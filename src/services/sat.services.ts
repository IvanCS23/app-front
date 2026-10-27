import { API_URL } from "@/src/config/api";
import { getAuthHeaders } from "@/src/services/http";
import type { SatCatalogs, SatProductKey, SatUnitKey } from "@/src/types/sat";

/**
 * Fase 6.26: catálogos SAT locales del backend (sin llamadas al PAC). Los
 * pequeños no cambian durante la sesión, así que se piden una sola vez.
 */
let catalogsRequest: Promise<SatCatalogs> | null = null;

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { headers: getAuthHeaders(), signal });

  if (!response.ok) {
    throw new Error("No fue posible cargar los catálogos del SAT.");
  }

  return (await response.json()) as T;
}

export function getSatCatalogs(): Promise<SatCatalogs> {
  catalogsRequest ??= getJson<SatCatalogs>("/api/sat/catalogs").catch((error: unknown) => {
    catalogsRequest = null; // un fallo no queda cacheado
    throw error;
  });

  return catalogsRequest;
}

/** Sólo para pruebas: olvida la respuesta cacheada. */
export function resetSatCatalogsCache(): void {
  catalogsRequest = null;
}

export function searchProductKeys(query: string, signal?: AbortSignal): Promise<SatProductKey[]> {
  return getJson<SatProductKey[]>(`/api/sat/product-keys?q=${encodeURIComponent(query.trim())}`, signal);
}

export function searchUnitKeys(query: string, signal?: AbortSignal): Promise<SatUnitKey[]> {
  return getJson<SatUnitKey[]>(`/api/sat/unit-keys?q=${encodeURIComponent(query.trim())}`, signal);
}
