import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, TrendingUp, ArrowRight, Check, Mail } from 'lucide-react';
import API from '../api';

export default function ComingSoonHero() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await API.post('/subscribe/', { email });
    } catch {
      /* fail silently */
    }
    setSubmitted(true);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Ambient gradient backdrop — same as homepage Hero */}
      <div className="absolute inset-0 bg-gradient-to-br from-blush-100 via-blush-50 to-blush-200" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-rose-400/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blush-200/40 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        {/* ─────── LEFT: Floating logo ─────── */}
        <div className="flex justify-center md:justify-start order-1">
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

        {/* ─────── RIGHT: Editorial copy ─────── */}
        <div className="text-center md:text-left order-2">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur border border-blush-200 text-rose-600 text-xs uppercase tracking-[0.25em] font-medium mb-6 animate-fade-up">
            <Sparkles size={14} strokeWidth={2.2} />
            Launching Soon
          </span>

          <h1
            className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-mulberry animate-fade-up"
            style={{ animationDelay: '0.1s' }}
          >
            Something beautiful
            <br />
            is <em className="text-rose-600 not-italic font-medium">on its way.</em>
          </h1>

          <p
            className="mt-6 text-lg text-mulberry/70 max-w-lg mx-auto md:mx-0 leading-relaxed animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            Your daily dose of feminine wisdom — self-love, grace, confidence &
            healing. A soft sanctuary for the woman you're becoming.
          </p>

          {/* Email capture */}
          <div
            className="mt-10 max-w-md mx-auto md:mx-0 animate-fade-up"
            style={{ animationDelay: '0.3s' }}
          >
            {submitted ? (
              <div className="inline-flex items-center gap-3 px-6 py-4 rounded-full bg-white shadow-soft text-rose-600 font-medium">
                <span className="w-8 h-8 rounded-full bg-rose-600 grid place-items-center text-white">
                  <Check size={16} />
                </span>
                You're on the list. Watch your inbox ✨
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 pointer-events-none"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full rounded-full border-blush-200 bg-white/90 pl-11 pr-4 py-3.5 focus:border-rose-400 focus:ring-rose-400 text-sm"
                  />
                </div>
                <button className="btn-primary group whitespace-nowrap !py-3.5">
                  Notify Me
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition" />
                </button>
              </form>
            )}
            <p className="text-xs text-mulberry/50 mt-4 italic">
              One gentle letter when we open the doors. Nothing else.
            </p>
          </div>

          {/* Mini stats */}
          <div
            className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto md:mx-0 animate-fade-up"
            style={{ animationDelay: '0.4s' }}
          >
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

      <PreviewLink />
    </section>
  );
}

function PreviewLink() {
  const params = new URLSearchParams(window.location.search);
  const showPreview =
    params.get('preview') === '1' ||
    localStorage.getItem('fa_preview') === '1';
  if (!showPreview) return null;

  return (
    <div className="relative text-center pb-10 animate-fade-in">
      <Link
        to="/preview"
        className="inline-flex items-center gap-2 text-[10px] text-mulberry/40 hover:text-rose-600 transition uppercase tracking-[0.4em]"
      >
        <Sparkles size={11} />
        Enter full preview
      </Link>
    </div>
  );
}