import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()  # load file .env

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-pro")

def generate_questions(content, qtype, difficulty, count):
    prompt = f"""
    Bạn là giáo viên THPT.

    Hãy tạo {count} câu hỏi dạng {qtype},
    độ khó: {difficulty}.

    Nội dung bài học:
    {content}

    Mỗi câu có 4 đáp án A, B, C, D
    và ghi rõ đáp án đúng.
    """

    response = model.generate_content(prompt)
    return response.text
