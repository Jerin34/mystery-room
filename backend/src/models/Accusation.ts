import mongoose, { Document, Schema } from 'mongoose';

export interface IAccusation extends Document {
  _id: mongoose.Types.ObjectId;
  caseId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  selectedSuspectId: string;
  isCorrect: boolean;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AccusationSchema = new Schema<IAccusation>(
  {
    caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    selectedSuspectId: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    submittedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// One accusation per case rule
AccusationSchema.index({ caseId: 1 }, { unique: true });

export const Accusation = mongoose.model<IAccusation>('Accusation', AccusationSchema);
