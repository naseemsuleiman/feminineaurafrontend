import { useState } from 'react';
import BudgetTracker from '../components/BudgetTracker';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function BudgetPage() {
  const today = new Date();
  const [month, setMonth] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  );
  const { user, loading } = useAuth();

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <p className="uppercase tracking-[0.3em] text-xs text-rose-600 mb-4">Financial Empowerment</p>
        <h1 className="section-title">30-Day Budget Tracker</h1>
        <p className="text-mulberry/60 mt-3 max-w-2xl mx-auto">
          Financial freedom is self-care. Track daily, spend intentionally, glow quietly.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="input max-w-xs text-center"
        />
      </div>

      {loading ? null : user ? (
        <BudgetTracker month={month} />
      ) : (
        <div className="card max-w-md mx-auto text-center">
          <h3 className="font-serif text-2xl mb-3">Sign in to track</h3>
          <p className="text-mulberry/60 mb-6">Your budget is private and personal.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/login" className="btn-ghost">Login</Link>
            <Link to="/signup" className="btn-primary">Create Account</Link>
          </div>
        </div>
      )}
    </section>
  );
}