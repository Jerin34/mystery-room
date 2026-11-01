import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Sparkles,
  ShieldCheck,
  FileSearch,
  Gavel,
  ChevronRight,
  Fingerprint,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user, quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const handleQuickPlay = async () => {
    if (!user) {
      await quickDemoLogin();
    }
    navigate('/cases/new');
  };

  return (
    <div className="space-y-16 py-8 sm:py-16">
      {/* Hero Section */}
      <div className="relative max-w-4xl mx-auto text-center space-y-6 px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-wider">
          <Fingerprint size={14} className="animate-pulse" />
          <span>GENERATIVE DETECTIVE INVESTIGATION WORKSPACE</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold font-cinzel text-slate-100 tracking-tight leading-tight">
          Every Clue Counts. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
            One Culprit. Zero Leaks.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
          Provide any mystery premise or choose a classic locked-room scenario. Google Gemini
          synthesizes an airtight, fair-play case file filled with simulated chats, witness
          interrogations, CCTV logs, and forensic artifacts.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={handleQuickPlay}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-xl shadow-amber-950/40 flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5"
          >
            <Sparkles size={18} />
            <span>Launch New Mystery</span>
            <ChevronRight size={16} />
          </button>

          {user ? (
            <Link
              to="/cases"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-mono text-sm bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <span>Inspect Saved Dossiers</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-mono text-sm bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <span>Detective Sign In</span>
            </Link>
          )}
        </div>
      </div>

      {/* How it Works sequence */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold font-cinzel text-slate-100">
            How The Investigation Works
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Engineered around strict fair-play deduction principles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="detective-card rounded-2xl p-6 border border-slate-800 relative group hover:border-amber-500/40 transition">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-slate-100 mb-2 flex items-center gap-2">
              <Search size={16} className="text-amber-400" />
              <span>Plant the Scenario Seed</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Enter a short story seed — e.g. a priceless sapphire vanished during a power cut, or a
              cryptographer poisoned in a locked observatory. Choose your difficulty and theme.
            </p>
          </div>

          {/* Step 2 */}
          <div className="detective-card rounded-2xl p-6 border border-slate-800 relative group hover:border-amber-500/40 transition">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-slate-100 mb-2 flex items-center gap-2">
              <FileSearch size={16} className="text-amber-400" />
              <span>Inspect Synthetic Evidence</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Browse simulated encrypted chats, keycard access logs, CCTV audio transcripts, and
              witness statements. Uncover timing discrepancies, broken alibis, and red herrings.
            </p>
          </div>

          {/* Step 3 */}
          <div className="detective-card rounded-2xl p-6 border border-slate-800 relative group hover:border-amber-500/40 transition">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-slate-100 mb-2 flex items-center gap-2">
              <Gavel size={16} className="text-amber-400" />
              <span>Accuse & Unseal Solution</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Make your one formal accusation. The backend strictly evaluates your choice and
              unseals the canonical reconstructed timeline, true motive, and evidence citations.
            </p>
          </div>
        </div>
      </div>

      {/* Security & Integrity Highlights */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="detective-card rounded-2xl p-6 border border-slate-700/80 bg-gradient-to-r from-detective-900 to-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100 mb-1">
                Zero Pre-Accusation Answer Leaks
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The canonical culprit and solution reasoning are stored server-side only and
                strictly stripped from all API payloads before accusation. Inspecting network tabs
                will never spoil your deduction!
              </p>
            </div>
          </div>
          <button
            onClick={handleQuickPlay}
            className="shrink-0 px-4 py-2.5 rounded-lg text-xs font-mono font-semibold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 transition"
          >
            Start Investigation →
          </button>
        </div>
      </div>
    </div>
  );
};
