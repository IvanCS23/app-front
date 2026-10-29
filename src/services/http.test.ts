import { beforeEach, describe, expect, it, vi } from "vitest";
import { FORBIDDEN_MESSAGE, translateApiMessage } from "./http";
import { getUsers } from "./users";
import { getClients } from "./client.services";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

describe("mensajes del framework en español (Fase 6.27b)", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("api_token", "token-http");
    vi.restoreAllMocks();
  });

  it("traduce los mensajes en inglés de Laravel y respeta los propios", () => {
    expect(translateApiMessage("This action is unauthorized.", 403)).toBe(FORBIDDEN_MESSAGE);
    expect(translateApiMessage("Unauthenticated.", 401)).toBe("Tu sesión terminó. Inicia sesión de nuevo.");
    expect(translateApiMessage("Too Many Attempts.", 429)).toContain("Demasiados intentos");
    expect(translateApiMessage("Tu cuenta está desactivada. Contacta a un administrador.", 403)).toBe("Tu cuenta está desactivada. Contacta a un administrador.");
    expect(translateApiMessage(undefined, 403)).toBe(FORBIDDEN_MESSAGE);
    expect(translateApiMessage("", 500, "No se pudo")).toBe("No se pudo");
  });

  it("Usuarios y Clientes muestran el 403 de autorización en español", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async () => jsonResponse({ message: "This action is unauthorized." }, 403));

    await expect(getUsers({})).rejects.toThrow(FORBIDDEN_MESSAGE);
    await expect(getClients()).rejects.toThrow(FORBIDDEN_MESSAGE);
  });
});
