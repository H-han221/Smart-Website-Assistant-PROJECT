import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[env.cookieName];
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub).lean();
    if (!user) return res.status(401).json({ message: "Invalid session" });

    req.user = { id: user._id.toString(), role: user.role, email: user.email, username: user.username };
    next();
  } catch {
    return res.status(401).json({ message: "Not authenticated" });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "ADMIN") return res.status(403).json({ message: "Admin only" });
  next();
}
