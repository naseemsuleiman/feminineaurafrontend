import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import API from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load authenticated user profile
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await API.get('/auth/me/');
      setUser(data);
    } catch (error) {
      // If fetching profile fails (e.g., invalid/expired token), clear local session
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Login handler
  const login = async (username, password) => {
    try {
      const { data } = await API.post('/auth/login/', { username, password });
      
      // Save JWT tokens
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);

      // Fetch user profile with new access token
      await loadUser();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Login failed. Please check your credentials.',
      };
    }
  };

  // Registration handler
  const register = async (username, email, password) => {
    try {
      await API.post('/auth/register/', { username, email, password });
      
      // Automatically log user in after successful registration
      return await login(username, password);
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Registration failed.',
      };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        loadUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};