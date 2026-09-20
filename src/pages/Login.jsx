import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      nav('/budget-tracker');
    } catch {
      setErr('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back, gorgeous."
      subtitle="Your sanctuary is waiting. Pick up where you left off."
      footer={
        <>
          New here?{' '}
          <Link to="/signup" className="text-rose-600 font-medium hover:underline">
            Create your account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5 animate-fade-up" style={{ animationDelay: '0.15s' }}>
        {/* Username */}
        <label className="block">
          <span className="text-sm font-medium text-mulberry">Username</span>
          <div className="auth-input-wrap mt-2">
            <User size={16} className="auth-input-icon" />
            <input
              type="text"
              required
              autoComplete="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="your beautiful name"
              className="input !pl-11 !py-3"
            />
          </div>
        </label>

        {/* Password */}
        <label className="block">
          <span className="text-sm font-medium text-mulberry">Password</span>
          <div className="auth-input-wrap mt-2">
            <Lock size={16} className="auth-input-icon" />
            <input
              type={showPw ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="input !pl-11 !pr-11 !py-3"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-mulberry/40 hover:text-rose-600 transition"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>

        {/* Remember + forgot */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded border-blush-200 text-rose-600 focus:ring-rose-400"
            />
            <span className="text-mulberry/70">Remember me</span>
          </label>
          <a href="#" className="text-rose-600 hover:underline">Forgot password?</a>
        </div>

        {/* Error */}
        {err && (
          <div className="flex items-start gap-2 px-4 py-3 rounded-2xl bg-red-50 text-red-600 text-sm animate-fade-up">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{err}</span>
          </div>
        )}

        {/* Submit */}
        <button
          disabled={loading}
          className="btn-primary btn-shimmer w-full !py-3.5 text-base group disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />
              Signing you in…
            </>
          ) : (
            <>
              Login
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition" />
            </>
          )}
        </button>

        {/* Trust row */}
        <div className="flex items-center justify-center gap-4 pt-2 text-[11px] uppercase tracking-widest text-mulberry/40">
          <span className="flex items-center gap-1">
            <Check size={12} className="text-rose-600" /> Private
          </span>
          <span className="flex items-center gap-1">
            <Check size={12} className="text-rose-600" /> Secure
          </span>
          <span className="flex items-center gap-1">
            <Check size={12} className="text-rose-600" /> Yours
          </span>
        </div>
      </form>
    </AuthLayout>
  );
}