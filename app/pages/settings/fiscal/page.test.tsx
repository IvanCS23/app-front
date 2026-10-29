import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CompanyFiscalPage from "./page";
import * as companyServices from "@/src/services/company.services";
import { CompanyApiError } from "@/src/services/company.services";
import * as satServices from "@/src/services/sat.services";
import { satCatalogsFixture } from "@/src/test-fixtures/sat";
import type { CompanyFiscal } from "@/src/types/company";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => "/" }));
vi.mock("@/app/components/layout/AppLayout", () => ({ default: ({ children }: { children: ReactNode }) => <div>{children}</div> }));
vi.mock("@/src/services/company.services", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/src/services/company.services")>()),
  getCompanyFiscal: vi.fn(),
  updateCompanyFiscal: vi.fn(),
}));
vi.mock("@/src/services/sat.services", () => ({ getSatCatalogs: vi.fn() }));

function fiscal(overrides: Partial<CompanyFiscal> = {}): CompanyFiscal {
  return {
    legal_name: "Mi Empresa",
    trade_name: "Mi Empresa",
    rfc: "XAXX010101000",
    fiscal_regime: "601",
    postal_code: null,
    address: { street: null, external_number: null, internal_number: null, colony: null, city: null, municipality: null, state: null },
    issues: [
      { code: "COMPANY_RFC_GENERIC", field: "rfc", message: "Un RFC genérico (XAXX010101000 o XEXX010101000) no puede emitir facturas." },
      { code: "COMPANY_POSTAL_CODE_MISSING", field: "postal_code", message: "Falta el código postal del domicilio fiscal (lugar de expedición)." },
    ],
    can_edit: true,
    organization: {
      legal_name: "TECNOLOGIAS S.A",
      legal_tax_id: "XIA190128J61",
      legal_tax_system: "601",
      legal_zip: "06010",
      rfc_matches: false,
      snapshot_at: null,
      certificate: { has_certificate: false, serial_number: null, expires_at: null, updated_at: null, days_left: null },
    },
    ...overrides,
  };
}

async function renderPage(data: CompanyFiscal = fiscal()) {
  vi.mocked(companyServices.getCompanyFiscal).mockResolvedValue(data);
  render(<CompanyFiscalPage />);
  return screen.findByLabelText("RFC");
}

const fill = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });

describe("Datos fiscales (Fase 6.27b)", () => {
  beforeEach(() => {
    vi.mocked(companyServices.updateCompanyFiscal).mockReset();
    vi.mocked(satServices.getSatCatalogs).mockResolvedValue(satCatalogsFixture());
  });

  it("muestra por qué la empresa no puede emitir y el RFC del CSD", async () => {
    await renderPage();

    expect(screen.getByText("Con estos datos la empresa no puede emitir facturas:")).toBeInTheDocument();
    expect(screen.getByText(/no puede emitir facturas\.$/)).toBeInTheDocument();
    expect(screen.getByText("Debe ser el del CSD cargado en Facturapi: XIA190128J61.")).toBeInTheDocument();
    expect(screen.getByText("El RFC de la empresa no coincide con el del CSD.")).toBeInTheDocument();
  });

  it("valida en el navegador y no envía datos inválidos", async () => {
    await renderPage();

    fill("Razón social", "TECNOLOGIAS S.A");
    fireEvent.click(screen.getByRole("button", { name: "Guardar datos fiscales" }));

    expect(await screen.findByText(/sin el régimen societario/)).toBeInTheDocument();
    expect(screen.getByText("Un RFC genérico (XAXX010101000 o XEXX010101000) no puede emitir facturas.", { selector: "p" })).toBeInTheDocument();
    expect(companyServices.updateCompanyFiscal).not.toHaveBeenCalled();
  });

  it("exige el RFC del CSD antes de enviar", async () => {
    await renderPage();

    fill("RFC", "ABC010101AB1");
    fill("Razón social", "XENON INDUSTRIAL ARTICLES");
    fill("Código postal (lugar de expedición)", "06010");
    fireEvent.click(screen.getByRole("button", { name: "Guardar datos fiscales" }));

    expect(await screen.findByText("El RFC debe ser el del CSD cargado en Facturapi (XIA190128J61).")).toBeInTheDocument();
    expect(companyServices.updateCompanyFiscal).not.toHaveBeenCalled();
  });

  it("guarda con datos válidos y avisa que se guardó en Facturapi", async () => {
    vi.mocked(companyServices.updateCompanyFiscal).mockResolvedValue(fiscal({ rfc: "XIA190128J61", postal_code: "06010", legal_name: "XENON INDUSTRIAL ARTICLES", issues: [] }));
    await renderPage();

    fill("RFC", "xia190128j61");
    fill("Razón social", "XENON INDUSTRIAL ARTICLES");
    fill("Código postal (lugar de expedición)", "06010");
    fireEvent.click(screen.getByRole("button", { name: "Guardar datos fiscales" }));

    await waitFor(() => expect(companyServices.updateCompanyFiscal).toHaveBeenCalledTimes(1));
    expect(vi.mocked(companyServices.updateCompanyFiscal).mock.calls[0][0]).toMatchObject({ rfc: "xia190128j61", postal_code: "06010" });
    expect(await screen.findByText("Datos fiscales guardados en Facturapi y en el sistema.")).toBeInTheDocument();
    expect(screen.queryByText("Con estos datos la empresa no puede emitir facturas:")).not.toBeInTheDocument();
  });

  it("muestra los problemas por campo y el mensaje del backend", async () => {
    vi.mocked(companyServices.updateCompanyFiscal).mockRejectedValue(
      new CompanyApiError("Facturapi rechazó los datos fiscales: El código postal no existe", 422, "COMPANY_FISCAL_DATA_REJECTED", [
        { code: "COMPANY_POSTAL_CODE_INVALID", field: "postal_code", message: "Ese código postal no existe." },
      ]),
    );
    await renderPage();

    fill("RFC", "XIA190128J61");
    fill("Razón social", "XENON INDUSTRIAL ARTICLES");
    fill("Código postal (lugar de expedición)", "99999");
    fireEvent.click(screen.getByRole("button", { name: "Guardar datos fiscales" }));

    expect(await screen.findByText("Ese código postal no existe.")).toBeInTheDocument();
    expect(screen.getByText("Facturapi rechazó los datos fiscales: El código postal no existe")).toBeInTheDocument();
  });

  it("un contador ve los datos sin poder guardarlos", async () => {
    await renderPage(fiscal({ can_edit: false }));

    expect(screen.getByText("Solo un administrador puede modificar los datos fiscales.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Guardar datos fiscales" })).not.toBeInTheDocument();
    expect(screen.getByLabelText("RFC")).toBeDisabled();
  });

  it("sin organización de Facturapi no permite guardar", async () => {
    await renderPage(fiscal({ organization: null }));

    expect(screen.getByText(/todavía no tiene organización de Facturapi/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guardar datos fiscales" })).toBeDisabled();
  });

  it("explica en español cuando el usuario no tiene permiso", async () => {
    vi.mocked(companyServices.getCompanyFiscal).mockRejectedValue(new CompanyApiError("No tienes permiso para realizar esta acción. Pide a un administrador que la realice.", 403));
    render(<CompanyFiscalPage />);

    expect(await screen.findByRole("alert")).toHaveTextContent("No tienes permiso para realizar esta acción");
  });
});
