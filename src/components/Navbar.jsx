import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const link = ({ isActive }) =>
    `px-4 py-2 text-sm font-medium tracking-wide rounded-full transition ${
      isActive ? 'bg-blush-100 text-rose-600' : 'text-mulberry hover:bg-blush-100'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-blush-50/80 backdrop-blur border-b border-blush-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
<Link to="/" className="flex items-center gap-3">
  <img
    src="/logo.png"
    alt="Feminine Aura"
    className="w-10 h-10 rounded-full object-cover shadow-soft"
  />
  <span className="font-serif text-xl text-mulberry">Feminine Aura</span>
</Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" end className={link}>Home</NavLink>
          <NavLink to="/empowerment" className={link}>Empowerment Hub</NavLink>
          <NavLink to="/budget-tracker" className={link}>Budget Tracker</NavLink>
          <NavLink to="/wisdom" className={link}>Daily Wisdom</NavLink>
          <NavLink to="/community" className={link}>Community</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:block text-sm text-rose-600 font-medium">
                Hi, {user.display_name || user.username}
              </span>
              <button onClick={logout} className="btn-ghost !px-4 !py-2 text-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost !px-4 !py-2 text-sm">Login</Link>
              <Link to="/signup" className="btn-primary !px-4 !py-2 text-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}