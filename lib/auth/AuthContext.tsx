"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/api/client";

export type AuthUser = {
  id: string;
  nickname: string | null;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  phone: string | null;
  status: "active" | "pending" | "suspended";
  verified: boolean;
  isActive: boolean;
  role: string | null;
  roles: string[];
  createdAt: string;
};

type LoginResponse = { user: AuthUser; accessToken: string; refreshToken: string; sessionId?: string };

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string, role: "investor" | "business") => Promise<AuthUser>;
  logout: () => Promise<void>;
};

const STORAGE_KEY = "aurex:auth";

const AuthContext = createContext<AuthContextValue | null>(null);

type StoredAuth = { user: AuthUser; sessionId?: string };

type AuthState = { user: AuthUser | null; isLoading: boolean };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, isLoading: true });
  const sessionIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    let next: AuthState = { user: null, isLoading: false };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as StoredAuth;
        sessionIdRef.current = stored.sessionId;
        next = { user: stored.user, isLoading: false };
      }
    } catch {
      // empty
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(next);
  }, []);

  const persist = (next: LoginResponse) => {
    sessionIdRef.current = next.sessionId;
    const stored: StoredAuth = { user: next.user, sessionId: next.sessionId };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // empty
    }
    setState({ user: next.user, isLoading: false });
  };

  const login = async (email: string, password: string, role: "investor" | "business") => {
    const { data } = await apiFetch<LoginResponse>("/auth/login", { method: "POST", body: { email, password, role } });
    persist(data);
    return data.user;
  };

  const logout = async () => {
    if (sessionIdRef.current) {
      try {
        await apiFetch("/auth/logout", {
          method: "POST",
          body: { sessionId: sessionIdRef.current },
        });
      } catch {
        // empty
      }
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // empty
    }
    sessionIdRef.current = undefined;
    setState({ user: null, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
