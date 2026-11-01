import { Response, NextFunction } from 'express';
import { notesService } from './notes.service';
import { sendSuccess } from '../../utils/response';
import { AuthenticatedRequest } from '../../middleware/auth';

export class NotesController {
  public async getNote(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const ownerId = req.user!.userId;
      const caseId = req.params.caseId;
      const content = await notesService.getNote(caseId, ownerId);
      return sendSuccess(res, { content });
    } catch (err) {
      return next(err);
    }
  }

  public async updateNote(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const ownerId = req.user!.userId;
      const caseId = req.params.caseId;
      const content = req.body.content || '';
      const updated = await notesService.updateNote(caseId, ownerId, content);
      return sendSuccess(res, { content: updated });
    } catch (err) {
      return next(err);
    }
  }
}

export const notesController = new NotesController();
