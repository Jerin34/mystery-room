import mongoose from 'mongoose';
import { PlayerNote } from '../../models/PlayerNote';
import { Case } from '../../models/Case';

export class NotesService {
  public async getNote(caseId: string, ownerId: string): Promise<string> {
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      throw { statusCode: 400, code: 'INVALID_ID', message: 'Invalid case identifier.' };
    }

    const note = await PlayerNote.findOne({
      caseId: new mongoose.Types.ObjectId(caseId),
      ownerId: new mongoose.Types.ObjectId(ownerId),
    });

    return note ? note.content : '';
  }

  public async updateNote(caseId: string, ownerId: string, content: string): Promise<string> {
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      throw { statusCode: 400, code: 'INVALID_ID', message: 'Invalid case identifier.' };
    }

    // Verify case ownership
    const caseDoc = await Case.findOne({
      _id: new mongoose.Types.ObjectId(caseId),
      ownerId: new mongoose.Types.ObjectId(ownerId),
    });

    if (!caseDoc) {
      throw { statusCode: 404, code: 'CASE_NOT_FOUND', message: 'Case not found or access denied.' };
    }

    const trimmed = (content || '').slice(0, 5000);

    const note = await PlayerNote.findOneAndUpdate(
      {
        caseId: new mongoose.Types.ObjectId(caseId),
        ownerId: new mongoose.Types.ObjectId(ownerId),
      },
      { content: trimmed },
      { upsert: true, new: true }
    );

    return note.content;
  }
}

export const notesService = new NotesService();
