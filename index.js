import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import aiRoute from "./routes/ai.route.js";

dotenv.config();

const app = express();

// ES MODULE FIX __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// ✅ CHỈ SERVE PUBLIC
app.use(express.static(path.join(__dirname, "public")));

// ✅ ROUTE HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/result", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "result.html"));
});

// API AI
app.use("/api/ai", aiRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
