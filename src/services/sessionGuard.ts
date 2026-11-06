import type { AuthUser } from "@/src/services/auth.services";

export const LOGIN_PATH = "/login";
export const CHANGE_PASSWORD_PATH = "/cambiar-contrasena";

/**
 * Fase 6.32 (D7): a dónde mandar a quien abre una pantalla protegida.
 * Sin token, al login; con contraseña temporal, a cambiarla; si no, a
 * ningún lado. Sólo experiencia de usuario: el backend sigue respondiendo
 * 401 o 403 PASSWORD_CHANGE_REQUIRED aunque esta guardia no exista.
 */
export function sessionRedirect(token: string | null, user: Pick<AuthUser, "must_change_password"> | null): string | null {
  if (!token) return LOGIN_PATH;
  if (user?.must_change_password === true) return CHANGE_PASSWORD_PATH;
  return null;
}
