import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSatCatalogs, resetSatCatalogsCache, searchProductKeys, searchUnitKeys } from "./sat.services";
import { satCatalogsFixture } from "@/src/test-fixtures/sat";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

describe("servicio de catálogos SAT (Fase 6.26)", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("api_token", "token-sat");
    resetSatCatalogsCache();
    vi.restoreAllMocks();
  });

  it("pide los catálogos pequeños una sola vez por sesión", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => jsonResponse(satCatalogsFixture()));

    const [first, second] = await Promise.all([getSatCatalogs(), getSatCatalogs()]);
    await getSatCatalogs();

    expect(first.tax_regimes).toHaveLength(5);
    expect(second).toBe(first);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toMatch(/\/api\/sat\/catalogs$/);
    expect((fetchMock.mock.calls[0][1]?.headers as Record<string, string>).Authorization).toBe("Bearer token-sat");
  });

  it("un fallo no queda cacheado", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockImplementationOnce(async () => jsonResponse({ message: "error" }, 500))
      .mockImplementation(async () => jsonResponse(satCatalogsFixture()));

    await expect(getSatCatalogs()).rejects.toThrow("catálogos del SAT");
    await expect(getSatCatalogs()).resolves.toMatchObject({ cfdi_uses: expect.any(Array) });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("busca claves de producto y de unidad con el texto codificado", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => jsonResponse([{ code: "43232408", description: "Software" }]));

    await searchProductKeys(" software web ");
    await searchUnitKeys("H87");

    expect(String(fetchMock.mock.calls[0][0])).toMatch(/\/api\/sat\/product-keys\?q=software%20web$/);
    expect(String(fetchMock.mock.calls[1][0])).toMatch(/\/api\/sat\/unit-keys\?q=H87$/);
  });
});
