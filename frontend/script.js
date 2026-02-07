function openModal() {
  document.getElementById("modal").style.display = "block";
}
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

async function generate() {
  const res = await fetch("https://taobaitap.onrender.com/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: title.value,
      content: content.value,
      difficulty: difficulty.value,
      count: Number(count.value)
    })
  });

  const data = await res.json();
  closeModal();

  let html = `<h2>${data.title}</h2><form id="quiz">`;

  data.questions.forEach((q, i) => {
    html += `<p><b>Câu ${i+1}: ${q.question}</b></p>`;
    q.options.forEach(opt => {
      html += `
        <label>
          <input type="radio" name="q${i}" value="${opt[0]}">
          ${opt}
        </label><br>
      `;
    });
  });

  html += `<button type="button" onclick="submitQuiz()">Nộp bài</button></form>`;
  document.getElementById("result").innerHTML = html;

  window.correctAnswers = data.questions.map(q => q.answer);
}

function submitQuiz() {
  let score = 0;
  correctAnswers.forEach((ans, i) => {
    const pick = document.querySelector(`input[name=q${i}]:checked`);
    if (pick && pick.value === ans) score++;
  });
  alert(`Bạn đúng ${score}/${correctAnswers.length} câu`);
}
