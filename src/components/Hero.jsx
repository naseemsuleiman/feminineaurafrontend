import { Link } from 'react-router-dom';
import { Sparkles, Heart, TrendingUp, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-blush-100 via-blush-50 to-blush-200" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-rose-400/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blush-200/40 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT — Logo */}
        <div className="flex justify-center md:justify-start order-2 md:order-1">
          <div className="relative animate-float">
            <div className="absolute inset-0 rounded-full bg-rose-400/30 blur-3xl scale-95" />
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-[26rem] lg:h-[26rem] rounded-full p-2 bg-gradient-to-br from-white/60 to-blush-200/40 shadow-glow backdrop-blur-sm border border-white/60">
              <img
                src="/logo.png"
                alt="Feminine Aura — Be her. Attract her. Become her."
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* RIGHT — Copy */}
        <div className="order-1 md:order-2 text-center md:text-left">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur border border-blush-200 text-rose-600 text-xs uppercase tracking-[0.25em] font-medium mb-6">
            <Sparkles size={14} strokeWidth={2.2} />
            Feminine Aura
          </span>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-mulberry">
            Be her.<br />
            Attract her.<br />
            <em className="text-rose-600 not-italic font-medium">Become her.</em>
          </h1>

          <p className="mt-6 text-lg text-mulberry/70 max-w-lg mx-auto md:mx-0 leading-relaxed">
            Your daily dose of feminine wisdom — self-love, grace, confidence & healing.
            A soft sanctuary for the woman you're becoming.
          </p>

          <div className="mt-10 flex flex-wrap gap-4 justify-center md:justify-start">
            <Link to="/empowerment" className="btn-primary group">
              Explore Articles
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition" />
            </Link>
            <Link to="/budget-tracker" className="btn-ghost">
              Manage Your Finances
            </Link>
          </div>

          {/* Mini stats */}
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto md:mx-0">
            {[
              { icon: Heart, label: 'Self-Love', sub: 'Daily prompts' },
              { icon: Sparkles, label: 'Glow', sub: 'Rituals & care' },
              { icon: TrendingUp, label: 'Wealth', sub: '30-day tracker' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="text-center md:text-left">
                <Icon size={20} className="text-rose-600 mb-2 mx-auto md:mx-0" />
                <p className="font-serif text-mulberry text-sm">{label}</p>
                <p className="text-xs text-mulberry/50">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}