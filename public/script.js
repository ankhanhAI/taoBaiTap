function openForm() {
  document.getElementById("form").style.display = "flex";
}

function closeForm() {
  document.getElementById("form").style.display = "none";
}

function change(id, value) {
  const el = document.getElementById(id);
  let num = parseInt(el.value) || 0;
  num += value;
  if (num < 0) num = 0;
  el.value = num;
}

async function submitForm() {
  const data = {
    title: document.getElementById("title").value,
    content: document.getElementById("content").value,
    single: Number(document.getElementById("single").value),
    tf: Number(document.getElementById("tf").value),
    multi: Number(document.getElementById("multi").value),
    level: document.getElementById("level").value
  };

  // UI loading (ăn điểm đồ án)
  alert("🤖 AI đang tạo câu hỏi, vui lòng đợi...");

  try {
    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    // LƯU KẾT QUẢ AI (KHÔNG LƯU FORM NỮA)
    localStorage.setItem("aiQuestions", result.data);

    // CHUYỂN TRANG
    window.location.href = "/result";

  } catch (err) {
    alert("❌ Lỗi khi tạo câu hỏi AI");
    console.error(err);
  }
}

