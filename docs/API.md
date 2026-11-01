# AI Mystery Room — API Documentation (v1)

Base URL: `/api/v1`

## Standard Response Envelope
All responses adhere to the following JSON structure:
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "requestId": "req_123456789"
}
```

Error format:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Premise must be at least 30 characters."
  },
  "requestId": "req_123456789"
}
```

---

## 1. Authentication Endpoints

### Register
- **POST** `/auth/register`
- **Body**:
  ```json
  {
    "displayName": "Detective Smith",
    "email": "smith@scotlandyard.example",
    "password": "StrongPassword123!"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "user": {
      "id": "6640a1b2c3d4e5f6a7b8c9d0",
      "displayName": "Detective Smith",
      "email": "smith@scotlandyard.example"
    },
    "token": "jwt.token.here"
  }
  ```

### Login
- **POST** `/auth/login`
- **Body**:
  ```json
  {
    "email": "smith@scotlandyard.example",
    "password": "StrongPassword123!"
  }
  ```
- **Response**: `200 OK` (sets `token` cookie or returns token in body)

### Logout
- **POST** `/auth/logout`
- **Response**: `200 OK` (clears cookie)

### Current User
- **GET** `/auth/me`
- **Headers**: `Authorization: Bearer <token>` or Cookie
- **Response**: `200 OK` with user details.

---

## 2. Cases Endpoints

### Create / Generate Case
- **POST** `/cases`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "premise": "A priceless diamond disappeared from Lord Harrington's locked study during a thunderstorm.",
    "difficulty": "MEDIUM",
    "theme": "LOCKED_ROOM",
    "setting": "Victorian Country Manor",
    "evidenceIntensity": "STANDARD"
  }
  ```
- **Response**: `201 Created`
  Returns sanitized case briefing (NO culprit or solution data).

### List Cases
- **GET** `/cases?page=1&limit=10&status=READY`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` with paginated user-owned case cards.

### Get Case Briefing & Suspects
- **GET** `/cases/:caseId`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK`
  Returns public suspect list, incident summary, safe timeline events.

### Get Evidence List
- **GET** `/cases/:caseId/evidence?category=ALL`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK`
  Returns list of evidence items safe for investigation.

### Get Single Evidence Item
- **GET** `/cases/:caseId/evidence/:evidenceId`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK`
  Returns full evidence content (chat log, statement, access log, etc.).

### Delete Case
- **DELETE** `/cases/:caseId`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK`

---

## 3. Accusation & Reveal Endpoints

### Submit Accusation
- **POST** `/cases/:caseId/accusation`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "suspectId": "suspect_02"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "isCorrect": true,
    "selectedSuspectId": "suspect_02",
    "canonicalCulpritId": "suspect_02",
    "submittedAt": "2026-10-25T12:00:00.000Z",
    "solution": {
      "motive": "...",
      "reasoning": "...",
      "reconstructedTimeline": [...],
      "evidenceReferences": ["evidence_01", "evidence_03"],
      "redHerringExplanations": [...]
    }
  }
  ```

### Get Reveal Result (After Accusation)
- **GET** `/cases/:caseId/result`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` with final solution dossier. If case is still `READY`, returns `403 Forbidden`.

---

## 4. Player Notes Endpoints

### Get Notes
- **GET** `/cases/:caseId/notes`
- **Response**: `200 OK`

### Update Notes
- **PUT** `/cases/:caseId/notes`
- **Body**: `{ "content": "Suspect 1 has an alibi for 10 PM..." }`
- **Response**: `200 OK`

---

## 5. System Health
- **GET** `/health`
- **Response**: `200 OK` `{ "status": "UP", "timestamp": "..." }`
