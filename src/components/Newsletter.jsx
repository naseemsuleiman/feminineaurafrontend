import { useState } from 'react';
import { Mail, Check, Sparkles } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    setDone(true);
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      <div className="relative rounded-[2.5rem] p-10 md:p-14 bg-gradient-to-br from-blush-200 via-blush-100 to-rose-400/40 shadow-card overflow-hidden text-center">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/40 blur-3xl" />

        <div className="relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-soft mb-6">
            <Mail size={22} className="text-rose-600" />
          </div>

          <h3 className="font-serif text-3xl md:text-4xl mb-3 text-mulberry">
            Morning Self-Love Prompts
          </h3>
          <p className="text-mulberry/70 mb-8 max-w-md mx-auto">
            One gentle email each morning. No noise. Just wisdom, grace & glow.
          </p>

          {done ? (
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-soft text-rose-600 font-medium">
              <Check size={18} />
              You're in. Check your inbox ✨
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <div className="relative flex-1">
                <Sparkles
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 pointer-events-none"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input !pl-11 bg-white/90"
                />
              </div>
              <button className="btn-primary whitespace-nowrap">Subscribe</button>
            </form>
          )}

          <p className="text-xs text-mulberry/50 mt-5">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}