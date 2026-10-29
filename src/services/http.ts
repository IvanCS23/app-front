
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("api_token");
}
export function getAuthHeaders() {
  const token = getToken();
  if (!token) throw new Error("No hay sesión activa");

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
}

/**
 * Fase 6.27b: mensajes del framework (Laravel) que llegan en inglés,
 * traducidos para el usuario. Un 403 sin mensaje se explica igual.
 */
const FRAMEWORK_MESSAGES: Record<string, string> = {
  "This action is unauthorized.": "No tienes permiso para realizar esta acción. Pide a un administrador que la realice.",
  "Unauthenticated.": "Tu sesión terminó. Inicia sesión de nuevo.",
  "Too Many Attempts.": "Demasiados intentos. Espera un momento y vuelve a intentarlo.",
  "Server Error": "Ocurrió un error en el servidor. Intenta de nuevo más tarde.",
};

export const FORBIDDEN_MESSAGE = FRAMEWORK_MESSAGES["This action is unauthorized."];

/** Sin mensaje: el propio del servicio (`fallback`) o, si no hay, uno según el estado. */
export function translateApiMessage(message: unknown, status?: number, fallback?: string): string {
  const text = typeof message === "string" ? message.trim() : "";

  if (text !== "") return FRAMEWORK_MESSAGES[text] ?? text;

  return fallback ?? (status === 403 ? FORBIDDEN_MESSAGE : "No fue posible completar la operación.");
}
