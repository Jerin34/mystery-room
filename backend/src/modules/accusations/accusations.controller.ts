import { Response, NextFunction } from 'express';
import { accusationsService } from './accusations.service';
import { sendSuccess } from '../../utils/response';
import { AuthenticatedRequest } from '../../middleware/auth';

export class AccusationsController {
  public async submit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const ownerId = req.user!.userId;
      const caseId = req.params.caseId;
      const { suspectId } = req.body;

      const result = await accusationsService.submitAccusation(caseId, ownerId, suspectId);
      return sendSuccess(res, result);
    } catch (err) {
      return next(err);
    }
  }

  public async getResult(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const ownerId = req.user!.userId;
      const caseId = req.params.caseId;

      const result = await accusationsService.getCaseResult(caseId, ownerId);
      return sendSuccess(res, result);
    } catch (err) {
      return next(err);
    }
  }
}

export const accusationsController = new AccusationsController();
