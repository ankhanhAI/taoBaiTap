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
        difficulty,
        count: Number(count)
      })
    });

    if (!res.ok) throw new Error("Server lỗi");

    const data = await res.json();

    // 👉 TEST TẠM: HIỆN PAYLOAD
    resultBox.innerHTML = `
      <h3>${data.result}</h3>
      <pre>${JSON.stringify(data.payload, null, 2)}</pre>
    `;

  } catch (err) {
    console.error(err);
    resultBox.innerText = "❌ Lỗi kết nối server";
  }
}
