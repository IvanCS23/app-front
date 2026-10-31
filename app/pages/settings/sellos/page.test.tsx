import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SellosPage from "./page";
import * as companyServices from "@/src/services/company.services";
import { CompanyApiError } from "@/src/services/company.services";
import type { CompanyFiscal } from "@/src/types/company";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => "/" }));
vi.mock("@/app/components/layout/AppLayout", () => ({ default: ({ children }: { children: ReactNode }) => <div>{children}</div> }));
vi.mock("@/src/services/company.services", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/src/services/company.services")>()),
  getCompanyFiscal: vi.fn(),
  uploadCompanyCsd: vi.fn(),
}));

function fiscal(overrides: Partial<CompanyFiscal> = {}, certificate: Partial<NonNullable<CompanyFiscal["organization"]>["certificate"]> = {}): CompanyFiscal {
  return {
    legal_name: "XENON INDUSTRIAL ARTICLES",
    trade_name: "Xenon",
    rfc: "XIA190128J61",
    fiscal_regime: "601",
    postal_code: "06010",
    address: { street: null, external_number: null, internal_number: null, colony: null, city: null, municipality: null, state: null },
    issues: [],
    can_edit: true,
    logo: { available: false, updated_at: null },
    organization: {
      legal_name: "XENON INDUSTRIAL ARTICLES",
      trade_name: "Mi Empresa",
      has_logo: false,
      legal_tax_id: "XIA190128J61",
      legal_tax_system: "601",
      legal_zip: "06010",
      rfc_matches: true,
      snapshot_at: null,
      certificate: { has_certificate: false, serial_number: null, expires_at: null, updated_at: null, days_left: null, ...certificate },
    },
    ...overrides,
  };
}

const file = (name: string, size = 10) => new File(["x".repeat(size)], name, { type: "application/octet-stream" });

async function renderPage(data: CompanyFiscal = fiscal()) {
  vi.mocked(companyServices.getCompanyFiscal).mockResolvedValue(data);
  render(<SellosPage />);
  await screen.findByRole("region", { name: "CSD actual" });
}

function fillForm(password = "secreto-csd") {
  fireEvent.change(screen.getByLabelText("Certificado (.cer)"), { target: { files: [file("csd.cer")] } });
  fireEvent.change(screen.getByLabelText("Llave privada (.key)"), { target: { files: [file("csd.key")] } });
  fireEvent.change(screen.getByLabelText("Contraseña de la llave privada"), { target: { value: password } });
}

describe("Sellos digitales (Fase 6.27b)", () => {
  beforeEach(() => {
    vi.mocked(companyServices.uploadCompanyCsd).mockReset();
  });

  it("muestra el CSD vigente, avisa si vence pronto y no ofrece descargas", async () => {
    await renderPage(fiscal({}, { has_certificate: true, serial_number: "30001000000500003416", expires_at: "2026-11-15T00:00:00Z", days_left: 17 }));

    expect(screen.getByText("30001000000500003416")).toBeInTheDocument();
    expect(screen.getByText("El CSD vence en 17 días: tramita uno nuevo en el SAT.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Reemplazar CSD" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /descargar/i })).not.toBeInTheDocument();
  });

  it("sube el CSD y borra la contraseña del formulario", async () => {
    vi.mocked(companyServices.uploadCompanyCsd).mockResolvedValue(fiscal({}, { has_certificate: true, serial_number: "3001", expires_at: "2027-10-29T00:00:00Z", days_left: 365 }));
    await renderPage();

    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "Subir CSD" }));

    await waitFor(() => expect(companyServices.uploadCompanyCsd).toHaveBeenCalledTimes(1));
    const [cer, key, password] = vi.mocked(companyServices.uploadCompanyCsd).mock.calls[0];
    expect(cer.name).toBe("csd.cer");
    expect(key.name).toBe("csd.key");
    expect(password).toBe("secreto-csd");
    expect(await screen.findByText("CSD cargado en Facturapi.")).toBeInTheDocument();
    expect(screen.getByText("3001")).toBeInTheDocument();
    expect(screen.getByLabelText("Contraseña de la llave privada")).toHaveValue("");
  });

  it("si Facturapi lo rechaza muestra el motivo y también borra la contraseña", async () => {
    vi.mocked(companyServices.uploadCompanyCsd).mockRejectedValue(
      new CompanyApiError("El certificado es de otro RFC.", 422, "COMPANY_RFC_CSD_MISMATCH", [
        { code: "COMPANY_RFC_CSD_MISMATCH", field: "cer", message: "El certificado es del RFC ABC010101AB1 y la empresa tiene XIA190128J61." },
      ]),
    );
    await renderPage();

    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "Subir CSD" }));

    expect(await screen.findByText("El certificado es del RFC ABC010101AB1 y la empresa tiene XIA190128J61.")).toBeInTheDocument();
    expect(screen.getByText("El certificado es de otro RFC.")).toBeInTheDocument();
    expect(screen.getByLabelText("Contraseña de la llave privada")).toHaveValue("");
  });

  it("valida archivos y contraseña antes de enviar", async () => {
    await renderPage();

    fireEvent.change(screen.getByLabelText("Certificado (.cer)"), { target: { files: [file("csd.pdf")] } });
    fireEvent.change(screen.getByLabelText("Llave privada (.key)"), { target: { files: [file("csd.key", 70 * 1024)] } });
    fireEvent.click(screen.getByRole("button", { name: "Subir CSD" }));

    expect(screen.getByText("Selecciona un archivo .cer.")).toBeInTheDocument();
    expect(screen.getByText("El archivo .key no puede pesar más de 64 KB.")).toBeInTheDocument();
    expect(screen.getByText("Escribe la contraseña de la llave privada.")).toBeInTheDocument();
    expect(companyServices.uploadCompanyCsd).not.toHaveBeenCalled();
  });

  it("quien no es Admin ve el estado sin formulario de carga", async () => {
    await renderPage(fiscal({ can_edit: false }));

    expect(screen.getByText("Solo un administrador puede cargar el CSD.")).toBeInTheDocument();
    expect(screen.queryByLabelText("Contraseña de la llave privada")).not.toBeInTheDocument();
  });

  it("la e.firma (FIEL) aparece como Próximamente y deshabilitada", async () => {
    await renderPage();

    const fiel = screen.getByRole("region", { name: "e.firma (FIEL)" });
    expect(fiel).toHaveTextContent("Próximamente");
    expect(screen.getByLabelText("Contraseña de la FIEL")).toBeDisabled();
  });
});
