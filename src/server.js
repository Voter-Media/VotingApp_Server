import express from "express";
import "dotenv/config";
import { connectToDB } from "./db/index.js";

const app = express();

app.use("/api", (req, res) => {
  res.send("Hello World");
});

connectToDB();

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
