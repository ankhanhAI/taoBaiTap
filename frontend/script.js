// MỞ MODAL
function openModal() {
  document.getElementById("modal").style.display = "flex";
}

// ĐÓNG MODAL
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// CLICK RA NGOÀI MODAL
window.onclick = function (e) {
  const modal = document.getElementById("modal");
  if (e.target === modal) closeModal();
};

// TẠO BÀI TẬP
async function generate() {
  const title = document.getElementById("title").value || "Bài tập";
  const content = document.getElementById("content").value;
  const difficulty = document.getElementById("difficulty").value;
  const count = Number(document.getElementById("count").value);
  const resultBox = document.getElementById("result");

  if (!content.trim()) {
    resultBox.innerText = "⚠️ Vui lòng nhập nội dung bài học";
    return;
  }

  resultBox.innerText = "🤖 AI đang tạo câu hỏi...";
  closeModal();

  try {
    const res = await fetch("https://taobaitap.onrender.com/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        type: "single_choice",
        difficulty,
        count
      })
    });

    if (!res.ok) throw new Error("Server lỗi");

    const data = await res.json();

    // ===== HIỂN THỊ CÂU HỎI =====
    let html = `<h2>${data.title}</h2><form id="quizForm">`;

    data.questions.forEach((q, i) => {
      html += `<div style="margin-bottom:20px">
        <p><b>Câu ${i + 1}: ${q.question}</b></p>`;

      q.options.forEach(opt => {
        html += `
          <label>
            <input type="radio" name="q${i}" value="${opt}">
            ${opt}
          </label><br>
        `;
      });

      html += `</div>`;
    });

    html += `<button type="submit">📤 Nộp bài</button></form>`;
    resultBox.innerHTML = html;

    // CHECK ĐÁP ÁN
    document.getElementById("quizForm").onsubmit = function (e) {
      e.preventDefault();
      let score = 0;

      data.questions.forEach((q, i) => {
        const chosen = document.querySelector(`input[name="q${i}"]:checked`);
        if (chosen && q.answer.includes(chosen.value)) score++;
      });

      alert(`✅ Bạn đúng ${score}/${data.questions.length} câu`);
    };

  } catch (err) {
    console.error(err);
    resultBox.innerText = "❌ Không thể tạo câu hỏi";
  }
}
