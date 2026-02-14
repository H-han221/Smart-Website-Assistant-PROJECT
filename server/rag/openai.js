import OpenAI from "openai";
import { env } from "../config/env.js";

export const openai = new OpenAI({ apiKey: env.openaiApiKey });

export async function embedTexts(texts) {
  const resp = await openai.embeddings.create({
    model: env.embeddingModel,
    input: texts
  });
  return resp.data.map(d => d.embedding);
}

export function cosineSim(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-10);
}
