import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
export const generateAI = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ success: false, error: "Thiếu API Key." });

    const genAI = new GoogleGenerativeAI(apiKey);

    // LẤY DỮ LIỆU PHẲNG TỪ REQ.BODY
    const { content, single, tf, multi, level } = req.body;

    // Kiểm tra log để debug trên Render
    console.log("Dữ liệu nhận được:", { content, single, tf, multi, level });

    // Tính tổng số câu hỏi
    const total = (parseInt(single) || 0) + (parseInt(tf) || 0) + (parseInt(multi) || 0);

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview", // Dùng flash để né lỗi Timeout 30s của Render
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `Bạn là giáo viên .Tạo mảng JSON chứa đúng ${total} câu hỏi về: ${content}.
      Độ khó: ${level}.
      Yêu cầu số lượng:
      - ${single} câu 'multi' (trắc nghiệm 4 đáp án)
      - ${tf} câu 'tf' (đúng/sai)
      - ${multi} câu 'single' (trả lời ngắn)
      - Sử dụng LaTeX trong $.
      - Explanation: giải thích thật ngắn gọn dưới 1 dòng.
      BẮT BUỘC TRẢ VỀ ĐỦ ${total} CÂU.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonData = JSON.parse(text);

    res.json({ success: true, data: jsonData });

  } catch (err) {
    console.error("❌ BACKEND ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

