import { API_URL } from "@/src/config/api";
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export async function loginRequest(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const err = data as ApiError | null;
    const firstError =
      err?.errors?.email?.[0] ??
      err?.errors?.password?.[0] ??
      err?.message ??
      "Error al iniciar sesión.";
    throw new Error(firstError);
  }

  return data as LoginResponse;
}

export async function logoutRequest(token: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const message =
      (data as ApiError)?.message ?? "No se pudo cerrar sesión.";
    throw new Error(message);
  }
}

export function saveSession(token: string, user: AuthUser): void {
  localStorage.setItem("api_token", token);
  localStorage.setItem("auth_user", JSON.stringify(user));
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("api_token");
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("auth_user");
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

export function clearSession(): void {
  localStorage.removeItem("api_token");
  localStorage.removeItem("auth_user");
}
