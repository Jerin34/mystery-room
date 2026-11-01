# AI Mystery Room — Product & Engineering Specification
**Document status:** Source of truth  
**Version:** 1.0  
**Audience:** Antigravity, developers, QA, and product/design contributors  
**Product type:** AI-generated fictional investigation game  
**Primary stack:** MERN (MongoDB, Express.js, React, Node.js)  
**AI provider:** Google Gemini  
**Working rule:** If implementation choices conflict with this document, follow this document. If a requirement is genuinely ambiguous, choose the simplest secure option and record the decision in `docs/DECISIONS.md` rather than silently changing product behavior.

---

## 1. Product Summary

AI Mystery Room is a browser-based mystery investigation game. A player submits a short scenario, premise, or story seed. The application uses Gemini on the backend to create a fictional case with a consistent timeline, suspects, motives, clues, and exactly one intended culprit. The player investigates a case file containing AI-generated evidence such as chat messages, witness statements, images, CCTV-style clips or transcripts, access logs, and other artifacts. The player reviews the evidence, selects a culprit, submits a final accusation, and receives a result with an explanation grounded in the case evidence.

All cases, people, organizations, messages, evidence, and media are fictional. The interface must label generated content as fictional/simulated so that screenshots or artifacts are not mistaken for real evidence.

### Product goals
1. Turn a user-provided story seed into a playable, coherent mystery.
2. Present evidence in an immersive but readable investigation workspace.
3. Make the mystery fair: the culprit is determined before play, and evidence supports the solution.
4. Let players save, resume, and review their cases.
5. Keep AI generation secure, bounded, validated, and resilient to provider failures.

### Non-goals for the first release
- Real-world investigations or claims about real people.
- User-uploaded evidence analysis.
- Multiplayer, live co-op, public leaderboards, or social feeds.
- Real CCTV ingestion, real WhatsApp integration, or real messaging integrations.
- Autonomous external actions or contacting suspects.
- Payments/subscriptions.
- Native mobile apps.

---

## 2. Target Users and Main User Story

**Primary user:** Someone who enjoys detective stories, puzzle games, escape rooms, and interactive fiction.

**Main user story:**  
“As a player, I want to enter a short mystery premise and receive a complete fictional case with evidence. I want to inspect the evidence, infer who is responsible, submit my accusation, and understand why the answer is correct.”

### Success criteria
- A player can generate a case from a valid premise without seeing the solution prematurely.
- The generated case has one canonical culprit ID and at least three meaningful suspects.
- Every required evidence item renders correctly and can be opened/read.
- Evidence and solution remain consistent after refresh and when resuming a case.
- A final accusation is persisted and scored against the canonical culprit.
- Provider errors, malformed AI output, and empty inputs produce useful user-facing feedback rather than broken pages.

---

## 3. Product Principles

1. **Fair-play first:** Store the answer server-side and never include it in the player-facing case payload before submission.
2. **Fictional by default:** Use fictional names and places; clearly mark synthetic messages, images, and recordings.
3. **Deterministic case state:** Once a case is generated, do not regenerate or alter its culprit/evidence during ordinary viewing.
4. **Evidence-grounded explanation:** The final reveal must cite specific evidence IDs and explain the deductions.
5. **Graceful degradation:** If image/video generation is unavailable, use a designed placeholder or transcript. Do not block a whole case because optional media generation failed.
6. **Secure backend:** Keep Gemini keys and prompt templates on the server. Validate every client-controlled ID and payload.
7. **Accessible, responsive UI:** The full investigation workflow must work on desktop, tablet, and mobile.

---

## 4. Core User Flow

1. **Landing page** → explains the game and offers “Create a Mystery.”
2. **Create case** → player enters a premise and selects optional settings.
3. **Generation state** → show progress steps such as “Building suspects,” “Preparing evidence,” and “Checking case consistency.” These are UI progress states, not claims about exact provider internals.
4. **Case briefing** → show case title, fictional setting, incident summary, objective, and suspect list. Do not reveal the culprit or solution.
5. **Investigation workspace** → player browses evidence by category, opens artifacts, inspects images, reads simulated chat logs, and reviews a timeline.
6. **Accusation** → player selects one suspect and confirms the final accusation. Confirmation must be explicit.
7. **Result/reveal** → show correct/incorrect result, culprit, motive, evidence-based reasoning, and a reconstructed timeline.
8. **Case history** → player can return to saved cases, resume unsolved cases, and review completed cases and their outcomes.

