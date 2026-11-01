import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { CaseSummary, CaseStatus } from '../types';
import { StatusBadge, DifficultyBadge } from '../components/shared/Badge';
import { Spinner } from '../components/shared/Spinner';
import {
  FolderKanban,
  PlusCircle,
  Play,
  Award,
  Trash2,
  Calendar,
  Users,
  Search,
} from 'lucide-react';

export const CaseHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const res = await api.getCases({
        status: statusFilter !== 'ALL' ? (statusFilter as CaseStatus) : undefined,
      });
      setCases(res.cases || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [statusFilter]);

  const handleDelete = async (caseId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete case: "${title}"?`)) {
      return;
    }
    setDeletingId(caseId);
    try {
      await api.deleteCase(caseId);
      setCases((prev) => prev.filter((c) => c.id !== caseId));
    } catch {
      alert('Failed to delete case.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-slate-100 flex items-center gap-2.5">
            <FolderKanban size={26} className="text-amber-400" />
            <span>Case Archives & Dossiers</span>
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Review active inquiries, resume investigations, and inspect solved cases
          </p>
        </div>

        <Link
          to="/cases/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition shadow-md shadow-amber-950/20 shrink-0"
        >
          <PlusCircle size={16} />
          <span>New Mystery</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'READY', 'SOLVED', 'UNSOLVED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition whitespace-nowrap ${
              statusFilter === st
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {st === 'ALL' ? 'All Cases' : st}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-16">
          <Spinner size="md" message="Loading case registry..." />
        </div>
      ) : cases.length === 0 ? (
        <div className="detective-card rounded-2xl p-12 text-center space-y-4 border border-slate-800">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
            <Search size={22} />
          </div>
          <div>
            <h3 className="font-cinzel text-base font-bold text-slate-200">
              No Case Records Found
            </h3>
            <p className="text-xs font-mono text-slate-500 mt-1">
              No mystery cases match your current filter.
            </p>
          </div>
          <Link
            to="/cases/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition"
          >
            <PlusCircle size={15} />
            <span>Open First Investigation</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cases.map((c) => {
            const isCompleted = c.status === 'SOLVED' || c.status === 'UNSOLVED';
            return (
              <div
                key={c.id}
                className="detective-card rounded-xl p-5 border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <StatusBadge status={c.status} />
                    <DifficultyBadge difficulty={c.difficulty} />
                  </div>

                  <h3 className="font-bold text-base text-slate-100 mb-1.5 font-cinzel line-clamp-1">
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-3 font-sans leading-relaxed">
                    {c.premise}
                  </p>

                  <div className="space-y-1.5 text-[11px] font-mono text-slate-500 pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-1.5">
                      <Users size={12} className="text-amber-400" />
                      <span>{c.suspectCount} Suspects Identified</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-slate-500" />
                      <span>
                        Created: {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <button
                    onClick={() => navigate(`/cases/${c.id}`)}
                    className={`flex-1 py-1.5 px-3 rounded text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition ${
                      isCompleted
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <Award size={14} className="text-amber-400" />
                        <span>Inspect Reveal</span>
                      </>
                    ) : (
                      <>
                        <Play size={14} />
                        <span>Resume Case</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(c.id, c.title)}
                    disabled={deletingId === c.id}
                    title="Delete Case Dossier"
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800/60 rounded transition"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
