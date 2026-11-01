import { z } from 'zod';

export const SuspectSchema = z.object({
  id: z.string().regex(/^suspect_\d+$/, 'Suspect ID must be suspect_XX format'),
  name: z.string().min(2).max(80),
  occupation: z.string().min(2).max(100),
  relationshipToIncident: z.string().min(5),
  publicStatement: z.string().min(10),
  motiveSummary: z.string().optional(),
  alibiSummary: z.string().optional(),
  avatarPrompt: z.string().optional(),
});

export const TimelineEventSchema = z.object({
  id: z.string().regex(/^event_\d+$/, 'Event ID must be event_XX format'),
  timeLabel: z.string(),
  description: z.string().min(5),
  visibility: z.enum(['PUBLIC', 'REVEAL']).optional().default('PUBLIC'),
});

export const EvidenceItemSchema = z.object({
  id: z.string().regex(/^evidence_\d+$/, 'Evidence ID must be evidence_XX format'),
  type: z.enum(['MESSAGE', 'IMAGE', 'RECORDING', 'DOCUMENT', 'WITNESS', 'ACCESS_LOG', 'OTHER']),
  title: z.string().min(3).max(120),
  sourceLabel: z.string().min(2).max(100),
  occurredAtLabel: z.string().optional(),
  description: z.string().min(10),
  content: z.union([z.string(), z.record(z.any()), z.array(z.any())]),
  visibility: z.enum(['PUBLIC', 'REVEAL']).optional().default('PUBLIC'),
  supports: z.array(z.string()).optional(),
  mediaPrompt: z.string().optional(),
});

export const SolutionSchema = z.object({
  motive: z.string().min(10),
  reasoning: z.string().min(20),
  reconstructedTimeline: z.array(z.string()).min(2),
  evidenceReferences: z.array(z.string()).min(2),
  redHerringExplanations: z.array(z.string()).min(1),
});

export const GeneratedMysteryCaseSchema = z.object({
  schemaVersion: z.string().default('1.0'),
  title: z.string().min(5).max(120),
  setting: z.string().min(3),
  incidentSummary: z.string().min(30),
  suspects: z.array(SuspectSchema).min(3).max(6),
  canonicalCulpritId: z.string(),
  timeline: z.array(TimelineEventSchema).min(3),
  evidence: z.array(EvidenceItemSchema).min(5).max(20),
  solution: SolutionSchema,
});

export type GeneratedMysteryCase = z.infer<typeof GeneratedMysteryCaseSchema>;
