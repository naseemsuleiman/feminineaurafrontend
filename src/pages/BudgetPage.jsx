import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Sparkles, Lock, ArrowRight, Check, X, CreditCard, Shield, Crown, Globe,
} from 'lucide-react';
import BudgetTracker from '../components/BudgetTracker';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const REF_KEY = 'fa_paystack_reference';

export default function BudgetPage() {
  const today = new Date();
  const [month, setMonth] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  );
  
  const [currency, setCurrency] = useState(localStorage.getItem('fa_currency') || 'KES');
  const { user, loading, loadUser } = useAuth();
  const [params] = useSearchParams();
  const nav = useNavigate();
  const [paying, setPaying] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [notice, setNotice] = useState(null);

  const paymentStatus = params.get('payment');

  const handleCurrencyChange = (e) => {
    const newCurr = e.target.value;
    setCurrency(newCurr);
    localStorage.setItem('fa_currency', newCurr);
  };

  /* ─────────────────────────────────────────────
     On return from Paystack: verify the transaction
  ───────────────────────────────────────────── */
  useEffect(() => {
    const reference = localStorage.getItem(REF_KEY);

    if (paymentStatus === 'success') {
      if (reference) {
        setVerifying(true);
        setNotice({ type: 'success', text: 'Confirming your payment…' });

        API.post('/payments/verify/', { reference })
          .then(() => {
            localStorage.removeItem(REF_KEY);
            setNotice({ type: 'success', text: 'Payment confirmed. Unlocking…' });
            return loadUser();
          })
          .catch((err) => {
            console.error('[VERIFY] failed:', err?.response?.data || err);
            setNotice({ type: 'info', text: 'We are still confirming your payment. Refresh in a moment.' });
            loadUser();
          })
          .finally(() => setVerifying(false));
      } else {
        setNotice({ type: 'success', text: 'Payment received! Checking access…' });
        loadUser();
        const t = setTimeout(() => loadUser(), 2500);
        return () => clearTimeout(t);
      }
    }

    if (paymentStatus === 'cancelled') {
      setNotice({ type: 'info', text: 'Checkout cancelled. You can try again anytime.' });
      localStorage.removeItem(REF_KEY);
    }
  }, [paymentStatus, loadUser]);

  /* ─────────────────────────────────────────────
     Start checkout — store reference before redirect
  ───────────────────────────────────────────── */
  const handleUnlock = async () => {
    setPaying(true);
    try {
      const { data } = await API.post('/payments/create-checkout-session/', {
        frontend_url: window.location.origin,
        currency: currency, // Pass selected currency to backend
      });
      if (data.url) {
        if (data.reference) {
          localStorage.setItem(REF_KEY, data.reference);
        }
        window.location.href = data.url;
      } else {
        alert('Could not start checkout. Please try again.');
        setPaying(false);
      }
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.error || 'Could not start checkout. Please try again.');
      setPaying(false);
    }
  };

  if (loading) return null;

  const hasAccess = user?.has_paid || user?.is_staff;
  const isAdmin = !!user?.is_staff;

  const PRICE_LABELS = { KES: 'KES 1', USD: '$1', NGN: '₦1,000' };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blush-100 via-blush-50 to-blush-200 opacity-60 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-rose-400/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-blush-200/50 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="uppercase tracking-[0.3em] text-xs text-rose-600 mb-4">
            Financial Empowerment
          </p>
          <h1 className="section-title">30-Day Budget Tracker</h1>
          <p className="text-mulberry/60 mt-3 max-w-2xl mx-auto">
            Financial freedom is self-care. Track daily, spend intentionally, glow quietly.
          </p>
        </div>

        {/* Currency & Month Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full shadow-soft border border-blush-100">
            <span className="text-sm font-medium text-mulberry flex items-center gap-1.5">
              <Globe size={14} className="text-rose-600" /> Currency:
            </span>
            <select 
              value={currency} 
              onChange={handleCurrencyChange}
              className="bg-transparent border-none focus:ring-0 text-rose-600 font-bold cursor-pointer py-0"
            >
              <option value="KES">KES (Ksh)</option>
              <option value="USD">USD ($)</option>
              <option value="NGN">NGN (₦)</option>
            </select>
          </div>

          {user && hasAccess && (
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="input !py-2.5 max-w-[160px] text-center rounded-full border-blush-100 shadow-soft"
            />
          )}
        </div>

        {/* Notices */}
        {notice && (
          <div className={`max-w-2xl mx-auto mb-8 flex items-center gap-3 px-5 py-4 rounded-2xl text-sm ${
            notice.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-blush-100 border border-blush-200 text-mulberry/70'
          }`}>
            {verifying ? <span className="inline-block w-4 h-4 border-2 border-green-600/40 border-t-green-600 rounded-full animate-spin shrink-0" /> : notice.type === 'success' ? <Check size={18} className="shrink-0" /> : <X size={18} className="shrink-0" />}
            <span>{notice.text}</span>
          </div>
        )}

        {/* Not logged in */}
        {!user && (
          <div className="card max-w-md mx-auto text-center">
            <h3 className="font-serif text-2xl mb-3">Sign in to track</h3>
            <p className="text-mulberry/60 mb-6">Your budget is private and personal.</p>
            <div className="flex gap-3 justify-center">
              <Link to={`/login?next=${encodeURIComponent('/budget-tracker')}`} className="btn-ghost">Login</Link>
              <Link to="/signup" className="btn-primary">Create Account</Link>
            </div>
          </div>
        )}

        {/* Logged in + access → tracker */}
        {user && hasAccess && (
          <>
            {isAdmin && (
              <div className="max-w-2xl mx-auto mb-6 flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/70 border border-blush-200 text-xs uppercase tracking-widest text-rose-600">
                <Crown size={13} /> Admin preview — full access
              </div>
            )}
            <BudgetTracker month={month} currency={currency} />
          </>
        )}

        {/* Logged in, no access → preview + paywall */}
        {user && !hasAccess && (
          <BudgetPreview
            month={month}
            price={PRICE_LABELS[currency] || 'KES 1'}
            currency={currency}
            onUnlock={handleUnlock}
            paying={paying}
          />
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   PREVIEW + PAYWALL
═══════════════════════════════════════════════════════ */
function BudgetPreview({ month, price, currency, onUnlock, paying }) {
  const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n);

  return (
    <div className="relative max-w-5xl mx-auto">
      <div className="select-none pointer-events-none blur-[6px] opacity-60">
        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-card border border-blush-100">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="font-serif text-2xl text-mulberry">30-Day Tracker</h3>
              <p className="text-sm text-mulberry/60">{month} Preview</p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blush-100 text-xs uppercase tracking-widest text-rose-600">
              <Lock size={12} /> Locked
            </div>
          </div>
          <div className="space-y-2.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="grid grid-cols-6 gap-3 items-center text-sm">
                <div className="font-medium text-mulberry/70 text-xs">Day {i + 1}</div>
                <div className="h-9 rounded-xl bg-blush-50" />
                <div className="h-9 rounded-xl bg-blush-50" />
                <div className="h-9 rounded-xl bg-blush-50" />
                <div className="h-9 rounded-xl bg-blush-50 col-span-2" />
              </div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="rounded-2xl bg-blush-50 p-4"><p className="text-[10px] uppercase tracking-widest text-mulberry/50">Savings</p><p className="font-serif text-xl text-mulberry">{fmt(2000)}</p></div>
            <div className="rounded-2xl bg-blush-50 p-4"><p className="text-[10px] uppercase tracking-widest text-mulberry/50">Spent</p><p className="font-serif text-xl text-mulberry">{fmt(3420)}</p></div>
            <div className="rounded-2xl bg-blush-50 p-4"><p className="text-[10px] uppercase tracking-widest text-mulberry/50">Remaining</p><p className="font-serif text-xl text-rose-600">{fmt(4580)}</p></div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white/95 backdrop-blur rounded-[2rem] p-8 md:p-10 shadow-card border border-blush-100">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 mb-5 shadow-soft">
            <Lock size={26} className="text-white" />
          </div>

          <h3 className="font-serif text-3xl text-mulberry mb-3">Unlock Your Tracker</h3>

          <p className="text-mulberry/65 leading-relaxed mb-6">
            Get lifetime access to the 30-Day Budget Tracker. Track essentials, wants, and savings with grace and intention.
          </p>

          <ul className="text-left space-y-2.5 mb-7 max-w-xs mx-auto">
            {['Full 30-day editable tracker', 'Locked-in savings commitment', 'Live essentials & wants totals', 'Export to CSV anytime', 'Lifetime access — pay once'].map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-mulberry/75">
                <Check size={15} className="text-rose-600 mt-0.5 shrink-0" /> {f}
              </li>
            ))}
          </ul>

          <button onClick={onUnlock} disabled={paying} className="btn-primary btn-shimmer w-full !py-4 text-base group disabled:opacity-60">
            {paying ? (
              <><span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" /> Redirecting…</>
            ) : (
              <>Unlock for {price} <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition" /></>
            )}
          </button>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-widest text-mulberry/50">
            <span className="flex items-center gap-1.5"><CreditCard size={11} className="text-rose-600" /> Card or M-Pesa</span>
            <span className="flex items-center gap-1.5"><Shield size={11} className="text-rose-600" /> Powered by Paystack</span>
            <span className="flex items-center gap-1.5"><Sparkles size={11} className="text-rose-600" /> One-time</span>
          </div>
        </div>
      </div>
    </div>
  );
}