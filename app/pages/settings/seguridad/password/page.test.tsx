import type { ReactNode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "@/src/context/AuthContext";
import { API_URL } from "@/src/config/api";
import { PASSWORD_CHANGED_MESSAGE } from "@/app/components/auth/ChangePasswordForm";
import SecurityPasswordPage from "./page";

const navigation = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn() }));

vi.mock("next/navigation", () => ({ useRouter: () => navigation, usePathname: () => "/pages/settings/seguridad/password" }));
vi.mock("@/app/components/layout/AppLayout", () => ({ default: ({ children }: { children: ReactNode }) => <div>{children}</div> }));

const account = { id: 3, name: "Contadora", email: "conta@example.com", avatar: null, role: "accountant", company: null, must_change_password: false };

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  navigation.replace.mockReset();
});

describe("Configuración > Seguridad > Contraseña (Fase 6.32)", () => {
  it("cualquier rol cambia su contraseña, sigue en la pantalla con el token nuevo y ve el resultado", async () => {
    localStorage.setItem("api_token", "token-actual");
    const methods: string[] = [];
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      const path = String(input).replace(API_URL, "");
      methods.push(`${init?.method ?? "GET"} ${path}`);
      if (path === "/api/user") return json({ user: account });
      return json({ token: "token-rotado", user: account });
    });
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <SecurityPasswordPage />
      </AuthProvider>
    );

    expect(await screen.findByText("Cuenta: conta@example.com")).toBeInTheDocument();
    expect(screen.getByText(/Se cierran las sesiones abiertas en otros equipos/)).toBeInTheDocument();

    await user.type(screen.getByLabelText("Contraseña actual"), "Actual-2026");
    await user.type(screen.getByLabelText("Contraseña nueva"), "Nueva-Segura-2026!");
    await user.type(screen.getByLabelText("Confirmar contraseña nueva"), "Nueva-Segura-2026!");
    await user.click(screen.getByRole("button", { name: "Cambiar contraseña" }));

    expect(await screen.findByRole("status")).toHaveTextContent(PASSWORD_CHANGED_MESSAGE);
    await waitFor(() => expect(localStorage.getItem("api_token")).toBe("token-rotado"));
    expect(screen.getByLabelText("Contraseña actual")).toHaveValue("");
    expect(navigation.replace).not.toHaveBeenCalled();
    expect(methods).toContain("PUT /api/me/password");
  });
});
