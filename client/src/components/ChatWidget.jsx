import React, { useEffect, useRef, useState } from "react";
import { apiBase, apiJson } from "../lib/api.js";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (open && !sessionId) {
      apiJson("/api/chat/session", { method: "POST" })
        .then((d) => setSessionId(d.sessionId))
        .catch(() => {});
    }
  }, [open, sessionId]);

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages, typing]);

  async function send() {
    if (!input.trim() || !sessionId) return;

    const userMsg = { role: "user", content: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    setTyping(true);
    let assistant = { role: "assistant", content: "", citations: [] };
    setMessages((m) => [...m, assistant]);

    const res = await fetch(`${apiBase()}/api/chat/message`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, message: userMsg.content })
    });

    if (!res.ok) {
      setTyping(false);
      const j = await res.json().catch(() => ({}));
      setMessages((m) => m.slice(0, -1).concat({ role: "assistant", content: j.message || "Error" }));
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // SSE parsing
      const parts = buffer.split("\n\n");
      buffer = parts.pop() || "";

      for (const p of parts) {
        const lines = p.split("\n");
        const eventLine = lines.find((l) => l.startsWith("event:"));
        const dataLine = lines.find((l) => l.startsWith("data:"));
        const event = eventLine?.slice(6).trim();
        const data = dataLine?.slice(5).trim();

        if (!event || !data) continue;
        const payload = JSON.parse(data);

        if (event === "token") {
          const token = payload.token || "";
          setMessages((m) => {
            const copy = [...m];
            copy[copy.length - 1] = {
              ...copy[copy.length - 1],
              content: (copy[copy.length - 1].content || "") + token
            };
            return copy;
          });
        }

        if (event === "done") {
          setMessages((m) => {
            const copy = [...m];
            copy[copy.length - 1] = {
              ...copy[copy.length - 1],
              citations: payload.citations || []
            };
            return copy;
          });
        }
      }
    }

    setTyping(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-3 rounded-full shadow-lg"
      >
        {open ? "Close Chat" : "Chat"}
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 w-[360px] max-w-[92vw] bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-3 border-b border-slate-800">
            <div className="font-semibold">Website Assistant (RAG)</div>
            <div className="text-xs text-slate-400">Answers based on uploaded knowledge base</div>
          </div>

          <div ref={boxRef} className="h-[360px] overflow-y-auto p-3 space-y-3">
            {messages.map((m, idx) => (
              <div key={idx} className={m.role === "user" ? "text-right" : "text-left"}>
                <div
                  className={
                    "inline-block px-3 py-2 rounded-lg text-sm " +
                    (m.role === "user" ? "bg-indigo-500" : "bg-slate-800")
                  }
                >
                  {m.content}
                </div>
                {m.role === "assistant" && m.citations?.length ? (
                  <div className="text-xs text-slate-400 mt-1">
                    Sources: {m.citations.map((c) => `#${c.n}`).join(", ")}
                  </div>
                ) : null}
              </div>
            ))}
            {typing && <div className="text-xs text-slate-400">Assistant typing…</div>}
          </div>

          <div className="p-3 border-t border-slate-800 flex gap-2">
            <input
              className="flex-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button className="px-3 py-2 rounded bg-indigo-500 hover:bg-indigo-400" onClick={send}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
