"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  clearSession,
  getMeRequest,
  getToken,
  getUser,
  loginRequest,
  logoutRequest,
  saveSession,
  saveUser,
  type AuthUser,
  type LoginCredentials,
} from "@/src/services/auth.services";

export interface AuthContextValue {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const cachedUser = getUser();

    if (cachedUser) {
      setUserState(cachedUser);
      setLoading(false);
    }

    if (!token) {
      setLoading(false);
      return;
    }

    getMeRequest(token)
      .then((freshUser) => {
        setUserState(freshUser);
        saveUser(freshUser);
      })
      .catch(() => {
        clearSession();
        setUserState(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const setUser = useCallback((next: AuthUser | null) => {
    setUserState(next);
    if (next) {
      saveUser(next);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const { token, user: loggedInUser } = await loginRequest(credentials);
    saveSession(token, loggedInUser);
    setUserState(loggedInUser);
  }, []);

  const logout = useCallback(async () => {
    const token = getToken();
    if (token) {
      try {
        await logoutRequest(token);
      } catch (error) {
        console.error("No se pudo cerrar sesión en el backend:", error);
      }
    }
    clearSession();
    setUserState(null);
    router.push("/login");
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      setUser,
      loading,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user, setUser, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
