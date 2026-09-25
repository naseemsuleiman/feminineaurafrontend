import { Lock, Sparkles, ArrowRight } from 'lucide-react';

export default function BudgetPreview({ onUnlock }) {
  return (
    <div className="relative">
      {/* Blurred fake tracker */}
      <div className="select-none pointer-events-none blur-[6px] opacity-60">
        <div className="rounded-3xl bg-white p-8 shadow-card border border-blush-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-2xl text-mulberry">30-Day Tracker</h3>
              <p className="text-sm text-mulberry/60">2026-09 Preview</p>
            </div>
          </div>

          {/* Fake table rows */}
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-3 text-sm">
                <div className="font-medium text-mulberry/70">Day {i + 1}</div>
                <div className="h-8 rounded-xl bg-blush-50" />
                <div className="h-8 rounded-xl bg-blush-50" />
                <div className="h-8 rounded-xl bg-blush-50" />
                <div className="h-8 rounded-xl bg-blush-50" />
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="rounded-2xl bg-blush-50 p-4">
              <p className="text-xs uppercase tracking-widest text-mulberry/50">Savings</p>
              <p className="font-serif text-xl text-mulberry">$2,000</p>
            </div>
            <div className="rounded-2xl bg-blush-50 p-4">
              <p className="text-xs uppercase tracking-widest text-mulberry/50">Spent</p>
              <p className="font-serif text-xl text-mulberry">$3,420</p>
            </div>
            <div className="rounded-2xl bg-blush-50 p-4">
              <p className="text-xs uppercase tracking-widest text-mulberry/50">Remaining</p>
              <p className="font-serif text-xl text-rose-600">$4,580</p>
            </div>
          </div>
        </div>
      </div>

      {/* Unlock overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-md text-center bg-white/95 backdrop-blur rounded-[2rem] p-10 shadow-card border border-blush-100">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 mb-5">
            <Lock size={26} className="text-white" />
          </div>
          <h3 className="font-serif text-3xl text-mulberry mb-3">
            Unlock Your Tracker
          </h3>
          <p className="text-mulberry/65 leading-relaxed mb-8">
            Get lifetime access to the 30-Day Budget Tracker — track essentials,
            wants, and savings with grace and intention. One payment, yours forever.
          </p>

          <button
            onClick={onUnlock}
            className="btn-primary btn-shimmer w-full !py-4 text-base group"
          >
            Unlock for $19
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition" />
          </button>

          <p className="text-xs text-mulberry/50 mt-4 flex items-center justify-center gap-1.5">
            <Sparkles size={11} className="text-rose-400" />
            Secure payment via Stripe · One-time · Lifetime access
          </p>
        </div>
      </div>
    </div>
  );
}