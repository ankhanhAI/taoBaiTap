from fastapi import FastAPI
from pydantic import BaseModel
from app.ai import generate_questions

app = FastAPI()

class Data(BaseModel):
    title: str
    content: str
    type: str
    difficulty: str
    count: int

@app.post("/generate")
def generate(data: Data):
    result = generate_questions(
        data.content,
        data.type,
        data.difficulty,
        data.count
    )
    return {"result": result}
