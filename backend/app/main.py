from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# ✅ BẬT CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ ĐỊNH NGHĨA DỮ LIỆU NHẬN TỪ FRONTEND
class GenerateRequest(BaseModel):
    title: str
    content: str
    type: str
    difficulty: str
    count: int

# ✅ API TẠO CÂU HỎI
@app.post("/generate")
async def generate_quiz(data: GenerateRequest):
    questions = []

    for i in range(1, data.count + 1):
        questions.append({
            "question": f"{data.content} – câu hỏi số {i}?",
            "options": [
                "A. Đáp án 1",
                "B. Đáp án 2",
                "C. Đáp án 3",
                "D. Đáp án 4"
            ],
            "answer": ["A"]
        })

    return {
        "title": data.title,
        "type": data.type,
        "questions": questions
    }
