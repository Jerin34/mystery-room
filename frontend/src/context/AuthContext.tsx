import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  quickDemoLogin: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.getCurrentUser();
        if (res && res.user) {
          setUser(res.user);
        } else {
          localStorage.removeItem('token');
        }
      } catch (err) {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.login({ email, password: pass });
    if (res.token) {
      localStorage.setItem('token', res.token);
    }
    setUser(res.user);
  };

  const register = async (name: string, email: string, pass: string) => {
    const res = await api.register({ displayName: name, email, password: pass });
    if (res.token) {
      localStorage.setItem('token', res.token);
    }
    setUser(res.user);
  };

  const quickDemoLogin = async () => {
    // Generate an automatic detective credential for instant friction-free testing
    const demoEmail = `investigator_${Math.floor(Math.random() * 9000 + 1000)}@mystery.test`;
    const demoPass = 'DetectiveSecret#2026';
    try {
      await register('Detective Inspector Holmes', demoEmail, demoPass);
    } catch {
      await login(demoEmail, demoPass);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, quickDemoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
