import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export const generateAI = async (req, res) => {
  try {
    // 1. Kiểm tra API Key ngay lập tức
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Thiếu cấu hình API Key trên server." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const { content, single, tf, multi, level } = req.body;

    // 2. Cấu hình Model với JSON Mode (Để AI luôn trả về JSON chuẩn)
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // Dùng bản ổn định
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `
      Tạo câu hỏi Toán THPT dựa trên các yêu cầu sau:
      - Nội dung: ${content}
      - Độ khó: ${level}
      - Số lượng: ${single} câu trắc nghiệm 1 đáp án, ${tf} câu đúng/sai, ${multi} câu trả lời ngắn.
      
      Yêu cầu định dạng JSON là một mảng các đối tượng:
      [
        {
          "type": "single",
          "question": "Nội dung câu hỏi",
          "options": ["A", "B", "C", "D"],
          "answer": "A"
        }
      ]
    `;

    // 3. Gọi Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. Parse kết quả trực tiếp (Vì đã có responseMimeType nên không lo text rác)
    const jsonData = JSON.parse(text);

    res.json({ success: true, data: jsonData });

  } catch (err) {
    console.error("❌ GEMINI ERROR:", err);
    
    // Phân loại lỗi để phản hồi chính xác
    if (err.message.includes("API key not valid")) {
      return res.status(401).json({ error: "Lỗi xác thực: API Key không hợp lệ." });
    }

    res.status(500).json({
      error: "Đã có lỗi xảy ra khi gọi AI",
      detail: err.message
    });
  }
};