### Case states
- `GENERATING`: server is creating and validating a case.
- `READY`: case is playable and unresolved.
- `SOLVED`: player submitted a correct accusation.
- `UNSOLVED`: player submitted an incorrect final accusation.
- `FAILED`: case generation failed and cannot be played.
- Optional future state: `ARCHIVED` for user-archived cases.

For MVP, a final accusation is one attempt. Do not allow changing the answer after final submission. If multiple attempts are later desired, update this specification first.

---

## 5. Functional Requirements

### FR-01 — Landing page
- Explain the concept in a short hero section.
- Primary CTA: “Create a Mystery.”
- Show a small “How it works” sequence: create premise → inspect evidence → identify culprit.
- Include a clear fiction/simulation notice.
- Provide links to sign in/sign up and the user’s cases when authenticated.

### FR-02 — Authentication
- Support account registration, login, logout, and authenticated session restoration.
- Use a secure password hashing library (Argon2id preferred; bcrypt acceptable if consistently configured).
- Use JWT authentication with a secure, HttpOnly cookie where practical. If bearer tokens are used, never store sensitive tokens in localStorage unless there is a documented reason and mitigation.
- Protect user-specific case endpoints.
- A user can only read, modify, or submit accusations for cases they own.
- Add request validation and rate limits to authentication endpoints.
- Do not reveal whether an email exists in a way that enables account enumeration.

### FR-03 — Create a mystery
The create form must include:
- **Premise/story seed** (required, 30–1,500 characters).
- **Difficulty**: Easy, Medium, Hard. Default: Medium.
- **Theme**: Mystery defaults; optional categories such as locked-room, theft, disappearance, sabotage, or murder-themed fictional mystery. Keep content non-graphic and avoid instructional real-world wrongdoing.
- **Setting** (optional; if omitted, AI chooses one).
- **Evidence intensity**: Standard or Detailed. Default: Standard.
- Optional “surprise me” mode for theme/setting.

Validation:
- Trim whitespace.
- Reject empty or over-limit premise.
- Do not accept client-supplied culprit IDs or solution fields.
- Show the user a helpful error when input is invalid.
- Add a per-user generation rate limit and a configurable server-side cost/usage cap.

### FR-04 — AI case generation
- Gemini is called from the Node.js backend only.
- The model must return structured JSON matching a versioned schema.
- Generate a canonical case containing:
  - title and short description;
  - fictional setting and incident;
  - 3–6 suspects;
  - one canonical culprit;
  - each suspect’s motive, opportunity, alibi, and relationship to the incident;
  - a timeline of key events;
  - 6–12 evidence items for Standard mode and 10–16 for Detailed mode;
  - evidence metadata and content;
  - a solution explanation with evidence references;
  - optional media generation descriptions/prompts;
  - content safety and consistency checks.
- Exactly one suspect is the canonical culprit. Culprit identity must be represented by a stable suspect ID, not only a name.
- Evidence must be sufficient to infer the culprit. At least three evidence items should materially support the solution; at least one should help distinguish the culprit from a plausible alternative.
- Include red herrings, but they must be explainable and not contradict the canonical timeline.
- Avoid impossible contradictions unless the contradiction is intentionally framed as a clue and explained in the reveal.
- Never trust arbitrary model output without schema validation and consistency checks.
- If JSON is invalid, retry once with a repair/format prompt. If still invalid, fail gracefully and offer a retry without charging the user a successful case.
- Save the completed case and canonical solution atomically so the case cannot be left half-created.
- Do not send the canonical culprit, private solution, hidden deductions, or unrevealed fields to the frontend before final accusation.

