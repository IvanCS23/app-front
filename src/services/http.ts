
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

/** Fase 6.32: código del 403 de Laravel mientras la contraseña sea temporal. */
export const PASSWORD_CHANGE_REQUIRED = "PASSWORD_CHANGE_REQUIRED";

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

/**
 * Fase 6.32: mientras must_change_password esté activo, Laravel responde
 * 403 PASSWORD_CHANGE_REQUIRED a casi todas las rutas. Cada servicio ya
 * muestra el mensaje (en español); esto además avisa a la sesión para
 * llevar al usuario a /cambiar-contrasena, venga de donde venga la llamada.
 *
 * Es sólo experiencia de usuario (D7): quien decide es el backend. Devuelve
 * la función que deshace la envoltura de fetch.
 */
export function watchPasswordChangeRequired(apiUrl: string, onRequired: () => void): () => void {
  const original = window.fetch;

  const wrapped: typeof fetch = async (input, init) => {
    const response = await original.call(window, input, init);

    if (response.status === 403 && requestUrl(input).startsWith(apiUrl)) {
      response
        .clone()
        .json()
        .then((body: { code?: unknown } | null) => {
          if (body?.code === PASSWORD_CHANGE_REQUIRED) onRequired();
        })
        .catch(() => undefined);
    }

    return response;
  };

  window.fetch = wrapped;

  return () => {
    if (window.fetch === wrapped) window.fetch = original;
  };
}
