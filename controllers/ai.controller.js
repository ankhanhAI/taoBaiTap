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

    const model = genAI.getGenerativeModel({
      // Chuyển về dòng Flash để tối ưu tốc độ và tránh lỗi 429/JSON bị ngắt
      model: "gemini-3-flash-preview", 
      systemInstruction: "Bạn là chuyên gia soạn thảo đề thi đa năng. Hãy tạo câu hỏi bám sát nội dung, trình bày logic và đảm bảo đủ số lượng yêu cầu.",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
        maxOutputTokens: 4096, // Đủ cho khoảng 10-15 câu hỏi kèm lời giải
        temperature: 0.3, // Cân bằng giữa sự sáng tạo và độ chính xác
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

