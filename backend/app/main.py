from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
import json

# ===== CONFIG GEMINI =====
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-pro")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    title: str
    content: str
    type: str
    difficulty: str
    count: int

@app.post("/generate")
async def generate_quiz(data: GenerateRequest):
    prompt = f"""
Tạo {data.count} câu hỏi trắc nghiệm 1 đáp án đúng từ nội dung sau:

\"\"\"{data.content}\"\"\"  

YÊU CẦU:
- Mỗi câu có 4 đáp án A B C D
- Chỉ 1 đáp án đúng
- Trả về JSON THUẦN (không markdown, không giải thích)

FORMAT:
{{
  "title": "{data.title}",
  "questions": [
    {{
      "question": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "answer": ["A. ..."]
    }}
  ]
}}
"""

    response = model.generate_content(prompt)
    text = response.text.strip()

    # Dọn ```json nếu có
    if text.startswith("```"):
        text = text.replace("```json", "").replace("```", "").strip()

    return json.loads(text)
