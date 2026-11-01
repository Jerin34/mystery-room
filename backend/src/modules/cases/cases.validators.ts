import { z } from 'zod';

export const createCaseSchema = z.object({
  premise: z
    .string()
    .min(30, 'Premise must be at least 30 characters to generate a rich mystery.')
    .max(1500, 'Premise must not exceed 1500 characters.')
    .trim(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
  theme: z
    .enum(['LOCKED_ROOM', 'THEFT', 'DISAPPEARANCE', 'SABOTAGE', 'MURDER_MYSTERY', 'CYBER_HEIST', 'OTHER'])
    .default('LOCKED_ROOM'),
  setting: z.string().max(120).optional(),
  evidenceIntensity: z.enum(['STANDARD', 'DETAILED']).default('STANDARD'),
});

export const listCasesQuerySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  status: z.enum(['READY', 'SOLVED', 'UNSOLVED', 'FAILED']).optional(),
});

export type CreateCaseInput = z.infer<typeof createCaseSchema>;
