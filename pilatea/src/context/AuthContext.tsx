"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { login as apiLogin, register as apiRegister, logout as apiLogout, getUser } from "@/lib/api";
import type { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<User>;
  register: (data: Record<string, string>) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("customer_token");
    if (token) {
      getUser<{ data?: User }>()
        .then(res => setUser(res.data || (res as unknown as User)))
        .catch(() => localStorage.removeItem("customer_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (data: { email: string; password: string }) => {
    const res = await apiLogin<{ token: string; user: User }>(data);
    localStorage.setItem("customer_token", res.token);
    setUser(res.user);
    return res;
  }, []);

  const register = useCallback(async (data: Record<string, string>) => {
    const res = await apiRegister<{ token: string; user: User }>(data);
    localStorage.setItem("customer_token", res.token);
    setUser(res.user);
    return res;
  }, []);

  const logout = useCallback(async () => {
    try { await apiLogout(); } catch { /* ignore */ }
    localStorage.removeItem("customer_token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}