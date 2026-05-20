import asyncio
import json
import logging
import os
from typing import Annotated, Any

import fitz
from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from openai import APIError, APITimeoutError, AsyncOpenAI
from pydantic import BaseModel, Field, ValidationError

load_dotenv()
logger = logging.getLogger(__name__)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY is not set in the environment.")

MODEL_NAME = "llama-3.3-70b-versatile"
GROQ_BASE_URL = "https://api.groq.com/openai/v1"

client = AsyncOpenAI(api_key=GROQ_API_KEY, base_url=GROQ_BASE_URL)

app = FastAPI(title="VectorHire API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CVEvaluationSchema(BaseModel):
    candidate_score_out_of_100: int = Field(ge=0, le=100)
    executive_summary: str
    matched_skills: list[str]
    missing_critical_skills: list[str]
    impact_evaluation: str
    red_flags: list[str]
    recommended_interview_questions: list[str]


AUDITOR_SYSTEM_PROMPT = """You are The Auditor, a strict technical hiring evaluator.
Your job is to compare a job description against a candidate CV with zero generosity.
Focus only on hard skills, technical tools, platforms, frameworks, architecture experience, domain requirements, and explicitly stated experience.
Do not reward inferred experience.
Do not discuss soft skills, writing quality, formatting, or general professionalism.
Output concise plain text with these sections only:
1. Matched hard skills
2. Missing mandatory hard skills
3. Technical depth observations
"""

SKEPTIC_SYSTEM_PROMPT = """You are The Skeptic, a ruthless CV reviewer.
Ignore the candidate's tech stack unless it reveals a contradiction.
Your job is to hunt for red flags only:
- unexplained timeline gaps
- overlapping or contradictory dates
- suspicious seniority claims
- vague impact statements without measurable evidence
- responsibilities presented without proof of outcomes
- improbable combinations that deserve verification
Output concise plain text with these sections only:
1. Timeline concerns
2. Impact skepticism
3. Other red flags
"""

SYNTHESIZER_SYSTEM_PROMPT = """You are the Lead Hiring Manager for VectorHire.
You will synthesize the original job description and CV with specialist reviews from The Auditor and The Skeptic.
Return only valid JSON matching this exact schema:
{
  "candidate_score_out_of_100": integer,
  "executive_summary": string,
  "matched_skills": [string],
  "missing_critical_skills": [string],
  "impact_evaluation": string,
  "red_flags": [string],
  "recommended_interview_questions": [string]
}
Rules:
- candidate_score_out_of_100 must be an integer from 0 to 100.
- executive_summary must be objective and limited to 2-3 sentences.
- matched_skills must contain only skills evidenced in both the CV and the JD.
- missing_critical_skills must contain only explicit JD requirements not evidenced in the CV.
- impact_evaluation must assess whether the candidate quantifies outcomes or only lists responsibilities.
- red_flags must contain concrete concerns only; return an empty list if none.
- recommended_interview_questions must contain targeted questions that pressure-test weaknesses, missing depth, red flags, or unverified claims.
- Do not include markdown fences.
- Do not include commentary outside the JSON object.
"""


async def run_agent(system_prompt: str, user_prompt: str, *, temperature: float = 0.2) -> str:
    try:
        response = await client.chat.completions.create(
            model=MODEL_NAME,
            temperature=temperature,
            max_tokens=1400,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        )
    except APITimeoutError as exc:
        raise HTTPException(status_code=504, detail="The Groq API timed out while evaluating the candidate.") from exc
    except APIError as exc:
        status_code = getattr(exc, "status_code", None) or 502
        groq_error = None

        response_body = getattr(exc, "body", None)
        if isinstance(response_body, dict):
            error_payload = response_body.get("error")
            if isinstance(error_payload, dict):
                groq_error = error_payload.get("message") or json.dumps(error_payload)
            elif response_body:
                groq_error = json.dumps(response_body)
        elif response_body:
            groq_error = str(response_body)

        if not groq_error:
            groq_error = str(exc)

        logger.exception("Groq API error: status=%s detail=%s", status_code, groq_error)
        raise HTTPException(status_code=status_code, detail=f"Groq API error: {groq_error}") from exc
    except Exception as exc:
        logger.exception("Unexpected error while contacting Groq API")
        raise HTTPException(status_code=500, detail=f"Unexpected error while contacting Groq API: {exc}") from exc

    if not response.choices:
        raise HTTPException(status_code=502, detail="The Groq API returned an empty response.")

    content = response.choices[0].message.content
    if not content or not content.strip():
        raise HTTPException(status_code=502, detail="The Groq API returned a blank response.")

    return content.strip()


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    try:
        with fitz.open(stream=pdf_bytes, filetype="pdf") as document:
            page_text = [page.get_text("text") for page in document]
    except Exception as exc:
        raise HTTPException(status_code=400, detail="The uploaded PDF could not be parsed.") from exc

    extracted_text = "\n".join(text.strip() for text in page_text if text and text.strip()).strip()
    if not extracted_text:
        raise HTTPException(status_code=422, detail="The uploaded PDF did not contain extractable text.")

    return extracted_text


def parse_json_object(raw_text: str) -> dict[str, Any]:
    cleaned = raw_text.strip()

    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        if cleaned.lower().startswith("json"):
            cleaned = cleaned[4:]
        cleaned = cleaned.strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start == -1 or end == -1 or end <= start:
            raise HTTPException(status_code=502, detail="The synthesizer did not return valid JSON.")

        candidate_json = cleaned[start : end + 1]
        try:
            return json.loads(candidate_json)
        except json.JSONDecodeError as exc:
            raise HTTPException(status_code=502, detail="The synthesizer returned malformed JSON.") from exc


@app.get("/health")
async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/evaluate/", response_model=CVEvaluationSchema)
async def evaluate_candidate(
    jd_text: Annotated[str | None, Form()] = None,
    file: Annotated[UploadFile | None, File()] = None,
    job_description: Annotated[str | None, Form()] = None,
    resume: Annotated[UploadFile | None, File()] = None,
) -> CVEvaluationSchema:
    resolved_jd_text = (jd_text or job_description or "").strip()
    resolved_file = file or resume

    if not resolved_jd_text:
        raise HTTPException(status_code=400, detail="A job description is required.")

    if resolved_file is None:
        raise HTTPException(status_code=400, detail="A resume PDF is required.")

    if resolved_file.content_type not in {"application/pdf", "application/octet-stream"}:
        raise HTTPException(status_code=400, detail="The uploaded resume must be a PDF file.")

    pdf_bytes = await resolved_file.read()
    if not pdf_bytes:
        raise HTTPException(status_code=400, detail="The uploaded resume file is empty.")

    cv_text = extract_text_from_pdf(pdf_bytes)

    auditor_prompt = f"""Job Description:
{resolved_jd_text}

Candidate CV:
{cv_text}
"""

    skeptic_prompt = f"""Candidate CV:
{cv_text}

Job Description for context:
{resolved_jd_text}
"""

    auditor_report, skeptic_report = await asyncio.gather(
        run_agent(AUDITOR_SYSTEM_PROMPT, auditor_prompt, temperature=0.1),
        run_agent(SKEPTIC_SYSTEM_PROMPT, skeptic_prompt, temperature=0.1),
    )

    synthesizer_prompt = f"""Job Description:
{resolved_jd_text}

Candidate CV:
{cv_text}

Auditor Report:
{auditor_report}

Skeptic Report:
{skeptic_report}

Now produce the final evaluation JSON.
"""

    synthesizer_output = await run_agent(
        SYNTHESIZER_SYSTEM_PROMPT,
        synthesizer_prompt,
        temperature=0.1,
    )

    parsed_payload = parse_json_object(synthesizer_output)

    try:
        return CVEvaluationSchema.model_validate(parsed_payload)
    except ValidationError as exc:
        raise HTTPException(status_code=502, detail="The synthesizer returned data that did not match the expected schema.") from exc
