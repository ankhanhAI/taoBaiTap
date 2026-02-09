/**
 * ankhanh-AI - Logic trang kết quả bài tập
 */

// 1. Kiểm tra dữ liệu ngay khi tải trang
const rawData = localStorage.getItem("aiQuestions");
let questions = [];

try {
    questions = JSON.parse(rawData);
    if (!Array.isArray(questions) || questions.length === 0) throw new Error();
} catch (e) {
    // Nếu không có dữ liệu, tự động quay về trang chủ
    window.location.href = "/";
}

/**
 * Hàm Render giao diện chính
 */
function renderUI() {
    const container = document.getElementById("question-list");
    const titleEl = document.getElementById("title");
    const infoEl = document.getElementById("info");

    titleEl.innerText = "📘 Kết quả bài tập ankhanh-AI";
    infoEl.innerText = `Tổng số: ${questions.length} câu hỏi • Tối ưu hiển thị toán học`;

    // Sinh danh sách câu hỏi
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

                <div id="${solveId}" class="explanation-card" style="display:none;">
                    <p><span class="ans-tag">✅ ĐÁP ÁN:</span> <strong>${q.answer}</strong></p>
                    <div style="height:1px; background:#bae6fd; margin:10px 0;"></div>
                    <p><strong>📝 HƯỚNG DẪN GIẢI:</strong></p>
                    <div class="exp-text">${q.explanation || "Không có lời giải chi tiết."}</div>
                </div>
            </div>
        `;
    }).join('');

    // Sau khi nạp HTML, bắt đầu render Toán học
    triggerMathRender();
}

/**
 * Hàm hiển thị các phương án trả lời
 */
function renderOptions(q) {
    if (q.type === "tf") {
        return `
            <div class="option-item"><input type="radio" disabled> Đúng</div>
            <div class="option-item"><input type="radio" disabled> Sai</div>
        `;
    }
    
    if (q.options && Array.isArray(q.options)) {
        return q.options.map(opt => `
            <div class="option-item">
                <input type="radio" disabled>
                <span>${opt}</span>
            </div>
        `).join('');
    }

    return `<p style="color: #94a3b8; font-style: italic;">(Câu hỏi trả lời ngắn)</p>`;
}

/**
 * Kích hoạt KaTeX (Toán học)
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
 * Đóng/mở khối lời giải
 */
function toggleSolve(id) {
    const el = document.getElementById(id);
    el.style.display = (el.style.display === "none" || el.style.display === "") ? "block" : "none";
}

/**
 * Các hàm bổ trợ Toolbar
 */
function goBack() {
    window.location.href = "/";
}

function downloadAll() {
    let content = `BÀI TẬP ankhanh-AI\n====================\n\n`;
    questions.forEach((q, i) => {
        content += `Câu ${i+1}: ${q.question.replace(/\$/g, '')}\n`;
        content += `👉 Đáp án: ${q.answer}\n\n`;
    });

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "BaiTap_ankhanhAI.txt";
    link.click();
}

// Chạy ứng dụng
window.onload = renderUI;
