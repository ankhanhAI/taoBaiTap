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

    const prompt = `Bạn là chuyên gia giáo dục đa năng. Hãy tạo một mảng JSON chứa CHÍNH XÁC ${total} câu hỏi về nội dung: ${content}.
      Độ khó: ${level}.
      
      Yêu cầu số lượng và định dạng (BẮT BUỘC):
      - ${single} câu type "single": Trắc nghiệm 4 lựa chọn (phải có mảng "options").
      - ${tf} câu type "tf": Câu hỏi Đúng/Sai.
      - ${multi} câu type "multi": Câu hỏi trả lời ngắn (không cần "options").
      
      Quy tắc kỹ thuật:
      1. LaTeX: Sử dụng $ cho công thức (Ví dụ: $x^2 + y^2 = R^2$).
      2. JSON Escaping: Dùng dấu xuyệt ngược kép (\\) cho các ký tự đặc biệt của LaTeX (Ví dụ: \\frac, \\sqrt).
      3. Giải thích (explanation): Viết cực ngắn, tối đa 1 dòng.
      4. Tuyệt đối không được thiếu câu nào. Phải trả về đủ ${total} phần tử trong mảng JSON.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonData = JSON.parse(text);

    res.json({ success: true, data: jsonData });

  } catch (err) {
    console.error("❌ BACKEND ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};


