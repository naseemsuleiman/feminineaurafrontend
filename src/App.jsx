import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import Footer from './components/Footer';
import useSiteStatus from './hooks/useSiteStatus';

import Home from './pages/Home';
import ComingSoonPage from './pages/ComingSoonPage';
import BudgetPage from './pages/BudgetPage';
import ArticlesPage from './pages/ArticlesPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Wisdom from './pages/Wisdom';
import Community from './pages/Community';
import AdminDashboard from './pages/AdminDashboard';

function SiteGate() {
  const { isLive, loading } = useSiteStatus();
  const { user, loading: authLoading } = useAuth();

  if (loading || authLoading) {
    return (
      <div className="min-h-screen grid place-items-center bg-blush-50 text-mulberry/40">
        <div className="animate-pulse font-serif text-2xl">Feminine Aura</div>
      </div>
    );
  }

  const isAdmin = !!user?.is_staff;
  const showRealSite = isLive || isAdmin;

  /* ─────────────────────────────────────────────
     NOT LIVE + NOT ADMIN → Coming Soon + auth + tracker
     The tracker is always reachable so paid users can
     complete the Paystack return trip.
  ───────────────────────────────────────────── */
  if (!showRealSite) {
    return (
      <Routes>
        <Route path="/" element={<ComingSoonPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Reachable so users returning from Paystack aren't bounced */}
        <Route path="/budget-tracker" element={<BudgetPage />} />
        {/* Admins can still land on their dashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  /* ─────────────────────────────────────────────
     ADMIN LAYOUT → dark navbar, no public footer
  ───────────────────────────────────────────── */
  if (isAdmin) {
    return (
      <Routes>
        {/* Admin shell */}
        <Route
          path="/admin-dashboard"
          element={
            <div className="min-h-screen flex flex-col bg-blush-50">
              <AdminNavbar />
              <main className="flex-1">
                <AdminDashboard />
              </main>
            </div>
          }
        />

        {/* Admin browsing the public site */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/empowerment" element={<ArticlesPage />} />
                  <Route path="/budget-tracker" element={<BudgetPage />} />
                  <Route path="/wisdom" element={<Wisdom />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    );
  }

  /* ─────────────────────────────────────────────
     REGULAR VISITOR — site is live
  ───────────────────────────────────────────── */
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/empowerment" element={<ArticlesPage />} />
          <Route path="/budget-tracker" element={<BudgetPage />} />
          <Route path="/wisdom" element={<Wisdom />} />
          <Route path="/community" element={<Community />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SiteGate />
      </BrowserRouter>
    </AuthProvider>
  );
}