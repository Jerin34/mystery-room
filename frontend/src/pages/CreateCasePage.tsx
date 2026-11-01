import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { MysteryDifficulty, MysteryTheme } from '../types';
import {
  Sparkles,
  Dices,
  Sliders,
  AlertCircle,
  FileText,
  Search,
  CheckCircle2,
} from 'lucide-react';

const PRESET_SEEDS = [
  {
    theme: 'THEFT' as MysteryTheme,
    setting: 'Lord Harrington\'s Private Manor Study, Sussex',
    difficulty: 'MEDIUM' as MysteryDifficulty,
    premise:
      'A priceless 45-carat sapphire disappeared from Lord Harrington\'s vault locked from the inside during a localized 90-second electrical storm blackout. Four guests and staff were in the estate.',
  },
  {
    theme: 'LOCKED_ROOM' as MysteryTheme,
    setting: 'Blackwood Estate Observatory & Library, Northumberland',
    difficulty: 'HARD' as MysteryDifficulty,
    premise:
      'Dr. Alistair Finch, cryptographer and patent holder of a breakthrough quantum encryption key, was found poisoned in his sealed observatory following a late-night argument over patent rights. The prototype drive has been erased.',
  },
  {
    theme: 'SABOTAGE' as MysteryTheme,
    setting: 'Deep-Sea Research Vessel Triton, Mariana Trench',
    difficulty: 'MEDIUM' as MysteryDifficulty,
    premise:
      'At 3:00 AM while submerged at 4,000 meters, the backup oxygen recirculator was sabotaged with corrosive coolant. Only three crew members had the physical key to the engine bay during the graveyard shift.',
  },
  {
    theme: 'CYBER_HEIST' as MysteryTheme,
    setting: 'Aegis High-Frequency Trading Firm, Zurich',
    difficulty: 'EASY' as MysteryDifficulty,
    premise:
      'Fifty million francs in digital bonds vanished from a cold-storage hardware ledger during the annual board gala. The server room retinal scanner recorded a biometric match from an executive who claims to have been giving a speech.',
  },
];

const GENERATION_STEPS = [
  'Synthesizing crime scene narrative and setting...',
  'Generating distinct suspects, motives, and opportunity alibis...',
  'Engineering canonical timeline and determining single culprit...',
  'Planting forensic artifacts, simulated chat transcripts, and logs...',
  'Validating fair-play consistency and unsealing case dossier...',
];