### FR-05 — Investigation workspace
- Display case title, incident summary, status, and a clear “Evidence” navigation.
- Evidence categories: All, Messages, Images, Recordings, Documents, Witnesses, Timeline, Other.
- Each evidence card shows a title, type, source, timestamp if relevant, and a short preview.
- Opening an evidence item shows its full content in a detail panel or modal.
- Provide filters and sorting by category, chronological order, and relevance if relevance metadata exists.
- Provide a suspect board with each suspect’s public profile, known relationship, and public-facing statement.
- Provide a timeline view using only evidence/timeline details safe to reveal during play.
- Provide notes for the player (client-side or persisted; persisted notes must be private to the case owner).
- Keep the interface usable without requiring image or video playback.

### FR-06 — AI-generated evidence and media
Evidence can include:
- simulated chat conversations resembling generic messaging interfaces;
- fictional witness interviews and statements;
- documents, receipts, notes, access logs, or reports;
- AI-generated images representing fictional places, objects, or scenes;
- simulated CCTV stills or short clips where a suitable generation service exists;
- transcript or event summary for every recording.

Rules:
- Do not imply that evidence is from a real WhatsApp account, real CCTV system, real institution, or real person.
- Use labels such as “SIMULATED CHAT LOG,” “AI-GENERATED IMAGE,” and “SIMULATED CCTV TRANSCRIPT.”
- Use fictional names, fictional contact details, and fictional organizations.
- Never fabricate a real person’s confession or present synthetic content as authentic proof.
- Gemini can plan and describe evidence; it should not be assumed to generate image/video binaries unless the chosen model/API explicitly supports that capability. Use a separate image/video provider only if approved and configured. The MVP must work with text evidence and image placeholders if media generation is unavailable.
- Store generated media in object storage or an approved media service; store only metadata and URLs in MongoDB. Do not store large binary files directly in MongoDB.
- Validate media type, file size, and URL before displaying it. Use safe fallbacks if a media URL expires or fails.

### FR-07 — Accusation and reveal
- Present all suspects as selectable options.
- Require selection of one suspect before enabling “Submit accusation.”
- Show a confirmation dialog that clearly states the accusation is final for this case.
- Server validates ownership, case state, suspect ID, and whether an accusation was already submitted.
- Compare submitted suspect ID with the server-side canonical culprit ID.
- Persist accusation, result, and submission timestamp.
- Reveal screen includes:
  - correct/incorrect outcome;
  - culprit’s name and profile;
  - motive and opportunity;
  - chronological reconstruction;
  - evidence-backed explanation referencing evidence titles/IDs;
  - explanation of red herrings;
  - “Back to cases” and “Play another mystery” actions.
- Never accept a client-calculated score or outcome as authoritative.

### FR-08 — Case history and resume
- List cases owned by the authenticated user.
- Show title, creation date, difficulty, case status, and result if completed.
- Allow opening a READY case to continue investigating.
- Allow reviewing the reveal for a completed case.
- Allow deleting a case only after a confirmation step. Deletion behavior must be consistent for case, evidence, media references, and notes.
- Sort newest first by default.

### FR-09 — Loading, errors, and empty states
- Show a loading state during generation and accusation submission.
- Disable duplicate submissions while a request is in progress.
- Provide retry controls for recoverable failures.
- Use clear messages for rate limits, provider outages, invalid input, missing cases, and authorization failures.
- Do not display raw stack traces, API keys, provider request payloads, or internal prompts.
- Empty history should explain how to create the first case.

---

## 6. Non-Functional Requirements

### Performance
- Typical non-AI API reads should target under 500 ms at the 95th percentile in a modest deployment.
- AI generation time varies by provider and media; show progress and enforce a configurable timeout.
- Load evidence details on demand when practical.
- Paginate case history if it grows beyond a reasonable page size.

### Security and privacy
- Store secrets in environment variables or a managed secrets service.
- Never expose Gemini API keys in React code or browser network responses.
- Use HTTPS in production.
- Configure CORS for known frontend origins only.
- Apply Helmet or equivalent security headers.
- Validate and sanitize user input; render generated text as text, not trusted HTML.
- Prevent NoSQL injection by validating IDs and query fields and never passing arbitrary request objects directly into MongoDB queries.
- Rate-limit login, registration, generation, and accusation endpoints.
- Add request size limits and AI token/output limits.
- Use least-privilege database credentials.
- Log request IDs and safe error metadata, but do not log passwords, tokens, full secrets, or unnecessary sensitive user content.
- Provide a privacy notice and account/case deletion behavior.
- Apply a retention policy for stored cases and generated media.
- Treat user story seeds as untrusted input and defend against prompt injection. User text must not override system rules, output schema, safety rules, or case fairness requirements.

