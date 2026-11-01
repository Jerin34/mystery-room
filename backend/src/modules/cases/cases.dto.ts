import { ICase } from '../../models/Case';

export function toCaseSummaryDTO(c: ICase) {
  return {
    id: c._id.toString(),
    title: c.title,
    premise: c.premise,
    setting: c.setting,
    theme: c.theme,
    difficulty: c.difficulty,
    evidenceIntensity: c.evidenceIntensity,
    status: c.status,
    suspectCount: c.suspects.length,
    createdAt: c.createdAt,
    completedAt: c.completedAt,
  };
}

/**
 * Public case briefing: NEVER includes canonicalCulpritId or solution.
 * Filters out reveal-only timeline events.
 */
export function toPublicCaseDTO(c: ICase) {
  return {
    id: c._id.toString(),
    title: c.title,
    premise: c.premise,
    setting: c.setting,
    theme: c.theme,
    difficulty: c.difficulty,
    evidenceIntensity: c.evidenceIntensity,
    status: c.status,
    incidentSummary: c.incidentSummary,
    suspects: c.suspects.map((s) => ({
      id: s.id,
      name: s.name,
      occupation: s.occupation,
      relationshipToIncident: s.relationshipToIncident,
      publicStatement: s.publicStatement,
      avatarPrompt: s.avatarPrompt,
    })),
    timeline: c.timeline
      .filter((t) => t.visibility === 'PUBLIC')
      .map((t) => ({
        id: t.id,
        timeLabel: t.timeLabel,
        description: t.description,
      })),
    createdAt: c.createdAt,
    completedAt: c.completedAt,
  };
}

/**
 * Reveal case payload: only sent AFTER final accusation has been submitted.
 */
export function toRevealedCaseDTO(c: ICase, isCorrect: boolean, selectedSuspectId: string) {
  return {
    id: c._id.toString(),
    title: c.title,
    status: c.status,
    isCorrect,
    selectedSuspectId,
    canonicalCulpritId: c.canonicalCulpritId,
    canonicalCulprit: c.suspects.find((s) => s.id === c.canonicalCulpritId),
    solution: c.solution,
    fullTimeline: c.timeline,
    completedAt: c.completedAt,
  };
}
