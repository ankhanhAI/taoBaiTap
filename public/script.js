/**
 * ankhanh-AI - Logic hiển thị kết quả bài tập
 */

// 1. Lấy và kiểm tra dữ liệu từ LocalStorage
const rawData = localStorage.getItem("aiQuestions");
let questions = [];

try {
    questions = JSON.parse(rawData);
    if (!Array.isArray(questions) || questions.length === 0) throw new Error();
} catch (e) {
    // Nếu không có dữ liệu, chuyển hướng về trang chủ để tránh lỗi giao diện
    window.location.href = "/";
}

/**
 * Hàm Render giao diện chính
 */
function renderUI() {
    const container = document.getElementById("question-list");
    const titleEl = document.getElementById("title");
    const infoEl = document.getElementById("info");

    // Cập nhật thông tin Header
    titleEl.innerText = "📘 Kết quả bài tập ankhanh-AI";
    infoEl.innerText = `Tổng số: ${questions.length} câu hỏi • Đã tối ưu hiển thị toán học`;

    // Sinh HTML cho từng câu hỏi
    container.innerHTML = questions.map((q, i) => {
        const solveId = `solve-${i}`;
        
        return `
            <div class="card">
                <span class="question-no">CÂU HỎI ${i + 1}</span>
                <div class="question-text">${q.question}</div>
                
                <div class="options-grid">
                    ${renderOptions(q)}
                </div>

                <button class="btn-solve" onclick="toggleSolve('${solveId}')">
                    🔍 Xem lời giải & Đáp án
                </button>

                <div id="${solveId}" class="explanation-card">
                    <p><span class="ans-tag">✅ ĐÁP ÁN:</span> <strong>${q.answer}</strong></p>
                    <div style="height:1px; background:#bae6fd; margin:10px 0;"></div>
                    <p><strong>📝 HƯỚNG DẪN GIẢI:</strong></p>
                    <div class="exp-text">${q.explanation || "Không có lời giải chi tiết cho câu này."}</div>
                </div>
            </div>
        `;
    }).join('');

    // Sau khi nạp HTML, gọi KaTeX để quét và render công thức Toán
    triggerMathRender();
}

/**
 * Hàm xử lý render các lựa chọn (Fix lỗi đè chữ)
 */
function renderOptions(q) {
    // Xử lý câu hỏi Đúng/Sai
    if (q.type === "tf") {
        return `
            <div class="option-item"><input type="radio" disabled> Đúng</div>
            <div class="option-item"><input type="radio" disabled> Sai</div>
        `;
    }
    
    // Xử lý câu hỏi Trắc nghiệm nhiều lựa chọn
    if (q.options && Array.isArray(q.options)) {
        return q.options.map(opt => `
            <div class="option-item">
                <input type="${q.type === 'multi' ? 'checkbox' : 'radio'}" disabled>
                <span>${opt}</span>
            </div>
        `).join('');
    }

    // Trường hợp câu hỏi tự luận/trả lời ngắn
    return `<p style="color: #94a3b8; font-style: italic; grid-column: 1 / -1;">
                (Câu hỏi trả lời ngắn - Xem đáp án bên dưới)
            </p>`;
}

/**
 * Kích hoạt KaTeX để hiển thị công thức đẹp mắt
 */
function triggerMathRender() {
    setTimeout(() => {
        if (window.renderMathInElement) {
            renderMathInElement(document.body, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\(', right: '\\)', display: false},
                    {left: '\\[', right: '\\]', display: true}
                ],
                throwOnError: false
            });
        }
    }, 100);
}

/**
 * Hàm đóng/mở khối lời giải
 */
function toggleSolve(id) {
    const el = document.getElementById(id);
    const isVisible = el.style.display === "block";
    el.style.display = isVisible ? "none" : "block";
}

/**
 * Quay lại trang chủ
 */
function goBack() {
    window.location.href = "/";
}

/**
 * Xuất file bài giải (.txt)
 */
function downloadAll() {
    let content = `BÀI TẬP ankhanh-AI\n`;
    content += `Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}\n`;
    content += `==========================================\n\n`;

    questions.forEach((q, i) => {
        // Loại bỏ các ký tự $ của LaTeX khi lưu file text để dễ đọc
        const cleanQuestion = q.question.replace(/\$/g, '');
        content += `Câu ${i+1}: ${cleanQuestion}\n`;
        if(q.options) content += `Lựa chọn: ${q.options.join(' | ').replace(/\$/g, '')}\n`;
        content += `👉 ĐÁP ÁN: ${q.answer}\n`;
        content += `📝 LỜI GIẢI: ${q.explanation ? q.explanation.replace(/\$/g, '') : 'N/A'}\n`;
        content += `------------------------------------------\n\n`;
    });

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Bai_Tap_ankhanh_AI.txt";
    link.click();
}

// Chạy khởi tạo khi trang tải xong
window.onload = renderUI;
