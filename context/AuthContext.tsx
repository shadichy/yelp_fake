"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: number;
  email: string;
  user_type: "PATIENT" | "THERAPIST" | "ADMIN";
  verified: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      // 1. Check if system is initialized
      try {
        const setupRes = await api.get<{ initialized: boolean }>('/setup/status');
        if (!setupRes.data.initialized) {
          if (pathname !== '/setup') {
            router.push('/setup');
          }
          setIsLoading(false);
          return; // Stop here if setup is needed
        } else {
            // If initialized and we are on setup page, go to login
            if (pathname === '/setup') {
                router.push('/login');
            }
        }
      } catch (e) {
        console.error("Failed to check setup status", e);
        // Fallback? Assuming initialized if check fails to avoid blocking the app?
        // Or block it?
      }

      // 2. Check User Auth
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get<User>('/users/me');
          setUser(res.data);
        } catch (error) {
          console.error("Auth check failed", error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, [pathname, router]);

  const login = async (token: string) => {
    localStorage.setItem('token', token);
    try {
        const res = await api.get<User>('/users/me');
        setUser(res.data);
        if (res.data.user_type === 'THERAPIST') {
            router.push('/dashboard/therapist');
        } else {
            router.push('/dashboard/patient');
        }
    } catch (e) {
        console.error("Failed to fetch user details on login", e);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
