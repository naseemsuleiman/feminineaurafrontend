import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, PiggyBank, BookOpen, ArrowRight, Quote, Lock, Heart, Wallet 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api';

export default function MemberHome() {
  const { user } = useAuth();
  const [quote, setQuote] = useState(null);
  const [latestArticle, setLatestArticle] = useState(null);
  const [budgetSummary, setBudgetSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  useEffect(() => {
    let mounted = true;
    async function loadDashboardData() {
      try {
        // Fetch daily quote & latest article in parallel
        const [quoteRes, artRes] = await Promise.all([
          API.get('/quotes/').catch(() => ({ data: [] })),
          API.get('/articles/').catch(() => ({ data: [] })),
        ]);

        if (!mounted) return;

        // Active quote or first quote
        const quotes = quoteRes.data || [];
        const activeQuote = quotes.find((q) => q.active) || quotes[0];
        setQuote(activeQuote);

        // Latest article
        const articles = artRes.data || [];
        if (articles.length) setLatestArticle(articles[0]);

        // If user has paid or is staff, try fetching budget summary
        if (user?.has_paid || user?.is_staff) {
          const budRes = await API.get(`/budget-setup/?month=${currentMonth}`).catch(() => null);
          if (budRes?.data && mounted) {
            setBudgetSummary(budRes.data);
          }
        }
      } catch (err) {
        console.error('Error loading member home data:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDashboardData();
    return () => { mounted = false; };
  }, [user, currentMonth]);

  const hasAccess = user?.has_paid || user?.is_staff;

  return (
    <div className="relative overflow-hidden min-h-[85vh]">
      {/* Soft Background Accents */}
      <div className="absolute inset-0 bg-gradient-to-br from-blush-100 via-blush-50 to-blush-200 opacity-60 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-rose-400/15 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-12 sm:py-16">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-blush-200 text-rose-600 text-[10px] uppercase tracking-[0.25em] font-medium mb-4">
              <Sparkles size={12} /> Your Sanctuary
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-mulberry leading-tight">
              Welcome back, <br />
              <span className="italic font-normal text-rose-600">
                {user?.display_name || user?.username || 'Gorgeous'}.
              </span>
            </h1>
          </div>
          <div className="text-sm text-mulberry/60">
            {today.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
        </div>

        {/* Daily Affirmation Card */}
        {quote && (
          <div className="card relative overflow-hidden mb-10 bg-gradient-to-r from-rose-500/10 via-blush-100 to-white border border-blush-200 !p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-600/10 text-rose-600 grid place-items-center shrink-0 mt-1">
                <Quote size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-rose-600 font-medium mb-2">
                  Daily Whisper
                </p>
                <p className="font-serif text-xl sm:text-2xl text-mulberry leading-relaxed italic">
                  "{quote.text}"
                </p>
                <p className="text-xs text-mulberry/50 mt-2">— {quote.author || 'Feminine Aura'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid: Financial Sanctuary + Empowerment Hub */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Card 1: 30-Day Budget Tracker Widget */}
          <div className="card flex flex-col justify-between hover:-translate-y-1 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-[0.25em] text-rose-600 font-medium flex items-center gap-2">
                  <PiggyBank size={14} /> Financial Freedom
                </span>
                {!hasAccess && (
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-mulberry/50 bg-blush-100 px-2.5 py-1 rounded-full">
                    <Lock size={10} /> Locked
                  </span>
                )}
              </div>

              <h2 className="font-serif text-2xl text-mulberry mb-2">30-Day Budget Tracker</h2>
              <p className="text-sm text-mulberry/65 leading-relaxed mb-6">
                {hasAccess
                  ? 'Track daily expenses, review savings targets, and keep your financial goals aligned with peace.'
                  : 'Unlock lifetime access to manage your essential spendings, wants, and monthly savings goals.'}
              </p>

              {/* Status Snippet */}
              {hasAccess && budgetSummary ? (
                <div className="grid grid-cols-2 gap-3 mb-6 bg-blush-50 p-4 rounded-2xl border border-blush-100">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-mulberry/50">Monthly Income</span>
                    <p className="font-serif text-lg text-mulberry">${Number(budgetSummary.monthly_income || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-mulberry/50">Savings Goal</span>
                    <p className="font-serif text-lg text-rose-600">${Number(budgetSummary.savings_goal || 0).toLocaleString()}</p>
                  </div>
                </div>
              ) : null}
            </div>

            <Link
              to="/budget-tracker"
              className="btn-primary w-full text-center !py-3 text-sm inline-flex items-center justify-center gap-2 group"
            >
              {hasAccess ? 'Open Budget Tracker' : 'Unlock Budget Tracker'}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
            </Link>
          </div>

          {/* Card 2: Empowerment Hub Snippet */}
          <div className="card flex flex-col justify-between hover:-translate-y-1 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-[0.25em] text-rose-600 font-medium flex items-center gap-2">
                  <BookOpen size={14} /> Empowerment Hub
                </span>
                {latestArticle && (
                  <span className="text-[10px] uppercase tracking-widest text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                    {latestArticle.category}
                  </span>
                )}
              </div>

              {latestArticle ? (
                <>
                  <h2 className="font-serif text-2xl text-mulberry mb-2">{latestArticle.title}</h2>
                  <p className="text-sm text-mulberry/65 leading-relaxed line-clamp-3 mb-6">
                    {latestArticle.excerpt || latestArticle.body}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="font-serif text-2xl text-mulberry mb-2">Essays & Insights</h2>
                  <p className="text-sm text-mulberry/65 leading-relaxed mb-6">
                    Explore curated reads on soft confidence, charisma, healing, and becoming your best self.
                  </p>
                </>
              )}
            </div>

            <Link
              to="/empowerment"
              className="btn-ghost w-full text-center !py-3 text-sm inline-flex items-center justify-center gap-2 group"
            >
              Explore All Articles
              <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}