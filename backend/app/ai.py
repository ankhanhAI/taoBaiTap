import google.generativeai as genai
import json
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-pro")

def generate_questions(content: str, count: int):
    prompt = f"""
Tạo {count} câu hỏi trắc nghiệm 1 đáp án đúng từ nội dung sau:

\"\"\"{content}\"\"\"

YÊU CẦU:
- Mỗi câu có 4 đáp án A B C D
- Chỉ 1 đáp án đúng
- Trả về JSON THUẦN, KHÔNG giải thích, KHÔNG markdown

FORMAT:
[
  {{
    "question": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "answer": ["A"]
  }}
]
"""

    response = model.generate_content(prompt)

    text = response.text.strip()

    # Phòng AI trả ```json
    if text.startswith("```"):
        text = text.replace("```json", "").replace("```", "").strip()

    return json.loads(text)
