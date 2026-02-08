import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing");
}

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

FORMAT JSON BẮT BUỘC:
[
  {
    "type": "single",
    "question": "string",
    "options": ["A","B","C","D"]
  }
]
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log("🔵 GEMINI RAW:\n", text);

    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");

    if (start === -1 || end === -1) {
      throw new Error("Invalid JSON from Gemini");
    }

    const data = JSON.parse(text.slice(start, end + 1));

    res.json({ data });

  } catch (err) {
    console.error("❌ GEMINI ERROR:", err.message);
    res.status(500).json({
      error: "Gemini error",
      detail: err.message
    });
  }
};
