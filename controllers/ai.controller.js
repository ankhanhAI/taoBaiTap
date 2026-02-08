import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateQuestions = async (req, res) => {
  const { title, content, single, tf, multi, level } = req.body;

  const prompt = `
Bạn là giáo viên THPT.
Hãy tạo câu hỏi trắc nghiệm Toán bằng tiếng Việt.

Chủ đề: ${content}
Độ khó: ${level}

Yêu cầu:
- ${single} câu trắc nghiệm 1 đáp án
- ${tf} câu đúng/sai
- ${multi} câu nhiều đáp án

Trả về JSON chuẩn:
[
  {
    "type": "single | tf | multi",
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "answer": "..."
  }
]
`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    res.json({
      data: response.choices[0].message.content
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI generation failed" });
  }
};
