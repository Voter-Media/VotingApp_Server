import { Router } from "express";
import { getCandidates } from "../controllers/candidate.controller.js";

const router = Router();

router.get("/candidates", getCandidates);

export default router;
