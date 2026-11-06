import type { ReactNode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "@/src/context/AuthContext";
import { API_URL } from "@/src/config/api";
import { PASSWORD_CHANGE_REQUIRED, watchPasswordChangeRequired } from "@/src/services/http";
import { sessionRedirect } from "@/src/services/sessionGuard";
import { PASSWORD_CHANGED_MESSAGE } from "@/app/components/auth/ChangePasswordForm";
import CambiarContrasenaPage from "./page";
import LoginPage from "@/app/login/page";
import AppLayout from "@/app/components/layout/AppLayout";

const navigation = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn() }));

vi.mock("next/navigation", () => ({ useRouter: () => navigation, usePathname: () => "/pages/dashboard" }));
vi.mock("@/app/components/layout/Navbar", () => ({ default: () => <nav /> }));
vi.mock("@/app/components/layout/Sidebar", () => ({ default: () => <aside /> }));

const baseUser = { id: 7, name: "Vendedora", email: "vende@example.com", avatar: null, role: "sales", company: null };

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

type Route = (init: RequestInit | undefined) => Response;

function mockApi(routes: Record<string, Route>) {
  return vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const key = `${init?.method ?? "GET"} ${url.replace(API_URL, "")}`;
    const route = routes[key];
    if (!route) throw new Error(`Llamada inesperada: ${key}`);
    return route(init);
  });
}

function withAuth(children: ReactNode) {
  return <AuthProvider>{children}</AuthProvider>;
}

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  navigation.push.mockReset();
  navigation.replace.mockReset();
});

describe("guardia mínima de sesión (Fase 6.32, D7)", () => {
  it("decide a dónde ir: login sin token, cambiar contraseña con la bandera, nada si todo está bien", () => {
    expect(sessionRedirect(null, null)).toBe("/login");
    expect(sessionRedirect(null, { must_change_password: true })).toBe("/login");
    expect(sessionRedirect("t", { must_change_password: true })).toBe("/cambiar-contrasena");
    expect(sessionRedirect("t", { must_change_password: false })).toBeNull();
    expect(sessionRedirect("t", null)).toBeNull();
  });

  it("AppLayout manda al login a quien no tiene token y no muestra la pantalla", async () => {
    render(withAuth(<AppLayout><p>Contenido protegido</p></AppLayout>));

    await waitFor(() => expect(navigation.replace).toHaveBeenCalledWith("/login"));
    expect(screen.queryByText("Contenido protegido")).not.toBeInTheDocument();
  });

  it("AppLayout manda a cambiar la contraseña temporal", async () => {
    localStorage.setItem("api_token", "token-temporal");
    mockApi({ "GET /api/user": () => json({ user: { ...baseUser, must_change_password: true } }) });

    render(withAuth(<AppLayout><p>Contenido protegido</p></AppLayout>));

    await waitFor(() => expect(navigation.replace).toHaveBeenCalledWith("/cambiar-contrasena"));
    expect(screen.queryByText("Contenido protegido")).not.toBeInTheDocument();
  });

  it("AppLayout deja pasar una sesión normal", async () => {
    localStorage.setItem("api_token", "token-normal");
    mockApi({ "GET /api/user": () => json({ user: { ...baseUser, must_change_password: false } }) });

    render(withAuth(<AppLayout><p>Contenido protegido</p></AppLayout>));

    expect(await screen.findByText("Contenido protegido")).toBeInTheDocument();
    expect(navigation.replace).not.toHaveBeenCalled();
  });

  it("un 403 PASSWORD_CHANGE_REQUIRED de cualquier llamada lleva a cambiar la contraseña", async () => {
    localStorage.setItem("api_token", "token-normal");
    mockApi({
      "GET /api/user": () => json({ user: { ...baseUser, must_change_password: false } }),
      "GET /api/clients": () => json({ code: PASSWORD_CHANGE_REQUIRED, message: "Debes cambiar tu contraseña antes de continuar." }, 403),
    });

    render(withAuth(<AppLayout><p>Contenido protegido</p></AppLayout>));
    await screen.findByText("Contenido protegido");

    await window.fetch(`${API_URL}/api/clients`);

    await waitFor(() => expect(navigation.replace).toHaveBeenCalledWith("/cambiar-contrasena"));
    expect(JSON.parse(localStorage.getItem("auth_user") ?? "{}").must_change_password).toBe(true);
  });

  it("la envoltura de fetch ignora otros 403 y otros orígenes, y se puede quitar", async () => {
    const realFetch = window.fetch;
    const original = vi.fn(async (input: RequestInfo | URL) =>
      String(input).includes("/otro") ? json({ message: "This action is unauthorized." }, 403) : json({ code: PASSWORD_CHANGE_REQUIRED }, 403)
    );
    window.fetch = original as unknown as typeof fetch;
    const onRequired = vi.fn();

    const stop = watchPasswordChangeRequired(API_URL, onRequired);
    await window.fetch(`${API_URL}/api/otro`);
    await window.fetch("https://tercero.example/api/x");
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(onRequired).not.toHaveBeenCalled();

    await window.fetch(`${API_URL}/api/sales`);
    await waitFor(() => expect(onRequired).toHaveBeenCalledTimes(1));

    stop();
    expect(window.fetch).toBe(original);
    window.fetch = realFetch;
  });
});

