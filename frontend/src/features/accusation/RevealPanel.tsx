import React from 'react';
import { RevealData } from '../../types';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  XCircle,
  Gavel,
  History,
  FileCheck2,
  HelpCircle,
  PlusCircle,
  FolderKanban,
} from 'lucide-react';

interface RevealPanelProps {
  reveal: RevealData;
}

export const RevealPanel: React.FC<RevealPanelProps> = ({ reveal }) => {
  const isCorrect = reveal.isCorrect;
  const culprit = reveal.canonicalCulprit;

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Verdict Hero Banner */}
      <div
        className={`detective-card rounded-2xl p-6 sm:p-8 border shadow-2xl relative overflow-hidden text-center ${
          isCorrect
            ? 'border-emerald-500/50 bg-gradient-to-b from-emerald-950/40 to-detective-900 detective-glow-emerald'
            : 'border-rose-500/50 bg-gradient-to-b from-rose-950/40 to-detective-900 detective-glow-red'
        }`}
      >
        <div className="flex justify-center mb-3">
          {isCorrect ? (
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center text-emerald-400">
              <CheckCircle size={36} />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border-2 border-rose-400 flex items-center justify-center text-rose-400">
              <XCircle size={36} />
            </div>
          )}
        </div>

        <span className="font-mono text-xs uppercase tracking-widest text-slate-400 font-semibold">
          OFFICIAL BUREAU VERDICT
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold font-cinzel text-slate-100 my-2">
          {isCorrect ? 'CASE SOLVED' : 'MISCARRIAGE OF JUSTICE'}
        </h2>
        <p className="text-sm font-sans max-w-xl mx-auto text-slate-300">
          {isCorrect
            ? 'Outstanding deductive synthesis, Detective. Your accusation correctly pinned the true culprit.'
            : 'The suspect you accused was innocent. The true perpetrator evaded your initial hypothesis.'}
        </p>

        {/* Unmasked Culprit */}
        <div className="mt-6 p-4 rounded-xl bg-detective-950/90 border border-slate-700/80 max-w-lg mx-auto flex items-center gap-4 text-left">
          <div className="w-14 h-14 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-cinzel font-bold text-2xl">
            {culprit?.name ? culprit.name.charAt(0) : '?'}
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-amber-400 tracking-wider font-semibold block">
              CANONICAL CULPRIT UNMASKED
            </span>
            <div className="text-base font-bold text-slate-100">{culprit?.name}</div>
            <div className="text-xs font-mono text-slate-400">{culprit?.occupation}</div>
          </div>
        </div>
      </div>

      {/* Motive & Deductive Reasoning */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Motive */}
        <div className="detective-card rounded-xl p-5 border border-slate-700/80">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase font-semibold mb-2">
            <Gavel size={16} />
            <span>The True Motive</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            {reveal.solution.motive}
          </p>
        </div>

        {/* Step-by-step Deductive Chain */}
        <div className="detective-card rounded-xl p-5 border border-slate-700/80">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase font-semibold mb-2">
            <FileCheck2 size={16} />
            <span>Forensic Deductions & Citations</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-sans mb-3">
            {reveal.solution.reasoning}
          </p>
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
            <span>Key Evidence Cited:</span>
            {reveal.solution.evidenceReferences.map((ref) => (
              <span
                key={ref}
                className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700"
              >
                #{ref.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Reconstructed True Timeline */}
      <div className="detective-card rounded-xl p-6 border border-slate-700/80">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase font-semibold mb-3">
          <History size={16} />
          <span>The True Reconstructed Timeline</span>
        </div>
        <div className="space-y-2">
          {reveal.solution.reconstructedTimeline.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 text-xs text-slate-300 font-mono bg-detective-950/60 p-3 rounded border border-slate-800/80"
            >
              <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center shrink-0 text-[10px] font-bold">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Red Herrings Explained */}
      {reveal.solution.redHerringExplanations?.length > 0 && (
        <div className="detective-card rounded-xl p-5 border border-slate-700/80">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase font-semibold mb-3">
            <HelpCircle size={16} />
            <span>Red Herrings & False Leads Dissected</span>
          </div>
          <div className="space-y-2">
            {reveal.solution.redHerringExplanations.map((rh, i) => (
              <p
                key={i}
                className="text-xs text-slate-300 font-sans leading-relaxed bg-slate-900/40 p-3 rounded border border-slate-800"
              >
                • {rh}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to="/cases/new"
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition shadow-lg shadow-amber-950/40"
        >
          <PlusCircle size={18} />
          <span>Play Another Mystery</span>
        </Link>
        <Link
          to="/cases"
          className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-mono text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-md border border-slate-700 transition"
        >
          <FolderKanban size={16} className="text-amber-400" />
          <span>Return to Archives</span>
        </Link>
      </div>
    </div>
  );
};
