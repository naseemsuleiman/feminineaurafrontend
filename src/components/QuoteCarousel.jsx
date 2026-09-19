import { useEffect, useState } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import API from '../api';

const FALLBACK = [
  { id: 1, text: '5 ways to upgrade your life in silence.' },
  { id: 2, text: 'Softness is a strategy, not a weakness.' },
  { id: 3, text: 'Discipline is the highest form of self-love.' },
];

export default function QuoteCarousel() {
  const [quotes, setQuotes] = useState(FALLBACK);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    API.get('/quotes/')
      .then(({ data }) => data?.length && setQuotes(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % quotes.length), 6000);
    return () => clearInterval(t);
  }, [quotes.length]);

  const prev = () => setIdx((i) => (i - 1 + quotes.length) % quotes.length);
  const next = () => setIdx((i) => (i + 1) % quotes.length);

  return (
    <section className="relative max-w-5xl mx-auto px-6 py-20">
      <div className="relative bg-gradient-to-br from-blush-100 via-white to-blush-200 rounded-[2.5rem] p-10 md:p-16 shadow-card overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-rose-400/10 blur-2xl" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-blush-200/40 blur-2xl" />

        <div className="relative text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-soft mb-6">
            <Quote size={20} className="text-rose-600" />
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-rose-600 mb-6">
            Daily Wisdom
          </p>

          <div className="min-h-[140px] flex items-center justify-center px-4">
            <p
              key={idx}
              className="font-serif text-2xl md:text-3xl lg:text-4xl text-mulberry leading-snug animate-fade-up"
            >
              “{quotes[idx]?.text}”
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              aria-label="Previous quote"
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur border border-blush-200 grid place-items-center hover:bg-rose-600 hover:text-white hover:border-rose-600 transition text-mulberry"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-2">
              {quotes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Go to quote ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === idx ? 'bg-rose-600 w-6' : 'bg-blush-200 w-2 hover:bg-blush-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next quote"
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur border border-blush-200 grid place-items-center hover:bg-rose-600 hover:text-white hover:border-rose-600 transition text-mulberry"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}