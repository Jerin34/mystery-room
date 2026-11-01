import mongoose from 'mongoose';
import { Case, ICase } from '../../models/Case';
import { Evidence } from '../../models/Evidence';
import { Accusation } from '../../models/Accusation';
import { PlayerNote } from '../../models/PlayerNote';
import { geminiService } from '../ai/gemini.service';
import { CreateCaseInput } from './cases.validators';
import { toCaseSummaryDTO, toPublicCaseDTO } from './cases.dto';

export class CasesService {
  public async createAndGenerateCase(ownerId: string, input: CreateCaseInput): Promise<any> {
    const { caseData, isSimulatedSeed, durationMs } = await geminiService.generateMysteryCase(input);

    const newCase = new Case({
      ownerId: new mongoose.Types.ObjectId(ownerId),
      title: caseData.title,
      premise: input.premise,
      setting: caseData.setting,
      theme: input.theme,
      difficulty: input.difficulty,
      evidenceIntensity: input.evidenceIntensity,
      status: 'READY',
      incidentSummary: caseData.incidentSummary,
      suspects: caseData.suspects,
      timeline: caseData.timeline,
      canonicalCulpritId: caseData.canonicalCulpritId,
      solution: caseData.solution,
      promptVersion: '1.0',
      schemaVersion: caseData.schemaVersion || '1.0',
      generationMetadata: {
        model: isSimulatedSeed ? 'deterministic-seed' : 'gemini',
        durationMs,
        provider: isSimulatedSeed ? 'local-seed' : 'google-gemini',
      },
    });

    const savedCase = await newCase.save();

    try {
      const evidenceDocs = caseData.evidence.map((item) => ({
        caseId: savedCase._id,
        evidenceId: item.id,
        type: item.type,
        title: item.title,
        sourceLabel: item.sourceLabel,
        occurredAtLabel: item.occurredAtLabel,
        description: item.description,
        content: item.content,
        isPublicDuringInvestigation: item.visibility !== 'REVEAL',
        supportsEvents: item.supports || [],
      }));

      await Evidence.insertMany(evidenceDocs);
      return toPublicCaseDTO(savedCase);
    } catch (err) {
      await Case.deleteOne({ _id: savedCase._id });
      throw err;
    }
  }

  public async listUserCases(
    ownerId: string,
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<{ cases: any[]; total: number; page: number; totalPages: number }> {
    const filter: any = { ownerId: new mongoose.Types.ObjectId(ownerId) };
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;
    const [cases, total] = await Promise.all([
      Case.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Case.countDocuments(filter),
    ]);

    return {
      cases: cases.map(toCaseSummaryDTO),
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  public async getCaseBriefing(caseId: string, ownerId: string): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      throw { statusCode: 400, code: 'INVALID_ID', message: 'Invalid case identifier.' };
    }

    const found = await Case.findOne({
      _id: new mongoose.Types.ObjectId(caseId),
      ownerId: new mongoose.Types.ObjectId(ownerId),
    });

    if (!found) {
      throw { statusCode: 404, code: 'CASE_NOT_FOUND', message: 'Case not found or access denied.' };
    }

    return toPublicCaseDTO(found);
  }

  public async deleteCase(caseId: string, ownerId: string): Promise<void> {
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

    await Promise.all([
      Case.deleteOne({ _id: caseDoc._id }),
      Evidence.deleteMany({ caseId: caseDoc._id }),
      Accusation.deleteMany({ caseId: caseDoc._id }),
      PlayerNote.deleteMany({ caseId: caseDoc._id }),
    ]);
  }
}

export const casesService = new CasesService();
