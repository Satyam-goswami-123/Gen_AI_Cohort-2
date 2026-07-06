# DecisionAI – Community Decision Intelligence Platform

DecisionAI is a production-quality, generative AI-driven decision support system designed to help local governments, NGOs, educators, and city administrators make smarter, evidence-based choices.

---

## Technical Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, Lucide Icons, Axios.
- **Backend**: FastAPI, Python 3.11, PyMuPDF (PDF Parser), Gemini API (`gemini-2.0-flash`).
- **Explainability**: Dedicated Explainable AI (XAI) engine highlighting the logical flow, confidence indexes, and data gaps.

---

## Project Structure
```
gen-ai-hack/
├── backend/
│   ├── main.py                    # Entry point
│   ├── requirements.txt           # Python Dependencies
│   └── services/
│       ├── file_processor.py      # PDF, CSV, TXT, JSON parser
│       ├── ai_service.py          # Gemini AI API interface
│       └── prompt_builder.py      # Context & Prompts
│   └── routes/
│       └── analyze.py             # Route controller (Workspace, history, sandboxes)
├── frontend/                      # React SPA
│   ├── package.json
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx
│       ├── components/
│       └── pages/
└── README.md
```

---

## Setup & Running Locally

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` directory.
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file from the example template and fill in your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key
   PORT=8000
   ```
5. Start the FastAPI local server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *The API will be available at `http://localhost:8000/api`.*

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory.
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite hot-reloading development server:
   ```bash
   npm run dev
   ```
   *The client app will be available at `http://localhost:5173`.*
