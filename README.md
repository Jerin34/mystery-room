# AI Mystery Room 🔍

> An AI-generated fictional mystery investigation game powered by Google Gemini and built on the modern MERN stack.

---

## 🌟 Overview

**AI Mystery Room** turns any mystery seed into a playable, coherent detective case file.
The application generates suspects, motives, opportunity alibis, simulated forensic evidence (encrypted chats, access logs, CCTV audio transcripts, witness depositions), and exactly **one canonical culprit**.

### Core Tenets
1. **Fair Play First**: The canonical culprit is determined at generation time and kept server-side only. It is **never** leaked to client network payloads before accusation.
2. **One Irrevocable Accusation**: Detectives receive one formal accusation attempt per case, prompting an unsealed evidence-grounded reveal dossier.
3. **Resilient Architecture**: Zero-friction local development with embedded in-memory MongoDB fallback and deterministic procedural seeds when an API key is not configured.
4. **Cinematic Detective Workspace**: Dark investigation room aesthetic with charcoal/navy surfaces, amber forensic accents, glassmorphic dossier panels, interactive suspect board, and player notepad.

---

## 📁 Project Structure

```text
mystery-room/
├── frontend/                   # Frontend (React + Vite + TypeScript + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Navbar, Footer
│   │   │   └── shared/         # Badge, Modal, Spinner
│   │   ├── context/            # AuthContext (session, demo quick-login)
│   │   ├── features/
│   │   │   ├── accusation/     # AccusationModal, RevealPanel
│   │   │   └── investigation/  # CaseBriefing, EvidenceList, EvidenceViewer, SuspectBoard, TimelineView, PlayerNotes
│   │   ├── pages/              # LandingPage, LoginPage, RegisterPage, CreateCasePage, WorkspacePage, CaseHistoryPage
│   │   ├── services/           # api.ts (unified HTTP client)
│   │   └── types/              # Full TypeScript schemas and DTO contracts
│   ├── index.html
│   └── vite.config.ts
│
├── backend/                    # Backend API (Node.js + Express + TypeScript + Mongoose)
│   ├── src/
│   │   ├── config/             # Environment validation (Zod), MongoDB resilient connection
│   │   ├── middleware/         # Auth (JWT), Centralized Error Handler, Rate Limiting, Request ID, Zod Validation
│   │   ├── models/             # User, Case, Evidence, Accusation, PlayerNote
│   │   ├── modules/
│   │   │   ├── ai/             # Gemini integration, prompts, Zod output schemas, procedural seed fallback
│   │   │   ├── auth/           # Registration, login, session profile
│   │   │   ├── cases/          # Case generation, listing, no-leak DTO serializers, deletion
│   │   │   ├── evidence/       # Evidence retrieval, forensic inspection
│   │   │   ├── accusations/    # One-attempt accusation submission, scoring, reveal unsealing
│   │   │   └── notes/          # Private player detective notes with autosave
│   │   ├── routes/             # API v1 route aggregator
│   │   ├── utils/              # Response envelope helpers, structured logger
│   │   ├── app.ts              # Express application setup
│   │   └── server.ts           # Server bootstrap & graceful shutdown
│   └── src/__tests__/          # Automated Jest test suite
│
├── docs/                       # Technical Documentation
│   ├── SPEC.md                 # Product & engineering specification
│   ├── API.md                  # Comprehensive API contract (v1)
│   ├── DATA_MODEL.md           # Database schemas, field types & indexes
│   ├── AI_PROMPTS.md           # Gemini prompt architecture & repair mechanism
│   └── DECISIONS.md            # Architecture Decision Records (ADR)
│
├── .env.example                # Environment configuration template
├── package.json                # Root package with multi-package scripts
└── README.md                   # Project documentation
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** v18+ (tested on v24)
- **npm** v9+

### 2. Environment Setup
Copy `.env.example` to `.env` in the root folder:
```bash
cp .env.example .env
```
*(Optional)* Add your `GEMINI_API_KEY`. If left empty, the application seamlessly operates in high-fidelity deterministic development seed mode so you can play immediately offline.

### 3. Install Dependencies
```bash
# Install root, backend, and frontend packages
npm run install:all
```

### 4. Run Locally
```bash
# Run both Backend API (port 5000) and Frontend (port 5173) concurrently:
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🧪 Testing & Validation

Run the automated backend test suite:
```bash
npm run test
```
The test suite validates:
- System health endpoint
- Account registration, duplicate rejection, login, and JWT session restoration
- Case creation and **critical no-leak validation** (ensuring `canonicalCulpritId` and `solution` are never returned pre-accusation)
- Evidence listing and detailed item inspection
- Access control (forbidden reveal access before accusation)
- Accusation submission, scoring, and reveal unsealing
- Conflict prevention (one accusation attempt rule)

---

## 🔑 Key API Endpoints (`/api/v1`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register new investigator account |
| `POST` | `/auth/login` | Sign in & receive session token |
| `GET` | `/auth/me` | Fetch authenticated investigator profile |
| `POST` | `/cases` | Commission new case from premise (AI generated) |
| `GET` | `/cases` | List user's case archives |
| `GET` | `/cases/:caseId` | Get public case briefing & suspects (no answer leak) |
| `GET` | `/cases/:caseId/evidence` | Get public evidence artifacts |
| `GET` | `/cases/:caseId/evidence/:evidenceId` | Inspect single evidence item |
| `POST` | `/cases/:caseId/accusation` | Submit final accusation & receive reveal |
| `GET` | `/cases/:caseId/result` | Fetch reveal dossier (unlocked after accusation) |
| `GET` | `/cases/:caseId/notes` | Get private player notes |
| `PUT` | `/cases/:caseId/notes` | Save player notes |
| `GET` | `/health` | Health check endpoint |

---

## 🛡️ Fair Play & Security

- **Strict Pre-Accusation Scrubbing**: Response DTO serializers filter out `canonicalCulpritId`, `solution`, and reveal-only timeline events.
- **Server-Side Scoring**: The client never calculates or submits the score; correctness is derived authoritatively on the server.
- **Ownership Verification**: Case access, evidence queries, and accusation submissions verify that the requester is the authentic case owner.
- **NoSQL Injection & Input Sanitization**: IDs are strictly validated with `ObjectId.isValid()` and request payloads are validated via Zod schemas.
- **Fictionalization Disclaimer**: All interfaces display prominent notices that all suspects, crimes, and evidence are entirely simulated.
