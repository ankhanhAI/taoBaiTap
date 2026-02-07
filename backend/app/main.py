from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.ai import generate_questions

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
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
    try:
        questions = generate_questions(
            content=data.content,
            count=data.count
        )

        return {
            "title": data.title,
            "type": data.type,
            "questions": questions
        }

    except Exception as e:
        return {
            "error": str(e)
        }
