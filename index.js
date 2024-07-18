import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { fazerPergunta } from "./pergunta.js";

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

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  system_instruction:
    "Você é o chatbot de um site que vende pacotes de viagem. Ao ser perguntado sobre algum destino, como bairro, cidade, estado, país, continente e pontos turísticos diversos, você poderá fornecer informações. Caso seja perguntado sobre algo que não ter relação com viagem e turismo, informe que não poder responder a essa dúvida. Para formular a resposta, quero que os tópicos apareçam como lista com marcadores e sempre deve conter as categorias que forem solicitadas no momento da pergunta. Alguns exemplos de categoria: características, localização, cultura, pontos turísticos, clima, dicas, como chegar, curiosidades e culinária. Caso o peçam para você falar tudo sobre o local, fale algo a repeito de todas essas categorias que usei para exemplificar.",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run() {
  const chatSession = model.startChat({
    generationConfig,
    // safetySettings: Adjust safety settings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
      {
        role: "user",
        parts: [
          { text: "Me fale sobre o bairro do Flamengo, no Rio de Janeiro" },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "##  Flamengo - Rio de Janeiro:\n\n• **Características:** Bairro nobre e tradicional, conhecido por seus edifícios históricos, áreas verdes exuberantes e uma atmosfera tranquila. É um dos bairros mais seguros do Rio, com ruas arborizadas e clima agradável. Ideal para famílias e pessoas que buscam tranquilidade sem abrir mão da vida urbana.\n\n• **Localização:**  Zona Sul do Rio de Janeiro, vizinho a outros bairros famosos como Botafogo, Laranjeiras e Glória. Possui fácil acesso a transporte público, com estações de metrô e linhas de ônibus. \n\n• **Cultura:** O Flamengo é rico em história e cultura, com diversos museus, teatros e centros culturais. Abriga o Museu da República, o Museu Carmen Miranda e o MAM - Museu de Arte Moderna do Rio de Janeiro.  \n\n• **Pontos turísticos:** \n     - Praia do Flamengo:  A mais extensa orla carioca, com vista para o Pão de Açúcar e a Baía de Guanabara, ideal para caminhadas, ciclismo e atividades ao ar livre.\n     - Parque do Flamengo: Um dos maiores parques urbanos do mundo, com áreas verdes, jardins, quadras esportivas e ciclovias.\n     - Aterro do Flamengo:  Oferece uma vista espetacular da Baía de Guanabara e do Cristo Redentor, um local perfeito para apreciar o pôr do sol.\n\n• **Culinária:** O Flamengo oferece uma grande variedade de restaurantes, bares e cafés. Desde restaurantes sofisticados a opções mais informais, o bairro agrada a todos os gostos. Destaque para os restaurantes de frutos do mar, que aproveitam a proximidade com a Baía de Guanabara. \n",
          },
        ],
      },
    ],
  });

  let prompt = await fazerPergunta(
    "Me fale sobre o destino que deseja conhecer: "
  );

  const categorias = await fazerPergunta(
    "Me fale as categorias que tu desejas visualizar sobre um determinado destino: "
  );

  const result = await chatSession.sendMessage(
    `Me fale sobre as categeorias ${categorias} sobre o destino ${prompt}`
  );
  console.log(result.response.text());
}

run();

/*
NOTAS 

Clareza e objetividade: Seja claro e específico sobre o que você deseja que o Gemini faça. Evite ambiguidades e instruções vagas. Quanto mais preciso for o seu prompt, melhor será a resposta do modelo;

Contexto relevante: Forneça contexto suficiente para que o Gemini entenda a situação e o que você espera. Isso pode incluir informações sobre o estilo de escrita desejado, o público-alvo, o tom da mensagem, etc.;

Exemplos: Incluir exemplos do tipo de texto que você deseja pode ajudar o Gemini a entender melhor suas expectativas;

Experimentação: Teste e experimente diferentes prompts e estilos de escrita para encontrar o que funciona melhor para você;

Restrições: Se necessário, defina limites para o comprimento do texto, formato, estilo ou conteúdo.
*/
