import app from "./app.js";
import { env } from "../config/env.js";
import { connectDb } from "../config/db.js";

await connectDb();

app.listen(env.port, () => {
  console.log(`🚀 Server running on http://localhost:${env.port}`);
});
