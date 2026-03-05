# Autonomous AI Agent Full-Stack Application

This project is a sophisticated Full-Stack Web Application featuring an Autonomous AI Agent capable of answering questions, solving math problems, and executing Python code. The frontend is a visually stunning React application built with Vite, mimicking the ChatGPT dark mode interface, while the backend is an efficient and robust FastAPI server.

## Features
- **Dynamic React Frontend:** Responsive, fluid UI with sliding sidebars, smooth animations, and a sleek dark theme.
- **FastAPI Backend:** Lightweight and ultra-fast Python backend routing prompts to a customizable LLM.
- **Autonomous Agent Functionality:** The backend agent uses OpenRouter's free tier (or any OpenAI-styled endpoint) with tool-calling mechanics (Python execution & Math tools).

## Prerequisites
- Node.js (for the frontend)
- Python 3.9+ (for the backend)
- An OpenRouter API Key (or substitute your own LLM provider API)

## Installation & Setup

### 1. Backend Setup
Navigate into the `backend` directory, install requirements, and set up your `.env`.

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create or configure `.env` in the `backend/` folder:
```env
OPENROUTER_API_KEY=your_actual_api_key
```

Run the backend server:
```bash
uvicorn app:app --reload --port 8000
```
*The API will be available at http://localhost:8000.*

### 2. Frontend Setup
Navigate into the `frontend` directory, install node modules, and start the development server.

```bash
cd frontend
npm install
npm run dev
```

The frontend should automatically connect to the backend through the URL specified in `frontend/.env` (`VITE_API_URL=http://localhost:8000`).
Open the provided local network URL (usually `http://localhost:5173`) in your browser to start interacting.

## Future Enhancements
- User authentication and persistent chat history.
- Expanded tool repository for the AI agent (e.g., file writing, web searching).
# AI-Agent
