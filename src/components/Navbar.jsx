import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  LogOut,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  Wallet,
  BookOpen,
  Users,
  Home,
  Crown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CurrencySelector from './CurrencySelector';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const profileRef = useRef(null);
  const isAuth = pathname === '/login' || pathname === '/signup';

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // Lock body scroll while mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Scroll listener for frosted glass elevation
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    setProfileOpen(false);
    navigate('/');
  };

  const displayName = user?.display_name || user?.username || 'Member';
  const initial = displayName.charAt(0).toUpperCase();

  const navLinks = [
    { to: '/', label: 'Home', end: true, icon: Home },
    { to: '/empowerment', label: 'Empowerment', icon: BookOpen },
    { to: '/budget-tracker', label: 'Budget Tracker', icon: Wallet },
    { to: '/wisdom', label: 'Daily Wisdom', icon: Sparkles },
    { to: '/community', label: 'Community', icon: Users },
  ];

  /* ─────────────────────────────────────────
     AUTH HEADER (minimal, editorial)
  ───────────────────────────────────────── */
  if (isAuth) {
    return (
      <header className="absolute top-0 left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Feminine Aura"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-200/70 ring-offset-2 ring-offset-blush-50 shadow-soft group-hover:scale-105 transition"
            />
            <span className="font-serif text-xl tracking-tight text-mulberry">
              Feminine Aura
            </span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-blush-200/70 text-xs font-medium uppercase tracking-wider text-mulberry/75 hover:text-rose-600 hover:border-rose-300 shadow-2xs transition"
          >
            <ArrowLeft size={14} />
            Back home
          </Link>
        </div>
      </header>
    );
  }

  /* ─────────────────────────────────────────
     MAIN NAVBAR
  ───────────────────────────────────────── */
  const desktopLinkClasses = ({ isActive }) =>
    `relative px-4 py-2 text-[13px] tracking-wide rounded-full transition-all duration-200 ${
      isActive
        ? 'bg-white text-rose-600 font-semibold shadow-xs'
        : 'text-mulberry/75 font-medium hover:text-rose-600 hover:bg-white/50'
    }`;

  const mobileLinkClasses = ({ isActive }) =>
    `flex items-center justify-between px-4 py-3.5 rounded-2xl text-[15px] transition-all ${
      isActive
        ? 'bg-white text-rose-600 font-semibold shadow-xs border border-blush-100'
        : 'text-mulberry/80 font-medium hover:bg-white/60 hover:text-mulberry'
    }`;

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/85 backdrop-blur-xl border-b border-blush-200/60 shadow-[0_8px_30px_rgb(74,21,75,0.04)] py-2.5'
            : 'bg-blush-50/70 backdrop-blur-md border-b border-blush-100/50 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-5 sm:px-6">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img
              src="/logo.png"
              alt="Feminine Aura"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-200/70 ring-offset-2 ring-offset-blush-50 shadow-soft group-hover:scale-105 transition duration-300"
            />
            <div className="hidden sm:block">
              <span className="font-serif text-xl tracking-tight text-mulberry block leading-none">
                Feminine Aura
              </span>
              <span className="text-[9px] uppercase tracking-[0.28em] text-rose-600/80 font-medium mt-1 block">
                Glow Quietly
              </span>
            </div>
          </Link>

          {/* Centered Desktop Pill Navigation */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-1 bg-blush-100/60 backdrop-blur-sm border border-blush-200/60 p-1 rounded-full"
          >
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={desktopLinkClasses}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Utility & Account Cluster */}
          <div className="flex items-center gap-2.5">
            {/* Global Currency Switcher (Desktop & Tablet) */}
            <div className="hidden sm:block">
              <CurrencySelector compact />
            </div>

            {user ? (
              /* Logged-In User Menu */
              <div ref={profileRef} className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  aria-expanded={profileOpen}
                  className={`flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-full bg-white border transition-all shadow-2xs ${
                    profileOpen
                      ? 'border-rose-400 ring-2 ring-rose-100'
                      : 'border-blush-200/80 hover:border-rose-300'
                  }`}
                >
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-white text-xs font-bold grid place-items-center shadow-2xs">
                    {initial}
                  </span>
                  <span className="text-sm font-medium text-mulberry max-w-[110px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-mulberry/50 transition-transform duration-200 ${
                      profileOpen ? 'rotate-180 text-rose-600' : ''
                    }`}
                  />
                </button>

                {/* Account Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2.5 w-56 rounded-3xl bg-white/95 backdrop-blur-xl shadow-card border border-blush-100 p-2 z-50">
                    <div className="px-3.5 py-2.5 border-b border-blush-100 mb-1.5">
                      <p className="text-[10px] uppercase tracking-widest text-mulberry/45">
                        Signed in as
                      </p>
                      <p className="font-serif text-sm text-mulberry truncate mt-0.5">
                        {displayName}
                      </p>
                    </div>

                    {user.is_staff && (
                      <Link
                        to="/admin-dashboard"
                        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                      >
                        <Crown size={14} />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/budget-tracker"
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-medium text-mulberry/80 hover:bg-blush-50 hover:text-rose-600 transition"
                    >
                      <Wallet size={14} className="text-rose-500" />
                      My 30-Day Tracker
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 mt-1 rounded-2xl text-xs font-medium text-red-600 hover:bg-red-50/80 transition"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Logged-Out CTAs */
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full text-sm font-medium text-mulberry/80 hover:text-rose-600 hover:bg-white/70 transition"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-gradient-to-r from-rose-600 to-rose-500 text-white text-sm font-medium shadow-soft hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <Sparkles size={13} />
                  Join Free
                </Link>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="lg:hidden w-10 h-10 rounded-full grid place-items-center bg-white border border-blush-200/80 text-mulberry shadow-2xs hover:border-rose-300 hover:text-rose-600 transition"
            >
              <Menu size={19} />
            </button>
          </div>
        </div>
      </header>

      {/* ───────── MOBILE DRAWER ───────── */}
      {/* Backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-50 bg-mulberry/35 backdrop-blur-xs transition-opacity duration-300 lg:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer Panel */}
      <aside
        aria-label="Mobile Navigation"
        className={`fixed top-0 right-0 z-50 h-full w-[86%] max-w-sm bg-gradient-to-b from-white via-blush-50/95 to-blush-100/90 backdrop-blur-xl shadow-2xl border-l border-blush-100 transition-transform duration-300 ease-out lg:hidden flex flex-col ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-blush-100">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="Feminine Aura"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-rose-200/70"
            />
            <span className="font-serif text-lg text-mulberry">Feminine Aura</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="w-9 h-9 rounded-full grid place-items-center bg-white border border-blush-200/80 text-mulberry/70 hover:text-rose-600 transition"
          >
            <X size={17} />
          </button>
        </div>

        {/* User Profile Card */}
        {user && (
          <div className="px-5 pt-4">
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/90 border border-blush-100 shadow-2xs">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-white font-serif text-base font-bold grid place-items-center shrink-0">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-rose-600 font-semibold">
                  Welcome back
                </p>
                <p className="font-serif text-base text-mulberry truncate">
                  {displayName}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Currency Switcher Row */}
        <div className="px-5 pt-4">
          <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/80 border border-blush-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-mulberry/60">
              Currency
            </span>
            <CurrencySelector compact />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-5 py-4 space-y-1.5">
          {navLinks.map((l) => {
            const Icon = l.icon;
            return (
              <NavLink key={l.to} to={l.to} end={l.end} className={mobileLinkClasses}>
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-3">
                      <Icon
                        size={17}
                        className={isActive ? 'text-rose-600' : 'text-mulberry/45'}
                      />
                      {l.label}
                    </span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          {user?.is_staff && (
            <NavLink to="/admin-dashboard" className={mobileLinkClasses}>
              <span className="flex items-center gap-3 text-rose-600">
                <Crown size={17} />
                Admin Dashboard
              </span>
            </NavLink>
          )}
        </nav>

        {/* Bottom Auth Actions */}
        <div className="p-5 border-t border-blush-200/60 bg-white/60 backdrop-blur space-y-2.5">
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-rose-200 bg-white text-rose-600 text-sm font-semibold hover:bg-rose-600 hover:text-white transition"
            >
              <LogOut size={15} />
              Sign Out
            </button>
          ) : (
            <>
              <Link
                to="/signup"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-rose-600 to-rose-500 text-white text-sm font-medium shadow-soft"
              >
                <Sparkles size={15} />
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white border border-blush-200 text-mulberry text-sm font-medium hover:border-rose-300 hover:text-rose-600 transition"
              >
                Log in
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  );
}