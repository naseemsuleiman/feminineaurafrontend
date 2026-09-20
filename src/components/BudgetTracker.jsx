import { useEffect, useMemo, useState } from 'react';
import {
  PiggyBank, Wallet, ArrowRight, Lock, Heart, ShoppingBag,
  Download, Sparkles, Check, TrendingUp,
} from 'lucide-react';
import API from '../api';

const fmt = (n) =>
  `$${Number(n || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function BudgetTracker({ month }) {
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Savings screen state
  const [savingsGoal, setSavingsGoal] = useState('');
  const [income, setIncome] = useState('');

  const loadBudget = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/budgets/current/?month=${month}`);
      setBudget(data);
    } catch {
      setBudget(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudget();
    // eslint-disable-next-line
  }, [month]);

  const startTracking = async () => {
    setSaving(true);
    try {
      await API.post('/budgets/', {
        month,
        monthly_income: income || 0,
        savings_goal: savingsGoal,
      });
      await loadBudget();
    } catch (e) {
      alert(JSON.stringify(e.response?.data || e.message));
    } finally {
      setSaving(false);
    }
  };

  const updateEntry = async (entryId, patch) => {
    setBudget((b) => ({
      ...b,
      entries: b.entries.map((e) => (e.id === entryId ? { ...e, ...patch } : e)),
    }));
    const entry = budget.entries.find((e) => e.id === entryId);
    await API.patch(`/entries/${entryId}/`, {
      day: entry.day,
      date: entry.date,
      essentials: entry.essentials,
      wants: entry.wants,
      notes: entry.notes,
      ...patch,
    });
  };

  const totals = useMemo(() => {
    if (!budget) return null;
    const sum = (k) => budget.entries.reduce((a, e) => a + parseFloat(e[k] || 0), 0);
    const essentials = sum('essentials');
    const wants = sum('wants');
    const spent = essentials + wants;
    const income = parseFloat(budget.monthly_income || 0);
    const savingsGoal = parseFloat(budget.savings_goal || 0);
    const budgetAfterSavings = income > 0 ? income - savingsGoal : null;
    return {
      essentials,
      wants,
      spent,
      income,
      savingsGoal,
      budgetAfterSavings,
      remaining: budgetAfterSavings !== null ? budgetAfterSavings - spent : null,
    };
  }, [budget]);

  const exportCSV = () => {
    if (!budget) return;
    const header = ['Day', 'Date', 'Essentials', 'Wants', 'Daily Total', 'Notes'];
    const rows = budget.entries.map((e) => [
      e.day, e.date || '', e.essentials, e.wants, e.daily_total, `"${e.notes || ''}"`,
    ]);
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feminine-aura-budget-${month}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="text-center py-24 text-mulberry/60">
        <Sparkles className="animate-pulse mx-auto mb-3 text-rose-400" size={28} />
        Loading your tracker…
      </div>
    );
  }

  /* ─────────────────────────────────────────────
     SAVINGS SCREEN (no budget yet)
  ───────────────────────────────────────────── */
  if (!budget) {
    const savingsNum = parseFloat(savingsGoal) || 0;
    const incomeNum = parseFloat(income) || 0;
    const pct = incomeNum > 0 ? (savingsNum / incomeNum) * 100 : 0;
    const valid =
      savingsNum > 0 && (incomeNum === 0 || savingsNum < incomeNum);

    return (
      <div className="max-w-xl mx-auto">
        <div className="relative rounded-[2rem] bg-gradient-to-br from-white via-blush-50 to-blush-100 p-8 md:p-10 shadow-card border border-blush-100 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-rose-400/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-blush-200/40 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 grid place-items-center shadow-soft">
                <PiggyBank size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-mulberry">Set Your Savings First</h3>
                <p className="text-xs uppercase tracking-[0.25em] text-rose-600 mt-1">
                  {month}
                </p>
              </div>
            </div>

            <p className="text-sm text-mulberry/70 leading-relaxed mb-8">
              Before you start tracking, commit to the amount you want to save
              this month. This stays locked as your intention — then you can
              begin the daily tracker.
            </p>

            <label className="block mb-5">
              <span className="text-sm font-medium text-mulberry flex items-center gap-2">
                <PiggyBank size={14} className="text-rose-600" />
                Amount I want to save this month
              </span>
              <input
                type="number"
                step="0.01"
                autoFocus
                className="input mt-2 !py-3 text-lg font-serif"
                placeholder="2,000.00"
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(e.target.value)}
              />
            </label>

            <label className="block mb-5">
              <span className="text-sm font-medium text-mulberry flex items-center gap-2">
                <Wallet size={14} className="text-rose-600" />
                Monthly income
                <span className="text-xs text-mulberry/50 font-normal">(optional)</span>
              </span>
              <input
                type="number"
                step="0.01"
                className="input mt-2"
                placeholder="10,000.00"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
              />
            </label>

            {/* Live feedback */}
            {savingsNum > 0 && (
              <div
                className={`rounded-2xl p-4 text-sm mb-6 flex items-start gap-3 ${
                  incomeNum && savingsNum >= incomeNum
                    ? 'bg-red-50 text-red-600'
                    : 'bg-blush-50 text-mulberry/75'
                }`}
              >
                {incomeNum && savingsNum >= incomeNum ? (
                  <span>⚠ Savings goal must be less than your income.</span>
                ) : (
                  <>
                    <Check size={16} className="text-rose-600 mt-0.5 shrink-0" />
                    <span>
                      You're committing <strong className="text-rose-600">{fmt(savingsNum)}</strong>
                      {incomeNum > 0 && (
                        <> — <strong>{pct.toFixed(1)}%</strong> of your income</>
                      )}
                      .
                      {incomeNum > 0 && (
                        <> Leaving <strong>{fmt(incomeNum - savingsNum)}</strong> for daily spending.</>
                      )}
                    </span>
                  </>
                )}
              </div>
            )}

            <button
              onClick={startTracking}
              disabled={!valid || saving}
              className="btn-primary w-full !py-4 text-base disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? 'Starting…' : 'Proceed to Daily Tracker'}
              <ArrowRight size={18} className="ml-2" />
            </button>

            <p className="text-xs text-center text-mulberry/50 mt-4">
              You can't change this amount later — so make it intentional.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────
     DAILY TRACKER
  ───────────────────────────────────────────── */
  return (
    <div className="space-y-8">
      {/* Savings Commitment Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-rose-600 via-rose-400 to-blush-200 p-8 md:p-10 shadow-card text-white">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-white/85 text-xs uppercase tracking-[0.25em] mb-3">
              <PiggyBank size={14} /> Savings Commitment
            </div>
            <p className="font-serif text-4xl md:text-5xl">{fmt(totals.savingsGoal)}</p>
            <p className="text-white/85 text-sm mt-2 flex items-center gap-2">
              <Lock size={12} />
              Locked in for {month}
              {budget.savings_pct != null && <> · {budget.savings_pct}% of income</>}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur text-sm">
            <Sparkles size={14} /> Your intention
          </div>
        </div>
      </div>

      {/* Overview numbers */}
      <div className="card">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h3 className="font-serif text-2xl">{month} Overview</h3>
            <p className="text-sm text-mulberry/60">
              {totals.income > 0 ? `Income ${fmt(totals.income)}` : 'No income set'}
            </p>
          </div>
          <button onClick={exportCSV} className="btn-ghost !py-2 !px-4 text-sm">
            <Download size={16} className="mr-2" /> Export CSV
          </button>
        </div>

        {/* Category cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              label: 'Savings', icon: PiggyBank,
              spent: totals.savingsGoal, limit: totals.savingsGoal,
              color: 'bg-rose-600', locked: true,
              sub: 'Committed',
            },
            {
              label: 'Essentials', icon: Heart,
              spent: totals.essentials,
              limit: totals.budgetAfterSavings,
              color: 'bg-rose-400',
              sub: 'Daily spend',
            },
            {
              label: 'Wants', icon: ShoppingBag,
              spent: totals.wants,
              limit: totals.budgetAfterSavings,
              color: 'bg-blush-200',
              sub: 'Daily spend',
            },
          ].map((c) => {
            const pct = c.limit ? Math.min(100, (c.spent / c.limit) * 100) : 0;
            const Icon = c.icon;
            return (
              <div key={c.label} className="rounded-2xl bg-blush-50 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className="text-rose-600" />
                    <span className="font-medium text-sm">{c.label}</span>
                    {c.locked && <Lock size={12} className="text-mulberry/40" />}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-mulberry/40">
                    {c.sub}
                  </span>
                </div>
                <p className="font-serif text-xl mb-3">
                  {fmt(c.spent)}
                  {c.limit != null && (
                    <span className="text-sm text-mulberry/50 font-sans"> / {fmt(c.limit)}</span>
                  )}
                </p>
                <div className="h-2 rounded-full bg-blush-100 overflow-hidden">
                  <div className={`h-full ${c.color} transition-all`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Big numbers */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { label: 'Saved', value: fmt(totals.savingsGoal), cls: 'text-rose-600', icon: PiggyBank },
            { label: 'Spent', value: fmt(totals.spent), cls: '', icon: TrendingUp },
            {
              label: 'Left to Spend',
              value: totals.remaining !== null ? fmt(totals.remaining) : '—',
              cls: totals.remaining !== null && totals.remaining < 0 ? 'text-red-500' : 'text-rose-600',
              icon: Wallet,
            },
            { label: 'Income', value: totals.income > 0 ? fmt(totals.income) : '—', cls: '', icon: Wallet },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label}>
                <Icon size={16} className="mx-auto mb-2 text-mulberry/40" />
                <p className="text-xs uppercase tracking-widest text-mulberry/50">{s.label}</p>
                <p className={`font-serif text-2xl ${s.cls}`}>{s.value}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily table */}
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="font-serif text-2xl">30-Day Daily Tracker</h3>
          <span className="text-xs text-mulberry/50 uppercase tracking-widest">
            Essentials · Wants only
          </span>
        </div>
        <div className="overflow-x-auto -mx-6">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-mulberry/60 uppercase text-xs tracking-wider">
                <th className="px-4 py-3">Day</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Essentials</th>
                <th className="px-4 py-3">Wants</th>
                <th className="px-4 py-3">Daily Total</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {budget.entries.map((e) => (
                <tr key={e.id} className="border-t border-blush-100 hover:bg-blush-50/50">
                  <td className="px-4 py-2 font-medium">{e.day}</td>
                  <td className="px-4 py-2">
                    <input
                      type="date"
                      className="input !py-1 !px-2"
                      value={e.date || ''}
                      onChange={(ev) => updateEntry(e.id, { date: ev.target.value || null })}
                    />
                  </td>
                  {['essentials', 'wants'].map((k) => (
                    <td key={k} className="px-4 py-2">
                      <input
                        type="number"
                        step="0.01"
                        className="input !py-1 !px-2 w-24"
                        value={e[k]}
                        onChange={(ev) => updateEntry(e.id, { [k]: ev.target.value })}
                      />
                    </td>
                  ))}
                  <td className="px-4 py-2 font-medium text-rose-600">{fmt(e.daily_total)}</td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      className="input !py-1 !px-2"
                      placeholder="Note…"
                      value={e.notes}
                      onChange={(ev) => updateEntry(e.id, { notes: ev.target.value })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}