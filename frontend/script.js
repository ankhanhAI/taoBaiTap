async function generate() {
  const content = document.getElementById("content").value;
  const difficulty = document.getElementById("difficulty").value;
  const count = document.getElementById("count").value;
  const resultBox = document.getElementById("result");

  if (!content.trim()) {
    resultBox.innerText = "⚠️ Vui lòng nhập nội dung bài học";
    return;
  }

  closeModal();
  resultBox.innerText = "🤖 AI đang tạo câu hỏi, vui lòng chờ...";

  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 60000);

    const res = await fetch("https://taobaitap.onrender.com/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: "Bài học",
        content,
        type: "trắc nghiệm",
        difficulty,
        count: Number(count)
      }),
      signal: controller.signal
    });

    if (!res.ok) {
      throw new Error("Server lỗi");
    }

    const data = await res.json();

    // ✅ RENDER CÂU HỎI
    if (data.questions && data.questions.length > 0) {
      let html = `<h2>${data.title}</h2>`;

      data.questions.forEach((q, i) => {
        html += `<div style="margin-bottom:20px;">`;
        html += `<p><b>Câu ${i + 1}: ${q.question}</b></p>`;

        q.options.forEach(opt => {
          html += `<div>◯ ${opt}</div>`;
        });

        html += `</div>`;
      });

      resultBox.innerHTML = html;
    } else {
      resultBox.innerText = "⚠️ Không có câu hỏi được tạo";
    }

  } catch (err) {
    console.error("FETCH ERROR:", err);

    if (err.name === "AbortError") {
      resultBox.innerText = "⏳ Server phản hồi quá chậm (timeout 60s)";
    } else if (err.message) {
      resultBox.innerText = "❌ Lỗi: " + err.message;
    } else {
      resultBox.innerText = "❌ Không thể kết nối tới server";
    }
  }
}
