import { beforeEach, describe, expect, it, vi } from "vitest";
import { deleteInvoice, getInvoiceDetail, getInvoices, InvoiceCommercialApiError, InvoiceListApiError, markInvoiceReady, updateInvoiceNotes } from "./invoice.services";
import { invoiceCollectionFixture, invoiceDetailFixture } from "@/src/test-fixtures/invoice";

describe("servicio de listado de facturas", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("api_token", "token-listado-prueba");
    vi.restoreAllMocks();
  });

  it("envía filtros paginados codificados y AbortSignal en un solo GET", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify(invoiceCollectionFixture()), { status: 200 }));
    const controller = new AbortController();
    const response = await getInvoices({ search: "RFC & folio", status: "issued", page: 2, per_page: 20 }, controller.signal);
    expect(response.data).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    const parsed = new URL(String(url));
    expect(parsed.pathname).toMatch(/\/api\/invoices$/);
    expect(parsed.searchParams.get("search")).toBe("RFC & folio");
    expect(parsed.searchParams.get("status")).toBe("issued");
    expect(parsed.searchParams.get("page")).toBe("2");
    expect(init?.signal).toBe(controller.signal);
    expect((init?.headers as Record<string, string>).Authorization).toBe("Bearer token-listado-prueba");
  });

  it("conserva data, links y meta nativos de Laravel", async () => {
    const payload = invoiceCollectionFixture([], { current_page: 2, last_page: 4, total: 75 });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify(payload), { status: 200 }));
    await expect(getInvoices()).resolves.toEqual(payload);
  });

  it("403 usa mensaje humano estable", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ message: "raw forbidden" }), { status: 403 }));
    await expect(getInvoices()).rejects.toMatchObject({ status: 403, message: "No tienes permisos para consultar las facturas." });
  });

  it("401 limpia la sesión existente", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ message: "Unauthenticated" }), { status: 401 }));
    await expect(getInvoices()).rejects.toBeInstanceOf(InvoiceListApiError);
    expect(localStorage.getItem("api_token")).toBeNull();
  });

  it.each([[422, "Los filtros enviados no son válidos."], [500, "No fue posible cargar las facturas."]])("sanitiza error HTTP %i", async (status, expected) => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(status === 422 ? JSON.stringify({ message: "detalle interno" }) : "not-json", { status }));
    await expect(getInvoices()).rejects.toMatchObject({ status, message: expected });
  });
});

describe("servicio de detalle comercial", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("api_token", "token-detalle-prueba");
    vi.restoreAllMocks();
  });

  it("consulta una sola factura comercial con AbortSignal", async () => {
    const payload = invoiceDetailFixture();
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify(payload), { status: 200 }));
    const controller = new AbortController();

    await expect(getInvoiceDetail(3, controller.signal)).resolves.toEqual(payload);
    expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/api\/invoices\/3$/), expect.objectContaining({ signal: controller.signal }));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).not.toMatch(/\/clients\/|\/sales\//);
  });

  it("actualiza sólo notas con el contrato existente", async () => {
    const payload = invoiceDetailFixture({ notes: "Nota nueva" });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify(payload), { status: 200 }));

    await expect(updateInvoiceNotes(3, "Nota nueva")).resolves.toEqual(payload);
    expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/api\/invoices\/3$/), expect.objectContaining({
      method: "PUT",
      body: JSON.stringify({ notes: "Nota nueva" }),
    }));
  });

  it("usa las transiciones comerciales ready y delete sin rutas PAC", async () => {
    const ready = invoiceDetailFixture({ status: "ready" });
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify(ready), { status: 200 }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));

    await expect(markInvoiceReady(3)).resolves.toEqual(ready);
    await expect(deleteInvoice(3)).resolves.toBeUndefined();
    expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([
      expect.stringMatching(/\/api\/invoices\/3\/ready$/),
      expect.stringMatching(/\/api\/invoices\/3$/),
    ]);
    expect(fetchMock.mock.calls.every(([url]) => !String(url).includes("/pac/"))).toBe(true);
  });

  it.each([[403, "No tienes permisos para consultar esta factura."], [404, "Factura no encontrada."]])("expone error comercial estable para HTTP %i", async (status, message) => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ message: "detalle interno" }), { status }));
    await expect(getInvoiceDetail(3)).rejects.toMatchObject({ status, message });
  });

  it("propaga validación de notas y limpia sesión en 401", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ errors: { notes: ["Las notas son demasiado largas."] } }), { status: 422 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: "Unauthenticated" }), { status: 401 }));

    await expect(updateInvoiceNotes(3, "x")).rejects.toMatchObject({ message: "Las notas son demasiado largas." });
    await expect(getInvoiceDetail(3)).rejects.toBeInstanceOf(InvoiceCommercialApiError);
    expect(localStorage.getItem("api_token")).toBeNull();
  });
});
