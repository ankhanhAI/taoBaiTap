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
    title: document.getElementById("title").value || "Bài tập AI",
    content: document.getElementById("content").value,
    single: Number(document.getElementById("single").value),
    tf: Number(document.getElementById("tf").value),
    multi: Number(document.getElementById("multi").value),
    level: document.getElementById("level").value
  };

  if (!data.content) return alert("Vui lòng nhập nội dung!");

  // Trạng thái Loading
  btn.disabled = true;
  btn.innerHTML = `<span class="loader"></span> <span class="loading-text">Gemini 3 đang soạn đề...</span>`;

  try {
    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (result.success) {
      localStorage.setItem("aiQuestions", JSON.stringify(result.data));
      window.location.href = "/result";
    } else {
      throw new Error(result.error);
    }
  } catch (err) {
    alert("Lỗi: " + err.message);
    btn.disabled = false;
    btn.innerHTML = originalHTML;
  }
}
