import ChatSession from "../models/ChatSession.js";
import ChatMessage from "../models/ChatMessage.js";
import { retrieveTopK } from "../rag/retriever.js";
import { openai } from "../rag/openai.js";
import { env } from "../config/env.js";

export async function createSession(req, res) {
  const s = await ChatSession.create({ userId: req.user.id, title: "New Chat" });
  res.json({ sessionId: s._id.toString() });
}

export async function getSession(req, res) {
  const { id } = req.params;
  const session = await ChatSession.findOne({ _id: id, userId: req.user.id }).lean();
  if (!session) return res.status(404).json({ message: "Not found" });

  const messages = await ChatMessage.find({ sessionId: id }).sort({ createdAt: 1 }).lean();
  res.json({ session, messages });
}

export async function sendMessageStream(req, res) {
  const { sessionId, message } = req.body;
  if (!sessionId || !message) return res.status(400).json({ message: "sessionId and message are required" });

  const session = await ChatSession.findOne({ _id: sessionId, userId: req.user.id });
  if (!session) return res.status(404).json({ message: "Chat session not found" });

  await ChatMessage.create({ sessionId, role: "user", content: message });

  const top = await retrieveTopK({ query: message, k: 6 });

  const context = top.map((c, i) => `[#${i + 1} score=${c.score.toFixed(3)}] ${c.content}`).join("\n\n");
  const citations = top.map((c, i) => ({
    n: i + 1,
    sourceId: String(c.sourceId),
    chunkId: String(c._id),
    score: c.score,
    title: c.meta?.title
  }));

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");

  const system = `You are the website assistant. Answer ONLY using the provided CONTEXT.
If the answer isn't in the context, say you don't have enough info and ask the user to upload the relevant document.
Cite sources like (Source #1), (Source #2).`;

  let assistantText = "";

  const stream = await openai.chat.completions.create({
    model: env.chatModel,
    stream: true,
    messages: [
      { role: "system", content: system },
      { role: "user", content: `CONTEXT:\n${context}\n\nQUESTION:\n${message}` }
    ]
  });

  for await (const part of stream) {
    const token = part.choices?.[0]?.delta?.content || "";
    if (token) {
      assistantText += token;
      res.write(`event: token\ndata: ${JSON.stringify({ token })}\n\n`);
    }
  }

  const saved = await ChatMessage.create({
    sessionId,
    role: "assistant",
    content: assistantText,
    citations
  });

  res.write(`event: done\ndata: ${JSON.stringify({ messageId: saved._id.toString(), citations })}\n\n`);
  res.end();
}
