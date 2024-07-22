// Study project for future practice. FILE TO READ IMAGE IS THE geraTextoPorImagem.js
import { VertexAI } from "@google-cloud/vertexai";
import { GoogleAuth } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

async function createNonStreamingMultipartContent(
  projectId = process.env.GOOGLE_PROJECT_ID,
  location = "southamerica-east1",
  model = "gemini-1.5-flash-001",
  image = "gs://generativeai-downloads/images/scones.jpg",
  mimeType = "image/jpeg"
) {
  const credentials = {
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
  };

  const auth = new GoogleAuth({
    credentials: credentials,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  const vertexAI = new VertexAI({
    project: projectId,
    location: location,
    authClient: await auth.getClient(),
  });

  // Instantiate the model
  const generativeVisionModel = vertexAI.getGenerativeModel({
    model: model,
  });

  // For images, the SDK supports both Google Cloud Storage URI and base64 strings
  const filePart = {
    fileData: {
      fileUri: image,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: "what is shown in this image?",
  };

  const request = {
    contents: [{ role: "user", parts: [filePart, textPart] }],
  };

  console.log("Prompt Text:");
  console.log(request.contents[0].parts[1].text);

  console.log("Non-Streaming Response Text:");

  // Generate a response
  const response = await generativeVisionModel.generateContent(request);

  // Select the text from the response
  const fullTextResponse =
    response.response.candidates[0].content.parts[0].text;

  console.log(fullTextResponse);
}

createNonStreamingMultipartContent();
