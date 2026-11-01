import mongoose from 'mongoose';
import { Case } from '../../models/Case';
import { Accusation } from '../../models/Accusation';
import { toRevealedCaseDTO } from '../cases/cases.dto';

export class AccusationsService {
  public async submitAccusation(
    caseId: string,
    ownerId: string,
    selectedSuspectId: string
  ): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      throw { statusCode: 400, code: 'INVALID_ID', message: 'Invalid case identifier.' };
    }

    const caseDoc = await Case.findOne({
      _id: new mongoose.Types.ObjectId(caseId),
      ownerId: new mongoose.Types.ObjectId(ownerId),
    });

    if (!caseDoc) {
      throw { statusCode: 404, code: 'CASE_NOT_FOUND', message: 'Case not found or access denied.' };
    }

    if (caseDoc.status === 'SOLVED' || caseDoc.status === 'UNSOLVED') {
      throw {
        statusCode: 409,
        code: 'CASE_ALREADY_RESOLVED',
        message: 'A final accusation has already been made for this case. Accusations are final.',
      };
    }

    if (caseDoc.status !== 'READY') {
      throw {
        statusCode: 400,
        code: 'CASE_NOT_READY',
        message: `Cannot accuse on case with status ${caseDoc.status}`,
      };
    }

    // Verify suspect exists in the case
    const suspectExists = caseDoc.suspects.some((s) => s.id === selectedSuspectId);
    if (!suspectExists) {
      throw {
        statusCode: 422,
        code: 'INVALID_SUSPECT',
        message: `Suspect ID '${selectedSuspectId}' is not among the registered suspects.`,
      };
    }

    // Evaluate correctness strictly on server
    const isCorrect = caseDoc.canonicalCulpritId === selectedSuspectId;
    const finalStatus = isCorrect ? 'SOLVED' : 'UNSOLVED';

    caseDoc.status = finalStatus;
    caseDoc.completedAt = new Date();
    await caseDoc.save();

    const accusation = new Accusation({
      caseId: caseDoc._id,
      ownerId: new mongoose.Types.ObjectId(ownerId),
      selectedSuspectId,
      isCorrect,
      submittedAt: new Date(),
    });
    await accusation.save();

    return toRevealedCaseDTO(caseDoc, isCorrect, selectedSuspectId);
  }

  public async getCaseResult(caseId: string, ownerId: string): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      throw { statusCode: 400, code: 'INVALID_ID', message: 'Invalid case identifier.' };
    }

    const caseDoc = await Case.findOne({
      _id: new mongoose.Types.ObjectId(caseId),
      ownerId: new mongoose.Types.ObjectId(ownerId),
    });

    if (!caseDoc) {
      throw { statusCode: 404, code: 'CASE_NOT_FOUND', message: 'Case not found or access denied.' };
    }

    if (caseDoc.status === 'READY' || caseDoc.status === 'GENERATING') {
      throw {
        statusCode: 403,
        code: 'RESULT_FORBIDDEN',
        message: 'The case reveal is only available after a final accusation has been submitted.',
      };
    }

    const accusation = await Accusation.findOne({ caseId: caseDoc._id });
    const selectedSuspectId = accusation ? accusation.selectedSuspectId : 'unknown';
    const isCorrect = caseDoc.status === 'SOLVED';

    return toRevealedCaseDTO(caseDoc, isCorrect, selectedSuspectId);
  }
}

export const accusationsService = new AccusationsService();
