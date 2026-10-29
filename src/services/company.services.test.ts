import { beforeEach, describe, expect, it, vi } from "vitest";
import { CompanyApiError, getCompanyFiscal, updateCompanyFiscal, uploadCompanyCsd } from "./company.services";
import type { CompanyFiscalInput } from "@/src/types/company";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

const input: CompanyFiscalInput = {
  legal_name: "XENON INDUSTRIAL ARTICLES",
  trade_name: "Xenon",
  rfc: "XIA190128J61",
  fiscal_regime: "601",
  postal_code: "06010",
  street: "",
  external_number: "",
  internal_number: "",
  colony: "",
  city: "",
  municipality: "",
  state: "",
};

describe("servicio de datos fiscales de la empresa (Fase 6.27b)", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("api_token", "token-empresa");
    vi.restoreAllMocks();
  });

  it("consulta y guarda sin enviar ids de empresa ni de organización", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => jsonResponse({ rfc: "XIA190128J61" }));

    await getCompanyFiscal();
    await updateCompanyFiscal(input);

    expect(String(fetchMock.mock.calls[0][0])).toMatch(/\/api\/company\/fiscal$/);
    const [url, init] = fetchMock.mock.calls[1];
    expect(String(url)).toMatch(/\/api\/company\/fiscal$/);
    expect(init?.method).toBe("PUT");
    expect((init?.headers as Record<string, string>).Authorization).toBe("Bearer token-empresa");
    const body = JSON.parse(String(init?.body));
    expect(body).toEqual(input);
    expect(body).not.toHaveProperty("organization_id");
    expect(body).not.toHaveProperty("company_id");
  });

  it("conserva el código y los problemas por campo del backend", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async () =>
      jsonResponse({ code: "COMPANY_RFC_CSD_MISMATCH", message: "El RFC no coincide con el del CSD de la organización.", issues: [{ code: "COMPANY_RFC_CSD_MISMATCH", field: "rfc", message: "El RFC debe ser el del CSD." }] }, 422),
    );

    const error = await updateCompanyFiscal(input).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(CompanyApiError);
    expect(error).toMatchObject({ status: 422, code: "COMPANY_RFC_CSD_MISMATCH", issues: [{ field: "rfc" }] });
  });

  it("traduce el 403 de autorización y el 429 a mensajes en español", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockImplementationOnce(async () => jsonResponse({ message: "This action is unauthorized." }, 403))
      .mockImplementationOnce(async () => jsonResponse({ message: "Too Many Attempts." }, 429));

    await expect(getCompanyFiscal()).rejects.toThrow("No tienes permiso para realizar esta acción");
    await expect(updateCompanyFiscal(input)).rejects.toThrow("Demasiados intentos");
  });

  it("convierte los errores de validación de Laravel en problemas por campo", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async () =>
      jsonResponse({ message: "The postal code field must not be greater than 5 characters.", errors: { postal_code: ["El código postal es demasiado largo."] } }, 422),
    );

    const error = (await updateCompanyFiscal(input).catch((e: unknown) => e)) as CompanyApiError;

    expect(error.issues).toEqual([{ code: "VALIDATION_ERROR", field: "postal_code", message: "El código postal es demasiado largo." }]);
  });

  it("sube el CSD como FormData con los archivos y la contraseña, sin ids", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => jsonResponse({ rfc: "XIA190128J61" }));
    const cer = new File(["cer"], "csd.cer");
    const key = new File(["key"], "csd.key");

    await uploadCompanyCsd(cer, key, "secreto-csd");

    const [url, init] = fetchMock.mock.calls[0];
    const body = init?.body as FormData;
    expect(String(url)).toMatch(/\/api\/company\/csd$/);
    expect(init?.method).toBe("POST");
    expect(body.get("cer")).toBeInstanceOf(File);
    expect(body.get("key")).toBeInstanceOf(File);
    expect(body.get("csd_password")).toBe("secreto-csd");
    expect([...body.keys()].sort()).toEqual(["cer", "csd_password", "key"]);
    expect((init?.headers as Record<string, string>)["Content-Type"]).toBeUndefined();
  });
});
