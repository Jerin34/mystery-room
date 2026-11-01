import React from 'react';
import { EvidenceDetail } from '../../types';
import { Modal } from '../../components/shared/Modal';
import { getEvidenceTypeIcon } from './EvidenceList';
import { Clock, ShieldCheck, Tag, FileText, Volume2 } from 'lucide-react';

interface EvidenceViewerProps {
  evidence: EvidenceDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({
  evidence,
  isOpen,
  onClose,
}) => {
  if (!evidence) return null;

  const renderContent = () => {
    const rawContent = evidence.content;
    const contentString = typeof rawContent === 'string' ? rawContent : JSON.stringify(rawContent, null, 2);

    switch (evidence.type) {
      case 'MESSAGE': {
        // Parse chat lines into simulated chat message bubbles
        const lines = contentString.split('\n').filter((l) => l.trim() !== '');
        return (
          <div className="space-y-3 p-4 rounded-lg bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] font-mono text-cyan-400">
              <span>ENCRYPTED CHAT LOG EXPORT</span>
              <span>VERIFIED FORENSIC EXTRACT</span>
            </div>
            <div className="space-y-2.5 pt-2">
              {lines.map((line, idx) => {
                const isSystem = line.startsWith('SIMULATED') || line.startsWith('SYSTEM');
                if (isSystem) {
                  return (
                    <div key={idx} className="text-center my-2 text-[11px] font-mono text-amber-500/80">
                      — {line} —
                    </div>
                  );
                }
                const isAlternate = idx % 2 === 1;
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isAlternate ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                        isAlternate
                          ? 'bg-cyan-950/60 border border-cyan-800/60 text-cyan-100 rounded-br-none'
                          : 'bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-bl-none'
                      }`}
                    >
                      <div className="font-mono text-[10px] text-slate-400 mb-1 opacity-80">
                        {line.split(']')[0] ? `${line.split(']')[0]}]` : ''}
                      </div>
                      <p className="font-sans">
                        {line.includes(']') ? line.substring(line.indexOf(']') + 1).trim() : line}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      case 'ACCESS_LOG': {
        return (
          <div className="p-4 rounded-lg bg-black border border-blue-900/50 font-mono text-xs text-blue-300 overflow-x-auto shadow-inner">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-blue-950 text-[10px] text-blue-500 uppercase tracking-widest">
              <span>Security Terminal Audit Log</span>
              <span>READ ONLY</span>
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed">{contentString}</pre>
          </div>
        );
      }

      case 'RECORDING': {
        return (
          <div className="space-y-4">
            {/* Audio Waveform Simulator */}
            <div className="p-4 rounded-lg bg-detective-950 border border-slate-800 flex flex-col items-center justify-center gap-3">
              <div className="flex items-center gap-1.5 h-10 w-full justify-center">
                {[12, 28, 40, 20, 32, 16, 36, 44, 22, 14, 30, 42, 24, 18, 38, 26, 12, 34, 16].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}px` }}
                    className="w-1.5 rounded-full bg-rose-500/70"
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-rose-400">
                <Volume2 size={16} />
                <span>SURVEILLANCE AUDIO TRANSCRIPT (SIMULATED)</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
              {contentString}
            </div>
          </div>
        );
      }

      case 'WITNESS': {
        return (
          <div className="p-5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-3 font-sans text-xs leading-relaxed text-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px] font-mono text-emerald-400 tracking-wider">
              <span>OFFICIAL WITNESS DEPOSITION</span>
              <span>CASE FILE EXHIBIT</span>
            </div>
            <div className="whitespace-pre-wrap font-mono text-slate-300">
              {contentString}
            </div>
          </div>
        );
      }

      default: {
        return (
          <div className="p-5 rounded-lg bg-slate-900 border border-slate-800 relative overflow-hidden">
            <div className="absolute right-4 top-4 confidential-stamp select-none pointer-events-none">
              CONFIDENTIAL
            </div>
            <div className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
              {contentString}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-amber-400">
          {getEvidenceTypeIcon(evidence.type)}
          <span>{evidence.title}</span>
        </div>
      }
      maxWidth="3xl"
    >
      <div className="space-y-4">
        {/* Metadata bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-detective-950 border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <Tag size={13} className="text-amber-400" />
            <span>EXHIBIT: #{evidence.id.toUpperCase()}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <FileText size={13} className="text-amber-400" />
            <span>ORIGIN: {evidence.sourceLabel}</span>
          </div>

          {evidence.occurredAtLabel && (
            <div className="flex items-center gap-1.5 text-amber-400">
              <Clock size={13} />
              <span>{evidence.occurredAtLabel}</span>
            </div>
          )}
        </div>

        {/* Content Viewer */}
        {renderContent()}

        {/* Footer simulation notice */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck size={13} className="text-emerald-500" />
            Fictional synthetic evidence artifact
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xs font-mono"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </Modal>
  );
};
