import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { createSession, getSession, sendMessageStream } from "../controllers/chat.controller.js";

const router = Router();
router.use(requireAuth);

router.post("/session", createSession);
router.get("/session/:id", getSession);
router.post("/message", sendMessageStream);

export default router;
