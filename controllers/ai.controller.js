import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export const generateAI = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Thiếu API Key." });

    const genAI = new GoogleGenerativeAI(apiKey);
    const { content, config, level } = req.body; 

    // Schema vẫn giữ nguyên để đảm bảo tính đồng bộ với giao diện
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
      // Chuyển sang model Pro mạnh mẽ nhất để xử lý logic
      model: "gemini-3-flash-preview", 
      systemInstruction: "Bạn là một giảng viên Toán học cấp cao. Nhiệm vụ của bạn là tạo đề thi với độ chính xác 100% về số lượng và kiến thức.",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
        maxOutputTokens: 8192, // Dòng Pro hỗ trợ phản hồi cực dài, thoải mái cho 10-20 câu
        temperature: 0.4, // Giảm temperature để AI làm việc nghiêm túc, tránh sáng tạo quá đà gây thiếu câu
      },
    });

    // Tính toán tổng số câu để ép AI thực hiện đúng
    const totalNeeded = parseInt(config.single) + parseInt(config.tf) + parseInt(config.multi);

    const prompt = `
      YÊU CẦU QUAN TRỌNG: Tạo CHÍNH XÁC ${totalNeeded} câu hỏi. 
      Phân bổ chi tiết:
      - ${config.single} câu trắc nghiệm đơn (type: "single")
      - ${config.tf} câu hỏi đúng/sai (type: "tf")
      - ${config.multi} câu trả lời ngắn (type: "multi")
      
      Kiến thức mục tiêu: ${content}
      Mức độ: ${level}
      
      Yêu cầu kỹ thuật:
      - Sử dụng LaTeX chuẩn cho mọi biểu thức toán học.
      - Mỗi câu phải có phần giải thích (explanation) logic và sư phạm.
      - Nếu nội dung cung cấp không đủ, hãy mở rộng sang các dạng bài tập liên quan trực tiếp để đạt đủ ${totalNeeded} câu.
    `;

    const result = await model.generateContent(prompt);
    const jsonData = JSON.parse(result.response.text());

    res.json({ success: true, data: jsonData });

  } catch (err) {
    console.error("❌ GEMINI PRO ERROR:", err);
    res.status(500).json({ success: false, message: "Lỗi AI Pro: " + err.message });
  }
};

