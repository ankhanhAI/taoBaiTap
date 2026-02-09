/**
 * ankhanh-AI - Logic điều khiển trang chủ
 */

function openForm() {
    const form = document.getElementById("form");
    form.style.display = "flex";
    form.style.opacity = "0";
    setTimeout(() => form.style.opacity = "1", 10);
}

function closeForm() {
    const form = document.getElementById("form");
    form.style.opacity = "0";
    setTimeout(() => form.style.display = "none", 300);
}

function change(id, delta) {
    const input = document.getElementById(id);
    let newValue = (parseInt(input.value) || 0) + delta;
    if (newValue < 0) newValue = 0;
    if (newValue > 15) newValue = 15; // Giới hạn thấp để tránh Timeout trên Render
    input.value = newValue;
}

async function submitForm() {
    const btn = document.getElementById("submitBtn");
    const content = document.getElementById("content").value.trim();
    const numSingle = document.getElementById("single").value;
    const numTF = document.getElementById("tf").value;
    const numMulti = document.getElementById("multi").value;
    const level = document.getElementById("level").value;

    if (!content) {
        alert("Vui lòng nhập nội dung kiến thức!");
        return;
    }

    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="loader"></span> Đang soạn bài (có thể mất 30s)...`;

    try {
        // Sử dụng AbortController để chủ động quản lý thời gian chờ
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // Chờ tối đa 60s

        const response = await fetch("/api/ai/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
                content: content,
                single: parseInt(numSingle),
                tf: parseInt(numTF),
                multi: parseInt(numMulti),
                level: level
                // ĐÃ BỎ BỌC 'config' để khớp với logic Backend bạn gửi lúc đầu
            })
        });

        clearTimeout(timeoutId);

        // Đọc text trước khi parse JSON để bắt lỗi HTML (lỗi 500/504)
        const rawText = await response.text();
        let result;

        try {
            result = JSON.parse(rawText);
        } catch (e) {
            console.error("Dữ liệu không phải JSON:", rawText);
            throw new Error("AI phản hồi quá lâu dẫn đến bị ngắt kết nối. Hãy thử lại với số lượng ít câu hỏi hơn.");
        }

        if (result.success && result.data) {
            localStorage.setItem("aiQuestions", JSON.stringify(result.data));
            window.location.href = "/result";
        } else {
            throw new Error(result.error || "Không thể tạo bài tập.");
        }

    } catch (error) {
        console.error("AI Error:", error);
        if (error.name === 'AbortError') {
            alert("Lỗi: Quá thời gian chờ (Timeout). Render không cho phép xử lý quá 30 giây.");
        } else {
            alert("Lỗi: " + error.message);
        }
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

window.onclick = function(event) {
    const form = document.getElementById("form");
    if (event.target == form) closeForm();
}
