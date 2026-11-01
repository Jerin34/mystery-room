# AI Mystery Room — Product & Engineering Specification

## 1. Overview
AI Mystery Room is a browser-based mystery investigation game where a player submits a short scenario seed, and the backend uses Google Gemini to generate a fictional case with suspects, motives, evidence, and exactly one canonical culprit.

The player explores evidence in an immersive investigation workspace (simulated chats, witness reports, access logs, CCTV transcripts, forensics), takes notes, forms deductions, and submits an accusation. The game evaluates the accusation server-side and reveals an evidence-grounded solution.

All content is strictly fictional and labeled as simulated. Canonical solutions and culprit IDs are never leaked to the client prior to final accusation.

## 2. Core Tenets
1. **Fair Play First**: Culprit is fixed at generation time; answer is kept server-only until accusation.
2. **Deterministic & Resilient**: Once created, case state remains stable. Graceful degradation when AI services are offline or rate-limited.
3. **Immersive Detective Workspace**: Styled after a modern forensic investigation dashboard with simulated evidence artifacts.
4. **Zero Answer Leaks**: Public DTOs strictly strip culprit IDs, private motives, and reveal-only timeline events.
