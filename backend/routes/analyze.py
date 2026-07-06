import json
import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import JSONResponse
from services.file_processor import extract_text_from_file
from services.ai_service import analyze_with_gemini
from services.prompt_builder import build_analysis_prompt, get_use_case_examples

router = APIRouter()

# In-memory history store (replace with DB in production)
analysis_history: List[dict] = []


@router.post("/analyze")
async def analyze(
    query: str = Form(...),
    use_case: str = Form(""),
    files: List[UploadFile] = File(default=[]),
):
    """
    Main analysis endpoint.
    Accepts a text query + optional uploaded files.
    Returns structured Gemini AI analysis.
    """
    if not query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    # Process uploaded files
    file_context_parts = []
    processed_files = []

    for file in files:
        if file.filename:
            content = await file.read()
            if len(content) > 10 * 1024 * 1024:  # 10MB limit
                raise HTTPException(
                    status_code=413,
                    detail=f"File '{file.filename}' exceeds 10MB limit",
                )
            try:
                extracted_text = await extract_text_from_file(file.filename, content)
                file_context_parts.append(
                    f"--- File: {file.filename} ---\n{extracted_text}"
                )
                processed_files.append(
                    {"name": file.filename, "size": len(content), "status": "processed"}
                )
            except ValueError as e:
                processed_files.append(
                    {"name": file.filename, "size": len(content), "status": f"error: {e}"}
                )

    # Build combined context
    file_context = "\n\n".join(file_context_parts)

    # Build prompt
    prompt = build_analysis_prompt(query, file_context, use_case)

    # Call Gemini
    try:
        analysis = await analyze_with_gemini(prompt)
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"AI analysis failed: {str(e)}"
        )

    # Build response
    analysis_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat() + "Z"

    result = {
        "id": analysis_id,
        "timestamp": timestamp,
        "query": query,
        "use_case": use_case,
        "files_processed": processed_files,
        "analysis": analysis,
    }

    # Store in history (keep last 50)
    analysis_history.append({
        "id": analysis_id,
        "timestamp": timestamp,
        "query": query[:100],
        "use_case": use_case,
        "priority_score": analysis.get("priority_score", "Medium"),
        "confidence_level": analysis.get("confidence_level", 60),
        "category": analysis.get("category", "general"),
        "executive_summary": analysis.get("executive_summary", "")[:200],
    })
    if len(analysis_history) > 50:
        analysis_history.pop(0)

    return JSONResponse(content=result)


@router.get("/history")
async def get_history():
    """Return list of previous analyses."""
    return JSONResponse(content={"history": list(reversed(analysis_history))})


@router.get("/examples")
async def get_examples():
    """Return use case examples."""
    return JSONResponse(content={"examples": get_use_case_examples()})


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "DecisionAI Backend"}
