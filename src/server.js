import express from "express";
import "dotenv/config";
import { connectToDB } from "./db/index.js";
import userRoutes from "./routes/user.route.js";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.use("/api", userRoutes);

connectToDB();

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
