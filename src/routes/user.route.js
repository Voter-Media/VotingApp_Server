import { Router } from "express";
import {
  getUser,
  login,
  register,
  verifyEmail,
} from "../controllers/user.controller.js";
import { checkAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);

router.post("/verifyEmail", verifyEmail);

router.post("/logout", (req, res) => {
  res.send("Hello World");
});

router.get("/getUser", checkAuth, getUser);

export default router;
