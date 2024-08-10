import express from "express";
import "dotenv/config";
import { connectToDB } from "./db/index.js";

import votesRoutes from "./routes/votes.route.js";
import userRoutes from "./routes/user.route.js";
import cors from "cors";
import bodyParser from "body-parser";
const app = express();

connectToDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.use("/api", userRoutes);
app.use("/api", votesRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
