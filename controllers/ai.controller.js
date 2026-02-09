import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export const generateAI = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Thiếu API Key." });

    const genAI = new GoogleGenerativeAI(apiKey);

    // Định nghĩa Schema chặt chẽ
    const schema = {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          type: { type: SchemaType.STRING, description: "single | tf | multi" },
          question: { type: SchemaType.STRING },
          options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          answer: { type: SchemaType.STRING },
          explanation: { type: SchemaType.STRING }
        },
        required: ["type", "question", "answer"]
      }
    };

    const { content, single, tf, multi, level } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const prompt = `Tạo câu hỏi Toán THPT: 
      Nội dung: ${content}. Độ khó: ${level}. 
      Số lượng: ${single} câu đơn, ${tf} câu đúng/sai, ${multi} câu ngắn. 
      Sử dụng LaTeX cho công thức.`;

    const result = await model.generateContent(prompt);
    
    // Gemini 3 trả về JSON cực sạch, không cần xử lý chuỗi phức tạp
    const jsonData = JSON.parse(result.response.text());

    res.json({ success: true, data: jsonData });

  } catch (err) {
    console.error("❌ GEMINI 3 ERROR:", err);
    res.status(500).json({ error: "Lỗi AI", detail: err.message });
  }
};
