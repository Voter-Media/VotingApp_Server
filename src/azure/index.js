import path from "path";
import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";

export async function uploadToAzureStorage(file) {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobName = path.basename(file);

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  try {
    const response = await blockBlobClient.uploadFile(file);

    const imageUrl = response._response.request.url;

    console.log("Image uploaded successfully: ", blobName, imageUrl);
    return { blobName, imageUrl };
  } catch (error) {
    console.log("Something went wrong: \n", error);
  }
}
