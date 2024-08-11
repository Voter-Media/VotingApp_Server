import Router from "express";
import { getVoter, getVoters } from "../controllers/voter.controller.js";

const router = Router();

router.get("/voters", getVoters);
router.get("/voters/:id", getVoter);

export default router;
