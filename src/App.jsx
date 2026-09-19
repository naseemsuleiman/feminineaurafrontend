import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BudgetPage from './pages/BudgetPage';
import ArticlesPage from './pages/ArticlesPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Wisdom from './pages/Wisdom';
import Community from './pages/Community';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}