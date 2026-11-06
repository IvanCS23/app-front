import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { API_URL } from "@/src/config/api";
import nextConfig from "@/next.config";
import RecuperarContrasenaPage from "@/app/recuperar-contrasena/page";
import LoginPage from "@/app/login/page";
import ResetPasswordForm, { INCOMPLETE_LINK_MESSAGE, readResetLink } from "./ResetPasswordForm";
import { metadata } from "./page";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn(), replace: vi.fn() }), usePathname: () => "/" }));
vi.mock("@/src/hooks/useAuth", () => ({ useAuth: () => ({ login: vi.fn() }) }));

const SAME_MESSAGE = "Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada.";
const TOKEN = "f".repeat(64);

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

function captureFetch(respond: (url: string, body: Record<string, string>) => Response) {
  const calls: { url: string; body: Record<string, string> }[] = [];
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
    const url = String(input);
    const body = JSON.parse(String(init?.body ?? "{}"));
    calls.push({ url, body });
    return respond(url, body);
  });
  return calls;
}

function openLink(hash: string) {
  window.history.replaceState(null, "", `/restablecer-contrasena${hash}`);
}

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  window.history.replaceState(null, "", "/");
});

describe("/recuperar-contrasena (Fase 6.32)", () => {
  it("el login enlaza a recuperar la contraseña", () => {
    render(<LoginPage />);

    expect(screen.getByRole("link", { name: "¿Olvidó su contraseña?" })).toHaveAttribute("href", "/recuperar-contrasena");
  });

  it("muestra el mismo mensaje exista o no el correo", async () => {
    const calls = captureFetch(() => json({ message: SAME_MESSAGE }, 202));
    const user = userEvent.setup();
    const texts: string[] = [];

    for (const email of ["persona@example.com", "nadie@example.com"]) {
      const view = render(<RecuperarContrasenaPage />);
      await user.type(screen.getByLabelText("Correo electrónico"), email);
      await user.click(screen.getByRole("button", { name: "Enviar enlace" }));
      texts.push((await screen.findByRole("status")).textContent ?? "");
      view.unmount();
    }

    expect(texts).toEqual([SAME_MESSAGE, SAME_MESSAGE]);
    expect(calls.map((call) => [call.url, call.body.email])).toEqual([
      [`${API_URL}/api/password/forgot`, "persona@example.com"],
      [`${API_URL}/api/password/forgot`, "nadie@example.com"],
    ]);
  });

  it("explica el límite de solicitudes y el correo mal escrito", async () => {
    const user = userEvent.setup();
    captureFetch(() => json({ message: "Demasiadas solicitudes. Espera un momento antes de intentar de nuevo." }, 429));

    const view = render(<RecuperarContrasenaPage />);
    await user.type(screen.getByLabelText("Correo electrónico"), "persona@example.com");
    await user.click(screen.getByRole("button", { name: "Enviar enlace" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Demasiadas solicitudes");
    view.unmount();

    vi.restoreAllMocks();
    captureFetch(() => json({ message: "x", errors: { email: ["Escribe un correo válido."] } }, 422));
    render(<RecuperarContrasenaPage />);
    await user.type(screen.getByLabelText("Correo electrónico"), "no-es-correo");
    await user.click(screen.getByRole("button", { name: "Enviar enlace" }));
    expect(await screen.findByText("Escribe un correo válido.")).toBeInTheDocument();
  });
});

describe("/restablecer-contrasena (Fase 6.32, D2)", () => {
  it("lee token y correo después de #", () => {
    expect(readResetLink(`#token=${TOKEN}&email=persona%2Bx%40example.com`)).toEqual({ token: TOKEN, email: "persona+x@example.com" });
    expect(readResetLink("#token=&email=a@b.c")).toBeNull();
    expect(readResetLink("")).toBeNull();
  });

  it("borra el token de la barra de direcciones al abrir el enlace", async () => {
    openLink(`#token=${TOKEN}&email=persona%40example.com`);

    render(<ResetPasswordForm />);

    expect(screen.getByText("persona@example.com")).toBeInTheDocument();
    await waitFor(() => expect(window.location.hash).toBe(""));
    expect(window.location.href).not.toContain(TOKEN);
    expect(window.location.pathname).toBe("/restablecer-contrasena");
  });

  it("restablece con el token del enlace, cierra la sesión local y lleva al login", async () => {
    localStorage.setItem("api_token", "token-viejo");
    openLink(`#token=${TOKEN}&email=persona%40example.com`);
    const calls = captureFetch(() => json({ message: "Tu contraseña se restableció. Inicia sesión con la nueva." }));
    const user = userEvent.setup();

    render(<ResetPasswordForm />);
    await user.type(screen.getByLabelText("Contraseña nueva"), "Nueva-Segura-2026!");
    await user.type(screen.getByLabelText("Confirmar contraseña nueva"), "Nueva-Segura-2026!");
    await user.click(screen.getByRole("button", { name: "Restablecer contraseña" }));

    expect(await screen.findByRole("status")).toHaveTextContent("Tu contraseña se restableció");
    expect(screen.getByRole("link", { name: "Ir a iniciar sesión" })).toHaveAttribute("href", "/login");
    expect(calls).toEqual([
      {
        url: `${API_URL}/api/password/reset`,
        body: { token: TOKEN, email: "persona@example.com", password: "Nueva-Segura-2026!", password_confirmation: "Nueva-Segura-2026!" },
      },
    ]);
    expect(localStorage.getItem("api_token")).toBeNull();
  });

  it("un enlace vencido o ya usado pide uno nuevo", async () => {
    openLink(`#token=${TOKEN}&email=persona%40example.com`);
    captureFetch(() => json({ code: "PASSWORD_RESET_INVALID", message: "El enlace para restablecer la contraseña no es válido o ya venció. Solicita uno nuevo." }, 422));
    const user = userEvent.setup();

    render(<ResetPasswordForm />);
    await user.type(screen.getByLabelText("Contraseña nueva"), "Nueva-Segura-2026!");
    await user.type(screen.getByLabelText("Confirmar contraseña nueva"), "Nueva-Segura-2026!");
    await user.click(screen.getByRole("button", { name: "Restablecer contraseña" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("no es válido o ya venció");
    expect(screen.getByRole("link", { name: "Solicitar un enlace nuevo" })).toHaveAttribute("href", "/recuperar-contrasena");
  });

  it("las reglas de la contraseña se muestran junto al campo y el enlace sigue sirviendo", async () => {
    openLink(`#token=${TOKEN}&email=persona%40example.com`);
    captureFetch(() => json({ message: "x", errors: { password: ["La contraseña debe tener al menos 12 caracteres."] } }, 422));
    const user = userEvent.setup();

    render(<ResetPasswordForm />);
    await user.type(screen.getByLabelText("Contraseña nueva"), "corta");
    await user.type(screen.getByLabelText("Confirmar contraseña nueva"), "corta");
    await user.click(screen.getByRole("button", { name: "Restablecer contraseña" }));

    expect(await screen.findByText("La contraseña debe tener al menos 12 caracteres.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Restablecer contraseña" })).toBeInTheDocument();
  });

  it("sin token en el enlace no llama a la API y ofrece pedir otro", () => {
    openLink("");
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    render(<ResetPasswordForm />);

    expect(screen.getByRole("alert")).toHaveTextContent(INCOMPLETE_LINK_MESSAGE);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("no envía Referer", async () => {
    expect(metadata.referrer).toBe("no-referrer");

    const rules = await nextConfig.headers!();
    for (const source of ["/restablecer-contrasena", "/recuperar-contrasena"]) {
      const headers = rules.find((rule) => rule.source === source)?.headers ?? [];
      expect(headers).toContainEqual({ key: "Referrer-Policy", value: "no-referrer" });
    }
  });
});
