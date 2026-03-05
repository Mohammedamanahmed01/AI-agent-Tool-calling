from fastapi import FastAPI
from pydantic import BaseModel
from orchestrator import autonomous_agent
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="AI Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    result = autonomous_agent(request.message)
    return ChatResponse(reply=result)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "AI Agent API is running!"}
