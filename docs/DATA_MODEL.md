# AI Mystery Room — Data Model & Schema Contracts

## Collections

### 1. Users (`users`)
```typescript
interface IUser {
  _id: ObjectId;
  displayName: string;       // max 80 chars
  email: string;             // unique, indexed, normalized lowercase
  passwordHash: string;      // bcrypt/argon2
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. Cases (`cases`)
```typescript
interface ICase {
  _id: ObjectId;
  ownerId: ObjectId;         // ref User, indexed
  title: string;             // max 120 chars
  premise: string;           // 30-1500 chars
  setting: string;
  theme: 'LOCKED_ROOM' | 'THEFT' | 'DISAPPEARANCE' | 'SABOTAGE' | 'MURDER_MYSTERY' | 'CYBER_HEIST' | 'OTHER';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  evidenceIntensity: 'STANDARD' | 'DETAILED';
  status: 'GENERATING' | 'READY' | 'SOLVED' | 'UNSOLVED' | 'FAILED';
  incidentSummary: string;
  suspects: Array<{
    id: string;              // e.g. "suspect_01"
    name: string;
    occupation: string;
    relationshipToIncident: string;
    publicStatement: string;
    motiveSummary?: string;
    alibiSummary?: string;
    avatarPrompt?: string;
  }>;
  timeline: Array<{
    id: string;              // e.g. "event_01"
    timeLabel: string;
    description: string;
    visibility: 'PUBLIC' | 'REVEAL';
  }>;
  // --- SERVER-ONLY FIELDS (NEVER LEAKED PRE-ACCUSATION) ---
  canonicalCulpritId: string; // e.g. "suspect_02"
  solution: {
    motive: string;
    reasoning: string;
    reconstructedTimeline: string[];
    evidenceReferences: string[];
    redHerringExplanations: string[];
  };
  promptVersion: string;
  schemaVersion: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. Evidence (`evidence`)
```typescript
interface IEvidence {
  _id: ObjectId;
  caseId: ObjectId;          // ref Case, indexed
  evidenceId: string;        // stable string: "evidence_01"
  type: 'MESSAGE' | 'IMAGE' | 'RECORDING' | 'DOCUMENT' | 'WITNESS' | 'ACCESS_LOG' | 'OTHER';
  title: string;
  sourceLabel: string;       // e.g. "Victim's Encrypted Phone", "Front Gate Camera"
  occurredAtLabel?: string;  // e.g. "11:42 PM"
  description: string;       // short preview
  content: string | Record<string, any>; // formatted text or structured chat/transcript
  media?: {
    url?: string;
    mimeType?: string;
    altText?: string;
    generationStatus: 'NOT_REQUESTED' | 'GENERATED' | 'FALLBACK';
  };
  isPublicDuringInvestigation: boolean;
  revealPurpose?: string;    // server-only internal note
  supportsEvents?: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### 4. Accusations (`accusations`)
```typescript
interface IAccusation {
  _id: ObjectId;
  caseId: ObjectId;          // unique compound index with ownerId (one attempt)
  ownerId: ObjectId;
  selectedSuspectId: string;
  isCorrect: boolean;        // calculated by server
  submittedAt: Date;
}
```

### 5. Player Notes (`player_notes`)
```typescript
interface IPlayerNote {
  _id: ObjectId;
  caseId: ObjectId;          // indexed
  ownerId: ObjectId;
  content: string;           // max 5000 chars
  updatedAt: Date;
}
```
