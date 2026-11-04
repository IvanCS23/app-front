import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EmailSettingsPage from "./page";
import * as companyServices from "@/src/services/company.services";
import { CompanyApiError } from "@/src/services/company.services";
import type { CompanyEmailSettings } from "@/src/types/company";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => "/" }));
vi.mock("@/app/components/layout/AppLayout", () => ({ default: ({ children }: { children: ReactNode }) => <div>{children}</div> }));
vi.mock("@/src/services/company.services", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/src/services/company.services")>()),
  getCompanyEmailSettings: vi.fn(),
  updateCompanyEmailSettings: vi.fn(),
}));

function settings(overrides: Partial<CompanyEmailSettings> = {}): CompanyEmailSettings {
  return { auto_email_invoices: false, pac_mode: "test", daily_limit: 100, sent_last_24h: 3, can_edit: true, ...overrides };
}

/** Fase 6.30: Configuración > Correo. */
describe("Configuración de correo", () => {
  beforeEach(() => {
    vi.mocked(companyServices.updateCompanyEmailSettings).mockReset();
  });

  it("un Admin activa el envío automático y ve el uso del límite diario", async () => {
    vi.mocked(companyServices.getCompanyEmailSettings).mockResolvedValue(settings());
    vi.mocked(companyServices.updateCompanyEmailSettings).mockResolvedValue(settings({ auto_email_invoices: true }));
    render(<EmailSettingsPage />);

    const toggle = await screen.findByRole("switch", { name: "Enviar las facturas automáticamente al timbrarlas" });
    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText(/de 100 envíos en las últimas 24 horas/)).toBeInTheDocument();

    fireEvent.click(toggle);

    await waitFor(() => expect(companyServices.updateCompanyEmailSettings).toHaveBeenCalledWith(true));
    expect(await screen.findByText("Envío automático activado.")).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("en modo test avisa que Facturapi envía los correos de verdad", async () => {
    vi.mocked(companyServices.getCompanyEmailSettings).mockResolvedValue(settings({ pac_mode: "test" }));
    render(<EmailSettingsPage />);

    expect(await screen.findByRole("note")).toHaveTextContent("Facturapi envía los correos de verdad");
  });

  it("en live no muestra el aviso de pruebas", async () => {
    vi.mocked(companyServices.getCompanyEmailSettings).mockResolvedValue(settings({ pac_mode: "live" }));
    render(<EmailSettingsPage />);

    await screen.findByRole("switch");
    expect(screen.queryByRole("note")).not.toBeInTheDocument();
  });

  it("un Contador la consulta pero no la cambia", async () => {
    vi.mocked(companyServices.getCompanyEmailSettings).mockResolvedValue(settings({ can_edit: false }));
    render(<EmailSettingsPage />);

    expect(await screen.findByRole("switch")).toBeDisabled();
    expect(screen.getByText("Sólo un administrador puede cambiar el envío automático.")).toBeInTheDocument();
  });

  it("explica cuando el rol no tiene permiso", async () => {
    vi.mocked(companyServices.getCompanyEmailSettings).mockRejectedValue(new CompanyApiError("No tienes permiso para realizar esta acción.", 403));
    render(<EmailSettingsPage />);

    expect(await screen.findByRole("alert")).toHaveTextContent("No tienes permiso");
  });
});
