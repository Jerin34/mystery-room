import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { CaseBriefing as ICaseBriefing, EvidenceSummary, EvidenceDetail, RevealData } from '../types';
import { CaseBriefing } from '../features/investigation/CaseBriefing';
import { EvidenceList } from '../features/investigation/EvidenceList';
import { EvidenceViewer } from '../features/investigation/EvidenceViewer';
import { SuspectBoard } from '../features/investigation/SuspectBoard';
import { TimelineView } from '../features/investigation/TimelineView';
import { PlayerNotes } from '../features/investigation/PlayerNotes';
import { AccusationModal } from '../features/accusation/AccusationModal';
import { RevealPanel } from '../features/accusation/RevealPanel';
import { Spinner } from '../components/shared/Spinner';
import { FileSearch, Users, History, Award, AlertCircle } from 'lucide-react';

export const WorkspacePage: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState<ICaseBriefing | null>(null);
  const [evidenceList, setEvidenceList] = useState<EvidenceSummary[]>([]);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceDetail | null>(null);
  const [revealData, setRevealData] = useState<RevealData | null>(null);

  const [activeTab, setActiveTab] = useState<'EVIDENCE' | 'SUSPECTS' | 'TIMELINE' | 'REVEAL'>('EVIDENCE');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals & Drawers
  const [isAccusationOpen, setIsAccusationOpen] = useState<boolean>(false);
  const [targetSuspectId, setTargetSuspectId] = useState<string | null>(null);
  const [accusationLoading, setAccusationLoading] = useState<boolean>(false);
  const [accusationError, setAccusationError] = useState<string | null>(null);
  const [isNotesOpen, setIsNotesOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!caseId) return;

    async function loadWorkspace() {
      setLoading(true);
      setError(null);
      try {
        const [c, ev] = await Promise.all([
          api.getCase(caseId!),
          api.getEvidenceList(caseId!),
        ]);

        setCaseData(c);
        setEvidenceList(ev);

        // If case was already completed, load reveal
        if (c.status === 'SOLVED' || c.status === 'UNSOLVED') {
          try {
            const rev = await api.getCaseResult(caseId!);
            setRevealData(rev);
            setActiveTab('REVEAL');
          } catch {
            // ignore
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load case workspace.');
      } finally {
        setLoading(false);
      }
    }

    loadWorkspace();
  }, [caseId]);

  const handleSelectEvidence = async (evidenceId: string) => {
    try {
      const detail = await api.getEvidenceDetail(caseId!, evidenceId);
      setSelectedEvidence(detail);
    } catch {
      // ignore
    }
  };

  const handleOpenAccusation = (suspectId?: string) => {
    if (suspectId) setTargetSuspectId(suspectId);
    setAccusationError(null);
    setIsAccusationOpen(true);
  };

  const handleSubmitAccusation = async (suspectId: string) => {
    setAccusationLoading(true);
    setAccusationError(null);
    try {
      const res = await api.submitAccusation(caseId!, suspectId);
      setRevealData(res);
      setCaseData((prev) => (prev ? { ...prev, status: res.status } : null));
      setIsAccusationOpen(false);
      setActiveTab('REVEAL');
    } catch (err: any) {
      setAccusationError(err.message || 'Accusation filing failed.');
    } finally {
      setAccusationLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24">
        <Spinner size="lg" message="Decrypting case file & evidence artifacts..." />
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono flex items-center justify-center gap-2">
          <AlertCircle size={18} />
          <span>{error || 'Case not found or permission denied.'}</span>
        </div>
        <button
          onClick={() => navigate('/cases')}
          className="px-4 py-2 rounded-lg text-xs font-mono bg-slate-800 text-slate-200 hover:bg-slate-700"
        >
          Return to Archives
        </button>
      </div>
    );
  }

  const isCompleted = caseData.status === 'SOLVED' || caseData.status === 'UNSOLVED';

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto">
      {/* Header Briefing */}
      <CaseBriefing
        caseData={caseData}
        onOpenAccusation={() => handleOpenAccusation()}
        onToggleNotes={() => setIsNotesOpen(!isNotesOpen)}
      />

      {/* Workspace Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 mb-6">
        <button
          onClick={() => setActiveTab('EVIDENCE')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-medium border-b-2 transition ${
            activeTab === 'EVIDENCE'
              ? 'border-amber-400 text-amber-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <FileSearch size={15} />
          <span>Evidence File ({evidenceList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SUSPECTS')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-medium border-b-2 transition ${
            activeTab === 'SUSPECTS'
              ? 'border-amber-400 text-amber-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Users size={15} />
          <span>Suspects ({caseData.suspects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('TIMELINE')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-medium border-b-2 transition ${
            activeTab === 'TIMELINE'
              ? 'border-amber-400 text-amber-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <History size={15} />
          <span>Chronology ({caseData.timeline.length})</span>
        </button>

        {isCompleted && (
          <button
            onClick={() => setActiveTab('REVEAL')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-medium border-b-2 transition ${
              activeTab === 'REVEAL'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Award size={15} />
            <span>Official Dossier Reveal</span>
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div>
        {activeTab === 'EVIDENCE' && (
          <EvidenceList
            evidence={evidenceList}
            onSelectEvidence={handleSelectEvidence}
            selectedEvidenceId={selectedEvidence?.id}
          />
        )}

        {activeTab === 'SUSPECTS' && (
          <SuspectBoard
            suspects={caseData.suspects}
            onSelectSuspectForAccusation={handleOpenAccusation}
            isPlayable={!isCompleted}
          />
        )}

        {activeTab === 'TIMELINE' && <TimelineView timeline={caseData.timeline} />}

        {activeTab === 'REVEAL' && revealData && <RevealPanel reveal={revealData} />}
      </div>

      {/* Modals & Drawers */}
      <EvidenceViewer
        evidence={selectedEvidence}
        isOpen={!!selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
      />

      <AccusationModal
        isOpen={isAccusationOpen}
        onClose={() => setIsAccusationOpen(false)}
        suspects={caseData.suspects}
        preselectedSuspectId={targetSuspectId}
        onSubmitAccusation={handleSubmitAccusation}
        loading={accusationLoading}
        error={accusationError}
      />

      <PlayerNotes
        caseId={caseData.id}
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
      />
    </div>
  );
};