### Accessibility
- Use semantic HTML, keyboard-accessible controls, visible focus states, appropriate labels, and accessible dialog behavior.
- Do not communicate status using color alone.
- Provide alt text for images and captions/transcripts for recordings.
- Respect reduced-motion preferences.

### Reliability
- AI calls must have timeouts, bounded retries, and controlled failure behavior.
- Avoid duplicate case creation if the user retries after a network timeout; use an idempotency key or equivalent request strategy.
- Persist a case only after schema validation and consistency checks pass.
- Maintain structured server logs and a health endpoint.

---

## 7. Recommended Architecture

### Frontend
- React with Vite.
- React Router for navigation.
- TypeScript recommended for reliable API contracts.
- Styling: Tailwind CSS or CSS modules; choose one and use it consistently.
- A shared API client handles credentials, errors, and response parsing.
- Component groups:
  - `auth/`: LoginForm, RegisterForm, ProtectedRoute.
  - `layout/`: AppShell, Navbar, Footer, PageContainer.
  - `cases/`: CreateCaseForm, CaseCard, CaseList, CaseStatusBadge.
  - `investigation/`: CaseBriefing, SuspectBoard, EvidenceList, EvidenceCard, EvidenceViewer, Timeline, PlayerNotes.
  - `accusation/`: SuspectSelector, AccusationConfirmation, RevealPanel.
  - `shared/`: Button, Input, Select, Modal, Spinner, Alert, EmptyState, ErrorBoundary.

### Backend
- Node.js + Express.js + TypeScript.
- Modular MVC/service architecture:
  - routes → middleware → controllers → services → models.
  - `auth` module for authentication.
  - `cases` module for lifecycle and ownership.
  - `ai` module for Gemini calls, prompt construction, schema validation, and repair retry.
  - `evidence` module for evidence retrieval and media metadata.
  - `accusations` module for final submission and scoring.
- Gemini integration is isolated behind an `AIProvider`/`GeminiService` abstraction so provider changes do not affect case controllers.
- Use centralized error handling and request validation.
- Keep generation prompts in version-controlled server-side files or dedicated prompt modules.
- Use environment-based configuration; do not hard-code secrets.

### Database and media
- MongoDB with Mongoose.
- Media stored outside MongoDB in an approved object store or media service.
- Store a media URL, media type, generation status, alt text, and expiry/ownership metadata in MongoDB.
- Add indexes for user-owned case history and case/evidence lookups.

### Suggested repository layout
```text
ai-mystery-room/
  client/
    src/
      app/
      components/
      features/
        auth/
        cases/
        investigation/
        accusation/
      pages/
      services/
      types/
      utils/
  server/
    src/
      config/
      middleware/
      modules/
        auth/
        cases/
        ai/
        evidence/
        accusations/
      models/
      routes/
      validators/
      utils/
      app.ts
      server.ts
  docs/
    SPEC.md
    API.md
    DATA_MODEL.md
    AI_PROMPTS.md
    DECISIONS.md
  .env.example
  README.md
```
This is a recommended layout, not a reason to restructure an existing repository unnecessarily. If Antigravity is working in an existing repo, inspect it first and preserve established conventions where they do not conflict with this specification.

---

## 8. Data Model (Mongoose-Level Contract)

All IDs exposed to the frontend should be stable strings. Use MongoDB ObjectIds internally unless there is a documented reason not to.

### User
- `_id`
- `displayName`: string, required, trimmed, max 80
- `email`: string, required, normalized, unique index
- `passwordHash`: string, required, never returned by API
- `createdAt`, `updatedAt`
- Optional `role`: default `USER`; no admin interface in MVP unless explicitly added

