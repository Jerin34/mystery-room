import { Response, NextFunction } from 'express';
import { evidenceService } from './evidence.service';
import { sendSuccess } from '../../utils/response';
import { AuthenticatedRequest } from '../../middleware/auth';

export class EvidenceController {
  public async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const ownerId = req.user!.userId;
      const caseId = req.params.caseId;
      const category = req.query.category as string | undefined;

      const evidence = await evidenceService.getCaseEvidence(caseId, ownerId, category);
      return sendSuccess(res, evidence);
    } catch (err) {
      return next(err);
    }
  }

  public async getOne(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const ownerId = req.user!.userId;
      const { caseId, evidenceId } = req.params;

      const item = await evidenceService.getSingleEvidence(caseId, evidenceId, ownerId);
      return sendSuccess(res, item);
    } catch (err) {
      return next(err);
    }
  }
}

export const evidenceController = new EvidenceController();
