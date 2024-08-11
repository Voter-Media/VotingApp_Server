import Router from "express";
import { getVoter, getVoters } from "../controllers/voter.controller.js";
import { checkAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/voters", checkAuth, getVoters);
router.get("/voters/:id", checkAuth, getVoter);

export default router;
