import React from 'react';
import { CaseStatus, MysteryDifficulty } from '../../types';

export const StatusBadge: React.FC<{ status: CaseStatus }> = ({ status }) => {
  switch (status) {
    case 'READY':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          ACTIVE CASE
        </span>
      );
    case 'SOLVED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          CASE SOLVED
        </span>
      );
    case 'UNSOLVED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-rose-500/10 text-rose-400 border border-rose-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          UNSOLVED
        </span>
      );
    case 'GENERATING':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
          INVESTIGATION PENDING
        </span>
      );
    case 'FAILED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-500/10 text-slate-400 border border-slate-600">
          CASE ARCHIVED
        </span>
      );
    default:
      return null;
  }
};

export const DifficultyBadge: React.FC<{ difficulty: MysteryDifficulty }> = ({ difficulty }) => {
  switch (difficulty) {
    case 'EASY':
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700">
          Novice
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-amber-950/40 text-amber-400 border border-amber-800/60">
          Detective
        </span>
      );
    case 'HARD':
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-rose-950/40 text-rose-400 border border-rose-800/60">
          Master Mind
        </span>
      );
    default:
      return null;
  }
};