### Case
- `_id`
- `ownerId`: ObjectId reference to User, required, indexed
- `title`: string, required, max 120
- `premise`: string, required, max 1,500
- `setting`: string
- `theme`: string enum
- `difficulty`: `EASY | MEDIUM | HARD`
- `evidenceIntensity`: `STANDARD | DETAILED`
- `status`: `GENERATING | READY | SOLVED | UNSOLVED | FAILED`
- `incidentSummary`: string
- `publicBriefing`: object containing only player-safe fields
- `suspects`: array of public suspect profiles; do not place hidden culprit flags in public responses
- `timeline`: array of timeline events; distinguish public-safe and reveal-only data
- `canonicalCulpritId`: string/ObjectId, server-only field and excluded from all pre-accusation DTOs
- `solution`: server-only object containing motive, reasoning, event reconstruction, and evidence references
- `promptVersion`: string
- `schemaVersion`: string
- `generationMetadata`: safe provider/model/version/timing fields; never include API keys or private chain-of-thought
- `failureCode`: optional safe enum for failed cases
- `createdAt`, `updatedAt`, `completedAt`

### Suspect (embedded in Case for MVP)
- `id`: stable ID such as `suspect_01`
- `name`: fictional name
- `ageRange`: optional broad range; avoid unnecessary personal data
- `occupation`: fictional occupation
- `relationshipToIncident`: player-safe string
- `publicStatement`: player-safe statement
- `motiveSummary`: player-safe only if intended to be discoverable; otherwise reveal-only
- `alibiSummary`: player-safe only if intended to be discoverable
- `portraitMediaId`: optional media reference
- Private solution data should be kept in a server-only section or separate private solution document, not mixed into public DTOs.

### Evidence
- `_id`
- `caseId`: ObjectId reference, required, indexed
- `evidenceId`: stable case-scoped string, e.g. `evidence_01`
- `type`: `MESSAGE | IMAGE | RECORDING | DOCUMENT | WITNESS | ACCESS_LOG | OTHER`
- `title`: string
- `sourceLabel`: string
- `occurredAt`: optional date/time in the fictional case timeline
- `description`: short preview
- `content`: structured type-specific data or plain text
- `media`: optional `{ url, mimeType, altText, generationStatus, expiresAt }`
- `isPublicDuringInvestigation`: boolean, default true
- `revealPurpose`: optional internal note for solution explanation; do not expose if it leaks the answer
- `createdAt`, `updatedAt`

### Accusation
- `_id`
- `caseId`: ObjectId reference, unique for MVP one-attempt rule
- `ownerId`: ObjectId reference
- `selectedSuspectId`: string
- `isCorrect`: boolean, server-calculated
- `submittedAt`: date
- `resultSnapshot`: safe reveal data or a reference to the case solution
- Never accept `isCorrect` from the client.

### PlayerNote (optional MVP feature)
- `_id`
- `caseId`, `ownerId`
- `content`: string, max 5,000 per note or a bounded notes document
- `updatedAt`
- Ensure note access is scoped to the owner and case.

### Data integrity rules
- `canonicalCulpritId` must reference one of the case’s suspect IDs.
- Every solution evidence reference must point to evidence belonging to the same case.
- A `READY` case must have all required suspects, evidence, and a valid solution.
- An accusation can only be created for a `READY` case and only once.
- Successful accusation changes case status to `SOLVED` or `UNSOLVED` in the same transaction/atomic workflow.
- Public DTO serializers must use allowlists; never serialize a full Mongoose document directly to the player.

---

## 9. AI Generation Contract

### Input to Gemini
Provide a server-authored instruction and a sanitized user premise. Explicitly instruct the model to treat the premise as story material, not instructions that can override the output contract.

### Required output shape (conceptual)
```json
{
  "schemaVersion": "1.0",
  "title": "string",
  "setting": "string",
  "incidentSummary": "string",
  "suspects": [
    {
      "id": "suspect_01",
      "name": "string",
      "occupation": "string",
      "relationshipToIncident": "string",
      "publicStatement": "string",
      "motiveSummary": "string",
      "alibiSummary": "string"
    }
  ],
  "canonicalCulpritId": "suspect_02",
  "timeline": [
    {
      "id": "event_01",
      "timeLabel": "string",
      "description": "string",
      "visibility": "PUBLIC | REVEAL"
    }
  ],
  "evidence": [
    {
      "id": "evidence_01",
      "type": "MESSAGE | IMAGE | RECORDING | DOCUMENT | WITNESS | ACCESS_LOG | OTHER",
      "title": "string",
      "sourceLabel": "string",
      "occurredAtLabel": "string",
      "description": "string",
      "content": "string or structured object",
      "visibility": "PUBLIC | REVEAL",
      "supports": ["event_01"],
      "mediaPrompt": "optional string"
    }
  ],
  "solution": {
    "motive": "string",
    "reasoning": "string",
    "reconstructedTimeline": ["string"],
    "evidenceReferences": ["evidence_01", "evidence_03"],
    "redHerringExplanations": ["string"]
  }
}
```

