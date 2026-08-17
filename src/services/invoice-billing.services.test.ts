import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  cancelInvoiceBusiness,
  downloadAuthenticatedFile,
  getInvoiceBilling,
  InvoiceApiError,
  issueInvoiceBusiness,
  issueInvoicePac,
} from "./invoice-billing.services";

describe("cliente API fiscal", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("api_token", "token-de-prueba");
    vi.restoreAllMocks();
  });

  it("reutiliza Bearer en headers, nunca en URL, y envía confirm=true", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(() => Promise.resolve(new Response(JSON.stringify({ id: 3 }), { status: 200, headers: { "Content-Type": "application/json" } })));
    await issueInvoicePac(3);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/\/api\/invoices\/3\/pac\/issue$/);
    expect(String(url)).not.toContain("token-de-prueba");
    expect((init?.headers as Record<string, string>).Authorization).toBe("Bearer token-de-prueba");
    expect(init?.body).toBe(JSON.stringify({ confirm: true }));
  });

  it("usa endpoints empresariales con payload mínimo y conserva los PAC legacy", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(() => Promise.resolve(new Response(JSON.stringify({ id: 3 }), { status: 200, headers: { "Content-Type": "application/json" } })));

    await issueInvoiceBusiness(3);
    await cancelInvoiceBusiness(3, { confirm: true });
    await cancelInvoiceBusiness(3, { confirm: true, motive: "01", substitution_uuid: "96013e83-154b-4153-8e61-c38b8966e560" });

    expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([
      expect.stringMatching(/\/api\/invoices\/3\/operations\/issue$/),
      expect.stringMatching(/\/api\/invoices\/3\/operations\/cancel$/),
      expect.stringMatching(/\/api\/invoices\/3\/operations\/cancel$/),
    ]);
    expect(fetchMock.mock.calls[0][1]?.body).toBe(JSON.stringify({ confirm: true }));
    expect(fetchMock.mock.calls[1][1]?.body).toBe(JSON.stringify({ confirm: true }));
    expect(fetchMock.mock.calls[2][1]?.body).toBe(JSON.stringify({ confirm: true, motive: "01", substitution_uuid: "96013e83-154b-4153-8e61-c38b8966e560" }));
  });

  it("parsea código y mensaje seguros sin propagar JSON completo", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ message: "Requiere reconciliación", code: "PAC_RECONCILIATION_REQUIRED", secret: "no" }), { status: 409, headers: { "Content-Type": "application/json" } }));
    await expect(getInvoiceBilling(3)).rejects.toMatchObject({ status: 409, code: "PAC_RECONCILIATION_REQUIRED", message: "Requiere reconciliación" });
  });

  it.each([
    [403, "No tienes permisos para realizar esta acción."],
    [422, "Datos fiscales inválidos"],
    [503, "Proveedor no disponible"],
  ])("conserva el status %i y sólo el mensaje público", async (status, message) => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify(status === 403 ? {} : { message }), { status, headers: { "Content-Type": "application/json" } }));
    await expect(getInvoiceBilling(3)).rejects.toMatchObject({ status, message });
  });

  it("401 limpia la sesión usando el comportamiento auth existente", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ message: "Unauthenticated" }), { status: 401, headers: { "Content-Type": "application/json" } }));
    await expect(getInvoiceBilling(3)).rejects.toBeInstanceOf(InvoiceApiError);
    expect(localStorage.getItem("api_token")).toBeNull();
  });

  it("descarga Blob autenticado, asigna filename y revoca URL temporal", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(new Blob(["xml-seguro"], { type: "application/xml" }), { status: 200 }));
    const createObjectURL = vi.fn(() => "blob:test");
    const revokeObjectURL = vi.fn();
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: createObjectURL });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: revokeObjectURL });
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);

    await downloadAuthenticatedFile("/api/invoices/3/cfdi/xml", "CFDI-FAC-00000003.xml");

    expect((fetchMock.mock.calls[0][1]?.headers as Record<string, string>).Authorization).toBe("Bearer token-de-prueba");
    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(click).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:test");
  });

  it("no contiene referencias a Facturapi ni claves PAC", async () => {
    const source = readFileSync(join(process.cwd(), "src/services/invoice-billing.services.ts"), "utf8");
    expect(source).not.toMatch(/FACTURAPI|sk_live/i);
  });
});
