import React from 'react';
import { TimelineEvent } from '../../types';
import { Clock, History } from 'lucide-react';

interface TimelineViewProps {
  timeline: TimelineEvent[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="detective-card rounded-xl p-8 text-center text-slate-500 font-mono text-xs">
        No verified timeline events established yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold font-cinzel text-slate-100 flex items-center gap-2">
          <History size={20} className="text-amber-400" />
          <span>Incident Chronology ({timeline.length} Events)</span>
        </h2>
        <span className="text-xs font-mono text-slate-400">
          Reconstructed timeline of verified events
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {timeline.map((event, idx) => (
          <div key={event.id || idx} className="relative group">
            {/* Timeline node marker */}
            <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 bg-amber-400 group-hover:scale-125 transition" />

            <div className="detective-card rounded-xl p-4 border border-slate-800/80 hover:border-slate-700 transition">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1 font-semibold">
                <Clock size={13} />
                <span>{event.timeLabel}</span>
              </div>
              <p className="text-sm text-slate-200 font-sans leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