The actual implementation must define a strict runtime schema (e.g. Zod) and reject unknown/invalid fields as appropriate. This conceptual JSON is not a substitute for validation.

### Validation checklist
- 3–6 unique suspects with unique IDs.
- Exactly one `canonicalCulpritId` matching a suspect.
- Evidence count fits selected intensity.
- Evidence IDs are unique.
- Solution references only existing evidence IDs.
- Timeline event references are valid.
- No public evidence directly exposes the culprit or solution before accusation.
- The solution’s claims are supported by evidence.
- No impossible timeline contradictions unless explicitly explained as a clue.
- Content follows safety and fictionalization rules.
- Evidence content is not empty or repetitive boilerplate.

### Prompt injection and privacy
- Treat the user premise as untrusted data.
- Do not pass system secrets, credentials, environment variables, or unrelated user data to Gemini.
- Do not request or store hidden chain-of-thought. Store only concise, user-facing reasoning and evidence references.
- Use structured output mode if supported by the selected Gemini model/API; otherwise parse and validate JSON server-side.
- Model name, token limits, timeout, and retry count must be configurable.

---

## 10. API Contract (Version 1)

Prefix: `/api/v1`

All endpoints return JSON with a consistent envelope:
```json
{
  "success": true,
  "data": {},
  "error": null,
  "requestId": "string"
}
```
For errors, `success` is false, `data` is null, and `error` contains `{ "code": "SAFE_ERROR_CODE", "message": "Human-readable message" }`. Do not return stack traces in production.

### Authentication
- `POST /auth/register` — create account; body `{ displayName, email, password }`
- `POST /auth/login` — authenticate; body `{ email, password }`
- `POST /auth/logout` — clear session/cookie
- `GET /auth/me` — current authenticated user

### Cases
- `POST /cases` — create/generate case; body `{ premise, difficulty, theme, setting?, evidenceIntensity }`
- `GET /cases` — list current user’s cases; support `page`, `limit`, `status`
- `GET /cases/:caseId` — return safe case briefing and public investigation data only
- `GET /cases/:caseId/evidence` — list public evidence for an owned case
- `GET /cases/:caseId/evidence/:evidenceId` — return one public evidence item
- `DELETE /cases/:caseId` — delete owned case and related data/references after confirmation

### Accusation and reveal
- `POST /cases/:caseId/accusation` — body `{ suspectId }`; server calculates correctness and atomically records final result
- `GET /cases/:caseId/result` — only available after an accusation; returns reveal data to the case owner

### Notes (if implemented)
- `GET /cases/:caseId/notes`
- `PUT /cases/:caseId/notes` — replace or save bounded notes for the authenticated owner

### System
- `GET /health` — simple service health check without exposing secrets or infrastructure details

### API rules
- Validate all request bodies, params, and query values.
- Use `401` for unauthenticated requests, `403` for authenticated users without ownership/permission, `404` for missing resources, `409` for duplicate/finalized actions, `422` for invalid input, `429` for rate limits, and `502`/`503` for upstream AI failures as appropriate.
- Never return `canonicalCulpritId`, private solution, or reveal-only evidence from `GET /cases/:caseId` or evidence endpoints before accusation.
- Enforce ownership in the database query, e.g. query case by both `_id` and `ownerId`.
- Keep response DTOs separate from persistence models.
- Add request IDs and structured error handling.

---

## 11. UI/UX and Visual Direction

### Overall mood
A modern detective case-management workspace: cinematic, suspenseful, precise, and readable. Avoid cluttered “hacker movie” clichés or overly bright arcade styling.

