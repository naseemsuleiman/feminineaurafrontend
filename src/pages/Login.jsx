// Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await login(form.username, form.password);
      nav('/budget-tracker');
    } catch {
      setErr('Invalid credentials.');
    }
  };

  return (
    <section className="max-w-md mx-auto px-6 py-20">
      <div className="card">
        <h1 className="font-serif text-3xl mb-6 text-center">Welcome back</h1>
        <form onSubmit={submit} className="space-y-4">
          <input className="input" placeholder="Username" value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          <input className="input" type="password" placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {err && <p className="text-red-500 text-sm">{err}</p>}
          <button className="btn-primary w-full">Login</button>
        </form>
        <p className="text-sm text-center text-mulberry/60 mt-6">
          New here? <Link to="/signup" className="text-rose-600 font-medium">Create account</Link>
        </p>
      </div>
    </section>
  );
}