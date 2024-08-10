import express from "express";
import { votes, castVote } from "../controllers/votes.controller.js";

const router = express.Router();
router.get("/votes", votes);
router.post("/vote", castVote);
export default router;
