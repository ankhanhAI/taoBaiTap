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
    type: str
    difficulty: str
    count: int

@app.post("/generate")
async def generate_quiz(data: GenerateRequest):
    prompt = f"""
Tạo {data.count} câu hỏi trắc nghiệm 1 đáp án từ nội dung sau:

Nội dung: {data.content}

Yêu cầu:
- Mỗi câu có 4 đáp án A B C D
- Chỉ có 1 đáp án đúng
- Trả về JSON theo mẫu:

{{
  "title": "{data.title}",
  "questions": [
    {{
      "question": "...",
      "options": ["A ...", "B ...", "C ...", "D ..."],
      "answer": ["A ..."]
    }}
  ]
}}
"""

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    text = response.choices[0].message.content

    return json.loads(text)
