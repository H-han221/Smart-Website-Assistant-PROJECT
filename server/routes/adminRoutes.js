import express from "express";
import { uploadDocument } from "../controllers/adminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Only authenticated users can upload documents
router.post("/upload", authMiddleware, uploadDocument);

export default router;
