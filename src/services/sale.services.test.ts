import { beforeEach, describe, expect, it, vi } from "vitest";
import { addSaleItem, createSale, getSaleBillingReadiness, getSales, getTaxRates, invoiceSale, SaleApiError, updateSale } from "./sale.services";
import { saleCollectionFixture, saleFixture } from "@/src/test-fixtures/sale";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

describe("servicio de ventas (Fase 6.25)", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("api_token", "token-ventas-prueba");
    vi.restoreAllMocks();
  });

  it("lista ventas paginadas con filtros y token", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse(saleCollectionFixture()));
    const response = await getSales({ search: "Dunder & Co", status: "draft", page: 2 });

    expect(response.data).toHaveLength(1);
    const [url, init] = fetchMock.mock.calls[0];
    const parsed = new URL(String(url));
    expect(parsed.pathname).toMatch(/\/api\/sales$/);
    expect(parsed.searchParams.get("search")).toBe("Dunder & Co");
    expect(parsed.searchParams.get("status")).toBe("draft");
    expect((init?.headers as Record<string, string>).Authorization).toBe("Bearer token-ventas-prueba");
  });

  it("crea y edita la venta con forma y método de pago", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => jsonResponse(saleFixture()));
    await createSale({ client_id: 3, payment_form: "99", payment_method: "PPD" });
    await updateSale(7, { payment_form: "03", payment_method: "PUE" });

    expect(fetchMock.mock.calls[0][1]?.method).toBe("POST");
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toEqual({ client_id: 3, payment_form: "99", payment_method: "PPD" });
    expect(String(fetchMock.mock.calls[1][0])).toMatch(/\/api\/sales\/7$/);
    expect(fetchMock.mock.calls[1][1]?.method).toBe("PUT");
  });

  it("agrega una línea con su tasa de impuesto", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({ id: 1 }, 201));
    await addSaleItem(7, { product_id: 14, quantity: 2, unit_price: 100, tax_rate_id: 1 });

    expect(String(fetchMock.mock.calls[0][0])).toMatch(/\/api\/sales\/7\/items$/);
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toMatchObject({ product_id: 14, tax_rate_id: 1 });
  });

  it.each([
    [201, true],
    [200, false],
  ])("facturar con %i informa si la factura se creó", async (status, created) => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({ id: 12, folio: "FAC-00000011", status: "ready", total: "116.00" }, status));

    await expect(invoiceSale(7)).resolves.toEqual({ created, invoice: { id: 12, folio: "FAC-00000011", status: "ready" } });
    expect(String(fetchMock.mock.calls[0][0])).toMatch(/\/api\/sales\/7\/invoice$/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("422 SALE_NOT_BILLABLE expone los problemas concretos", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({
      message: "La venta no está lista para facturarse.",
      code: "SALE_NOT_BILLABLE",
      errors: [{ code: "CLIENT_RFC_MISSING", field: "client.rfc", message: "El cliente no tiene RFC." }],
    }, 422));

    const error = await invoiceSale(7).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(SaleApiError);
    expect(error).toMatchObject({ status: 422, code: "SALE_NOT_BILLABLE", issues: [{ code: "CLIENT_RFC_MISSING" }] });
  });

  it("422 de validación usa el primer mensaje de campo", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({
      message: "The given data was invalid.",
      errors: { payment_form: ["Con método de pago PPD la forma de pago debe ser 99 (Por definir)."] },
    }, 422));

    await expect(updateSale(7, { payment_method: "PPD" })).rejects.toMatchObject({
      message: "Con método de pago PPD la forma de pago debe ser 99 (Por definir).",
      fieldErrors: { payment_form: [expect.any(String)] },
    });
  });

  it("consulta readiness y tasas de impuesto", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(jsonResponse({ ready: false, errors: [], warnings: [] }))
      .mockResolvedValueOnce(jsonResponse([{ id: 1, name: "IVA 16%" }]));

    await expect(getSaleBillingReadiness(7)).resolves.toMatchObject({ ready: false });
    await expect(getTaxRates()).resolves.toHaveLength(1);
    expect(String(fetchMock.mock.calls[0][0])).toMatch(/\/api\/sales\/7\/billing-readiness$/);
    expect(String(fetchMock.mock.calls[1][0])).toMatch(/\/api\/tax-rates$/);
  });

  it("404 y 401 se manejan de forma estable", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(jsonResponse({ message: "No query results" }, 404));
    await expect(getSales()).rejects.toMatchObject({ status: 404, message: "Venta no encontrada." });

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(jsonResponse({ message: "Unauthenticated" }, 401));
    await expect(getSales()).rejects.toBeInstanceOf(SaleApiError);
    expect(localStorage.getItem("api_token")).toBeNull();
  });
});
