import KbChunk from "../models/KbChunk.js";
import { cosineSim, embedTexts } from "./openai.js";

export async function retrieveTopK({ query, k = 6, sourceFilter = {} }) {
  const [qEmb] = await embedTexts([query]);
  const chunks = await KbChunk.find(sourceFilter).lean();

  return chunks
    .map(c => ({ ...c, score: cosineSim(qEmb, c.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
