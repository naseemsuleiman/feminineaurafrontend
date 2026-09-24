import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Users, Mail, Download, RefreshCw, Sparkles,
  Check, ShieldAlert, Search, TrendingUp, Crown,
  PiggyBank, FileText, Quote, Calendar, Wallet, BarChart3,
  ArrowUpRight, Heart,
} from 'lucide-react';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') || 'overview';

  const [subs, setSubs] = useState({ count: 0, subscribers: [] });
  const [budgets, setBudgets] = useState([]);
  const [articles, setArticles] = useState([]);
  const [siteLive, setSiteLive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [subsRes, statusRes, budRes, artRes] = await Promise.all([
        API.get('/admin/subscribers/'),
        API.get('/site-status/'),
        API.get('/admin/budgets/'),
        API.get('/articles/'),
      ]);
      setSubs(subsRes.data);
      setSiteLive(!!statusRes.data.is_live);
      setBudgets(budRes.data?.budgets || []);
      setArticles(artRes.data || []);
    } catch (e) {
      console.error(e);
      setError(
        e?.response?.status === 403
          ? 'Admin access required.'
          : 'Some data failed to load.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user?.is_staff) fetchAll();
  }, [authLoading, user, fetchAll]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return nav('/login', { replace: true });
    if (!user.is_staff) return nav('/', { replace: true });
  }, [authLoading, user, nav]);

  const stats = useMemo(() => {
    const list = subs.subscribers || [];
    const now = Date.now();
    const today = new Date().toDateString();
    const weekAgo = now - 7 * 86400000;

    const todayCount = list.filter(
      (s) => new Date(s.created_at).toDateString() === today
    ).length;

    const weekCount = list.filter(
      (s) => new Date(s.created_at).getTime() > weekAgo
    ).length;

    const series = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      const label = d.toLocaleDateString(undefined, { weekday: 'short' });
      const count = list.filter(
        (s) => new Date(s.created_at).toDateString() === d.toDateString()
      ).length;
      series.push({ label, count });
    }

    const totalSaved = budgets.reduce(
      (a, b) => a + Number(b.savings_goal || 0), 0
    );

    const articlesByCat = articles.reduce((acc, a) => {
      acc[a.category] = (acc[a.category] || 0) + 1;
      return acc;
    }, {});

    return { todayCount, weekCount, series, totalSaved, articlesByCat };
  }, [subs, budgets, articles]);

  const filteredSubs = subs.subscribers.filter((s) =>
    s.email.toLowerCase().includes(query.toLowerCase())
  );

  const exportCSV = () => {
    const header = 'Email,Subscribed At';
    const rows = subs.subscribers.map(
      (s) => `${s.email},${new Date(s.created_at).toISOString()}`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feminine-aura-subscribers-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-mulberry/60">
        <div className="text-center">
          <Sparkles className="animate-pulse text-rose-400 mx-auto mb-3" size={28} />
          <p className="font-serif text-lg">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user?.is_staff) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="text-center">
          <ShieldAlert size={28} className="mx-auto text-rose-400 mb-3" />
          <p className="font-serif text-lg text-mulberry">Admin access required</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'subscribers', label: 'Subscribers', icon: Users },
    { key: 'budgets', label: 'Budgets', icon: PiggyBank },
    { key: 'content', label: 'Content', icon: FileText },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blush-100 via-blush-50 to-blush-200 opacity-60 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-rose-400/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-blush-200/50 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-14">

        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur border border-blush-200 text-rose-600 text-[10px] uppercase tracking-[0.25em] font-medium mb-3 sm:mb-4">
              <Crown size={11} /> Admin Console
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.05] text-mulberry break-words">
              Welcome back,
              <br />
              <em className="text-rose-600 not-italic font-medium">
                {user.display_name || user.username}.
              </em>
            </h1>
          </div>
          <button
            onClick={fetchAll}
            disabled={loading}
            className="btn-ghost !py-2.5 !px-4 sm:!px-5 text-xs sm:text-sm"
          >
            <RefreshCw size={14} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Tabs — horizontally scrollable on mobile */}
        <div className="-mx-4 sm:mx-0 mb-6 sm:mb-8">
          <div className="flex gap-2 overflow-x-auto px-4 sm:px-0 pb-1 scrollbar-hide">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setParams({ tab: key })}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition whitespace-nowrap shrink-0 ${
                  tab === key
                    ? 'bg-rose-600 text-white shadow-soft'
                    : 'bg-white/70 text-mulberry/70 hover:bg-blush-100 hover:text-rose-600'
                }`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl bg-red-50 text-red-600 text-sm mb-6">
            <ShieldAlert size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* ─────────── OVERVIEW ─────────── */}
        {tab === 'overview' && (
          <div className="space-y-5 sm:space-y-8">
            {/* Top stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* Total subscribers hero */}
              <div className="md:col-span-2 relative overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] bg-gradient-to-br from-rose-600 via-rose-400 to-blush-200 p-6 sm:p-8 text-white shadow-card">
                <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/25 blur-3xl" />
                <div className="relative">
                  <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 text-white/85 text-[10px] uppercase tracking-[0.25em] min-w-0">
                      <Users size={13} /> <span className="truncate">Total Subscribers</span>
                    </div>
                    <span className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/20 text-[10px] uppercase tracking-widest shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                      Live
                    </span>
                  </div>
                  <p className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-none break-all">
                    {subs.count}
                  </p>
                  <p className="text-white/85 text-sm mt-3 sm:mt-4">
                    Women on the waitlist.
                  </p>
                </div>
              </div>

              <StatCard
                icon={Calendar} label="This Week"
                value={stats.weekCount} sub="New in last 7 days"
              />
              <StatCard
                icon={Sparkles} label="Today"
                value={stats.todayCount} sub="Signed up today"
              />
            </div>

            {/* Chart + Site status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
              <div className="lg:col-span-2 card">
                <div className="flex items-center justify-between mb-5 sm:mb-6 gap-3">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-mulberry/50 min-w-0">
                    <TrendingUp size={12} className="text-rose-600 shrink-0" />
                    <span className="truncate">Last 7 Days</span>
                  </div>
                  <span className="text-xs text-mulberry/50 shrink-0">
                    {stats.weekCount} new
                  </span>
                </div>
                <div className="flex items-end justify-between gap-1.5 sm:gap-2 h-32 sm:h-40">
                  {stats.series.map((d, i) => {
                    const max = Math.max(...stats.series.map((s) => s.count), 1);
                    const height = (d.count / max) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1.5 sm:gap-2 min-w-0">
                        <div className="w-full h-full flex items-end">
                          <div
                            className="w-full rounded-t-lg sm:rounded-t-xl bg-gradient-to-t from-rose-600 to-rose-400 transition-all duration-500"
                            style={{ height: `${Math.max(height, 4)}%` }}
                            title={`${d.count} on ${d.label}`}
                          />
                        </div>
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-mulberry/40">
                          {d.label}
                        </p>
                        <p className="text-[10px] sm:text-xs font-medium text-mulberry">
                          {d.count}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="card">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-mulberry/50 mb-4 sm:mb-5">
                  <TrendingUp size={12} className="text-rose-600" /> Site Status
                </div>
                {siteLive === null ? (
                  <p className="text-mulberry/40 text-sm">Loading…</p>
                ) : siteLive ? (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_0_6px_rgba(74,222,128,0.2)] shrink-0" />
                      <p className="font-serif text-2xl sm:text-3xl text-mulberry">Live</p>
                    </div>
                    <p className="text-mulberry/60 text-sm">
                      Public sees the full site.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_0_6px_rgba(200,122,139,0.2)] animate-pulse shrink-0" />
                      <p className="font-serif text-2xl sm:text-3xl text-mulberry">Coming Soon</p>
                    </div>
                    <p className="text-mulberry/60 text-sm">
                      Toggle in Django admin to launch.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Recent subs + export */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
              <div className="lg:col-span-2 card">
                <div className="flex items-center justify-between mb-5 sm:mb-6 gap-3">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-mulberry/50 min-w-0">
                    <Users size={12} className="text-rose-600 shrink-0" />
                    <span className="truncate">Recent Subscribers</span>
                  </div>
                  <button
                    onClick={() => setParams({ tab: 'subscribers' })}
                    className="text-xs text-rose-600 hover:underline inline-flex items-center gap-1 shrink-0"
                  >
                    View all <ArrowUpRight size={12} />
                  </button>
                </div>
                {subs.subscribers.slice(0, 5).length === 0 ? (
                  <EmptyState icon={Mail} title="No subscribers yet." />
                ) : (
                  <ul className="divide-y divide-blush-100">
                    {subs.subscribers.slice(0, 5).map((s) => (
                      <li
                        key={s.id}
                        className="flex items-center justify-between gap-3 py-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 grid place-items-center text-white text-xs font-medium shrink-0">
                            {s.email.charAt(0).toUpperCase()}
                          </span>
                          <span className="text-sm text-mulberry font-medium truncate">
                            {s.email}
                          </span>
                        </div>
                        <span className="text-[11px] sm:text-xs text-mulberry/50 shrink-0">
                          {new Date(s.created_at).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="card flex flex-col">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-mulberry/50 mb-4 sm:mb-5">
                  <Download size={12} className="text-rose-600" /> Export
                </div>
                <p className="font-serif text-2xl sm:text-3xl text-mulberry">
                  {subs.count} {subs.count === 1 ? 'record' : 'records'}
                </p>
                <p className="text-mulberry/60 text-sm mt-2 flex-1">
                  Download as CSV — opens in Excel, Sheets, or Mailchimp.
                </p>
                <button
                  onClick={exportCSV}
                  disabled={!subs.count}
                  className="btn-primary mt-5 w-full !py-2.5 text-sm disabled:opacity-40"
                >
                  Export CSV
                </button>
              </div>
            </div>

            {/* Glance cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <GlanceCard
                icon={PiggyBank}
                title="Budgets Created"
                value={budgets.length}
                sub={`Total savings goals: $${stats.totalSaved.toLocaleString()}`}
              />
              <GlanceCard
                icon={FileText}
                title="Articles Published"
                value={articles.length}
                sub={
                  Object.entries(stats.articlesByCat)
                    .map(([k, v]) => `${v} ${k}`)
                    .join(' · ') || 'None yet'
                }
              />
            </div>
          </div>
        )}

        {/* ─────────── SUBSCRIBERS ─────────── */}
        {tab === 'subscribers' && (
          <div className="card overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-4 mb-6">
              <div className="min-w-0">
                <h2 className="font-serif text-xl sm:text-2xl">All Subscribers</h2>
                <span className="text-xs uppercase tracking-widest text-mulberry/40">
                  {filteredSubs.length} of {subs.count}
                </span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400"
                  />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search email…"
                    className="input !py-2 !pl-10 !pr-4 text-sm w-full sm:w-56"
                  />
                </div>
                <button
                  onClick={exportCSV}
                  disabled={!subs.count}
                  className="btn-ghost !py-2 !px-3 sm:!px-4 text-sm disabled:opacity-40 shrink-0"
                >
                  <Download size={14} className="sm:mr-2" />
                  <span className="hidden sm:inline">CSV</span>
                </button>
              </div>
            </div>

            {filteredSubs.length === 0 ? (
              <EmptyState
                icon={Mail}
                title={subs.count === 0 ? 'No subscribers yet.' : 'No matches.'}
              />
            ) : (
              <>
                {/* Mobile card list */}
                <ul className="sm:hidden divide-y divide-blush-100">
                  {filteredSubs.map((s, i) => (
                    <li key={s.id} className="py-3 flex items-start gap-3">
                      <span className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 grid place-items-center text-white text-xs font-medium shrink-0">
                        {s.email.charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-mulberry font-medium truncate">
                          {s.email}
                        </p>
                        <p className="text-[11px] text-mulberry/50 mt-0.5">
                          {new Date(s.created_at).toLocaleString()}
                        </p>
                        <span className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-medium">
                          <Check size={10} /> Confirmed
                        </span>
                      </div>
                      <span className="text-[10px] text-mulberry/40 shrink-0">#{i + 1}</span>
                    </li>
                  ))}
                </ul>

                {/* Desktop table */}
                <div className="hidden sm:block overflow-x-auto -mx-6">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-mulberry/60 uppercase text-xs tracking-wider">
                        <th className="px-6 py-3">#</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Subscribed</th>
                        <th className="px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubs.map((s, i) => (
                        <tr
                          key={s.id}
                          className="border-t border-blush-100 hover:bg-blush-50/50"
                        >
                          <td className="px-6 py-3 text-mulberry/40">{i + 1}</td>
                          <td className="px-6 py-3 font-medium text-mulberry">
                            {s.email}
                          </td>
                          <td className="px-6 py-3 text-mulberry/70">
                            {new Date(s.created_at).toLocaleString()}
                          </td>
                          <td className="px-6 py-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium">
                              <Check size={12} /> Confirmed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* ─────────── BUDGETS ─────────── */}
        {tab === 'budgets' && (
          <div className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <GlanceCard
                icon={PiggyBank}
                title="Active Budgets"
                value={budgets.length}
                sub="Users who started tracking"
              />
              <GlanceCard
                icon={Wallet}
                title="Committed Savings"
                value={`$${stats.totalSaved.toLocaleString()}`}
                sub="Across all users this month"
              />
              <GlanceCard
                icon={Heart}
                title="Avg. Savings Goal"
                value={
                  budgets.length
                    ? `$${(stats.totalSaved / budgets.length).toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}`
                    : '$0'
                }
                sub="Per user"
              />
            </div>

            <div className="card">
              <h2 className="font-serif text-xl sm:text-2xl mb-5 sm:mb-6">Budgets Overview</h2>
              {budgets.length === 0 ? (
                <EmptyState icon={PiggyBank} title="No budgets created yet." />
              ) : (
                <>
                  {/* Mobile list */}
                  <ul className="sm:hidden divide-y divide-blush-100">
                    {budgets.map((b) => (
                      <li key={b.id} className="py-3">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <p className="text-sm font-medium text-mulberry truncate">
                            {b.username}
                          </p>
                          <span className="text-[10px] uppercase tracking-widest text-mulberry/40 shrink-0">
                            {b.month}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-mulberry/60">
                          <span>Income ${Number(b.monthly_income).toLocaleString()}</span>
                          <span className="font-medium text-rose-600">
                            Save ${Number(b.savings_goal).toLocaleString()}
                          </span>
                        </div>
                        {b.savings_pct != null && (
                          <div className="mt-2 h-1.5 rounded-full bg-blush-100 overflow-hidden">
                            <div
                              className="h-full bg-rose-600"
                              style={{ width: `${Math.min(b.savings_pct, 100)}%` }}
                            />
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>

                  {/* Desktop table */}
                  <div className="hidden sm:block overflow-x-auto -mx-6">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-mulberry/60 uppercase text-xs tracking-wider">
                          <th className="px-6 py-3">User</th>
                          <th className="px-6 py-3">Month</th>
                          <th className="px-6 py-3">Income</th>
                          <th className="px-6 py-3">Savings Goal</th>
                          <th className="px-6 py-3">%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {budgets.map((b) => (
                          <tr
                            key={b.id}
                            className="border-t border-blush-100 hover:bg-blush-50/50"
                          >
                            <td className="px-6 py-3 font-medium text-mulberry">
                              {b.username}
                            </td>
                            <td className="px-6 py-3 text-mulberry/70">{b.month}</td>
                            <td className="px-6 py-3 text-mulberry/70">
                              ${Number(b.monthly_income).toLocaleString()}
                            </td>
                            <td className="px-6 py-3 font-medium text-rose-600">
                              ${Number(b.savings_goal).toLocaleString()}
                            </td>
                            <td className="px-6 py-3 text-mulberry/70">
                              {b.savings_pct != null ? `${b.savings_pct}%` : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ─────────── CONTENT ─────────── */}
        {tab === 'content' && (
          <div className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
              <GlanceCard
                icon={FileText} title="All Articles"
                value={articles.length} sub="Published"
              />
              {['mental', 'physical', 'financial'].map((c) => (
                <GlanceCard
                  key={c}
                  icon={Quote} title={c.charAt(0).toUpperCase() + c.slice(1)}
                  value={stats.articlesByCat[c] || 0}
                  sub="articles"
                />
              ))}
            </div>

            <div className="card">
              <h2 className="font-serif text-xl sm:text-2xl mb-5 sm:mb-6">Recent Articles</h2>
              {articles.length === 0 ? (
                <EmptyState icon={FileText} title="No articles yet." />
              ) : (
                <ul className="divide-y divide-blush-100">
                  {articles.slice(0, 10).map((a) => (
                    <li key={a.id} className="py-4 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                      <span className="text-[10px] uppercase tracking-widest text-rose-600 sm:pt-1 sm:w-20 shrink-0">
                        {a.category}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-base sm:text-lg text-mulberry">
                          {a.title}
                        </p>
                        <p className="text-sm text-mulberry/60 line-clamp-2 mt-1">
                          {a.excerpt || a.body?.slice(0, 120)}
                        </p>
                      </div>
                      <span className="text-[11px] sm:text-xs text-mulberry/40 sm:shrink-0">
                        {new Date(a.created_at).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────── small components ─────────── */
function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="card relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-blush-100 blur-2xl" />
      <div className="relative">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-mulberry/50 font-medium mb-4 sm:mb-5">
          <Icon size={12} className="text-rose-600" />
          <span className="truncate">{label}</span>
        </div>
        <p className="font-serif text-4xl sm:text-5xl text-mulberry break-all">
          {value}
        </p>
        <p className="text-mulberry/60 text-xs sm:text-sm mt-2 sm:mt-3">{sub}</p>
      </div>
    </div>
  );
}

function GlanceCard({ icon: Icon, title, value, sub }) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-mulberry/50 font-medium mb-4 sm:mb-5">
        <Icon size={12} className="text-rose-600 shrink-0" />
        <span className="truncate">{title}</span>
      </div>
      <p className="font-serif text-2xl sm:text-3xl text-mulberry break-words">
        {value}
      </p>
      <p className="text-mulberry/60 text-xs sm:text-sm mt-2 break-words">{sub}</p>
    </div>
  );
}

function EmptyState({ icon: Icon, title }) {
  return (
    <div className="text-center py-10 sm:py-12">
      <Icon size={26} className="mx-auto text-rose-400 mb-3" />
      <p className="font-serif text-base sm:text-lg text-mulberry">{title}</p>
    </div>
  );
}