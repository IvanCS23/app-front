import { render, screen, waitFor } from "@testing-library/react";
import { useContext } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthContext, AuthProvider } from "./AuthContext";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn(), replace: vi.fn() }) }));

const cachedUser = { id: 7, name: "Admin E2E", email: "admin@example.com", must_change_password: false };

function Probe() {
  const auth = useContext(AuthContext);
  return <p data-testid="probe">{auth?.loading ? "cargando" : (auth?.user?.name ?? "sin usuario")}</p>;
}

// AuthProvider envuelve window.fetch (aviso de contraseña temporal, 6.32): se
// verifica sobre el espía original.
let fetchSpy: ReturnType<typeof vi.fn>;

function mockMe(response: (() => Promise<Response>) | Response) {
  fetchSpy = vi.fn(async () => (typeof response === "function" ? response() : response));
  vi.stubGlobal("fetch", fetchSpy);
}

beforeEach(() => {
  localStorage.setItem("api_token", "token-valido");
  localStorage.setItem("auth_user", JSON.stringify(cachedUser));
});

afterEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
});

describe("GET /api/user al cargar (Fase 6.35, D10)", () => {
  it.each([
    ["429 (límite de peticiones)", () => mockMe(new Response(JSON.stringify({ message: "Too Many Attempts." }), { status: 429 }))],
    ["500", () => mockMe(new Response(JSON.stringify({ message: "Server Error" }), { status: 500 }))],
    ["error de red", () => mockMe(() => Promise.reject(new TypeError("Failed to fetch")))],
  ])("con %s conserva el token y el usuario guardado", async (_label, arrange) => {
    arrange();
    render(<AuthProvider><Probe /></AuthProvider>);

    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByTestId("probe")).toHaveTextContent("Admin E2E"));
    expect(localStorage.getItem("api_token")).toBe("token-valido");
    expect(localStorage.getItem("auth_user")).not.toBeNull();
  });

  it("con 401 cierra la sesión", async () => {
    mockMe(new Response(JSON.stringify({ message: "Unauthenticated." }), { status: 401 }));
    render(<AuthProvider><Probe /></AuthProvider>);

    await waitFor(() => expect(localStorage.getItem("api_token")).toBeNull());
    expect(localStorage.getItem("auth_user")).toBeNull();
    expect(screen.getByTestId("probe")).toHaveTextContent("sin usuario");
  });

  it("con 200 actualiza el usuario", async () => {
    mockMe(new Response(JSON.stringify({ user: { ...cachedUser, name: "Nombre nuevo" } }), { status: 200 }));
    render(<AuthProvider><Probe /></AuthProvider>);

    await waitFor(() => expect(screen.getByTestId("probe")).toHaveTextContent("Nombre nuevo"));
    expect(localStorage.getItem("api_token")).toBe("token-valido");
  });
});
