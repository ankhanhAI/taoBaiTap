import google.generativeai as genai
import json
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash")

def generate_questions(content: str, count: int):
    prompt = f"""
Tạo {count} câu hỏi trắc nghiệm 1 đáp án đúng từ nội dung sau:

\"\"\"{content}\"\"\"

YÊU CẦU:
- Mỗi câu có 4 đáp án A B C D
- Chỉ 1 đáp án đúng
- Trả về JSON THUẦN (KHÔNG markdown, KHÔNG giải thích)

FORMAT CHÍNH XÁC:
[
  {{
    "question": "Câu hỏi?",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "answer": ["A. ..."]
  }}
]
"""

    response = model.generate_content(prompt)
    text = response.text.strip()

    # 🔥 DỌN RÁC AI
    text = text.replace("```json", "").replace("```", "").strip()

    return json.loads(text)
