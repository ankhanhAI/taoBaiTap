from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import os
import json

openai.api_key = os.getenv("OPENAI_API_KEY")

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
    difficulty: str
    count: int

@app.post("/generate")
async def generate_quiz(data: GenerateRequest):
    prompt = f"""
Bạn là giáo viên.
Hãy tạo {data.count} câu hỏi trắc nghiệm 1 đáp án đúng.
Chủ đề: {data.content}
Độ khó: {data.difficulty}

Trả về JSON theo format:
{{
  "questions": [
    {{
      "question": "...",
      "options": ["A...", "B...", "C...", "D..."],
      "answer": "A"
    }}
  ]
}}
"""

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    quiz = json.loads(response.choices[0].message.content)

    return {
        "title": data.title,
        "questions": quiz["questions"]
    }
