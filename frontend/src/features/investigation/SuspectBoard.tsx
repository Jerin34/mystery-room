import React from 'react';
import { Suspect } from '../../types';
import { UserCheck, ShieldAlert, Quote } from 'lucide-react';

interface SuspectBoardProps {
  suspects: Suspect[];
  onSelectSuspectForAccusation?: (suspectId: string) => void;
  isPlayable?: boolean;
}

export const SuspectBoard: React.FC<SuspectBoardProps> = ({
  suspects,
  onSelectSuspectForAccusation,
  isPlayable = true,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold font-cinzel text-slate-100 flex items-center gap-2">
          <UserCheck size={20} className="text-amber-400" />
          <span>Persons of Interest ({suspects.length})</span>
        </h2>
        <span className="text-xs font-mono text-slate-400">
          Cross-examine statements with gathered evidence
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suspects.map((suspect, idx) => (
          <div
            key={suspect.id}
            className="detective-card rounded-xl p-5 border border-slate-700/70 hover:border-amber-500/40 transition flex flex-col justify-between group shadow-md"
          >
            <div>
              {/* Header with portrait avatar icon */}
              <div className="flex items-start gap-3.5 mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-amber-400 font-cinzel font-bold text-lg shadow-inner group-hover:border-amber-500/50 transition">
                  {suspect.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500">
                      SUSPECT #{idx + 1}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-100 group-hover:text-amber-300 transition">
                    {suspect.name}
                  </h3>
                  <p className="text-xs text-amber-400/80 font-mono">
                    {suspect.occupation}
                  </p>
                </div>
              </div>

              {/* Relation to Incident */}
              <div className="mb-3 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                <span className="font-mono text-[10px] text-slate-500 block uppercase mb-0.5">
                  Connection to Scene:
                </span>
                {suspect.relationshipToIncident}
              </div>

              {/* Public Statement */}
              <div className="text-xs text-slate-400 italic bg-detective-950/70 p-3 rounded border border-slate-800/60 relative">
                <Quote size={12} className="text-amber-500/50 mb-1" />
                "{suspect.publicStatement}"
              </div>
            </div>

            {/* Accuse button if playable */}
            {isPlayable && onSelectSuspectForAccusation && (
              <button
                onClick={() => onSelectSuspectForAccusation(suspect.id)}
                className="mt-4 w-full py-1.5 px-3 rounded text-xs font-mono font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-red-900/60 border border-slate-700 hover:border-red-600/60 flex items-center justify-center gap-1.5 transition"
              >
                <ShieldAlert size={14} className="text-red-400" />
                <span>Target for Accusation</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
