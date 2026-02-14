import fs from "fs/promises";
import pdfParse from "pdf-parse";

export async function extractTextFromPdf(filePath) {
  const buf = await fs.readFile(filePath);
  const data = await pdfParse(buf);
  return data.text || "";
}
