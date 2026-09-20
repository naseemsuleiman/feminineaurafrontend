import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Check, Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

export default function Signup() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  // Password strength
  const strength = getStrength(form.password);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!agree) return setErr('Please accept the terms to continue.');
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      nav('/budget-tracker');
    } catch (e) {
      setErr(prettyErr(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Join the circle."
      subtitle="Create your sanctuary — self-love, glow, and financial grace await."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-rose-600 font-medium hover:underline">
            Login here
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

        {/* Email */}
        <label className="block">
          <span className="text-sm font-medium text-mulberry">
            Email <span className="text-xs text-mulberry/50">(optional)</span>
          </span>
          <div className="auth-input-wrap mt-2">
            <Mail size={16} className="auth-input-icon" />
            <input
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
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
              minLength={6}
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 6 characters"
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

          {/* Strength meter */}
          {form.password && (
            <div className="mt-3 animate-fade-in">
              <div className="flex gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      i < strength.score ? strength.color : 'bg-blush-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs mt-2 text-mulberry/60">
                Strength: <span className={`font-medium ${strength.text}`}>{strength.label}</span>
              </p>
            </div>
          )}
        </label>

        {/* Terms */}
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-blush-200 text-rose-600 focus:ring-rose-400"
          />
          <span className="text-sm text-mulberry/70 leading-relaxed">
            I agree to the{' '}
            <a href="#" className="text-rose-600 hover:underline">Terms</a> and{' '}
            <a href="#" className="text-rose-600 hover:underline">Privacy Policy</a>.
          </span>
        </label>

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
              Creating your sanctuary…
            </>
          ) : (
            <>
              Create Account
              <Sparkles size={18} className="ml-2 group-hover:rotate-12 transition" />
            </>
          )}
        </button>

        {/* Trust row */}
        <div className="flex items-center justify-center gap-4 pt-2 text-[11px] uppercase tracking-widest text-mulberry/40">
          <span className="flex items-center gap-1">
            <Check size={12} className="text-rose-600" /> Free forever
          </span>
          <span className="flex items-center gap-1">
            <Check size={12} className="text-rose-600" /> No spam
          </span>
          <span className="flex items-center gap-1">
            <Check size={12} className="text-rose-600" /> Cancel anytime
          </span>
        </div>
      </form>
    </AuthLayout>
  );
}

/* ─────────── helpers ─────────── */
function getStrength(pw) {
  if (!pw) return { score: 0, label: '—', color: 'bg-blush-200', text: '' };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { label: 'Too weak', color: 'bg-red-400', text: 'text-red-500' },
    { label: 'Weak', color: 'bg-orange-400', text: 'text-orange-500' },
    { label: 'Fair', color: 'bg-yellow-400', text: 'text-yellow-600' },
    { label: 'Strong', color: 'bg-green-400', text: 'text-green-600' },
    { label: 'Beautiful & strong', color: 'bg-green-500', text: 'text-green-600' },
  ];
  return { score, ...levels[score] };
}

function prettyErr(e) {
  const data = e?.response?.data;
  if (!data) return 'Something went wrong. Please try again.';
  if (typeof data === 'string') return data;
  // Flatten DRF field errors
  const first = Object.entries(data)[0];
  if (!first) return 'Something went wrong.';
  const [field, msgs] = first;
  const text = Array.isArray(msgs) ? msgs[0] : msgs;
  return `${field}: ${text}`;
}