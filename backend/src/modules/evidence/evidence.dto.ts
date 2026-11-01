import { IEvidence } from '../../models/Evidence';

export function toPublicEvidenceSummaryDTO(e: IEvidence) {
  return {
    id: e.evidenceId,
    type: e.type,
    title: e.title,
    sourceLabel: e.sourceLabel,
    occurredAtLabel: e.occurredAtLabel,
    description: e.description,
    supportsEvents: e.supportsEvents || [],
  };
}

export function toPublicEvidenceDetailDTO(e: IEvidence) {
  return {
    id: e.evidenceId,
    type: e.type,
    title: e.title,
    sourceLabel: e.sourceLabel,
    occurredAtLabel: e.occurredAtLabel,
    description: e.description,
    content: e.content,
    media: e.media,
    supportsEvents: e.supportsEvents || [],
    createdAt: e.createdAt,
  };
}
