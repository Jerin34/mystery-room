import React from 'react';
import { CaseBriefing as ICaseBriefing } from '../../types';
import { StatusBadge, DifficultyBadge } from '../../components/shared/Badge';
import { MapPin, FileQuestion, Gavel, NotebookPen } from 'lucide-react';

interface CaseBriefingProps {
  caseData: ICaseBriefing;
  onOpenAccusation: () => void;
  onToggleNotes: () => void;
  notesCount?: number;
}

export const CaseBriefing: React.FC<CaseBriefingProps> = ({
  caseData,
  onOpenAccusation,
  onToggleNotes,
}) => {
  const isPlayable = caseData.status === 'READY';

  return (
    <div className="detective-card rounded-xl p-6 mb-6 border border-slate-700/80 shadow-xl relative overflow-hidden">
      {/* Background seal watermarking */}
      <div className="absolute right-4 -bottom-6 select-none pointer-events-none opacity-5 font-cinzel text-9xl text-slate-100">
        DOSSIER
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        {/* Left Column: Case Meta & Incident */}
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={caseData.status} />
            <DifficultyBadge difficulty={caseData.difficulty} />
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              {caseData.theme}
            </span>
            <span className="text-xs font-mono text-slate-500">
              FILE ID: #{caseData.id.slice(-6).toUpperCase()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-slate-100 tracking-wide">
            {caseData.title}
          </h1>

          <div className="flex items-center gap-2 text-xs font-mono text-amber-400/90">
            <MapPin size={14} />
            <span>CRIME SCENE: {caseData.setting}</span>
          </div>

          <div className="p-4 rounded-lg bg-detective-900/90 border border-slate-800 text-sm text-slate-300 leading-relaxed font-sans">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1.5 uppercase font-semibold">
              <FileQuestion size={14} className="text-amber-400" />
              <span>Incident Briefing</span>
            </div>
            {caseData.incidentSummary}
          </div>
        </div>

        {/* Right Column: Detective Action Panel */}
        <div className="flex md:flex-col gap-2.5 sm:self-start min-w-[200px]">
          {isPlayable ? (
            <button
              onClick={onOpenAccusation}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-bold bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-lg shadow-red-950/40 border border-red-500/50 hover:scale-[1.02] transition"
            >
              <Gavel size={18} />
              <span>File Accusation</span>
            </button>
          ) : (
            <div className="p-3 text-center rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300">
              Investigation Concluded
            </div>
          )}

          <button
            onClick={onToggleNotes}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <NotebookPen size={15} className="text-amber-400" />
            <span>Detective Notebook</span>
          </button>
        </div>
      </div>
    </div>
  );
};
