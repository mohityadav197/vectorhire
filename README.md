# VectorHire

**A high-speed, multi-agent AI resume evaluation engine.**

VectorHire evaluates a candidate's resume against a job description using a lightweight multi-agent architecture built for **low latency**, **structured outputs**, and **defensible engineering decisions**. Instead of relying on heavyweight orchestration frameworks, it uses a custom native async pipeline to run specialized AI personas in parallel and return a strict, schema-validated JSON payload to a recruiter-facing dashboard.

---

## Why I built this

Most AI resume-screening prototypes either:

- overuse abstraction-heavy agent frameworks,
- return fragile free-form text,
- or introduce unnecessary latency by serializing every LLM step.

VectorHire was built to demonstrate a different approach:

- **Custom multi-agent orchestration** over framework-heavy stacks like LangChain or CrewAI
- **Concurrent specialist execution** using Python's native `asyncio.gather`
- **Strict schema enforcement** so LLM output is treated as untrusted input
- **High-speed inference** through Groq's LPU-backed serving with `llama-3.3-70b-versatile`

The goal was to build an MVP that is simple enough to reason about, fast enough to feel interactive, and rigorous enough to discuss in a GenAI or MLOps interview.

---

## Core idea

VectorHire compares a **Job Description** and a **candidate CV** using three distinct AI personas:

- **Auditor** — evaluates technical fit, matched hard skills, missing requirements, and depth
- **Skeptic** — looks for credibility issues, vague claims, timeline anomalies, and red flags
- **Synthesizer** — combines both specialist reports into a final strict JSON evaluation

This creates a more structured and bias-reduced decision flow than a single monolithic prompt.

---

## Engineering highlights

### 1) Custom multi-agent orchestration
Rather than introducing a heavy agent framework, VectorHire implements orchestration directly in Python using a small, explicit async pipeline. This keeps the architecture transparent, debuggable, and easy to defend technically.

### 2) Concurrent execution for low latency
The **Auditor** and **Skeptic** are independent roles, so they execute in parallel using `asyncio.gather`. Their raw reports are then passed to the **Synthesizer** for final structured evaluation.

### 3) Strict LLM output validation
The LLM is treated as an **untrusted producer**. Even after the Synthesizer is instructed to return JSON, its output is:

1. parsed defensively,
2. cleaned if needed,
3. and validated against a **Pydantic schema**

If the output does not match the contract, the backend rejects it before anything reaches the frontend.

### 4) Lightning-fast inference
Inference is powered by **Groq's API** using the **`llama-3.3-70b-versatile`** model through an OpenAI-compatible async client. This provides fast turnaround while preserving a simple application integration surface.

---

## Architecture data flow

```text
[React UI]
   │
   │ 1. User pastes Job Description + uploads PDF resume
   ▼
[FastAPI Backend]
   │
   │ 2. Validate multipart request
   │ 3. Extract text from PDF with PyMuPDF
   ▼
[Multi-Agent Orchestrator]
   ├── Auditor Agent  ──┐
   └── Skeptic Agent  ──┤  (run concurrently via asyncio.gather)
                        ▼
                 [Synthesizer Agent]
                        │
                        │ 4. Return JSON only
                        ▼
             [Pydantic Schema Validation]
                        │
                        │ 5. Reject malformed or mismatched output
                        ▼
              [Structured JSON API Response]
                        │
                        ▼
               [Frontend Dashboard Render]
```

### Request lifecycle

1. The frontend collects the **job description** and **PDF resume**.
2. The client sends the payload to the backend as **multipart form data**.
3. FastAPI validates required fields and file type.
4. PyMuPDF extracts text from the uploaded PDF.
5. The backend launches the **Auditor** and **Skeptic** concurrently.
6. Their reports are passed into the **Synthesizer**.
7. The Synthesizer returns a candidate evaluation in JSON form.
8. The backend validates the response against a **Pydantic schema**.
9. The frontend renders the validated result as a dashboard with score, summary, skills gap analysis, red flags, and interview questions.

---

## Tech stack

### Frontend
- **React**
- **Vite**
- **Tailwind CSS**
- **Axios** for multipart form-data submission

### Backend
- **FastAPI**
- **Python 3.11**
- **PyMuPDF** for PDF text extraction
- **Pydantic** for strict response schema validation
- **python-multipart** for file uploads

### AI engine
- **AsyncOpenAI** client
- **Groq API**
- **Native asyncio** orchestration
- **`llama-3.3-70b-versatile`**

### Infrastructure
- **Docker**
- **Docker Compose**

---

## Structured output contract

The final response is enforced through a strict schema and includes:

- `candidate_score_out_of_100`
- `executive_summary`
- `matched_skills`
- `missing_critical_skills`
- `impact_evaluation`
- `red_flags`
- `recommended_interview_questions`

This design ensures the frontend consumes a predictable contract rather than brittle free-form model text.

---

## Getting started

### Prerequisites
- **Docker**
- **Docker Compose**
- A **Groq API key**

### 1) Clone the repository

```bash
git clone <your-repo-url>
cd VectorHire
```

### 2) Create the backend environment file
Create a `.env` file inside `backend/`:

```env
GROQ_API_KEY=your_key
```

### 3) Build and run the stack

```bash
docker-compose up --build
```

### 4) Access the application
- **Frontend UI:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **Health check:** http://localhost:8000/health

---

## Local development notes

The project is fully containerized for local development:

- the **frontend** runs on Vite's dev server,
- the **backend** runs on FastAPI + Uvicorn,
- both services are wired together through **Docker Compose**.

This keeps the environment reproducible and minimizes local setup friction.

---

## Design trade-offs

### Why not LangChain or CrewAI?
Because the workflow is a **fixed orchestration graph**, not an open-ended autonomous agent system. Native async orchestration gives:

- lower abstraction overhead,
- better latency control,
- simpler debugging,
- and fewer framework dependencies.

### Why schema validation matters
LLM output is probabilistic. Application contracts cannot be. By validating the final response through Pydantic, VectorHire prevents malformed model output from leaking into the UI or downstream systems.

### Why this architecture works well for an MVP
This design keeps the system:

- **fast** enough for interactive use,
- **small** enough to explain clearly,
- and **structured** enough to extend into production patterns later.

---

## Future roadmap

### 1) Async job execution for scale
Move long-running evaluations off the request path using:

- **Redis**
- **Celery** or another background worker system

This would let the API accept jobs quickly and process them asynchronously at higher concurrency.

### 2) PostgreSQL persistence layer
Add durable storage for:

- uploaded resume metadata
- extracted text
- evaluation results
- agent outputs
- audit history

This would unlock replayability, analytics, and recruiter workflow history.

### 3) Production hardening
Potential next steps:

- rate limiting and backpressure
- observability around model latency and schema failures
- object storage for resumes
- authentication and tenant isolation
- OCR support for scanned PDFs

---

## What this project demonstrates

VectorHire is intentionally designed to showcase practical GenAI and MLOps engineering skills:

- prompt-role decomposition into specialized agents
- low-latency async orchestration
- strict structured output enforcement
- LLM boundary hardening
- containerized full-stack local deployment

It is less about novelty for its own sake and more about building a system that is technically clean, fast, and easy to defend in an engineering interview.
