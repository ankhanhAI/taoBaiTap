import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export const generateAI = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Thiếu cấu hình API Key." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Định nghĩa Schema chặt chẽ cho Gemini 2.0
    const schema = {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          type: { type: SchemaType.STRING },
          question: { type: SchemaType.STRING },
          options: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING }
          },
          answer: { type: SchemaType.STRING },
          explanation: { type: SchemaType.STRING }
        },
        required: ["type", "question", "answer"]
      }
    };

    const { content, single, tf, multi, level } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash", // Sử dụng đời mới nhất
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema, // Ép AI tuân thủ cấu trúc
      },
    });

    const prompt = `
      Bạn là chuyên gia soạn đề thi Toán THPT. 
      Nội dung: ${content}
      Độ khó: ${level}
      Số lượng:
      - ${single} câu trắc nghiệm (type: "single", cần 4 options A,B,C,D)
      - ${tf} câu đúng/sai (type: "tf", answer ghi Đúng hoặc Sai)
      - ${multi} câu trả lời ngắn (type: "short_answer")
      
      Lưu ý: Sử dụng LaTeX cho công thức toán học (ví dụ: $x^2 + \sqrt{y}$).
    `;

    const result = await model.generateContent(prompt);
    const jsonData = JSON.parse(result.response.text());

    res.json({ success: true, data: jsonData });

  } catch (err) {
    console.error("❌ GEMINI ERROR:", err);
    res.status(500).json({ error: "Lỗi hệ thống AI", detail: err.message });
  }
};
