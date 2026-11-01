import mongoose, { Document, Schema } from 'mongoose';

export interface IPlayerNote extends Document {
  _id: mongoose.Types.ObjectId;
  caseId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const PlayerNoteSchema = new Schema<IPlayerNote>(
  {
    caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, default: '', maxlength: 5000 },
  },
  {
    timestamps: true,
  }
);

PlayerNoteSchema.index({ caseId: 1, ownerId: 1 }, { unique: true });

export const PlayerNote = mongoose.model<IPlayerNote>('PlayerNote', PlayerNoteSchema);
