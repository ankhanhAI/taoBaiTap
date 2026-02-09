/**
 * ankhanh-AI - Logic điều khiển trang chủ
 */

// 1. Điều khiển hiển thị Form thiết lập
function openForm() {
    const form = document.getElementById("form");
    form.style.display = "flex";
    // Hiệu ứng mượt mà khi hiện form
    form.style.opacity = "0";
    setTimeout(() => form.style.opacity = "1", 10);
}

function closeForm() {
    const form = document.getElementById("form");
    form.style.opacity = "0";
    setTimeout(() => form.style.display = "none", 300);
}

// 2. Logic tăng giảm số lượng câu hỏi (Counter)
function change(id, delta) {
    const input = document.getElementById(id);
    let currentValue = parseInt(input.value) || 0;
    let newValue = currentValue + delta;
    
    // Đảm bảo số lượng không nhỏ hơn 0 và không quá 50
    if (newValue < 0) newValue = 0;
    if (newValue > 50) newValue = 50;
    
    input.value = newValue;
}

// 3. Gửi yêu cầu tạo bài tập tới AI
async function submitForm() {
    const btn = document.getElementById("submitBtn");
    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();
    
    // Lấy số lượng từ các ô input
    const numSingle = document.getElementById("single").value;
    const numTF = document.getElementById("tf").value;
    const numMulti = document.getElementById("multi").value;
    const level = document.getElementById("level").value;

    // Kiểm tra dữ liệu đầu vào
    if (!content) {
        alert("Vui lòng nhập nội dung kiến thức để AI có dữ liệu soạn bài!");
        return;
    }

    // Trạng thái Loading
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="loader"></span> Đang soạn bài tập...`;

    try {
        const response = await fetch("/api/ai/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: title || "Bài tập ôn tập",
                content: content,
                config: {
                    single: parseInt(numSingle),
                    tf: parseInt(numTF),
                    multi: parseInt(numMulti),
                    level: level
                }
            })
        });

        const result = await response.json();

        if (result.success && result.data) {
            // Lưu dữ liệu vào LocalStorage để trang result.html sử dụng
            localStorage.setItem("aiQuestions", JSON.stringify(result.data));
            // Chuyển hướng sang trang kết quả
            window.location.href = "/result";
        } else {
            throw new Error(result.message || "Không thể tạo bài tập.");
        }

    } catch (error) {
        console.error("AI Error:", error);
        alert("Có lỗi xảy ra: " + error.message);
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

// Đóng form khi click ra ngoài vùng wrapper
window.onclick = function(event) {
    const form = document.getElementById("form");
    if (event.target == form) {
        closeForm();
    }
}
