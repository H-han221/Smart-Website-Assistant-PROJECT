import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
    title: { type: String, default: "New Chat" }
  },
  { timestamps: true }
);

export default mongoose.model("ChatSession", chatSessionSchema);