### Visual system
- Default theme: dark investigation room.
- Backgrounds: charcoal/navy surfaces with restrained contrast.
- Accent: amber or muted gold for active evidence and important actions; red only for warnings/danger, not as the sole indication of incorrect answers.
- Typography: highly legible sans-serif for body text; optional restrained display font for case headings.
- Cards: subtle borders, clear hierarchy, generous spacing, consistent radius.
- Evidence types have both icons and text labels.
- Animations should be subtle and respect reduced-motion settings.

### Main screens
1. Landing / marketing page.
2. Register and login.
3. Create case form.
4. Generation/loading state.
5. Case briefing.
6. Investigation workspace with evidence list and viewer.
7. Suspect details/board.
8. Accusation confirmation.
9. Result/reveal.
10. Case history.
11. Not-found and error pages.

### Investigation layout on desktop
- Left sidebar: case navigation and evidence categories.
- Main panel: selected evidence content.
- Optional right panel: suspect board, notes, or timeline, collapsible on smaller screens.
- On mobile, use a single-column layout with accessible tabs/drawers; never require horizontal scrolling for core content.

### UX rules
- Every page has a clear title and primary action.
- Keep the user’s investigation context when opening/closing evidence.
- Use skeletons or progress indicators rather than blank screens.
- Do not expose solution data in HTML, hidden attributes, React state, client bundles, or API responses before accusation.
- Clearly distinguish fictional timestamps from real-world creation timestamps.
- Confirmation dialogs must be keyboard accessible.

---

## 12. Configuration and Environment

Provide `.env.example` with placeholders only:
```dotenv
NODE_ENV=development
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/ai-mystery-room
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d
GEMINI_API_KEY=replace_me
GEMINI_MODEL=configure_supported_model_name
AI_TIMEOUT_MS=60000
AI_MAX_RETRIES=1
CASE_GENERATION_LIMIT_PER_HOUR=3
```

If using cookie-based JWT authentication, also configure cookie security, same-site behavior, and production domain. Never commit `.env`. The selected Gemini model must be verified against the current Google GenAI SDK and API capabilities during implementation; do not assume that every model supports image/video generation.

---

## 13. Testing and Acceptance Criteria

### Authentication
- Register, login, logout, and session restoration work.
- Invalid credentials and malformed inputs return safe errors.
- User A cannot view or modify User B’s cases by changing IDs.

### Generation
- Valid premise produces a `READY` case with required suspects/evidence.
- Empty, too-short, too-long, or malicious prompt input is handled safely.
- Malformed AI output is rejected; one repair retry is bounded.
- Provider timeout/quota failure shows a recoverable error and does not create a playable partial case.
- Duplicate network retries do not create duplicate cases where idempotency is implemented.
- Case generation never exposes the canonical culprit or reveal-only data to the client.

### Investigation
- Evidence filters, details, suspect board, and timeline work.
- Broken/missing media shows a fallback and text transcript where available.
- Refreshing a READY case preserves the same evidence and culprit.
- Generated content is visibly marked fictional/simulated.

### Accusation
- Missing/invalid suspect ID is rejected.
- A correct accusation returns a correct result.
- An incorrect accusation returns an incorrect result without changing the canonical answer.
- Second accusation is rejected with `409 Conflict`.
- Result endpoint is unavailable before final accusation.
- Result is available after accusation and includes evidence-grounded reasoning.

### Quality
- Frontend builds with no blocking TypeScript/lint errors.
- Backend tests cover validation, ownership, case state, and accusation logic.
- At least one integration test covers the complete happy path.
- No secrets are present in client bundles or repository.
- Responsive layout and keyboard navigation are manually checked.

---

## 14. Implementation Plan for Antigravity

Build in vertical slices. Do not generate the entire application in one unreviewed pass.

### Phase 0 — Repository inspection and setup
- Inspect the existing repository before editing.
- Identify current framework, package manager, conventions, and existing working code.
- Create/update `docs/SPEC.md` with this specification.
- Create `.env.example`, configuration validation, README, and decision log.
- Confirm frontend/backend run scripts and health endpoint.

**Exit criteria:** Both apps start locally; environment requirements are documented; no secrets are committed.

### Phase 1 — Foundation and authentication
- Set up Express, MongoDB/Mongoose, centralized errors, validation, logging, and auth.
- Set up React routes, layout, API client, auth pages, protected routes.
- Add unit/integration tests for authentication and ownership.

