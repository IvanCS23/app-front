import { API_URL } from "@/src/config/api";
import { clearSession } from "@/src/services/auth.services";
import { getAuthHeaders } from "@/src/services/http";
import type {
  InvoiceSaleResult,
  ReadinessIssue,
  Sale,
  SaleBillingReadiness,
  SaleCollectionResponse,
  SaleItem,
  SaleItemPayload,
  SalePayload,
  SaleQuery,
  TaxRate,
} from "@/src/types/sale";

interface SaleErrorBody {
  message?: string;
  code?: string;
  errors?: Record<string, string[]> | ReadinessIssue[];
}

/**
 * Fase 6.25: error de la API de ventas. `issues` trae los problemas de
 * facturación (422 SALE_NOT_BILLABLE); `fieldErrors`, los de validación
 * de un Form Request.
 */
export class SaleApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string | null = null,
    public readonly issues: ReadinessIssue[] = [],
    public readonly fieldErrors: Record<string, string[]> = {},
  ) {
    super(message);
    this.name = "SaleApiError";
  }
}

function handleUnauthorized(response: Response): void {
  if (response.status !== 401 || typeof window === "undefined") return;
  clearSession();
  window.location.assign("/login");
}

async function parseError(response: Response): Promise<SaleApiError> {
  const body = (await response.json().catch(() => null)) as SaleErrorBody | null;
  const issues = Array.isArray(body?.errors) ? body.errors : [];
  const fieldErrors = body?.errors && !Array.isArray(body.errors) ? body.errors : {};
  const firstFieldError = Object.values(fieldErrors)[0]?.[0];
  const message = response.status === 404
    ? "Venta no encontrada."
    : response.status === 403
      ? "No tienes permisos para realizar esta acción."
      : firstFieldError ?? body?.message ?? "No fue posible completar la operación con la venta.";

  return new SaleApiError(message, response.status, body?.code ?? null, issues, fieldErrors);
}

async function request<T>(path: string, init?: RequestInit): Promise<{ status: number; body: T }> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...getAuthHeaders(),
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  handleUnauthorized(response);

  if (!response.ok) throw await parseError(response);

  return { status: response.status, body: response.status === 204 ? (undefined as T) : ((await response.json()) as T) };
}

export async function getSales(query: SaleQuery = {}, signal?: AbortSignal): Promise<SaleCollectionResponse> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const queryString = params.toString();

  return (await request<SaleCollectionResponse>(`/api/sales${queryString ? `?${queryString}` : ""}`, { signal })).body;
}

export async function getSale(id: number, signal?: AbortSignal): Promise<Sale> {
  return (await request<Sale>(`/api/sales/${id}`, { signal })).body;
}

export async function createSale(payload: SalePayload & { client_id: number }): Promise<Sale> {
  return (await request<Sale>("/api/sales", { method: "POST", body: JSON.stringify(payload) })).body;
}

export async function updateSale(id: number, payload: SalePayload): Promise<Sale> {
  return (await request<Sale>(`/api/sales/${id}`, { method: "PUT", body: JSON.stringify(payload) })).body;
}

export async function deleteSale(id: number): Promise<void> {
  await request<void>(`/api/sales/${id}`, { method: "DELETE" });
}

export async function addSaleItem(saleId: number, payload: SaleItemPayload): Promise<SaleItem> {
  return (await request<SaleItem>(`/api/sales/${saleId}/items`, { method: "POST", body: JSON.stringify(payload) })).body;
}

export async function updateSaleItem(saleId: number, itemId: number, payload: Partial<SaleItemPayload>): Promise<SaleItem> {
  return (await request<SaleItem>(`/api/sales/${saleId}/items/${itemId}`, { method: "PUT", body: JSON.stringify(payload) })).body;
}

export async function deleteSaleItem(saleId: number, itemId: number): Promise<void> {
  await request<void>(`/api/sales/${saleId}/items/${itemId}`, { method: "DELETE" });
}

export async function getSaleBillingReadiness(id: number, signal?: AbortSignal): Promise<SaleBillingReadiness> {
  return (await request<SaleBillingReadiness>(`/api/sales/${id}/billing-readiness`, { signal })).body;
}

/**
 * Fase 6.25: una sola llamada factura la venta (envía, confirma, convierte
 * y deja la factura ready). 201 = creada, 200 = ya existía.
 */
export async function invoiceSale(id: number): Promise<InvoiceSaleResult> {
  const { status, body } = await request<InvoiceSaleResult["invoice"]>(`/api/sales/${id}/invoice`, { method: "POST" });

  return { created: status === 201, invoice: { id: body.id, folio: body.folio, status: body.status } };
}

export async function getTaxRates(signal?: AbortSignal): Promise<TaxRate[]> {
  return (await request<TaxRate[]>("/api/tax-rates", { signal })).body;
}
