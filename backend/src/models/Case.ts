import mongoose, { Document, Schema } from 'mongoose';

export interface ISuspect {
  id: string; // e.g. "suspect_01"
  name: string;
  occupation: string;
  relationshipToIncident: string;
  publicStatement: string;
  motiveSummary?: string;
  alibiSummary?: string;
  avatarPrompt?: string;
}

export interface ITimelineEvent {
  id: string; // e.g. "event_01"
  timeLabel: string;
  description: string;
  visibility: 'PUBLIC' | 'REVEAL';
}

export interface ISolution {
  motive: string;
  reasoning: string;
  reconstructedTimeline: string[];
  evidenceReferences: string[];
  redHerringExplanations: string[];
}

export interface ICase extends Document {
  _id: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  title: string;
  premise: string;
  setting: string;
  theme: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  evidenceIntensity: 'STANDARD' | 'DETAILED';
  status: 'GENERATING' | 'READY' | 'SOLVED' | 'UNSOLVED' | 'FAILED';
  incidentSummary: string;
  suspects: ISuspect[];
  timeline: ITimelineEvent[];
  // --- SERVER-ONLY FIELDS (NEVER LEAKED BEFORE ACCUSATION) ---
  canonicalCulpritId: string;
  solution: ISolution;
  promptVersion: string;
  schemaVersion: string;
  generationMetadata?: {
    model?: string;
    durationMs?: number;
    provider?: string;
  };
  failureCode?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SuspectSchema = new Schema<ISuspect>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    occupation: { type: String, required: true },
    relationshipToIncident: { type: String, required: true },
    publicStatement: { type: String, required: true },
    motiveSummary: { type: String },
    alibiSummary: { type: String },
    avatarPrompt: { type: String },
  },
  { _id: false }
);

const TimelineEventSchema = new Schema<ITimelineEvent>(
  {
    id: { type: String, required: true },
    timeLabel: { type: String, required: true },
    description: { type: String, required: true },
    visibility: { type: String, enum: ['PUBLIC', 'REVEAL'], default: 'PUBLIC' },
  },
  { _id: false }
);

const SolutionSchema = new Schema<ISolution>(
  {
    motive: { type: String, required: true },
    reasoning: { type: String, required: true },
    reconstructedTimeline: [{ type: String }],
    evidenceReferences: [{ type: String }],
    redHerringExplanations: [{ type: String }],
  },
  { _id: false }
);

const CaseSchema = new Schema<ICase>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, maxlength: 120 },
    premise: { type: String, required: true, maxlength: 1500 },
    setting: { type: String, default: 'Victorian Estate' },
    theme: { type: String, default: 'LOCKED_ROOM' },
    difficulty: { type: String, enum: ['EASY', 'MEDIUM', 'HARD'], default: 'MEDIUM' },
    evidenceIntensity: { type: String, enum: ['STANDARD', 'DETAILED'], default: 'STANDARD' },
    status: {
      type: String,
      enum: ['GENERATING', 'READY', 'SOLVED', 'UNSOLVED', 'FAILED'],
      default: 'READY',
      index: true,
    },
    incidentSummary: { type: String, required: true },
    suspects: [SuspectSchema],
    timeline: [TimelineEventSchema],
    canonicalCulpritId: { type: String, required: true },
    solution: { type: SolutionSchema, required: true },
    promptVersion: { type: String, default: '1.0' },
    schemaVersion: { type: String, default: '1.0' },
    generationMetadata: {
      model: String,
      durationMs: Number,
      provider: String,
    },
    failureCode: String,
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

CaseSchema.index({ ownerId: 1, createdAt: -1 });

export const Case = mongoose.model<ICase>('Case', CaseSchema);
