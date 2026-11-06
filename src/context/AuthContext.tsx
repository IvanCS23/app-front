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
import { API_URL } from "@/src/config/api";
import { watchPasswordChangeRequired } from "@/src/services/http";
import {
  changeMyPasswordRequest,
  clearSession,
  getMeRequest,
  getToken,
  getUser,
  loginRequest,
  logoutRequest,
  saveSession,
  saveUser,
  type AuthUser,
  type ChangeMyPasswordPayload,
  type LoginCredentials,
} from "@/src/services/auth.services";

export interface AuthContextValue {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  loading: boolean;
  isAuthenticated: boolean;
  /** Fase 6.32: contraseña temporal pendiente de cambiar. */
  mustChangePassword: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  /** Fase 6.32: cambia la propia contraseña y guarda el token nuevo (D1). */
  changePassword: (payload: ChangeMyPasswordPayload) => Promise<AuthUser>;
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

  // Fase 6.32: un 403 PASSWORD_CHANGE_REQUIRED de cualquier llamada marca la
  // sesión; la guardia de AppLayout lleva entonces a /cambiar-contrasena.
  useEffect(
    () =>
      watchPasswordChangeRequired(API_URL, () => {
        setUserState((current) => {
          if (!current || current.must_change_password) return current;
          const next = { ...current, must_change_password: true };
          saveUser(next);
          return next;
        });
      }),
    []
  );

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
    return loggedInUser;
  }, []);

  const changePassword = useCallback(async (payload: ChangeMyPasswordPayload) => {
    const token = getToken();
    if (!token) throw new Error("Tu sesión terminó. Inicia sesión de nuevo.");

    const { token: rotatedToken, user: updatedUser } = await changeMyPasswordRequest(token, payload);
    saveSession(rotatedToken, updatedUser);
    setUserState(updatedUser);
    return updatedUser;
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
      mustChangePassword: user?.must_change_password === true,
      login,
      changePassword,
      logout,
    }),
    [user, setUser, loading, login, changePassword, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
