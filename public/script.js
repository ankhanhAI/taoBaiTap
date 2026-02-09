function openForm() { document.getElementById("form").style.display = "flex"; }
function closeForm() { document.getElementById("form").style.display = "none"; }

function change(id, val) {
  const el = document.getElementById(id);
  let n = (parseInt(el.value) || 0) + val;
  el.value = n < 0 ? 0 : n;
}

async function submitForm() {
  const btn = document.getElementById("submitBtn");
  const originalHTML = btn.innerHTML;
  
  const data = {
    title: document.getElementById("title").value.trim() || "Bài tập AI",
    content: document.getElementById("content").value.trim(),
    single: Number(document.getElementById("single").value),
    tf: Number(document.getElementById("tf").value),
    multi: Number(document.getElementById("multi").value),
    level: document.getElementById("level").value
  };

  // Sử dụng trim() để chặn các chuỗi chỉ có dấu cách
  if (!data.content) return alert("Vui lòng nhập nội dung bài học!");

  // Trạng thái Loading chuyên nghiệp
  btn.disabled = true;
  btn.innerHTML = `<span class="loader"></span> <span class="loading-text">Gemini 3 đang soạn đề...</span>`;

  try {
    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    
    if (result.success && result.data) {
      // Đảm bảo dữ liệu cũ được dọn sạch trước khi lưu đề mới
      localStorage.removeItem("aiQuestions");
      localStorage.setItem("aiQuestions", JSON.stringify(result.data));
      window.location.href = "/result";
    } else {
      throw new Error(result.error || "Dữ liệu AI không hợp lệ");
    }
  } catch (err) {
    console.error("Lỗi:", err);
    alert("Lỗi: " + err.message);
    btn.disabled = false;
    btn.innerHTML = originalHTML;
  }
}
