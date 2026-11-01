import React from 'react';
import { Search } from 'lucide-react';

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; message?: string }> = ({
  size = 'md',
  message,
}) => {
  const iconSizes = {
    sm: 18,
    md: 28,
    lg: 40,
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative flex items-center justify-center">
        {/* Radar pulses */}
        <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-ping" />
        <div className="w-16 h-16 rounded-full border border-amber-500/30 bg-amber-500/5 flex items-center justify-center text-amber-400">
          <Search size={iconSizes[size]} className="animate-pulse" />
        </div>
      </div>
      {message && (
        <p className="mt-4 text-xs font-mono tracking-wider text-slate-400 uppercase">
          {message}
        </p>
      )}
    </div>
  );
};
