import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileText, PiggyBank,
  ExternalLink, LogOut, Crown, Sparkles, Menu, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const { pathname, search } = useLocation();
  const [open, setOpen] = useState(false);

  const currentTab = new URLSearchParams(search).get('tab') || 'overview';

  useEffect(() => { setOpen(false); }, [pathname, search]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleLogout = () => {
    logout();
    nav('/login', { replace: true });
  };

  const links = [
    { key: 'overview',    to: '/admin-dashboard',                  label: 'Overview',    icon: LayoutDashboard },
    { key: 'subscribers', to: '/admin-dashboard?tab=subscribers',  label: 'Subscribers', icon: Users },
    { key: 'budgets',     to: '/admin-dashboard?tab=budgets',      label: 'Budgets',     icon: PiggyBank },
    { key: 'content',     to: '/admin-dashboard?tab=content',      label: 'Content',     icon: FileText },
  ];

  const isActive = (key) =>
    pathname === '/admin-dashboard' && currentTab === key;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#2A1620]/95 backdrop-blur-md border-b border-rose-900/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 px-4 sm:px-6 py-3">

          {/* Brand */}
          <Link to="/admin-dashboard" className="flex items-center gap-2.5 shrink-0 min-w-0">
            <img
              src="/logo.png"
              alt="Feminine Aura"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-rose-400/50 shrink-0"
            />
            <div className="leading-tight min-w-0">
              <p className="font-serif text-white text-sm sm:text-base truncate">
                Feminine Aura
              </p>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-rose-300/80 truncate">
                Admin Console
              </p>
            </div>
          </Link>

          {/* Desktop links */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map(({ key, to, label, icon: Icon }) => (
              <NavLink
                key={key}
                to={to}
                end={key === 'overview'}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                  isActive(key)
                    ? 'bg-rose-600 text-white shadow-soft'
                    : 'text-mulberry/70 hover:bg-rose-400/10 hover:text-rose-200'
                }`}
              >
                <Icon size={14} /> {label}
              </NavLink>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden xl:inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs uppercase tracking-widest text-rose-200 border border-rose-400/40 hover:bg-rose-400/10 transition"
            >
              <ExternalLink size={12} /> Site
            </a>

            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 max-w-[160px]">
              <Sparkles size={12} className="text-rose-300 shrink-0" />
              <span className="text-xs text-white/80 font-medium truncate">
                {user?.display_name || user?.username}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs uppercase tracking-widest text-rose-200 border border-rose-400/40 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition"
            >
              <LogOut size={12} /> Logout
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(true)}
              aria-label="Open admin menu"
              className="lg:hidden w-10 h-10 rounded-full grid place-items-center bg-white/5 border border-white/10 text-white hover:bg-white/10 transition"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-[82%] max-w-xs bg-[#2A1620] border-l border-rose-900/40 shadow-2xl transition-transform duration-300 lg:hidden flex flex-col ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-rose-900/40">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="" className="w-9 h-9 rounded-full object-cover" />
            <div>
              <p className="font-serif text-white text-sm">Feminine Aura</p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-rose-300/70">
                Admin Console
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="w-9 h-9 rounded-full grid place-items-center bg-white/5 border border-white/10 text-white hover:bg-white/10"
          >
            <X size={16} />
          </button>
        </div>

        {user && (
          <div className="p-4">
            <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-gradient-to-br from-rose-600/20 to-rose-400/10 border border-rose-400/20">
              <span className="w-9 h-9 rounded-full bg-rose-600/30 grid place-items-center text-white">
                <Crown size={15} />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-rose-300/70">Staff</p>
                <p className="text-sm text-white truncate">
                  {user.display_name || user.username}
                </p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {links.map(({ key, to, label, icon: Icon }) => (
            <NavLink
              key={key}
              to={to}
              end={key === 'overview'}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition ${
                isActive(key)
                  ? 'bg-rose-600 text-white'
                  : 'text-white/80 hover:bg-white/5'
              }`}
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-white/80 hover:bg-white/5"
          >
            <ExternalLink size={16} /> View Site
          </a>
        </nav>

        <div className="p-4 border-t border-rose-900/40">
          <button
            onClick={handleLogout}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-rose-600 text-white text-sm font-medium hover:bg-rose-400 transition"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}