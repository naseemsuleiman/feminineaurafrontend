import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  LogOut,
  ArrowLeft,
  ChevronDown,
  Crown,
  Wallet,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef(null);
  const isAuth = pathname === '/login' || pathname === '/signup';

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  const displayName = user?.display_name || user?.username || 'Member';
  const initial = displayName.charAt(0).toUpperCase();

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/empowerment', label: 'Empowerment' },
    { to: '/budget-tracker', label: 'Budget Tracker' },
    { to: '/wisdom', label: 'Daily Wisdom' },
    { to: '/community', label: 'Community' },
  ];

  /* ─────────────────────────────────────────
     AUTH HEADER
  ───────────────────────────────────────── */
  if (isAuth) {
    return (
      <header className="absolute top-0 left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Feminine Aura"
              className="w-10 h-10 rounded-full object-cover shadow-soft group-hover:scale-105 transition"
            />
            <span className="font-serif text-2xl tracking-tight text-mulberry">
              Feminine Aura
            </span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-mulberry/70 hover:text-rose-600 transition"
          >
            <ArrowLeft size={14} />
            Back home
          </Link>
        </div>
      </header>
    );
  }

  /* ─────────────────────────────────────────
     MAIN EDITORIAL NAVBAR
  ───────────────────────────────────────── */
  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-blush-100 shadow-soft'
            : 'bg-blush-50/90 backdrop-blur border-b border-blush-100/70'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-6">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3.5 group shrink-0">
            <img
              src="/logo.png"
              alt="Feminine Aura"
              className="w-10 h-10 rounded-full object-cover shadow-soft group-hover:scale-105 transition duration-300"
            />
            <span className="font-serif text-2xl tracking-tight text-mulberry">
              Feminine Aura
            </span>
          </Link>

          {/* Center Typographic Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-8"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `relative py-2 text-xs uppercase tracking-[0.18em] font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-rose-600'
                      : 'text-mulberry/70 hover:text-mulberry'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.label}</span>
                    <span
                      className={`absolute left-0 right-0 -bottom-0.5 h-[1.5px] bg-rose-600 transition-transform duration-300 origin-center ${
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Account / CTA Area */}
          <div className="flex items-center gap-5">
            {user ? (
              <div ref={dropdownRef} className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 py-1.5 px-2 rounded-full hover:bg-blush-100/70 transition"
                >
                  <span className="w-8 h-8 rounded-full bg-rose-600 text-white font-serif text-sm grid place-items-center">
                    {initial}
                  </span>
                  <span className="text-sm font-medium text-mulberry max-w-[120px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown
                    size={15}
                    className={`text-mulberry/50 transition-transform duration-200 ${
                      menuOpen ? 'rotate-180 text-rose-600' : ''
                    }`}
                  />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white border border-blush-100 shadow-card p-2 z-50">
                    <div className="px-3 py-2.5 border-b border-blush-100 mb-1">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-mulberry/40">
                        Account
                      </p>
                      <p className="font-serif text-base text-mulberry truncate">
                        {displayName}
                      </p>
                    </div>

                    {user.is_staff && (
                      <Link
                        to="/admin-dashboard"
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-blush-50 transition"
                      >
                        <Crown size={14} />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/budget-tracker"
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-mulberry/80 hover:bg-blush-50 hover:text-rose-600 transition"
                    >
                      <Wallet size={14} className="text-rose-600" />
                      30-Day Budget Tracker
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 mt-1 rounded-xl text-xs font-medium text-mulberry/70 hover:bg-blush-50 hover:text-rose-600 transition"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-6">
                <Link
                  to="/login"
                  className="text-xs uppercase tracking-[0.18em] font-medium text-mulberry/75 hover:text-rose-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2.5 rounded-full bg-rose-600 text-white text-xs uppercase tracking-[0.18em] font-medium shadow-soft hover:bg-rose-400 transition"
                >
                  Join
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="lg:hidden w-10 h-10 rounded-full grid place-items-center text-mulberry hover:bg-blush-100 transition"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* ───────── MOBILE DRAWER ───────── */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-50 bg-mulberry/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-[82%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden flex flex-col ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 h-20 border-b border-blush-100">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Feminine Aura"
              className="w-9 h-9 rounded-full object-cover"
            />
            <span className="font-serif text-xl text-mulberry">
              Feminine Aura
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="w-9 h-9 rounded-full grid place-items-center text-mulberry/70 hover:bg-blush-50 hover:text-rose-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {user && (
          <div className="px-6 py-4 bg-blush-50 border-b border-blush-100 flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-rose-600 text-white font-serif text-base grid place-items-center shrink-0">
              {initial}
            </span>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-mulberry/50">
                Signed in
              </p>
              <p className="font-serif text-base text-mulberry truncate">
                {displayName}
              </p>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-6 py-6 divide-y divide-blush-100">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `block py-4 text-sm uppercase tracking-[0.18em] font-medium transition ${
                  isActive
                    ? 'text-rose-600'
                    : 'text-mulberry/80 hover:text-rose-600'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {user?.is_staff && (
            <NavLink
              to="/admin-dashboard"
              className="block py-4 text-sm uppercase tracking-[0.18em] font-medium text-rose-600"
            >
              Admin Dashboard
            </NavLink>
          )}
        </nav>

        <div className="p-6 border-t border-blush-100 bg-blush-50/60 space-y-3">
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full border border-rose-400 text-rose-600 text-xs uppercase tracking-[0.18em] font-medium hover:bg-rose-600 hover:text-white transition"
            >
              <LogOut size={15} />
              Sign Out
            </button>
          ) : (
            <>
              <Link
                to="/signup"
                className="w-full block text-center py-3.5 rounded-full bg-rose-600 text-white text-xs uppercase tracking-[0.18em] font-medium shadow-soft hover:bg-rose-400 transition"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="w-full block text-center py-3.5 rounded-full border border-rose-400 text-rose-600 text-xs uppercase tracking-[0.18em] font-medium hover:bg-blush-100 transition"
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