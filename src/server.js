import express from "express";
import "dotenv/config";
import { connectToDB } from "./db/index.js";
import votesRouter from "./routes/votes.route.js";
const app = express();

connectToDB();

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
app.use("/api", votesRouter);
