import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { env } from "../config/env.js";
import authRoutes from "../routes/auth.routes.js";
import kbRoutes from "../routes/kb.routes.js";
import chatRoutes from "../routes/chat.routes.js";

const app = express();

app.set("trust proxy", 1);

app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));

app.use(rateLimit({ windowMs: 60 * 1000, limit: 120 }));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/kb", kbRoutes);
app.use("/api/chat", chat.routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

export default app;
