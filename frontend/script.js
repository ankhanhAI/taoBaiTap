// MỞ MODAL
function openModal() {
  document.getElementById("modal").style.display = "flex";
}

// ĐÓNG MODAL
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// ĐÓNG MODAL KHI CLICK RA NGOÀI
window.onclick = function (e) {
  const modal = document.getElementById("modal");
  if (e.target === modal) {
    closeModal();
  }
};

// TẠO BÀI TẬP BẰNG AI
async function generate() {
  const content = document.getElementById("content").value;
  const difficulty = document.getElementById("difficulty").value;
  const count = document.getElementById("count").value;
  const resultBox = document.getElementById("result");

  if (!content.trim()) {
    resultBox.innerText = "⚠️ Vui lòng nhập nội dung bài học";
    return;
  }

  closeModal(); // đóng modal khi bắt đầu tạo

  resultBox.innerText = "🤖 AI đang tạo câu hỏi, vui lòng chờ...";

  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 60000); // timeout 60s

    const res = await fetch("https://taobaitap.onrender.com/generate-quiz", {
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

    if (data.result) {
      resultBox.innerText = data.result;
    } else {
      resultBox.innerText = "❌ Không nhận được dữ liệu từ AI";
    }

  } catch (err) {
    resultBox.innerText = "❌ Lỗi tạo câu hỏi hoặc server quá chậm";
    console.error(err);
  }
}

