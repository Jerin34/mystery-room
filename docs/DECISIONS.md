# AI Mystery Room — Architecture Decision Records (ADR)

## ADR-001: MERN Monorepo Layout
- **Decision**: Keep `client/` (React + Vite + TypeScript) and `server/` (Node + Express + TypeScript) alongside root orchestration scripts.
- **Rationale**: Keeps full-stack development organized, clean, and easily maintainable.

## ADR-002: Dual-Mode Database Resilience (MongoDB & In-Memory Fallback)
- **Decision**: Provide support for external MongoDB via `MONGODB_URI`, with an automatic graceful fallback to embedded `mongodb-memory-server` in development/testing if no external database is detected.
- **Rationale**: Guarantees anyone checking out the repository can run the application instantly with zero manual database setup hurdles, while still using real MongoDB/Mongoose schemas and queries.

## ADR-003: Strict Pre-Accusation Information Boundary
- **Decision**: Strip `canonicalCulpritId`, `solution`, and reveal-only evidence/timeline items in specialized DTO serializer functions before any JSON response leaves the server.
- **Rationale**: Ensures players cannot inspect browser DevTools network tabs to discover the answer before submitting their accusation.

## ADR-004: Gemini AI Integration with Deterministic Fallback Generator
- **Decision**: Backend uses `@google/genai` with Zod structured parsing. If `GEMINI_API_KEY` is not provided in environment variables, the system gracefully provides rich, procedurally varied deterministic mystery seeds for immediate offline play and unit testing.
- **Rationale**: Allows instant testing, rapid development, and verification without failing if an API key is not immediately available.
