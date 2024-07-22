import { inicializaModelo } from "./modelo.js";
import { fazerPergunta } from "./pergunta.js";
import fs from "fs/promises";

const model = await inicializaModelo("gemini-1.5-flash", true);

export async function processaArquivoTexto() {
  const arquivo = await fazerPergunta(
    "\nMe informe o caminho e nome do arquivo: "
  );
  const dados = await fs.readFile(arquivo, "utf-8");

  const prompt = `Analise as opiniões descritas em sequência e resuma os pontos positivos e negativos citados pelos clientes sobre esses destinos. 
  Depois, categorize o percentual de respostas em satisfeito, insatisfeitos ou neutros, colocando no seguinte formato, por exemplo:  
   Satisfeitos: 20% - 20 respostas 
   Insatisfeitos: 50% - 50 respostas
   Neutros: 30% - 30 respostas 
   O total de respostas deve coincidir com o total de opiniões lidas. 
   Opiniões: ${dados}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const textoFinal = response.text();
  console.log(textoFinal);
}
