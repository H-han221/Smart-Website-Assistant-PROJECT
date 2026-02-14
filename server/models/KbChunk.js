import mongoose from "mongoose";

const kbChunkSchema = new mongoose.Schema(
  {
    sourceId: { type: mongoose.Schema.Types.ObjectId, ref: "KbSource", index: true, required: true },
    chunkIndex: { type: Number, required: true },
    content: { type: String, required: true },
    embedding: { type: [Number], required: true },
    meta: { type: Object, default: {} }
  },
  { timestamps: true }
);

kbChunkSchema.index({ sourceId: 1, chunkIndex: 1 }, { unique: true });

export default mongoose.model("KbChunk", kbChunkSchema);
