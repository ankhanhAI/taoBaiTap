import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateAI = async (req, res) => {
  const { content, single, tf, multi, level } = req.body;

  const prompt = `
Bạn là giáo viên THPT.
Tạo câu hỏi theo JSON.

Nội dung: ${content}
Độ khó: ${level}

Yêu cầu:
- ${single} trắc nghiệm 1 đáp án
- ${tf} đúng/sai
- ${multi} nhiều đáp án

CHỈ TRẢ JSON:
[
  {
    "type": "single",
    "question": "...",
    "options": ["A","B","C","D"]
  }
]
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    const text = result.response.text();
    const json = text.match(/\[.*\]/s)?.[0];

    res.json({ data: JSON.parse(json) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini error" });
  }
};
