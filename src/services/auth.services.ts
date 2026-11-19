import { API_URL } from "@/src/config/api";
import { translateApiMessage } from "@/src/services/http";
export interface LoginCredentials {
  email: string;
  password: string;
}

export type CompanyIntegrationStatus = "pending" | "connected" | "disconnected" | "error";

export interface AuthCompany {
  id: number;
  nombre: string;
  rfc: string | null;
  plan: string | null;
  integration_status: CompanyIntegrationStatus;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  /** Fase 6.32: contraseña temporal; Laravel bloquea casi todo hasta cambiarla. */
  must_change_password?: boolean;
  company: AuthCompany | null;
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

/**
 * Fase 6.35 (D10): error de GET /api/user con su código HTTP (null si no
 * hubo respuesta: error de red). Sólo un 401 significa que la sesión
 * terminó; un 429 o un 5xx no.
 */
export class AuthRequestError extends Error {
  constructor(message: string, public readonly status: number | null) {
    super(message);
    this.name = "AuthRequestError";
  }
}

export async function getMeRequest(token: string): Promise<AuthUser> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
  } catch {
    throw new AuthRequestError("No se pudo conectar con el servidor.", null);
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const message =
      (data as ApiError)?.message ?? "No se pudo obtener el usuario.";
    throw new AuthRequestError(message, res.status);
  }

  const data = (await res.json()) as { user: AuthUser };
  return data.user;
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

/**
 * Fase 6.32: error de un formulario de la cuenta. Trae los errores por campo
 * del 422 de Laravel para mostrarlos junto a cada campo.
 */
export class AccountFormError extends Error {
  status: number;
  errors: Record<string, string[]>;

  constructor(message: string, status: number, errors: Record<string, string[]> = {}) {
    super(message);
    this.name = "AccountFormError";
    this.status = status;
    this.errors = errors;
  }
}

async function accountFormError(res: Response, fallback: string): Promise<AccountFormError> {
  const data = (await res.json().catch(() => null)) as ApiError | null;

  return new AccountFormError(translateApiMessage(data?.message, res.status, fallback), res.status, data?.errors ?? {});
}

export interface ChangeMyPasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

/**
 * Fase 6.32: PUT /api/me/password. El token rota (D1): la respuesta trae uno
 * nuevo y el anterior deja de servir en cualquier cliente.
 */
export async function changeMyPasswordRequest(token: string, payload: ChangeMyPasswordPayload): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/api/me/password`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw await accountFormError(res, "No se pudo cambiar la contraseña.");
  }

  return (await res.json()) as LoginResponse;
}

/**
 * Fase 6.32: POST /api/password/forgot. Laravel responde lo mismo exista o
 * no el correo; se muestra tal cual.
 */
export async function forgotPasswordRequest(email: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/password/forgot`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw await accountFormError(res, "No se pudo enviar el enlace. Intenta de nuevo más tarde.");
  }

  const data = (await res.json().catch(() => null)) as { message?: string } | null;
  return data?.message ?? "Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña.";
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

/** Fase 6.32: POST /api/password/reset con el token del enlace del correo. */
export async function resetPasswordRequest(payload: ResetPasswordPayload): Promise<string> {
  const res = await fetch(`${API_URL}/api/password/reset`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw await accountFormError(res, "No se pudo restablecer la contraseña.");
  }

  const data = (await res.json().catch(() => null)) as { message?: string } | null;
  return data?.message ?? "Tu contraseña se restableció. Inicia sesión con la nueva.";
}

export function saveSession(token: string, user: AuthUser): void {
  localStorage.setItem("api_token", token);
  localStorage.setItem("auth_user", JSON.stringify(user));
}

export function saveUser(user: AuthUser): void {
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
