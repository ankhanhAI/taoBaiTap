import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import aiRoute from "./routes/ai.route.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(express.static("views"));

app.use("/api/ai", aiRoute);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
    