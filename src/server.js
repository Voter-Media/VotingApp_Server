import express from "express";
import "dotenv/config";
import { connectToDB } from "./db/index.js";
import userRoutes from "./routes/user.route.js";

const app = express();

app.use("/api", userRoutes);

connectToDB();

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
