import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Mail, Download, RefreshCw, Sparkles,
  ArrowLeft, Check, ShieldAlert, Search, TrendingUp,
} from 'lucide-react';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();

  const [data, setData] = useState({ count: 0, subscribers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [siteLive, setSiteLive] = useState(null);
  const [query, setQuery] = useState('');

  // ─── Fetch data ───────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [subs, status] = await Promise.all([
        API.get('/admin/subscribers/'),
        API.get('/site-status/'),
      ]);
      setData(subs.data);
      setSiteLive(!!status.data.is_live);
    } catch (e) {
      setError(
        e?.response?.status === 403
          ? 'Admin access required.'
          : 'Failed to load dashboard.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Fetch only when we know the user is staff ─
  useEffect(() => {
    if (!authLoading && user?.is_staff) {
      fetchAll();
    }
  }, [authLoading, user, fetchAll]);

  // ─── Redirect non-staff users ────────────────
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      nav('/login', { replace: true });
      return;
    }
    if (!user.is_staff) {
      nav('/', { replace: true });
    }
  }, [authLoading, user, nav]);

  const exportCSV = () => {
    const header = 'Email,Subscribed At';
    const rows = data.subscribers.map((s) =>
      `${s.email},${new Date(s.created_at).toISOString()}`
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

  const filtered = data.subscribers.filter((s) =>
    s.email.toLowerCase().includes(query.toLowerCase())
  );

  // ─── Loading / guard screens ─────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen grid place-items-center bg-blush-50 text-mulberry/60">
        <Sparkles className="animate-pulse text-rose-400" size={28} />
      </div>
    );
  }

  if (!user?.is_staff) {
    return (
      <div className="min-h-screen grid place-items-center bg-blush-50 text-mulberry/60">
        <div className="text-center">
          <ShieldAlert size={28} className="mx-auto text-rose-400 mb-3" />
          <p className="font-serif text-lg">Admin access required</p>
          <p className="text-sm text-mulberry/50 mt-1">Redirecting…</p>
        </div>
      </div>
    );
  }

  // ─── Main render ─────────────────────────────
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <button
            onClick={() => nav('/')}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-mulberry/50 hover:text-rose-600 transition mb-3"
          >
            <ArrowLeft size={12} /> Back to site
          </button>
          <h1 className="font-serif text-3xl md:text-4xl text-mulberry">
            Admin Dashboard
          </h1>
          <p className="text-mulberry/60 mt-1 text-sm">
            Welcome, {user.display_name || user.username}. Manage your audience.
          </p>
        </div>
        <button onClick={fetchAll} className="btn-ghost !py-2 !px-4 text-sm">
          <RefreshCw size={14} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid md:grid-cols-3 gap-5 mb-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-rose-400 to-blush-200 p-7 text-white shadow-card">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/20 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-white/85 text-xs uppercase tracking-[0.25em] mb-4">
              <Users size={14} /> Subscribers
            </div>
            <p className="font-serif text-5xl">{data.count}</p>
            <p className="text-white/80 text-sm mt-2">Women waiting for launch</p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-mulberry/50 mb-4">
            <TrendingUp size={14} className="text-rose-600" /> Site Status
          </div>
          {siteLive === null ? (
            <p className="text-mulberry/40 text-sm">Loading…</p>
          ) : siteLive ? (
            <>
              <p className="font-serif text-3xl text-green-600">Live</p>
              <p className="text-mulberry/60 text-sm mt-2">
                Visitors see the real homepage.
              </p>
            </>
          ) : (
            <>
              <p className="font-serif text-3xl text-rose-600">Coming Soon</p>
              <p className="text-mulberry/60 text-sm mt-2">
                Toggle in Django admin to launch.
              </p>
            </>
          )}
        </div>

        <div className="card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-mulberry/50 mb-4">
              <Download size={14} className="text-rose-600" /> Export
            </div>
            <p className="font-serif text-3xl">{data.count}</p>
            <p className="text-mulberry/60 text-sm mt-2">
              Download the full list as CSV.
            </p>
          </div>
          <button
            onClick={exportCSV}
            disabled={!data.count}
            className="btn-primary mt-5 w-full !py-2.5 text-sm disabled:opacity-40"
          >
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-red-50 text-red-600 text-sm mb-6">
          <ShieldAlert size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Subscribers table */}
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-2xl">Subscribers</h2>
            <span className="text-xs uppercase tracking-widest text-mulberry/40">
              {filtered.length} of {data.count}
            </span>
          </div>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search email…"
              className="input !py-2 !pl-10 !pr-4 text-sm w-64"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-mulberry/50">
            <Sparkles className="animate-pulse mx-auto mb-3 text-rose-400" size={24} />
            Loading subscribers…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Mail size={28} className="mx-auto text-rose-400 mb-3" />
            <p className="font-serif text-lg text-mulberry">
              {data.count === 0 ? 'No subscribers yet.' : 'No matches.'}
            </p>
            <p className="text-sm text-mulberry/50 mt-1">
              {data.count === 0
                ? "They'll appear here as soon as someone signs up."
                : 'Try a different search.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
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
                {filtered.map((s, i) => (
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
        )}
      </div>
    </section>
  );
}