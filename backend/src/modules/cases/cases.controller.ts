import { Response, NextFunction } from 'express';
import { casesService } from './cases.service';
import { sendSuccess } from '../../utils/response';
import { AuthenticatedRequest } from '../../middleware/auth';

export class CasesController {
  public async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const ownerId = req.user!.userId;
      const createdCase = await casesService.createAndGenerateCase(ownerId, req.body);
      return sendSuccess(res, createdCase, 201);
    } catch (err) {
      return next(err);
    }
  }

  public async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const ownerId = req.user!.userId;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const status = req.query.status as string | undefined;

      const result = await casesService.listUserCases(ownerId, page, limit, status);
      return sendSuccess(res, result);
    } catch (err) {
      return next(err);
    }
  }

  public async getOne(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const ownerId = req.user!.userId;
      const caseId = req.params.caseId;
      const caseBriefing = await casesService.getCaseBriefing(caseId, ownerId);
      return sendSuccess(res, caseBriefing);
    } catch (err) {
      return next(err);
    }
  }

  public async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const ownerId = req.user!.userId;
      const caseId = req.params.caseId;
      await casesService.deleteCase(caseId, ownerId);
      return sendSuccess(res, { message: 'Case and all associated records deleted successfully.' });
    } catch (err) {
      return next(err);
    }
  }
}

export const casesController = new CasesController();