export const CreateCasePage: React.FC = () => {
  const navigate = useNavigate();

  const [premise, setPremise] = useState('');
  const [theme, setTheme] = useState<MysteryTheme>('LOCKED_ROOM');
  const [difficulty, setDifficulty] = useState<MysteryDifficulty>('MEDIUM');
  const [setting, setSetting] = useState('');
  const [evidenceIntensity, setEvidenceIntensity] = useState<'STANDARD' | 'DETAILED'>('STANDARD');

  const [loading, setLoading] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (loading) {
      setCurrentStepIdx(0);
      interval = setInterval(() => {
        setCurrentStepIdx((prev) => (prev < GENERATION_STEPS.length - 1 ? prev + 1 : prev));
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSurpriseMe = () => {
    const randomPreset = PRESET_SEEDS[Math.floor(Math.random() * PRESET_SEEDS.length)];
    setPremise(randomPreset.premise);
    setTheme(randomPreset.theme);
    setSetting(randomPreset.setting);
    setDifficulty(randomPreset.difficulty);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (premise.trim().length < 30) {
      setError('Please provide at least 30 characters describing the mystery seed.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const createdCase = await api.createCase({
        premise: premise.trim(),
        theme,
        difficulty,
        setting: setting.trim() || undefined,
        evidenceIntensity,
      });

      navigate(`/cases/${createdCase.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to generate mystery case. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="detective-card rounded-2xl p-6 sm:p-10 border border-slate-700/80 shadow-2xl space-y-6">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-slate-100 flex items-center gap-2.5">
              <Sparkles size={24} className="text-amber-400" />
              <span>Commission New Mystery</span>
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Google Gemini generates a fair-play case file with synthetic evidence
            </p>
          </div>

          <button
            type="button"
            onClick={handleSurpriseMe}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition shrink-0"
          >
            <Dices size={16} />
            <span>Surprise Me Scenario</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-rose-950/60 border border-rose-800 text-xs font-mono text-rose-300 flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Progress State */}
        {loading ? (
          <div className="py-12 px-4 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-ping" />
              <div className="w-16 h-16 rounded-full border-2 border-amber-500/40 bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Search size={30} className="animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-cinzel text-lg font-bold text-slate-100">
                Synthesizing Investigation Dossier
              </h3>
              <p className="font-mono text-xs text-amber-400 h-5">
                {GENERATION_STEPS[currentStepIdx]}
              </p>
            </div>

            {/* Step markers */}
            <div className="max-w-md mx-auto space-y-2 text-left pt-2">
              {GENERATION_STEPS.map((step, idx) => {
                const isDone = idx < currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2.5 text-xs font-mono transition-opacity ${
                      isDone
                        ? 'text-emerald-400'
                        : isCurrent
                        ? 'text-amber-400 font-semibold'
                        : 'text-slate-600 opacity-60'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 size={14} className="shrink-0" />
                    ) : (
                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${
                          isCurrent
                            ? 'border-amber-400 bg-amber-400/20 text-amber-300 animate-pulse'
                            : 'border-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </div>
                    )}
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Story Premise */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-slate-300 uppercase font-semibold flex items-center gap-1.5">
                  <FileText size={14} className="text-amber-400" />
                  <span>Story Seed / Mystery Premise *</span>
                </label>
                <span className="text-[11px] font-mono text-slate-500">
                  {premise.length} / 1500 chars (min 30)
                </span>
              </div>
              <textarea
                required
                rows={4}
                value={premise}
                onChange={(e) => setPremise(e.target.value)}
                placeholder="Describe the incident: e.g. During a midnight thunderstorm at Harrington Manor, the priceless sapphire vanished from the locked study. Four guests had reason to steal it..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60 font-sans leading-relaxed"
              />
            </div>

            {/* Grid Configuration Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Theme */}
              <div>
                <label className="text-xs font-mono text-slate-300 uppercase font-semibold block mb-1.5">
                  Theme Category
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as MysteryTheme)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500/60"
                >
                  <option value="LOCKED_ROOM">Locked-Room Conundrum</option>
                  <option value="THEFT">Heist / Stolen Relic</option>
                  <option value="SABOTAGE">Corporate / Industrial Sabotage</option>
                  <option value="DISAPPEARANCE">Bizarre Disappearance</option>
                  <option value="MURDER_MYSTERY">Fictional Murder Mystery</option>
                  <option value="CYBER_HEIST">Cyber Vault Breach</option>
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="text-xs font-mono text-slate-300 uppercase font-semibold block mb-1.5">
                  Investigation Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as MysteryDifficulty)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500/60"
                >
                  <option value="EASY">Novice (Clear alibi contradictions)</option>
                  <option value="MEDIUM">Detective (Subtle timeline discrepancies)</option>
                  <option value="HARD">Master Mind (Intertwined red herrings)</option>
                </select>
              </div>

              {/* Fictional Setting */}
              <div>
                <label className="text-xs font-mono text-slate-300 uppercase font-semibold block mb-1.5">
                  Setting / Locale (Optional)
                </label>
                <input
                  type="text"
                  value={setting}
                  onChange={(e) => setSetting(e.target.value)}
                  placeholder="e.g. Victorian Manor, Submarine, High-Tech Penthouse"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              {/* Evidence Intensity */}
              <div>
                <label className="text-xs font-mono text-slate-300 uppercase font-semibold block mb-1.5">
                  Evidence Volume
                </label>
                <select
                  value={evidenceIntensity}
                  onChange={(e) => setEvidenceIntensity(e.target.value as 'STANDARD' | 'DETAILED')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500/60"
                >
                  <option value="STANDARD">Standard Dossier (6-8 Artifacts)</option>
                  <option value="DETAILED">Detailed Forensic Pack (10-14 Artifacts)</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500">
                Generates 3-5 suspects and canonical clues
              </span>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg text-sm font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition shadow-lg shadow-amber-950/30 flex items-center gap-2"
              >
                <Sliders size={16} />
                <span>Generate Mystery Case</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
