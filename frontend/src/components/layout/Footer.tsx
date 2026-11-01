import React from 'react';
import { ShieldCheck, Sparkles, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-detective-950 border-t border-slate-800/80 text-slate-400 py-8 px-4 text-xs font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-300">
          <Terminal size={16} className="text-amber-400" />
          <span className="font-semibold text-slate-200">AI MYSTERY ROOM</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Powered by Google Gemini & MERN Engine</span>
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck size={14} className="text-emerald-400" />
            Zero-Leak Fair Play
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Sparkles size={14} className="text-amber-400" />
            Synthetic Procedural Evidence
          </span>
        </div>

        <div className="text-center md:text-right text-slate-500">
          Simulated detective simulation game. All persons and cases are fictional.
        </div>
      </div>
    </footer>
  );
};
