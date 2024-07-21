import { VertexAI } from "@google-cloud/vertexai";

async function createNonStreamingMultipartContent(
  projectId = "vertexai-project-430015",
  location = "southamerica-east1",
  model = "gemini-1.5-flash-001",
  image = "gs://generativeai-downloads/images/scones.jpg",
  mimeType = "image/jpeg"
) {
  // Initialize Vertex with your Cloud project and location
  const vertexAI = new VertexAI({
    project: projectId,
    location: location,
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
