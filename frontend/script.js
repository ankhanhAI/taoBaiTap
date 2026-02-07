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
  resultBox.innerText = "🤖 AI đang tạo câu hỏi...";

  try {
    const res = await fetch("https://taobaitap.onrender.com/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Bài học",
        content,
        difficulty,
        count: Number(count)
      })
    });

    const data = await res.json();

    if (!data.questions || data.questions.length === 0) {
      resultBox.innerText = "⚠️ Không có câu hỏi được tạo";
      return;
    }

    let html = `<h2>${data.title}</h2>`;

    data.questions.forEach((q, i) => {
      html += `
        <div style="margin-bottom:20px;">
          <p><b>Câu ${i + 1}: ${q.question}</b></p>
          ${q.options.map(opt => `<div>◯ ${opt}</div>`).join("")}
        </div>
      `;
    });

    resultBox.innerHTML = html;

  } catch (err) {
    console.error(err);
    resultBox.innerText = "❌ Không thể kết nối server";
  }
}
