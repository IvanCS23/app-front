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
  getCompanyLogo: vi.fn(),
  uploadCompanyLogo: vi.fn(),
}));
vi.mock("@/src/services/sat.services", () => ({ getSatCatalogs: vi.fn() }));

function fiscal(overrides: Partial<CompanyFiscal> = {}): CompanyFiscal {
  return {
    legal_name: "Mi Empresa",
    trade_name: "Mi Empresa",
    email: null,
    rfc: "XAXX010101000",
    fiscal_regime: "601",
    postal_code: null,
    address: { street: null, external_number: null, internal_number: null, colony: null, city: null, municipality: null, state: null },
    issues: [
      { code: "COMPANY_RFC_GENERIC", field: "rfc", message: "Un RFC genérico (XAXX010101000 o XEXX010101000) no puede emitir facturas." },
      { code: "COMPANY_POSTAL_CODE_MISSING", field: "postal_code", message: "Falta el código postal del domicilio fiscal (lugar de expedición)." },
    ],
    can_edit: true,
    logo: { available: false, updated_at: null },
    organization: {
      legal_name: "TECNOLOGIAS S.A",
      trade_name: "Mi Empresa",
      has_logo: false,
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

describe("Logotipo del PDF (Fase 6.29)", () => {
  beforeEach(() => {
    vi.mocked(satServices.getSatCatalogs).mockResolvedValue(satCatalogsFixture());
    vi.mocked(companyServices.getCompanyLogo).mockReset().mockResolvedValue(null);
    vi.mocked(companyServices.uploadCompanyLogo).mockReset();
    globalThis.URL.createObjectURL = vi.fn(() => "blob:logo");
    globalThis.URL.revokeObjectURL = vi.fn();
  });

  const png = (size = 1024) => new File([new Uint8Array(size)], "logo.png", { type: "image/png" });

  it("muestra el nombre comercial del PDF y avisa si Facturapi tiene un logotipo ajeno", async () => {
    await renderPage(fiscal({ organization: { ...fiscal().organization!, has_logo: true } }));

    expect(screen.getByText("Nombre comercial en el PDF").nextSibling).toHaveTextContent("Mi Empresa");
    expect(screen.getByText(/Facturapi tiene un logotipo que no se subió desde aquí/)).toBeInTheDocument();
  });

  it("muestra la vista previa de la copia privada cuando hay logotipo", async () => {
    vi.mocked(companyServices.getCompanyLogo).mockResolvedValue(new Blob(["x"], { type: "image/png" }));
    await renderPage(fiscal({ logo: { available: true, updated_at: "2026-10-30T21:00:00Z" } }));

    expect(await screen.findByRole("img", { name: "Logotipo actual de la empresa" })).toHaveAttribute("src", "blob:logo");
    expect(screen.getByLabelText("Reemplazar logotipo")).toBeInTheDocument();
  });

  it("valida tipo y tamaño antes de subir", async () => {
    await renderPage();

    fireEvent.change(screen.getByLabelText("Subir logotipo"), { target: { files: [new File(["x"], "logo.pdf", { type: "application/pdf" })] } });
    expect(screen.getByText("El logotipo debe ser una imagen JPG o PNG.")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Subir logotipo"), { target: { files: [png(500 * 1024 + 1)] } });
    expect(screen.getByText("El logotipo no puede pesar más de 500 KB.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Subir logotipo" })).toBeDisabled();
    expect(companyServices.uploadCompanyLogo).not.toHaveBeenCalled();
  });

  it("sube el logotipo, actualiza la pantalla y confirma", async () => {
    const file = png();
    vi.mocked(companyServices.uploadCompanyLogo).mockResolvedValue(fiscal({ logo: { available: true, updated_at: "2026-10-30T21:00:00Z" }, organization: { ...fiscal().organization!, has_logo: true } }));
    vi.mocked(companyServices.getCompanyLogo).mockResolvedValue(new Blob(["x"], { type: "image/png" }));
    await renderPage();

    fireEvent.change(screen.getByLabelText("Subir logotipo"), { target: { files: [file] } });
    fireEvent.click(screen.getByRole("button", { name: "Subir logotipo" }));

    await waitFor(() => expect(companyServices.uploadCompanyLogo).toHaveBeenCalledWith(file));
    expect(await screen.findByText("Logotipo guardado en Facturapi. Se usará en los PDF nuevos.")).toBeInTheDocument();
    expect(await screen.findByRole("img", { name: "Logotipo actual de la empresa" })).toBeInTheDocument();
    expect(screen.queryByText(/Facturapi tiene un logotipo que no se subió desde aquí/)).not.toBeInTheDocument();
  });

  it("muestra el rechazo de Facturapi sin cambiar la pantalla", async () => {
    vi.mocked(companyServices.uploadCompanyLogo).mockRejectedValue(new CompanyApiError("Facturapi rechazó el logotipo: formato no válido", 422, "COMPANY_LOGO_REJECTED"));
    await renderPage();

    fireEvent.change(screen.getByLabelText("Subir logotipo"), { target: { files: [png()] } });
    fireEvent.click(screen.getByRole("button", { name: "Subir logotipo" }));

    expect(await screen.findByText("Facturapi rechazó el logotipo: formato no válido")).toBeInTheDocument();
    expect(screen.getByText("Sin logotipo propio.")).toBeInTheDocument();
  });

  it("un contador ve el logotipo pero no puede cambiarlo", async () => {
    await renderPage(fiscal({ can_edit: false }));

    expect(screen.getByText("Sólo un administrador puede cambiar el logotipo.")).toBeInTheDocument();
    expect(screen.queryByLabelText("Subir logotipo")).not.toBeInTheDocument();
  });
});

describe("Correo de contacto (Fase 6.30)", () => {
  beforeEach(() => {
    vi.mocked(companyServices.updateCompanyFiscal).mockReset();
    vi.mocked(satServices.getSatCatalogs).mockResolvedValue(satCatalogsFixture());
    vi.mocked(companyServices.getCompanyLogo).mockResolvedValue(null);
  });

  it("explica que aparece en los PDF y correos, y se envía al guardar", async () => {
    const valid = fiscal({ rfc: "XIA190128J61", legal_name: "XENON INDUSTRIAL ARTICLES", postal_code: "06010", issues: [], email: "antes@example.com" });
    vi.mocked(companyServices.updateCompanyFiscal).mockResolvedValue({ ...valid, email: "facturacion@example.com" });
    await renderPage(valid);

    expect(screen.getByLabelText("Correo de contacto")).toHaveValue("antes@example.com");
    expect(screen.getByText(/Aparece en los PDF y en los correos que Facturapi envía a tus clientes/)).toBeInTheDocument();

    fill("Correo de contacto", "facturacion@example.com");
    fireEvent.click(screen.getByRole("button", { name: "Guardar datos fiscales" }));

    await waitFor(() => expect(companyServices.updateCompanyFiscal).toHaveBeenCalledWith(expect.objectContaining({ email: "facturacion@example.com" })));
  });

  it("no guarda un correo de contacto inválido", async () => {
    await renderPage(fiscal({ rfc: "XIA190128J61", legal_name: "XENON INDUSTRIAL ARTICLES", postal_code: "06010", issues: [] }));

    fill("Correo de contacto", "no-es-correo");
    fireEvent.click(screen.getByRole("button", { name: "Guardar datos fiscales" }));

    expect(await screen.findByText("El correo de contacto no tiene un formato válido.")).toBeInTheDocument();
    expect(companyServices.updateCompanyFiscal).not.toHaveBeenCalled();
  });
});
