import React from "react";
import ChatWidget from "../components/ChatWidget.jsx";
import { apiJson } from "../lib/api.js";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const nav = useNavigate();

  async function logout() {
    await apiJson("/api/auth/logout", { method: "POST" });
    nav("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="flex items-center justify-between p-6 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-semibold">Landing Page</h1>
          <p className="text-slate-400 text-sm">Ask the chatbot about your uploaded knowledge base.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded bg-slate-800" onClick={() => nav("/admin")}>
            Admin
          </button>
          <button className="px-3 py-2 rounded bg-slate-800" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="p-6 max-w-3xl">
        <h2 className="text-3xl font-bold">Smart Website Assistant</h2>
        <p className="text-slate-300 mt-2">
          This is a modern landing page with an AI chatbot using Retrieval-Augmented Generation (RAG).
        </p>
        <ul className="list-disc list-inside mt-4 text-slate-300 space-y-1">
          <li>Secure login</li>
          <li>Admin knowledge base upload</li>
          <li>RAG chatbot with streaming answers + citations</li>
          <li>Chat history storage (bonus)</li>
        </ul>
      </main>

      <ChatWidget />
    </div>
  );
}
