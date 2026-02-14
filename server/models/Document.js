import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  filename: String,
  path: String,
});

export default mongoose.model("Document", documentSchema);
