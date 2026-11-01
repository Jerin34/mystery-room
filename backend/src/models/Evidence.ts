import mongoose, { Document, Schema } from 'mongoose';

export type EvidenceType =
  | 'MESSAGE'
  | 'IMAGE'
  | 'RECORDING'
  | 'DOCUMENT'
  | 'WITNESS'
  | 'ACCESS_LOG'
  | 'OTHER';

export interface IEvidenceMedia {
  url?: string;
  mimeType?: string;
  altText?: string;
  generationStatus?: 'NOT_REQUESTED' | 'GENERATED' | 'FALLBACK';
}

export interface IEvidence extends Document {
  _id: mongoose.Types.ObjectId;
  caseId: mongoose.Types.ObjectId;
  evidenceId: string; // e.g. "evidence_01"
  type: EvidenceType;
  title: string;
  sourceLabel: string;
  occurredAtLabel?: string;
  description: string;
  content: any; // string or structured JSON (e.g. chat messages list, access log lines)
  media?: IEvidenceMedia;
  isPublicDuringInvestigation: boolean;
  revealPurpose?: string; // internal server-only note
  supportsEvents?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EvidenceMediaSchema = new Schema<IEvidenceMedia>(
  {
    url: String,
    mimeType: String,
    altText: String,
    generationStatus: {
      type: String,
      enum: ['NOT_REQUESTED', 'GENERATED', 'FALLBACK'],
      default: 'NOT_REQUESTED',
    },
  },
  { _id: false }
);

const EvidenceSchema = new Schema<IEvidence>(
  {
    caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true },
    evidenceId: { type: String, required: true },
    type: {
      type: String,
      enum: ['MESSAGE', 'IMAGE', 'RECORDING', 'DOCUMENT', 'WITNESS', 'ACCESS_LOG', 'OTHER'],
      required: true,
    },
    title: { type: String, required: true },
    sourceLabel: { type: String, required: true },
    occurredAtLabel: String,
    description: { type: String, required: true },
    content: { type: Schema.Types.Mixed, required: true },
    media: EvidenceMediaSchema,
    isPublicDuringInvestigation: { type: Boolean, default: true },
    revealPurpose: String,
    supportsEvents: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

EvidenceSchema.index({ caseId: 1, evidenceId: 1 }, { unique: true });

export const Evidence = mongoose.model<IEvidence>('Evidence', EvidenceSchema);