**Exit criteria:** Users can register/login/logout and protected routes work after refresh.

### Phase 2 — Case domain without AI
- Implement Case, Evidence, and Accusation models and DTO serializers.
- Create a development-only seed case that follows the schema.
- Build case history, briefing, evidence list/viewer, suspect board, timeline, and reveal UI using the seed case.
- Keep hidden solution fields server-side.

**Exit criteria:** Full game flow works with a deterministic seed case and no AI dependency.

### Phase 3 — Gemini generation
- Implement `GeminiService`, versioned prompt, strict schema validation, repair retry, timeout, rate limits, and consistency validation.
- Add generation progress/error states.
- Persist valid case and solution atomically.
- Test malformed output, provider errors, and quota failures.

**Exit criteria:** User can generate and play a valid case from a premise; hidden answer never leaks.

### Phase 4 — AI media and polish
- Implement text-based simulated messages/documents and optional generated images if a configured provider is available.
- Add media placeholders/transcripts and failure fallbacks.
- Polish responsive design, accessibility, loading, empty, and error states.

**Exit criteria:** Cases remain playable even when media generation is unavailable.

### Phase 5 — Hardening
- Run all tests, lint, type checks, and production builds.
- Check authorization, prompt injection resistance, rate limits, API response DTOs, and secrets.
- Test end-to-end flow and document known limitations.

**Exit criteria:** Acceptance criteria in Section 13 pass; README explains setup, scripts, env vars, architecture, and test commands.

---

## 15. Antigravity Operating Instructions

1. Treat this file as the single source of truth for product behavior, data contracts, and acceptance criteria.
2. Inspect the current repository before making changes. Do not overwrite working code or recreate the project unnecessarily.
3. Implement one phase at a time and verify the phase’s exit criteria before proceeding.
4. Before adding a dependency, confirm it is necessary and compatible with the existing package manager and runtime.
5. Use TypeScript where the project already uses it; do not mix incompatible patterns without reason.
6. Never hard-code secrets, provider keys, real personal data, or production credentials.
7. Keep API contracts, schemas, frontend types, and tests aligned. Update `docs/API.md` and `docs/DATA_MODEL.md` when contracts change.
8. Do not fake AI functionality. If Gemini is not configured, show a clear configuration error and use only an explicitly labeled development seed mode.
9. Do not assume Gemini generates image/video files. Text evidence is mandatory; visual media is optional and must have a fallback.
10. Never leak the canonical culprit or reveal-only evidence before accusation.
11. Add tests for bug fixes and important domain rules.
12. After each phase, report: files changed, features implemented, commands/tests run, results, and remaining blockers.
13. If a requested change conflicts with this specification, pause and propose a specific amendment rather than silently changing behavior.
14. Record meaningful architectural choices in `docs/DECISIONS.md`.
15. Do not claim a feature is complete unless it has been implemented and verified.

---

## 16. Assumptions and Decisions

These defaults are binding unless the product owner explicitly changes this document:
- MVP is a single-player web application.
- Users must sign in to save and play generated cases.
- Each case has exactly one intended culprit.
- One final accusation per case.
- 3–6 suspects per case.
- 6–12 evidence items for Standard and 10–16 for Detailed.
- Text-based evidence is required; image/video generation is optional.
- Case content is fictional and explicitly labeled as AI-generated/simulated.
- Gemini is used on the backend for story/case generation.
- MongoDB stores structured case data; media binaries live outside MongoDB.
- The player never receives the canonical answer until the accusation is submitted.
- No real WhatsApp, CCTV, email, or social media account integrations are part of MVP.

---

## 17. Definition of Done

The MVP is done when:
- A user can register and sign in.
- A user can submit a premise and generate a valid case with Gemini.
- The app persists the case and serves it consistently across refreshes.
- The user can inspect suspects and evidence in a responsive investigation UI.
- The user can make one final accusation.
- The app calculates the result server-side and reveals a clear evidence-based explanation.
- Case history and resume/review work.
- AI/provider errors and missing media are handled gracefully.
- Security, ownership, validation, and no-answer-leak tests pass.
- README and `.env.example` are accurate.
- The application builds and the key end-to-end flow is verified.
