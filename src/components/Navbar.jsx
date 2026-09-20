import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, LogOut, User as UserIcon, Sparkles, ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isAuth = pathname === '/login' || pathname === '/signup';

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Scroll listener for solid nav
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  /* ─────────────────────────────────────────
     AUTH HEADER (minimal, transparent)
  ───────────────────────────────────────── */
  if (isAuth) {
    return (
      <header className="absolute top-0 left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Feminine Aura"
              className="w-11 h-11 rounded-full object-cover shadow-soft group-hover:scale-105 transition"
            />
            <span className="font-serif text-xl text-mulberry">Feminine Aura</span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-mulberry/70 hover:text-rose-600 transition"
          >
            <ArrowLeft size={16} />
            Back home
          </Link>
        </div>
      </header>
    );
  }

  /* ─────────────────────────────────────────
     MAIN NAVBAR
  ───────────────────────────────────────── */
  const linkClasses = ({ isActive }) =>
    `relative px-4 py-2 text-sm font-medium tracking-wide rounded-full transition ${
      isActive
        ? 'bg-blush-100 text-rose-600'
        : 'text-mulberry/80 hover:bg-blush-100 hover:text-rose-600'
    }`;

  const mobileLinkClasses = ({ isActive }) =>
    `block px-5 py-4 rounded-2xl text-base font-medium transition ${
      isActive
        ? 'bg-blush-100 text-rose-600'
        : 'text-mulberry hover:bg-blush-50'
    }`;

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/empowerment', label: 'Empowerment Hub' },
    { to: '/budget-tracker', label: 'Budget Tracker' },
    { to: '/wisdom', label: 'Daily Wisdom' },
    { to: '/community', label: 'Community' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-blush-50/90 backdrop-blur-md border-b border-blush-100 shadow-soft'
            : 'bg-blush-50/60 backdrop-blur border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img
              src="/logo.png"
              alt="Feminine Aura"
              className="w-11 h-11 rounded-full object-cover shadow-soft group-hover:scale-105 transition"
            />
            <span className="font-serif text-xl text-mulberry hidden sm:block">
              Feminine Aura
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClasses}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-blush-100">
                  <UserIcon size={14} className="text-rose-600" />
                  <span className="text-sm font-medium text-mulberry">
                    Hi, {user.display_name || user.username}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rose-400 text-rose-600 text-sm font-medium hover:bg-rose-600 hover:text-white transition"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-5 py-2 rounded-full border border-rose-400 text-rose-600 text-sm font-medium hover:bg-blush-100 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-600 text-white text-sm font-medium shadow-soft hover:bg-rose-400 transition"
                >
                  <Sparkles size={14} />
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="lg:hidden w-11 h-11 rounded-full grid place-items-center bg-white/70 border border-blush-100 text-mulberry hover:bg-blush-100 transition"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* ───────── MOBILE DRAWER ───────── */}
      {/* Backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-50 bg-mulberry/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-[85%] max-w-sm bg-blush-50 shadow-2xl transition-transform duration-300 ease-out lg:hidden flex flex-col ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-blush-100">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Feminine Aura" className="w-10 h-10 rounded-full" />
            <span className="font-serif text-lg text-mulberry">Feminine Aura</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="w-10 h-10 rounded-full grid place-items-center bg-white border border-blush-100 text-mulberry hover:bg-blush-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* User greeting */}
        {user && (
          <div className="px-5 pt-5">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-br from-blush-100 to-blush-200">
              <div className="w-10 h-10 rounded-full bg-white grid place-items-center text-rose-600">
                <UserIcon size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-mulberry/50">Welcome back</p>
                <p className="font-serif text-mulberry">
                  {user.display_name || user.username}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Links */}
        <nav className="flex-1 overflow-y-auto p-5 space-y-1">
          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={mobileLinkClasses}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="p-5 border-t border-blush-100 space-y-3">
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-rose-600 text-white font-medium shadow-soft hover:bg-rose-400 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/signup"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-rose-600 text-white font-medium shadow-soft hover:bg-rose-400 transition"
              >
                <Sparkles size={16} />
                Create Account
              </Link>
              <Link
                to="/login"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full border border-rose-400 text-rose-600 font-medium hover:bg-blush-100 transition"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  );
}