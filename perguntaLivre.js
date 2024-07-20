import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { fazerPergunta } from "./pergunta.js";
import { inicializaModelo } from "./modelo.js";

// dotenv.config({ path: "./.env" });
dotenv.config();

/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

// const {
//   GoogleGenerativeAI,
//   HarmCategory,
//   HarmBlockThreshold,
// } = require("@google/generative-ai");

// const apiKey = process.env.GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(apiKey);
const model = await inicializaModelo("gemini-1.5-flash", true);

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",
//   system_instruction:
//     "Você é o chatbot de um site que vende pacotes de viagem. Ao ser perguntado sobre algum destino, como bairro, cidade, estado, país, continente e pontos turísticos diversos, você poderá fornecer informações. Caso seja perguntado sobre algo que não ter relação com viagem e turismo, informe que não poder responder a essa dúvida. Para formular a resposta, quero que os tópicos apareçam como lista com marcadores e sempre deve conter as categorias que forem solicitadas no momento da pergunta. Alguns exemplos de categoria: características, localização, cultura, pontos turísticos, clima, dicas, como chegar, curiosidades e culinária. Caso o peçam para você falar tudo sobre o local, fale algo a repeito de todas essas categorias que usei para exemplificar.",
// });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function perguntar() {
  const chatSession = model.startChat({
    generationConfig,
    // safetySettings: Adjust safety settings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [],
  });

  let prompt = await fazerPergunta(
    "Me faça uma pergunta sobre um determinado destino: "
  );
  const tokenEntrada = await model.countTokens(prompt);
  console.log("TOTAL TOKENS", tokenEntrada);

  const result = await chatSession.sendMessage(
    `Me fale o máximo que você puder sobre o destino ${prompt}`
  );

  const resultadoVindoAI = result.response.text();

  const tokenSaida = await model.countTokens(resultadoVindoAI);
  console.log("TOTAL TOKENS", tokenSaida);

  console.log(resultadoVindoAI);
}

/*
NOTAS 

Clareza e objetividade: Seja claro e específico sobre o que você deseja que o Gemini faça. Evite ambiguidades e instruções vagas. Quanto mais preciso for o seu prompt, melhor será a resposta do modelo;

Contexto relevante: Forneça contexto suficiente para que o Gemini entenda a situação e o que você espera. Isso pode incluir informações sobre o estilo de escrita desejado, o público-alvo, o tom da mensagem, etc.;

Exemplos: Incluir exemplos do tipo de texto que você deseja pode ajudar o Gemini a entender melhor suas expectativas;

Experimentação: Teste e experimente diferentes prompts e estilos de escrita para encontrar o que funciona melhor para você;

Restrições: Se necessário, defina limites para o comprimento do texto, formato, estilo ou conteúdo.
*/
