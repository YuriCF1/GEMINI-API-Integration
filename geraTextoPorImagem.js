import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import dotenv from "dotenv";
import { inicializaModelo } from "./modelo.js";

// dotenv.config();
dotenv.config({ path: "./.env" });

// Access your API key as an environment variable (see "Set up your API key" above)
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Converts local file information to a GoogleGenerativeAI.Part object.
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

export async function analisaImagem(imagem) {
  if (imagem === undefined || imagem === null) {
    console.log('Por favor, envie o nome do arquivo');
}
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = await inicializaModelo("gemini-1.5-flash", true);

  const prompt =
    "Me fale sobre o destino dessa foto. Identifique o lugar e fale sobre curiosades para um turista, como a culinária, o clima, curiosidades gerais do lugar. Me fale tudo em português";

  const imageParts = [
    fileToGenerativePart(imagem, "image/jpeg"),
    // fileToGenerativePart("image2.jpg", "image/jpeg"),
  ];

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

// analisaImagem();
