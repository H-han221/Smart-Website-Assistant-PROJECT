import mongoose from "mongoose";

const kbSourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["pdf", "text", "webpage"], required: true },
    status: { type: String, enum: ["pending", "processing", "ready", "failed"], default: "pending" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    filePath: { type: String }, // pdf
    rawText: { type: String },  // text/webpage
    error: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("KbSource", kbSourceSchema);
