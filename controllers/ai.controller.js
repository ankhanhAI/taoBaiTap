export const generateAI = async (req, res) => {
  try {
    const { content, single, tf, multi, level } = req.body;

    const prompt = `
CHỈ TRẢ VỀ JSON. KHÔNG GIẢI THÍCH.

Tạo câu hỏi Toán THPT.

Nội dung: ${content}
Độ khó: ${level}

Tổng số:
- ${single} câu single
- ${tf} câu đúng sai
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

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const result = await response.json();

    if (!result.candidates) {
      throw new Error("Gemini không trả dữ liệu");
    }

    const text = result.candidates[0].content.parts[0].text;

    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");

    const data = JSON.parse(text.slice(start, end + 1));

    res.json({ data });

  } catch (err) {
    console.error("❌ GEMINI ERROR:", err.message);
    res.status(500).json({ error: "Gemini error", detail: err.message });
  }
};
