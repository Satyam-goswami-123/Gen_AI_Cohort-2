import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routes.analyze import router as analyze_router

load_dotenv()

app = FastAPI(
    title="DecisionAI - Community Decision Intelligence API",
    description="Backend API for DecisionAI community decision support platform using Google Gemini API",
    version="1.0.0"
)

# CORS configuration
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(analyze_router, prefix="/api")

@app.get("/")
async def root():
    return {
        "message": "Welcome to the DecisionAI API. Head to /docs for API documentation.",
        "status": "online"
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
