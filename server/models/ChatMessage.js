import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatSession", index: true, required: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    citations: { type: Array, default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("ChatMessage", chatMessageSchema);
