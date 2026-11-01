import React, { useState } from 'react';
import { EvidenceSummary, EvidenceType } from '../../types';
import {
  MessageSquare,
  FileText,
  Mic,
  Camera,
  Terminal,
  Users,
  Archive,
  Search,
  Clock,
  ChevronRight,
} from 'lucide-react';

interface EvidenceListProps {
  evidence: EvidenceSummary[];
  onSelectEvidence: (evidenceId: string) => void;
  selectedEvidenceId?: string | null;
}

export const getEvidenceTypeIcon = (type: EvidenceType) => {
  switch (type) {
    case 'MESSAGE':
      return <MessageSquare size={16} className="text-cyan-400" />;
    case 'IMAGE':
      return <Camera size={16} className="text-purple-400" />;
    case 'RECORDING':
      return <Mic size={16} className="text-rose-400" />;
    case 'DOCUMENT':
      return <FileText size={16} className="text-amber-400" />;
    case 'WITNESS':
      return <Users size={16} className="text-emerald-400" />;
    case 'ACCESS_LOG':
      return <Terminal size={16} className="text-blue-400" />;
    default:
      return <Archive size={16} className="text-slate-400" />;
  }
};

export const EvidenceList: React.FC<EvidenceListProps> = ({
  evidence,
  onSelectEvidence,
  selectedEvidenceId,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'ALL', label: 'All Artifacts' },
    { id: 'MESSAGE', label: 'Chats' },
    { id: 'DOCUMENT', label: 'Documents' },
    { id: 'WITNESS', label: 'Statements' },
    { id: 'ACCESS_LOG', label: 'Access Logs' },
    { id: 'RECORDING', label: 'Recordings' },
  ];

  const filtered = evidence.filter((item) => {
    const matchesCategory = filterType === 'ALL' || item.type === filterType;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sourceLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterType(cat.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition whitespace-nowrap ${
                filterType === cat.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search clues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60 font-mono"
          />
        </div>
      </div>

      {/* Evidence Grid */}
      {filtered.length === 0 ? (
        <div className="detective-card rounded-xl p-8 text-center text-slate-500 font-mono text-xs">
          No evidence items found matching criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filtered.map((item) => {
            const isSelected = selectedEvidenceId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onSelectEvidence(item.id)}
                className={`detective-card rounded-xl p-4 cursor-pointer transition border text-left flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-400 bg-detective-800/90 detective-glow-amber'
                    : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                        {getEvidenceTypeIcon(item.type)}
                      </div>
                      <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
                        {item.type}
                      </span>
                    </div>

                    {item.occurredAtLabel && (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400/80">
                        <Clock size={12} />
                        {item.occurredAtLabel}
                      </span>
                    )}
                  </div>

                  <h4 className="font-semibold text-sm text-slate-100 mb-1 group-hover:text-amber-300">
                    {item.title}
                  </h4>
                  <p className="text-[11px] font-mono text-slate-500 mb-2 truncate">
                    Source: {item.sourceLabel}
                  </p>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-amber-400">
                  <span>EXAMINE EVIDENCE</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
