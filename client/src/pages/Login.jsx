import React, { useState } from "react";
import { apiJson } from "../lib/api.js";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [mode, setMode] = useState("login"); // login|signup
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      if (mode === "login") {
        await apiJson("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ identifier, password })
        });
      } else {
        await apiJson("/api/auth/signup", {
          method: "POST",
          body: JSON.stringify({ email: email || undefined, username: username || undefined, password })
        });
      }
      nav("/", { replace: true });
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h1 className="text-2xl font-semibold">Smart Website Assistant</h1>
        <p className="text-slate-400 mt-1">Login to access the landing page, admin KB, and chatbot.</p>

        <div className="flex gap-2 mt-4">
          <button
            className={`px-3 py-2 rounded ${mode === "login" ? "bg-white text-black" : "bg-slate-800"}`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`px-3 py-2 rounded ${mode === "signup" ? "bg-white text-black" : "bg-slate-800"}`}
            onClick={() => setMode("signup")}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          {mode === "login" ? (
            <input
              className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700"
              placeholder="Email or username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          ) : (
            <>
              <input
                className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700"
                placeholder="Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700"
                placeholder="Username (optional)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </>
          )}

          <input
            type="password"
            className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {err && <div className="text-red-400 text-sm">{err}</div>}

          <button className="w-full py-2 rounded bg-indigo-500 hover:bg-indigo-400">
            {mode === "login" ? "Login" : "Create account"}
          </button>
        </form>

        <p className="text-xs text-slate-500 mt-4">
          Bonus OAuth can be added later (Google/Facebook).
        </p>
      </div>
    </div>
  );
}
