import { Router } from "express";
import multer from "multer";
import path from "path";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { deleteSource, listSources, uploadSource } from "../controllers/kb.controller.js";

const router = Router();

const upload = multer({
  dest: path.join(process.cwd(), "server", "uploads")
});

router.use(requireAuth);
router.use(requireAdmin);

router.get("/sources", listSources);
router.post("/upload", upload.single("file"), uploadSource);
router.delete("/sources/:id", deleteSource);

export default router;
