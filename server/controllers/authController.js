import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
import User from "../models/User.js";

const signupSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().min(3).max(30).optional(),
  password: z.string().min(6)
}).refine(d => d.email || d.username, { message: "Email or username required" });

const loginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(6)
});

function setAuthCookie(res, userId) {
  const token = jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  res.cookie(env.cookieName, token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

export async function signup(req, res) {
  const data = signupSchema.parse(req.body);

  const exists = await User.findOne({
    $or: [
      data.email ? { email: data.email.toLowerCase() } : null,
      data.username ? { username: data.username } : null
    ].filter(Boolean)
  });

  if (exists) return res.status(409).json({ message: "User already exists" });

  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await User.create({
    email: data.email?.toLowerCase(),
    username: data.username,
    passwordHash,
    role: "USER"
  });

  setAuthCookie(res, user._id.toString());
  res.json({ user: { id: user._id.toString(), email: user.email, username: user.username, role: user.role } });
}

export async function login(req, res) {
  const { identifier, password } = loginSchema.parse(req.body);

  const user = await User.findOne({
    $or: [{ email: identifier.toLowerCase() }, { username: identifier }]
  });

  if (!user?.passwordHash) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  setAuthCookie(res, user._id.toString());
  res.json({ user: { id: user._id.toString(), email: user.email, username: user.username, role: user.role } });
}

export async function logout(req, res) {
  res.clearCookie(env.cookieName);
  res.json({ ok: true });
}

export async function me(req, res) {
  res.json({ user: req.user });
}
