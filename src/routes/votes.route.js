import express from "express";
import { votes, castVote, voteCount } from "../controllers/votes.controller.js";

const router = express.Router();
router.get("/votes", votes);
router.get("/vote-count", voteCount);
router.post("/vote", castVote);
export default router;
