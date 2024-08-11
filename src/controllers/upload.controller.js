import { uploadToAzureStorage } from "../azure/index.js";

export const uploadHandler = (image) => {
  if (image) {
    const uploadResponse = uploadToAzureStorage(image);
    return uploadResponse;
  }
};
