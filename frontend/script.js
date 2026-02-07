async function generate() {
  const content = document.getElementById("content").value;
  const difficulty = document.getElementById("difficulty").value;
  const count = document.getElementById("count").value;
  const resultBox = document.getElementById("result");

  if (!content.trim()) {
    resultBox.innerText = "⚠️ Vui lòng nhập nội dung bài học";
    return;
  }

  resultBox.innerText = "🤖 AI đang tạo câu hỏi...";

  try {
    const res = await fetch("https://taobaitap.onrender.com/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Bài học",
        content,
        type: "trắc nghiệm",   // ✅ BẮT BUỘC
        difficulty,
        count: Number(count)
      })
    });

    if (!res.ok) {
      throw new Error("Server lỗi");
    }

    const data = await res.json();

    // ✅ HIỂN THỊ CÂU HỎI
    let html = `<h2>${data.title}</h2>`;

    data.questions.forEach((q, i) => {
      html += `
        <div style="margin-bottom:20px;">
          <p><b>Câu ${i + 1}: ${q.question}</b></p>
      `;

      q.options.forEach(opt => {
        html += `<div>◯ ${opt}</div>`;
      });

      html += `</div>`;
    });

    resultBox.innerHTML = html;

  } catch (err) {
    console.error(err);
    resultBox.innerText = "❌ Không thể tạo câu hỏi";
  }
}