describe("login con contraseña temporal (Fase 6.32)", () => {
  it("lleva directo a cambiar la contraseña", async () => {
    mockApi({ "POST /api/login": () => json({ token: "token-login", user: { ...baseUser, must_change_password: true } }) });
    const user = userEvent.setup();

    render(withAuth(<LoginPage />));
    await user.type(screen.getByLabelText("Correo electrónico"), "vende@example.com");
    await user.type(screen.getByLabelText("Contraseña"), "Temporal-2026");
    await user.click(screen.getByRole("button", { name: /Iniciar sesión/ }));

    await waitFor(() => expect(navigation.push).toHaveBeenCalledWith("/cambiar-contrasena"));
  });

  it("sin la bandera va al panel", async () => {
    mockApi({ "POST /api/login": () => json({ token: "token-login", user: { ...baseUser, must_change_password: false } }) });
    const user = userEvent.setup();

    render(withAuth(<LoginPage />));
    await user.type(screen.getByLabelText("Correo electrónico"), "vende@example.com");
    await user.type(screen.getByLabelText("Contraseña"), "Normal-2026");
    await user.click(screen.getByRole("button", { name: /Iniciar sesión/ }));

    await waitFor(() => expect(navigation.push).toHaveBeenCalledWith("/pages/dashboard"));
  });
});

describe("/cambiar-contrasena (Fase 6.32)", () => {
  async function fill(current: string, next: string, confirmation = next) {
    const user = userEvent.setup();
    await user.type(await screen.findByLabelText("Contraseña actual"), current);
    await user.type(screen.getByLabelText("Contraseña nueva"), next);
    await user.type(screen.getByLabelText("Confirmar contraseña nueva"), confirmation);
    await user.click(screen.getByRole("button", { name: "Cambiar contraseña" }));
  }

  it("sin sesión manda al login", async () => {
    render(withAuth(<CambiarContrasenaPage />));

    await waitFor(() => expect(navigation.replace).toHaveBeenCalledWith("/login"));
  });

  it("explica la contraseña temporal, guarda el token nuevo y entra al panel", async () => {
    localStorage.setItem("api_token", "token-temporal");
    let sent: Record<string, string> = {};
    let authorization = "";
    mockApi({
      "GET /api/user": () => json({ user: { ...baseUser, must_change_password: true } }),
      "PUT /api/me/password": (init) => {
        sent = JSON.parse(String(init?.body));
        authorization = new Headers(init?.headers).get("Authorization") ?? "";
        return json({ token: "token-rotado", user: { ...baseUser, must_change_password: false } });
      },
    });

    render(withAuth(<CambiarContrasenaPage />));
    expect(await screen.findByText(/cambia la contraseña temporal/)).toBeInTheDocument();

    await fill("Temporal-2026", "Nueva-Segura-2026!");

    await waitFor(() => expect(navigation.replace).toHaveBeenCalledWith("/pages/dashboard"));
    expect(sent).toEqual({ current_password: "Temporal-2026", password: "Nueva-Segura-2026!", password_confirmation: "Nueva-Segura-2026!" });
    expect(authorization).toBe("Bearer token-temporal");
    expect(localStorage.getItem("api_token")).toBe("token-rotado");
    expect(JSON.parse(localStorage.getItem("auth_user") ?? "{}").must_change_password).toBe(false);
  });

  it("muestra los errores de Laravel junto a cada campo y no toca el token", async () => {
    localStorage.setItem("api_token", "token-normal");
    mockApi({
      "GET /api/user": () => json({ user: { ...baseUser, must_change_password: false } }),
      "PUT /api/me/password": () =>
        json(
          {
            message: "La contraseña actual no es correcta.",
            errors: { current_password: ["La contraseña actual no es correcta."], password: ["La contraseña debe tener al menos un símbolo."] },
          },
          422
        ),
    });

    render(withAuth(<CambiarContrasenaPage />));
    await fill("equivocada", "SinSimbolos2026x");

    expect(await screen.findByText("La contraseña actual no es correcta.")).toBeInTheDocument();
    expect(screen.getByText("La contraseña debe tener al menos un símbolo.")).toBeInTheDocument();
    expect(screen.getByLabelText("Contraseña actual")).toHaveAttribute("aria-invalid", "true");
    expect(localStorage.getItem("api_token")).toBe("token-normal");
    expect(navigation.replace).not.toHaveBeenCalledWith("/pages/dashboard");
    expect(screen.queryByText(PASSWORD_CHANGED_MESSAGE)).not.toBeInTheDocument();
  });

  it("una confirmación distinta se avisa sin llamar a la API", async () => {
    localStorage.setItem("api_token", "token-normal");
    const fetchSpy = mockApi({ "GET /api/user": () => json({ user: { ...baseUser, must_change_password: false } }) });

    render(withAuth(<CambiarContrasenaPage />));
    await fill("Actual-2026", "Nueva-Segura-2026!", "Otra-Distinta-2026!");

    expect(await screen.findByText("La confirmación no coincide con la contraseña nueva.")).toBeInTheDocument();
    expect(fetchSpy.mock.calls.some(([, init]) => init?.method === "PUT")).toBe(false);
  });

  it("el límite de intentos se explica en español", async () => {
    localStorage.setItem("api_token", "token-normal");
    mockApi({
      "GET /api/user": () => json({ user: { ...baseUser, must_change_password: false } }),
      "PUT /api/me/password": () => json({ message: "Too Many Attempts." }, 429),
    });

    render(withAuth(<CambiarContrasenaPage />));
    await fill("Actual-2026", "Nueva-Segura-2026!");

    expect(await screen.findByRole("alert")).toHaveTextContent("Demasiados intentos");
  });
});
