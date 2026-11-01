import mongoose from 'mongoose';
import { Evidence } from '../../models/Evidence';
import { Case } from '../../models/Case';
import { toPublicEvidenceDetailDTO, toPublicEvidenceSummaryDTO } from './evidence.dto';

export class EvidenceService {
  public async getCaseEvidence(
    caseId: string,
    ownerId: string,
    category?: string
  ): Promise<any[]> {
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      throw { statusCode: 400, code: 'INVALID_ID', message: 'Invalid case identifier.' };
    }

    // Check case ownership
    const c = await Case.findOne({
      _id: new mongoose.Types.ObjectId(caseId),
      ownerId: new mongoose.Types.ObjectId(ownerId),
    });

    if (!c) {
      throw { statusCode: 404, code: 'CASE_NOT_FOUND', message: 'Case not found or access denied.' };
    }

    const query: any = {
      caseId: c._id,
      isPublicDuringInvestigation: true,
    };

    if (category && category !== 'ALL') {
      query.type = category;
    }

    const items = await Evidence.find(query).sort({ evidenceId: 1 });
    return items.map(toPublicEvidenceSummaryDTO);
  }

  public async getSingleEvidence(
    caseId: string,
    evidenceId: string,
    ownerId: string
  ): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      throw { statusCode: 400, code: 'INVALID_ID', message: 'Invalid case identifier.' };
    }

    const c = await Case.findOne({
      _id: new mongoose.Types.ObjectId(caseId),
      ownerId: new mongoose.Types.ObjectId(ownerId),
    });

    if (!c) {
      throw { statusCode: 404, code: 'CASE_NOT_FOUND', message: 'Case not found or access denied.' };
    }

    const item = await Evidence.findOne({
      caseId: c._id,
      evidenceId,
      isPublicDuringInvestigation: true,
    });

    if (!item) {
      throw { statusCode: 404, code: 'EVIDENCE_NOT_FOUND', message: 'Evidence item not found.' };
    }

    return toPublicEvidenceDetailDTO(item);
  }
}

export const evidenceService = new EvidenceService();
