// Signup.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await register(form.username, form.email, form.password);
      nav('/budget-tracker');
    } catch (e) {
      setErr(JSON.stringify(e.response?.data || 'Registration failed'));
    }
  };

  return (
    <section className="max-w-md mx-auto px-6 py-20">
      <div className="card">
        <h1 className="font-serif text-3xl mb-6 text-center">Join Feminine Aura</h1>
        <form onSubmit={submit} className="space-y-4">
          <input className="input" placeholder="Username" value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          <input className="input" type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" type="password" placeholder="Password (min 6)" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
          {err && <p className="text-red-500 text-sm">{err}</p>}
          <button className="btn-primary w-full">Create Account</button>
        </form>
        <p className="text-sm text-center text-mulberry/60 mt-6">
          Already have one? <Link to="/login" className="text-rose-600 font-medium">Login</Link>
        </p>
      </div>
    </section>
  );
}