import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    username: { type: String, unique: true, sparse: true, trim: true },
    passwordHash: { type: String },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },

    // OAuth-ready (bonus)
    oauth: { provider: String, providerId: String }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
