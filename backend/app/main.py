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

CHỈ TRẢ VỀ JSON, KHÔNG GIẢI THÍCH:

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

    # dọn ```json nếu có
    if "```" in text:
        text = text.replace("```json", "").replace("```", "").strip()

    return json.loads(text)
