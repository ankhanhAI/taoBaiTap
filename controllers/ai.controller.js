import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateAI = async (req, res) => {
  try {
    const { content, single, tf, multi, level } = req.body;

    const prompt = `
CHỈ TRẢ VỀ JSON. KHÔNG GIẢI THÍCH. KHÔNG TEXT.

Tạo câu hỏi Toán THPT.

Nội dung: ${content}
Độ khó: ${level}

Tổng số:
- ${single} câu single
- ${tf} câu đúng/sai
- ${multi} câu nhiều đáp án

FORMAT JSON:
[
  {
    "type": "single",
    "question": "string",
    "options": ["A","B","C","D"]
  }
]
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest"
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log("🟢 GEMINI RAW:", text);

    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");

    if (start === -1 || end === -1) {
      throw new Error("Gemini did not return JSON");
    }

    const json = JSON.parse(text.slice(start, end + 1));

    res.json({ data: json });

  } catch (err) {
    console.error("❌ GEMINI ERROR:", err);
    res.status(500).json({
      error: "Gemini error",
      detail: err.message
    });
  }
};
