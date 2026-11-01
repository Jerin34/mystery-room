import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';
import {
  GeneratedMysteryCase,
  GeneratedMysteryCaseSchema,
} from './schema';
import {
  buildMysteryPrompt,
  buildRepairPrompt,
  GeneratePromptOptions,
} from './prompts';
import { generateSeedMystery } from './seedMystery';

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    if (env.GEMINI_API_KEY && env.GEMINI_API_KEY.trim() !== '') {
      this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
      logger.info(`GeminiService initialized with model ${env.GEMINI_MODEL}`);
    } else {
      logger.warn(
        'GEMINI_API_KEY not provided. Mystery generation will operate in deterministic development seed mode.'
      );
    }
  }

  public isLiveAiConfigured(): boolean {
    return !!this.genAI;
  }

  public async generateMysteryCase(
    options: GeneratePromptOptions
  ): Promise<{ caseData: GeneratedMysteryCase; isSimulatedSeed: boolean; durationMs: number }> {
    const startTime = Date.now();

    // If Gemini key is not configured, return deterministic seed mystery
    if (!this.genAI) {
      logger.info('Using development seed mystery generator (no API key configured).');
      const seed = generateSeedMystery(options);
      const durationMs = Date.now() - startTime;
      return { caseData: seed, isSimulatedSeed: true, durationMs };
    }

    try {
      const prompt = buildMysteryPrompt(options);
      logger.info('Calling Gemini API to generate mystery case...');

      const model = this.genAI.getGenerativeModel({
        model: env.GEMINI_MODEL,
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // Clean markdown code blocks if any
      const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

      try {
        const parsedJson = JSON.parse(cleaned);
        const validated = GeneratedMysteryCaseSchema.parse(parsedJson);
        this.validateCaseIntegrity(validated);

        const durationMs = Date.now() - startTime;
        logger.info(`Gemini generation succeeded in ${durationMs}ms`);
        return { caseData: validated, isSimulatedSeed: false, durationMs };
      } catch (parseOrValidationError: any) {
        logger.warn('First pass Gemini validation failed. Attempting repair retry...', parseOrValidationError.message);

        // Attempt 1 repair retry
        const repairPrompt = buildRepairPrompt(
          cleaned,
          parseOrValidationError.message || 'Schema validation failure'
        );

        const repairResult = await model.generateContent(repairPrompt);
        const repairText = repairResult.response
          .text()
          .replace(/^```json\s*/i, '')
          .replace(/```\s*$/i, '')
          .trim();

        const repairedJson = JSON.parse(repairText);
        const repairedValidated = GeneratedMysteryCaseSchema.parse(repairedJson);
        this.validateCaseIntegrity(repairedValidated);

        const durationMs = Date.now() - startTime;
        logger.info(`Gemini repair generation succeeded in ${durationMs}ms`);
        return { caseData: repairedValidated, isSimulatedSeed: false, durationMs };
      }
    } catch (err: any) {
      logger.error('Gemini generation failure:', err);
      // If live AI fails, we can either throw or fallback depending on policy.
      // Throw standard error so user gets clear actionable feedback
      throw new Error(`AI Case Generation Failed: ${err.message || 'Unknown upstream error'}`);
    }
  }

  private validateCaseIntegrity(mystery: GeneratedMysteryCase) {
    // 1. Suspect IDs must be unique
    const suspectIds = new Set(mystery.suspects.map((s) => s.id));
    if (suspectIds.size !== mystery.suspects.length) {
      throw new Error('Duplicate suspect IDs found in generated mystery');
    }

    // 2. Canonical culprit must exist in suspects
    if (!suspectIds.has(mystery.canonicalCulpritId)) {
      throw new Error(`Canonical culprit ID ${mystery.canonicalCulpritId} does not match any suspect`);
    }

    // 3. Evidence IDs must be unique
    const evidenceIds = new Set(mystery.evidence.map((e) => e.id));
    if (evidenceIds.size !== mystery.evidence.length) {
      throw new Error('Duplicate evidence IDs found in generated mystery');
    }

    // 4. Solution evidence references must point to existing evidence
    for (const ref of mystery.solution.evidenceReferences) {
      if (!evidenceIds.has(ref)) {
        throw new Error(`Solution references non-existent evidence ID: ${ref}`);
      }
    }
  }
}

export const geminiService = new GeminiService();
