from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


client = Groq(api_key=os.getenv("GROQ_API_KEY"))


class Query(BaseModel):
    message: str


SYSTEM_PROMPT = """
You are a medical assistant specialized ONLY in PCOS and PCOD.

Answer questions about:
- PCOS symptoms
- causes
- diagnosis
- treatment
- fertility
- diet
- lifestyle

If the question is unrelated, politely say you only answer PCOS related questions.
"""


@app.post("/ask")
def ask(query: Query):

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": query.message}
        ]
    )

    answer = response.choices[0].message.content

    return {"message": answer}

