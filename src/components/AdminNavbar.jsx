import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileText, Quote, PiggyBank,
  ExternalLink, LogOut, Crown, Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav('/login', { replace: true });
  };

  const link = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
      isActive
        ? 'bg-rose-600 text-white shadow-soft'
        : 'text-mulberry/70 hover:bg-blush-100 hover:text-rose-600'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-[#2A1620]/95 backdrop-blur-md border-b border-rose-900/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-6 py-3.5">

        {/* Left: brand + badge */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/admin-dashboard" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Feminine Aura"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-400/50 group-hover:ring-rose-400 transition"
            />
            <div className="hidden sm:block leading-tight">
              <p className="font-serif text-white text-base">Feminine Aura</p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-rose-300/80">
                Admin Console
              </p>
            </div>
          </Link>
          <span className="hidden lg:inline-flex items-center gap-1.5 ml-2 px-3 py-1 rounded-full bg-rose-600/20 border border-rose-400/30 text-rose-200 text-[10px] uppercase tracking-widest">
            <Crown size={11} /> Staff
          </span>
        </div>

        {/* Center: nav links */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/admin-dashboard" end className={link}>
            <LayoutDashboard size={14} /> Overview
          </NavLink>
          <NavLink to="/admin-dashboard?tab=subscribers" className={link}>
            <Users size={14} /> Subscribers
          </NavLink>
          <NavLink to="/admin-dashboard?tab=budgets" className={link}>
            <PiggyBank size={14} /> Budgets
          </NavLink>
          <NavLink to="/admin-dashboard?tab=content" className={link}>
            <FileText size={14} /> Content
          </NavLink>
        </nav>

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-widest text-rose-200 border border-rose-400/40 hover:bg-rose-400/10 transition"
          >
            <ExternalLink size={12} /> View site
          </a>
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <Sparkles size={12} className="text-rose-300" />
            <span className="text-xs text-white/80 font-medium">
              {user?.display_name || user?.username}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs uppercase tracking-widest text-rose-200 border border-rose-400/40 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition"
          >
            <LogOut size={12} /> Logout
          </button>
        </div>
      </div>
    </header>
  );
}