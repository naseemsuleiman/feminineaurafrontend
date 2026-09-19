import { useEffect, useMemo, useState } from 'react';
import API from '../api';

const fmt = (n) =>
  `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function BudgetTracker({ month }) {
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Setup form state
  const [setup, setSetup] = useState({
    monthly_income: 10000,
    essentials_pct: 50,
    wants_pct: 30,
    savings_pct: 20,
  });

  const pctTotal = Number(setup.essentials_pct) + Number(setup.wants_pct) + Number(setup.savings_pct);

  const loadBudget = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/budgets/current/?month=${month}`);
      setBudget(data);
      setSetup({
        monthly_income: parseFloat(data.monthly_income),
        essentials_pct: parseFloat(data.essentials_pct),
        wants_pct: parseFloat(data.wants_pct),
        savings_pct: parseFloat(data.savings_pct),
      });
    } catch {
      setBudget(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBudget(); /* eslint-disable-next-line */ }, [month]);

  const createBudget = async () => {
    if (pctTotal !== 100) return alert('Percentages must total 100%.');
    setSaving(true);
    try {
      await API.post('/budgets/', { month, ...setup });
      await loadBudget();
    } catch (e) {
      alert(JSON.stringify(e.response?.data || e.message));
    } finally {
      setSaving(false);
    }
  };

  const updateSetup = async () => {
    if (pctTotal !== 100) return alert('Percentages must total 100%.');
    setSaving(true);
    try {
      const { data } = await API.put(`/budgets/${budget.id}/`, { month, ...setup });
      setBudget(data);
    } finally {
      setSaving(false);
    }
  };

  const updateEntry = async (entryId, patch) => {
    // optimistic
    setBudget((b) => ({
      ...b,
      entries: b.entries.map((e) => (e.id === entryId ? { ...e, ...patch } : e)),
    }));
    const entry = budget.entries.find((e) => e.id === entryId);
    const payload = {
      day: entry.day,
      date: entry.date,
      essentials: entry.essentials,
      wants: entry.wants,
      savings: entry.savings,
      notes: entry.notes,
      ...patch,
    };
    await API.patch(`/entries/${entryId}/`, payload);
  };

  const totals = useMemo(() => {
    if (!budget) return null;
    const sum = (k) => budget.entries.reduce((a, e) => a + parseFloat(e[k] || 0), 0);
    const essentials = sum('essentials');
    const wants = sum('wants');
    const savings = sum('savings');
    const income = parseFloat(budget.monthly_income);
    return {
      essentials, wants, savings,
      spent: essentials + wants + savings,
      remaining: income - (essentials + wants + savings),
      income,
      essentialsLimit: parseFloat(budget.essentials_limit),
      wantsLimit: parseFloat(budget.wants_limit),
      savingsLimit: parseFloat(budget.savings_limit),
    };
  }, [budget]);

  const exportCSV = () => {
    if (!budget) return;
    const header = ['Day', 'Date', 'Essentials', 'Wants', 'Savings', 'Daily Total', 'Notes'];
    const rows = budget.entries.map((e) => [
      e.day, e.date || '', e.essentials, e.wants, e.savings, e.daily_total, `"${e.notes || ''}"`,
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

  if (loading) return <div className="text-center py-20 text-mulberry/60">Loading tracker…</div>;

  // Setup card (no budget yet)
  if (!budget) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="card">
          <h3 className="font-serif text-2xl mb-2">Set Up Your {month} Budget</h3>
          <p className="text-sm text-mulberry/60 mb-6">
            Classic rule: 50% Essentials · 30% Wants · 20% Savings / Debt.
          </p>

          <label className="block mb-4">
            <span className="text-sm font-medium">Take-home Monthly Income</span>
            <input
              type="number"
              className="input mt-1"
              value={setup.monthly_income}
              onChange={(e) => setSetup({ ...setup, monthly_income: e.target.value })}
            />
          </label>

          <div className="grid grid-cols-3 gap-3">
            {['essentials_pct', 'wants_pct', 'savings_pct'].map((k) => (
              <label key={k}>
                <span className="text-xs uppercase tracking-wider text-mulberry/60">
                  {k.split('_')[0]}
                </span>
                <input
                  type="number"
                  className="input mt-1"
                  value={setup[k]}
                  onChange={(e) => setSetup({ ...setup, [k]: e.target.value })}
                />
              </label>
            ))}
          </div>

          <div className={`mt-4 text-sm ${pctTotal === 100 ? 'text-green-600' : 'text-red-500'}`}>
            {pctTotal === 100 ? '✓ Categories total 100%' : `✗ Currently ${pctTotal}% — must be 100%`}
          </div>

          <button
            onClick={createBudget}
            disabled={saving || pctTotal !== 100}
            className="btn-primary mt-6 w-full disabled:opacity-50"
          >
            {saving ? 'Creating…' : 'Start 30-Day Tracker'}
          </button>
        </div>
      </div>
    );
  }

  // Full tracker
  return (
    <div className="space-y-8">
      {/* Summary card */}
      <div className="card">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <h3 className="font-serif text-2xl">{month} Overview</h3>
            <p className="text-sm text-mulberry/60">Income {fmt(totals.income)}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportCSV} className="btn-ghost !py-2 !px-4 text-sm">Export CSV</button>
            <button onClick={updateSetup} disabled={saving} className="btn-primary !py-2 !px-4 text-sm">
              {saving ? 'Saving…' : 'Save Setup'}
            </button>
          </div>
        </div>

        {/* Setup inputs */}
        <div className="grid md:grid-cols-4 gap-3 mb-6">
          <label>
            <span className="text-xs uppercase tracking-wider text-mulberry/60">Income</span>
            <input type="number" className="input mt-1" value={setup.monthly_income}
              onChange={(e) => setSetup({ ...setup, monthly_income: e.target.value })} />
          </label>
          {['essentials_pct', 'wants_pct', 'savings_pct'].map((k) => (
            <label key={k}>
              <span className="text-xs uppercase tracking-wider text-mulberry/60">{k.split('_')[0]} %</span>
              <input type="number" className="input mt-1" value={setup[k]}
                onChange={(e) => setSetup({ ...setup, [k]: e.target.value })} />
            </label>
          ))}
        </div>

        <div className={`text-sm mb-6 ${pctTotal === 100 ? 'text-green-600' : 'text-red-500'}`}>
          {pctTotal === 100 ? '✓ Categories total 100%' : `✗ Currently ${pctTotal}% — must be 100%`}
        </div>

        {/* Progress */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'Essentials', spent: totals.essentials, limit: totals.essentialsLimit, color: 'bg-rose-600' },
            { label: 'Wants', spent: totals.wants, limit: totals.wantsLimit, color: 'bg-rose-400' },
            { label: 'Savings / Debt', spent: totals.savings, limit: totals.savingsLimit, color: 'bg-blush-200' },
          ].map((c) => {
            const pct = c.limit ? Math.min(100, (c.spent / c.limit) * 100) : 0;
            return (
              <div key={c.label} className="rounded-2xl bg-blush-50 p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{c.label}</span>
                  <span className="text-mulberry/60">{fmt(c.spent)} / {fmt(c.limit)}</span>
                </div>
                <div className="h-2 rounded-full bg-blush-100 overflow-hidden">
                  <div className={`h-full ${c.color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-mulberry/50">Spent</p>
            <p className="font-serif text-2xl">{fmt(totals.spent)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-mulberry/50">Remaining</p>
            <p className={`font-serif text-2xl ${totals.remaining < 0 ? 'text-red-500' : 'text-rose-600'}`}>
              {fmt(totals.remaining)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-mulberry/50">Income</p>
            <p className="font-serif text-2xl">{fmt(totals.income)}</p>
          </div>
        </div>
      </div>

      {/* Daily table */}
      <div className="card overflow-hidden">
        <h3 className="font-serif text-2xl mb-4">30-Day Daily Tracker</h3>
        <div className="overflow-x-auto -mx-6">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-mulberry/60 uppercase text-xs tracking-wider">
                <th className="px-4 py-3">Day</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Essentials</th>
                <th className="px-4 py-3">Wants</th>
                <th className="px-4 py-3">Savings</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {budget.entries.map((e) => (
                <tr key={e.id} className="border-t border-blush-100 hover:bg-blush-50/50">
                  <td className="px-4 py-2 font-medium">{e.day}</td>
                  <td className="px-4 py-2">
                    <input type="date" className="input !py-1 !px-2"
                      value={e.date || ''}
                      onChange={(ev) => updateEntry(e.id, { date: ev.target.value || null })} />
                  </td>
                  {['essentials', 'wants', 'savings'].map((k) => (
                    <td key={k} className="px-4 py-2">
                      <input type="number" step="0.01" className="input !py-1 !px-2 w-24"
                        value={e[k]}
                        onChange={(ev) => updateEntry(e.id, { [k]: ev.target.value })} />
                    </td>
                  ))}
                  <td className="px-4 py-2 font-medium text-rose-600">{fmt(e.daily_total)}</td>
                  <td className="px-4 py-2">
                    <input type="text" className="input !py-1 !px-2"
                      placeholder="Note…"
                      value={e.notes}
                      onChange={(ev) => updateEntry(e.id, { notes: ev.target.value })} />
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