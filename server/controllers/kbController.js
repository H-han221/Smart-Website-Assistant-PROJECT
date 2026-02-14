import KbSource from "../models/KbSource.js";
import KbChunk from "../models/KbChunk.js";
import { chunkText } from "../rag/chunking.js";
import { embedTexts } from "../rag/openai.js";
import { extractTextFromPdf } from "../services/pdf.service.js";

export async function listSources(req, res) {
  const sources = await KbSource.find({ createdBy: req.user.id }).sort({ createdAt: -1 }).lean();
  res.json({ sources });
}

export async function uploadSource(req, res) {
  const { type, title, text } = req.body;

  if (!type) return res.status(400).json({ message: "type is required: pdf|text|webpage" });

  const source = await KbSource.create({
    title: title || (req.file?.originalname ?? "Untitled"),
    type,
    status: "processing",
    createdBy: req.user.id,
    filePath: req.file?.path,
    rawText: type !== "pdf" ? (text || "") : undefined
  });

  try {
    let raw = "";
    if (type === "pdf") raw = await extractTextFromPdf(source.filePath);
    else raw = source.rawText || "";

    const chunks = chunkText(raw);
    if (!chunks.length) throw new Error("No text extracted from document");

    const embeddings = await embedTexts(chunks);

    await KbChunk.deleteMany({ sourceId: source._id });

    await KbChunk.insertMany(
      chunks.map((content, idx) => ({
        sourceId: source._id,
        chunkIndex: idx,
        content,
        embedding: embeddings[idx],
        meta: { title: source.title, type: source.type }
      }))
    );

    source.status = "ready";
    await source.save();

    res.json({ ok: true, sourceId: source._id.toString(), chunks: chunks.length });
  } catch (e) {
    source.status = "failed";
    source.error = e.message;
    await source.save();
    res.status(400).json({ message: e.message });
  }
}

export async function deleteSource(req, res) {
  const { id } = req.params;
  const source = await KbSource.findOne({ _id: id, createdBy: req.user.id });
  if (!source) return res.status(404).json({ message: "Not found" });

  await KbChunk.deleteMany({ sourceId: source._id });
  await source.deleteOne();

  res.json({ ok: true });
}
