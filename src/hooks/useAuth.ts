import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import {
  login as authLogin,
  loginWithGoogle as authLoginWithGoogle,
  logout as authLogout,
  onAuthStateChanged,
} from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await authLogin(email, password);
  };

  const loginWithGoogle = async () => {
    await authLoginWithGoogle();
  };

  const logout = async () => {
    await authLogout();
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    logout,
  };
}
