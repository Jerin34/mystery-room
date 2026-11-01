import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, FolderKanban, PlusCircle, LogOut, ShieldAlert, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-detective-900/95 backdrop-blur border-b border-slate-800/80">
      {/* Top Simulation Banner */}
      <div className="bg-amber-950/40 border-b border-amber-900/40 text-amber-300 text-xs py-1 px-4 text-center font-mono tracking-wider flex items-center justify-center gap-2">
        <ShieldAlert size={14} className="text-amber-400 animate-pulse" />
        <span>SIMULATED CASE ENVIRONMENT — ALL CHARACTERS, ALIBIS, AND EVIDENCE ARE ENTIRELY FICTIONAL</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-700/10 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
            <Search size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="font-cinzel text-lg font-bold tracking-wider text-slate-100 flex items-center gap-2">
              MYSTERY ROOM
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                AI CO-OP
              </span>
            </span>
            <p className="text-[11px] text-slate-400 font-mono tracking-tight -mt-0.5">
              FORENSIC INVESTIGATION WORKSPACE
            </p>
          </div>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/cases"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-md border border-slate-700/60 transition"
              >
                <FolderKanban size={15} className="text-amber-400" />
                Case Archives
              </Link>
              <Link
                to="/cases/new"
                className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition shadow-md shadow-amber-900/20"
              >
                <PlusCircle size={15} />
                New Mystery
              </Link>

              <div className="h-5 w-px bg-slate-800 mx-1" />

              <div className="flex items-center gap-2 pl-1">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-semibold">
                  <UserIcon size={14} className="text-amber-400" />
                </div>
                <span className="hidden md:inline text-xs font-medium text-slate-300 max-w-[120px] truncate">
                  {user.displayName}
                </span>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800/60 rounded-md transition"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-md border border-slate-700/60 transition"
              >
                Detective Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition"
              >
                Join Bureau
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
