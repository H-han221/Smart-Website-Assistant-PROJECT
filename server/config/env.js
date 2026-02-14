import dotenv from "dotenv";
dotenv.config({ path: process.env.ENV_FILE || ".env" });

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),

  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  cookieName: process.env.COOKIE_NAME || "swa_token",

  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",

  openaiApiKey: process.env.OPENAI_API_KEY,
  embeddingModel: process.env.EMBEDDING_MODEL || "text-embedding-3-small",
  chatModel: process.env.CHAT_MODEL || "gpt-4o-mini",

  maxUploadMb: Number(process.env.MAX_UPLOAD_MB || 20)
};

for (const k of ["mongoUri", "jwtSecret", "openaiApiKey"]) {
  if (!env[k]) throw new Error(`Missing env var: ${k.toUpperCase()}`);
}
