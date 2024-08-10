import { Router } from "express";
import {
  login,
  register,
  verifyEmail,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/login", login);

router.post("/verifyEmail", verifyEmail);

router.post("/logout", (req, res) => {
  res.send("Hello World");
});

router.get("/users", (req, res) => {
  res.send("Hello World");
});

router.post("/register", register);

export default router;
