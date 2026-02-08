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
- ${tf} câu tf
- ${multi} câu multi

FORMAT JSON BẮT BUỘC:
[
  {
    "type": "single",
    "question": "string",
    "options": ["A","B","C","D"]
  },
  {
    "type": "tf",
    "question": "string"
  },
  {
    "type": "multi",
    "question": "string",
    "options": ["A","B","C","D"]
  }
]
`;

    const model = genAI.getGenerativeModel({
  model: "gemini-1.0-pro"
});

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log("🔵 GEMINI RAW RESPONSE:\n", text);

    // CẮT JSON AN TOÀN
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");

    if (start === -1 || end === -1) {
      throw new Error("Gemini did not return JSON");
    }

    const jsonText = text.substring(start, end + 1);
    const data = JSON.parse(jsonText);

    res.json({ data });

  } catch (err) {
    console.error("❌ GEMINI ERROR:", err.message);
    res.status(500).json({ error: "Gemini error" });
  }
};


