// ================== MODAL ==================
function openModal() {
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// click ra ngoài modal
window.onclick = function (e) {
  const modal = document.getElementById("modal");
  if (e.target === modal) closeModal();
};

// ================== TẠO BÀI TẬP ==================
async function generate() {
  const title = document.getElementById("title").value || "Bài tập";
  const content = document.getElementById("content").value;
  const difficulty = document.getElementById("difficulty").value;
  const count = Number(document.getElementById("count").value);
  const resultBox = document.getElementById("result");

  if (!content.trim()) {
    alert("Vui lòng nhập nội dung bài học");
    return;
  }

  closeModal();
  resultBox.innerHTML = "🤖 AI đang tạo câu hỏi...";

  try {
    const res = await fetch("https://taobaitap.onrender.com/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
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

    // ================== HIỂN THỊ CÂU HỎI ==================
    let html = `<h2>${data.title}</h2><form id="quizForm">`;

    data.questions.forEach((q, i) => {
      html += `
        <div style="margin-bottom:20px; padding:10px; border:1px solid #ddd; border-radius:8px">
          <p><b>Câu ${i + 1}: ${q.question}</b></p>
      `;

      q.options.forEach(opt => {
        html += `
          <label style="display:block; margin:4px 0">
            <input type="radio" name="q${i}" value="${opt}">
            ${opt}
          </label>
        `;
      });

      html += `</div>`;
    });

    html += `
      <button type="submit" style="padding:10px 20px; font-size:16px">
        📤 Nộp bài
      </button>
    </form>
    `;

    resultBox.innerHTML = html;

    // ================== CHẤM ĐIỂM ==================
    document.getElementById("quizForm").onsubmit = function (e) {
      e.preventDefault();

      let score = 0;

      data.questions.forEach((q, i) => {
        const chosen = document.querySelector(
          `input[name="q${i}"]:checked`
        );
        if (chosen && q.answer.includes(chosen.value)) {
          score++;
        }
      });

      alert(`✅ Bạn đúng ${score}/${data.questions.length} câu`);
    };

  } catch (err) {
    console.error(err);
    resultBox.innerHTML = "❌ Không thể tạo câu hỏi. Kiểm tra server / API key.";
  }
}
