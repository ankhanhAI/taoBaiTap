import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export const generateAI = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Thiếu API Key." });

    const genAI = new GoogleGenerativeAI(apiKey);
    const { content, config, level, title } = req.body; 

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
        required: ["type", "question", "answer", "explanation"]
      }
    };

    cconst model = genAI.getGenerativeModel({
  // Tự động sử dụng Gemini 3 Flash mới nhất
  model: "gemini-flash-latest", 
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
    // Với dòng 3 Flash, bạn có thể tự tin đặt 4096 tokens để tránh lỗi ngắt JSON
    maxOutputTokens: 4096, 
  },
});

    const total = parseInt(config.single) + parseInt(config.tf) + parseInt(config.multi);

    const prompt = `
      Nhiệm vụ: Tạo CHÍNH XÁC ${total} câu hỏi cho chủ đề: ${title || "Ôn tập tổng hợp"}.
      Phân bổ: ${config.single} trắc nghiệm, ${config.tf} đúng/sai, ${config.multi} ngắn.
      
      Nội dung kiến thức: ${content}
      Mức độ: ${level}
      
      Yêu cầu:
      - Nếu có công thức, hãy dùng LaTeX chuẩn (ví dụ: $E=mc^2$).
      - Nếu là môn xã hội, hãy đặt câu hỏi mang tính phân tích cao.
      - Lời giải (explanation) phải rõ ràng, ngắn gọn nhưng đầy đủ ý.
      - Phải trả về đủ ${total} câu, không được thiếu.
    `;

    const result = await model.generateContent(prompt);
    
    // Kiểm tra tính toàn vẹn của JSON trước khi Parse
    const text = result.response.text();
    try {
        const jsonData = JSON.parse(text);
        res.json({ success: true, data: jsonData });
    } catch (parseErr) {
        console.error("JSON Parse Error:", text);
        throw new Error("Dữ liệu AI trả về không đúng định dạng. Hãy thử lại.");
    }

  } catch (err) {
    console.error("❌ GEMINI 3 FLASH ERROR:", err);
    res.status(500).json({ success: false, message: "Lỗi AI Flash: " + err.message });
  }
};


