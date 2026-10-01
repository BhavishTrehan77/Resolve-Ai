
#Deployed Link
https://resolve-ai-virid.vercel.app/login
# RESOLVEAI — AI-Powered IT Incident & Support Management Platform

ResolveAI is an enterprise-grade, full-stack GenAI platform designed for autonomous IT incident triage, diagnostic root-cause analysis, semantic knowledge retrieval (RAG), and human-in-the-loop support orchestration.

---

## 🚀 Key Highlights & Architecture

### 1. Multi-Agent AI Orchestration
A sequential pipeline coordinating 5 specialized agents:
- **Triage Agent (`ai/agents/triage.agent.js`)**: Understands ticket intent, classifies into category & priority enums with runtime validation and JSON parsing.
- **Retrieval Agent (`ai/agents/retrieval.agent.js`)**: Rewrites user query, generates embeddings, performs vector search across technical documentation, reranks results, and calculates retrieval confidence.
- **Diagnosis Agent (`ai/agents/diagnosis.agent.js`)**: Synthesizes incident data and retrieved technical context to identify the most probable root cause.
- **Resolution Agent (`ai/agents/resolution.agent.js`)**: Generates structured, ordered troubleshooting and remediation steps based strictly on verified documentation.
- **Escalation Agent (`ai/agents/escalation.agent.js`)**: Evaluates confidence scores against a configurable threshold to determine whether automated resolution is safe or human intervention is required.

### 2. Semantic RAG & Vector Search
- **PDF Document Ingestion**: Upload technical SOP manuals, automated text cleaning, configurable text chunking, and embedding generation via Google Gemini.
- **MongoDB Atlas Vector Search**: Cosine similarity vector search with fallback resilience.
- **Relevance Reranking**: Re-orders candidate documents before LLM prompt injection.

### 3. Role-Based Access Control (RBAC) & Human-In-The-Loop
Three distinct system roles:
- **EMPLOYEE**: Submit tickets, track lifecycle, review AI diagnosis & resolutions, post incident updates.
- **AGENT**: Manage assigned incidents, inspect high-priority escalations, modify AI diagnosis & resolution plans, resolve tickets.
- **ADMIN**: Executive telemetry dashboard, user & agent provisioning, PDF knowledge management, and AI assistant console.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT authentication, bcrypt, Multer, PDF-parse.
- **AI / LLM**: Google Gemini Generative Model & Gemini Embedding Model.
- **Testing**: Jest, Supertest.

---

## 📦 Project Setup

### Backend Setup
```bash
cd backend
npm install
npm start
```
*Runs on port 3000.*

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Runs on Vite dev server (proxies `/api` to `http://localhost:3000`).*

### Automated Testing
```bash
cd backend
npm test
```
*Runs Jest & Supertest suites.*

---

## 👥 Demo Personas
- **Admin**: `admin@resolve.ai` / `Admin@123`
- **Agent**: `agent@resolve.ai` / `Agent@123`
- **Employee**: `employee@resolve.ai` / `Employee@123`
