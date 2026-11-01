import React, { useState } from 'react';
import { Suspect } from '../../types';
import { Modal } from '../../components/shared/Modal';
import { AlertTriangle, Gavel, CheckCircle2 } from 'lucide-react';

interface AccusationModalProps {
  isOpen: boolean;
  onClose: () => void;
  suspects: Suspect[];
  preselectedSuspectId?: string | null;
  onSubmitAccusation: (suspectId: string) => Promise<void>;
  loading: boolean;
  error?: string | null;
}

export const AccusationModal: React.FC<AccusationModalProps> = ({
  isOpen,
  onClose,
  suspects,
  preselectedSuspectId,
  onSubmitAccusation,
  loading,
  error,
}) => {
  const [selectedId, setSelectedId] = useState<string>(preselectedSuspectId || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    await onSubmitAccusation(selectedId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-red-400">
          <Gavel size={20} />
          <span>Formally Accuse Culprit</span>
        </div>
      }
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Warning banner */}
        <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-800/60 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs text-red-200 leading-relaxed font-sans">
            <span className="font-bold font-mono uppercase block text-red-400 mb-0.5">
              Warning: Final Accusation
            </span>
            You are filing your official accusation. You only receive{' '}
            <strong>one attempt</strong> per mystery case. Once submitted, the case will be
            judged and the canonical evidence dossier will be unsealed.
          </div>
        </div>

        {error && (
          <div className="p-3 rounded bg-rose-950 border border-rose-800 text-xs font-mono text-rose-300">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-300 uppercase block font-semibold">
            Select the true culprit:
          </label>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {suspects.map((suspect) => {
              const isSelected = selectedId === suspect.id;
              return (
                <div
                  key={suspect.id}
                  onClick={() => setSelectedId(suspect.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                    isSelected
                      ? 'border-red-500 bg-red-950/30 text-white shadow-md'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-red-400 bg-red-500' : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{suspect.name}</div>
                      <div className="text-xs font-mono text-slate-400">
                        {suspect.occupation}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <CheckCircle2 size={16} className="text-red-400" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-white bg-slate-800 transition"
          >
            Review Evidence More
          </button>
          <button
            type="submit"
            disabled={!selectedId || loading}
            className="px-5 py-2 rounded-lg text-xs font-mono font-bold text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 shadow-md shadow-red-950 transition disabled:opacity-50"
          >
            {loading ? 'Evaluating Deductions...' : 'Confirm Final Accusation'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
