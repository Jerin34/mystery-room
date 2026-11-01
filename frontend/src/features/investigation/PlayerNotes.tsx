import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { NotebookPen, Save, Check, X } from 'lucide-react';

interface PlayerNotesProps {
  caseId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const PlayerNotes: React.FC<PlayerNotesProps> = ({ caseId, isOpen, onClose }) => {
  const [content, setContent] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      api
        .getNotes(caseId)
        .then((res) => {
          setContent(res.content || '');
        })
        .catch(() => {});
    }
  }, [caseId, isOpen]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateNotes(caseId, content);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-detective-900 border-l border-slate-700 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-detective-850">
        <div className="flex items-center gap-2 text-slate-100 font-cinzel font-bold text-sm">
          <NotebookPen size={18} className="text-amber-400" />
          <span>Detective Notebook</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition"
        >
          <X size={16} />
        </button>
      </div>

      {/* Editor Body */}
      <div className="flex-1 p-4 flex flex-col">
        <p className="text-xs font-mono text-slate-400 mb-2">
          Record your hunches, suspicious alibis, and deductive steps:
        </p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="e.g. Suspect 1 claims they were reading, but the fireplace was cold..."
          className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60 resize-none leading-relaxed"
        />
      </div>

      {/* Footer Save Bar */}
      <div className="p-4 border-t border-slate-800 bg-detective-950 flex items-center justify-between">
        <span className="text-[11px] font-mono text-slate-500">
          Private to your investigation
        </span>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium bg-amber-400 hover:bg-amber-300 text-slate-950 transition disabled:opacity-50"
        >
          {saved ? (
            <>
              <Check size={14} className="text-emerald-950" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Save size={14} />
              <span>{saving ? 'Saving...' : 'Save Notes'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
