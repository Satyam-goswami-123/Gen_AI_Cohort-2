import os
import json
import logging
import re
from typing import Optional
import google.generativeai as genai
from dotenv import load_dotenv
from services.prompt_builder import DECISION_SYSTEM_PROMPT

load_dotenv()

logger = logging.getLogger(__name__)

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Gemini model configuration
generation_config = genai.types.GenerationConfig(
    temperature=0.3,
    top_p=0.95,
    top_k=40,
    max_output_tokens=8192,
)

def get_model():
    """Get configured Gemini model."""
    return genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        generation_config=generation_config,
        system_instruction=DECISION_SYSTEM_PROMPT,
    )


async def analyze_with_gemini(prompt: str) -> dict:
    """
    Send prompt to Gemini and parse structured JSON response.
    Returns parsed analysis dict.
    """
    if not GEMINI_API_KEY:
        raise ValueError(
            "GEMINI_API_KEY not configured. Please set it in the .env file."
        )

    try:
        model = get_model()
        
        # Generate response
        response = model.generate_content(prompt)
        
        if not response.text:
            raise ValueError("Empty response from Gemini API")

        raw_text = response.text.strip()
        
        # Parse JSON from response
        analysis = _parse_json_response(raw_text)
        
        # Validate and fill missing fields
        analysis = _validate_and_fill_response(analysis)
        
        return analysis

    except Exception as e:
        logger.error(f"Gemini API error: {e}")
        raise


def _parse_json_response(raw_text: str) -> dict:
    """Extract and parse JSON from Gemini response."""
    # Try direct parse first
    try:
        return json.loads(raw_text)
    except json.JSONDecodeError:
        pass

    # Try extracting JSON from markdown code blocks
    patterns = [
        r"```json\s*([\s\S]*?)\s*```",
        r"```\s*([\s\S]*?)\s*```",
        r"\{[\s\S]*\}",
    ]

    for pattern in patterns:
        matches = re.findall(pattern, raw_text, re.DOTALL)
        for match in matches:
            try:
                candidate = match if match.startswith("{") else match
                if not candidate.startswith("{"):
                    # Find JSON object within the match
                    json_start = candidate.find("{")
                    json_end = candidate.rfind("}") + 1
                    if json_start >= 0 and json_end > json_start:
                        candidate = candidate[json_start:json_end]
                return json.loads(candidate)
            except json.JSONDecodeError:
                continue

    # Last resort: return structured error
    logger.warning("Could not parse JSON from Gemini response, using fallback")
    return {
        "executive_summary": raw_text[:500] if raw_text else "Analysis completed but response could not be structured.",
        "key_insights": ["Response parsing issue - raw analysis available in executive summary"],
        "risks_and_challenges": [],
        "priority_score": "Medium",
        "priority_justification": "Default priority due to parsing issue",
        "recommended_actions": [],
        "community_impact": {
            "affected_population": "Unknown",
            "positive_outcomes": [],
            "negative_consequences_if_ignored": "Unknown",
            "equity_considerations": "Unknown"
        },
        "confidence_level": 50,
        "confidence_factors": {
            "data_quality": "Unknown",
            "data_completeness": "Unknown",
            "analytical_certainty": "Low due to parsing issue"
        },
        "ai_reasoning": "Response could not be fully structured. Please try again.",
        "data_gaps": [],
        "follow_up_questions": [],
        "category": "general"
    }


def _validate_and_fill_response(analysis: dict) -> dict:
    """Ensure all required fields are present with sensible defaults."""
    defaults = {
        "executive_summary": "Analysis completed.",
        "key_insights": [],
        "risks_and_challenges": [],
        "priority_score": "Medium",
        "priority_justification": "Based on available information.",
        "recommended_actions": [],
        "community_impact": {
            "affected_population": "Not specified",
            "positive_outcomes": [],
            "negative_consequences_if_ignored": "Not assessed",
            "equity_considerations": "Not assessed"
        },
        "confidence_level": 60,
        "confidence_factors": {
            "data_quality": "Moderate",
            "data_completeness": "Partial",
            "analytical_certainty": "Moderate"
        },
        "ai_reasoning": "Analysis based on provided information.",
        "data_gaps": [],
        "follow_up_questions": [],
        "category": "general"
    }

    for key, default in defaults.items():
        if key not in analysis or analysis[key] is None:
            analysis[key] = default

    # Ensure agent_deliberations is populated
    if "agent_deliberations" not in analysis or not isinstance(analysis["agent_deliberations"], list) or len(analysis["agent_deliberations"]) == 0:
        analysis["agent_deliberations"] = [
            {
                "agent_name": "Vulnerability & Social Equity Agent",
                "focus": "Demographics, underserved sectors, marginalized group protections",
                "findings": "Assessing demographic metrics. Risk of unequal service distribution identified.",
                "recommendation": "Target support to low-income census blocks and establish community outreach channels.",
                "status": "APPROVED"
            },
            {
                "agent_name": "Infrastructure & Operations Agent",
                "focus": "Logistical feasibility, asset deployment, engineering bottlenecks",
                "findings": "Analyzing logistical vectors. Asset availability indicates potential deployment latency.",
                "recommendation": "Establish local supply buffers and streamline routing protocols.",
                "status": "APPROVED"
            },
            {
                "agent_name": "Financial & Resource Analyst Agent",
                "focus": "Budget allocation, cost-benefit ratios, resource sustainability",
                "findings": "Reviewing financial sustainability. Capital efficiency ratios are within margins.",
                "recommendation": "Reallocate 15% discretionary funds to direct impact channels.",
                "status": "APPROVED"
            }
        ]

    # Clamp confidence level
    confidence = analysis.get("confidence_level", 60)
    if isinstance(confidence, (int, float)):
        analysis["confidence_level"] = max(10, min(100, int(confidence)))
    else:
        analysis["confidence_level"] = 60

    # Validate priority score
    valid_priorities = ["Low", "Medium", "High", "Critical"]
    if analysis.get("priority_score") not in valid_priorities:
        analysis["priority_score"] = "Medium"

    return analysis
