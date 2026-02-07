function openModal() {
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

async function generateAI() {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const type = document.getElementById("type").value;
  const difficulty = document.getElementById("difficulty").value;
  const count = document.getElementById("count").value;

  if (!content) {
    alert("Vui lòng nhập nội dung bài học");
    return;
  }

  document.getElementById("result").innerText = "⏳ AI đang tạo câu hỏi...";

  const res = await fetch("https://YOUR-BACKEND.onrender.com/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      content,
      type,
      difficulty,
      count
    })
  });

  const data = await res.json();
  document.getElementById("result").innerText = data.result;
}
