export interface User {
  id: string;
  displayName: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export type MysteryDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type MysteryTheme =
  | 'LOCKED_ROOM'
  | 'THEFT'
  | 'DISAPPEARANCE'
  | 'SABOTAGE'
  | 'MURDER_MYSTERY'
  | 'CYBER_HEIST'
  | 'OTHER';

export type CaseStatus = 'GENERATING' | 'READY' | 'SOLVED' | 'UNSOLVED' | 'FAILED';

export interface Suspect {
  id: string;
  name: string;
  occupation: string;
  relationshipToIncident: string;
  publicStatement: string;
  avatarPrompt?: string;
}

export interface TimelineEvent {
  id: string;
  timeLabel: string;
  description: string;
  visibility?: 'PUBLIC' | 'REVEAL';
}

export interface CaseSummary {
  id: string;
  title: string;
  premise: string;
  setting: string;
  theme: MysteryTheme;
  difficulty: MysteryDifficulty;
  evidenceIntensity: 'STANDARD' | 'DETAILED';
  status: CaseStatus;
  suspectCount: number;
  createdAt: string;
  completedAt?: string;
}

export interface CaseBriefing {
  id: string;
  title: string;
  premise: string;
  setting: string;
  theme: MysteryTheme;
  difficulty: MysteryDifficulty;
  evidenceIntensity: 'STANDARD' | 'DETAILED';
  status: CaseStatus;
  incidentSummary: string;
  suspects: Suspect[];
  timeline: TimelineEvent[];
  createdAt: string;
  completedAt?: string;
}

export type EvidenceType =
  | 'MESSAGE'
  | 'IMAGE'
  | 'RECORDING'
  | 'DOCUMENT'
  | 'WITNESS'
  | 'ACCESS_LOG'
  | 'OTHER';

export interface EvidenceSummary {
  id: string;
  type: EvidenceType;
  title: string;
  sourceLabel: string;
  occurredAtLabel?: string;
  description: string;
  supportsEvents?: string[];
}

export interface EvidenceDetail extends EvidenceSummary {
  content: any;
  media?: {
    url?: string;
    mimeType?: string;
    altText?: string;
    generationStatus?: string;
  };
  createdAt: string;
}

export interface SolutionDossier {
  motive: string;
  reasoning: string;
  reconstructedTimeline: string[];
  evidenceReferences: string[];
  redHerringExplanations: string[];
}

export interface RevealData {
  id: string;
  title: string;
  status: 'SOLVED' | 'UNSOLVED';
  isCorrect: boolean;
  selectedSuspectId: string;
  canonicalCulpritId: string;
  canonicalCulprit?: Suspect;
  solution: SolutionDossier;
  fullTimeline: TimelineEvent[];
  completedAt: string;
}
