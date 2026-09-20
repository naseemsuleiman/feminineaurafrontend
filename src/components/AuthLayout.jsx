import { Link } from 'react-router-dom';
import { Heart, Sparkles, Gem, BookOpen } from 'lucide-react';

export default function AuthLayout({ children, title, subtitle, footer }) {
  return (
    <section className="relative min-h-[calc(100vh-80px)] grid lg:grid-cols-2 overflow-hidden">
      {/* ─────────── LEFT: Brand panel ─────────── */}
      <aside className="relative hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-blush-100 via-blush-50 to-blush-200 overflow-hidden">
        {/* Animated blobs */}
        <div className="auth-blob w-72 h-72 bg-rose-400/25 -top-20 -left-20 animate-blob" />
        <div className="auth-blob w-80 h-80 bg-blush-200/60 -bottom-24 -right-16 animate-blob" style={{ animationDelay: '-4s' }} />
        <div className="auth-blob w-64 h-64 bg-rose-400/15 top-1/3 right-1/4 animate-blob" style={{ animationDelay: '-8s' }} />

        {/* Sparkle accents */}
        <Sparkles size={20} className="absolute top-20 right-24 text-rose-400/60 animate-pulse-soft" />
        <Sparkles size={14} className="absolute bottom-32 left-24 text-rose-600/50 animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <Sparkles size={16} className="absolute top-1/2 left-1/4 text-rose-400/40 animate-pulse-soft" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 text-center max-w-md">
          {/* Logo */}
          <Link to="/" className="inline-block animate-float-slow">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-rose-400/30 blur-3xl scale-95" />
              <img
                src="/logo.png"
                alt="Feminine Aura"
                className="relative w-64 h-64 rounded-full object-cover shadow-glow border border-white/50"
              />
            </div>
          </Link>

          <h2 className="mt-8 font-serif text-3xl text-mulberry leading-tight animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Be her. Attract her.<br />
            <em className="text-rose-600 not-italic">Become her.</em>
          </h2>

          <p className="mt-4 text-mulberry/65 leading-relaxed animate-fade-up" style={{ animationDelay: '0.35s' }}>
            A soft sanctuary for the woman you're becoming — wisdom,
            glow rituals, and financial grace, all in one place.
          </p>

          {/* Value pillars */}
          <div className="mt-10 grid grid-cols-4 gap-4 text-rose-600 animate-fade-up" style={{ animationDelay: '0.5s' }}>
            {[
              { icon: Heart, label: 'Self-Love' },
              { icon: Sparkles, label: 'Grace' },
              { icon: Gem, label: 'Confidence' },
              { icon: BookOpen, label: 'Healing' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Icon size={18} />
                <span className="text-[10px] uppercase tracking-widest text-mulberry/60">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ─────────── RIGHT: Form panel ─────────── */}
      <div className="relative flex items-center justify-center p-6 sm:p-12 bg-blush-50">
        {/* Mobile-only mini logo */}
        <Link
          to="/"
          className="lg:hidden absolute top-6 left-6 flex items-center gap-2"
        >
          <img src="/logo.png" alt="Feminine Aura" className="w-10 h-10 rounded-full" />
          <span className="font-serif text-mulberry text-lg">Feminine Aura</span>
        </Link>

        <div className="w-full max-w-md animate-slide-in-right">
          <div className="mb-8 text-center lg:text-left">
            <h1 className="font-serif text-3xl md:text-4xl text-mulberry">{title}</h1>
            {subtitle && <p className="text-mulberry/60 mt-2">{subtitle}</p>}
          </div>

          {children}

          {footer && <div className="mt-8 text-center text-sm text-mulberry/60">{footer}</div>}
        </div>
      </div>
    </section>
  );
}