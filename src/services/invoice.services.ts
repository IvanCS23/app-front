import { API_URL } from "@/src/config/api";
import { clearSession } from "@/src/services/auth.services";
import { getAuthHeaders } from "@/src/services/http";
import type { InvoiceCollectionResponse, InvoiceDetail, InvoiceQuery } from "@/src/types/invoice";

interface InvoiceErrorBody {
  message?: string;
  errors?: Record<string, string[]>;
}

export class InvoiceListApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "InvoiceListApiError";
  }
}

export class InvoiceCommercialApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "InvoiceCommercialApiError";
  }
}

function handleUnauthorized(response: Response): void {
  if (response.status !== 401 || typeof window === "undefined") return;
  clearSession();
  window.location.assign("/login");
}

export async function getInvoices(query: InvoiceQuery = {}, signal?: AbortSignal): Promise<InvoiceCollectionResponse> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const queryString = params.toString();
  const response = await fetch(`${API_URL}/api/invoices${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
    headers: getAuthHeaders(),
    signal,
  });

  handleUnauthorized(response);

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as InvoiceErrorBody | null;
    const message = response.status === 403
      ? "No tienes permisos para consultar las facturas."
      : response.status === 422
        ? "Los filtros enviados no son válidos."
        : body?.message || "No fue posible cargar las facturas.";
    throw new InvoiceListApiError(message, response.status);
  }

  return (await response.json()) as InvoiceCollectionResponse;
}

async function commercialRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...getAuthHeaders(),
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  handleUnauthorized(response);

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as InvoiceErrorBody | null;
    const message = response.status === 404
      ? "Factura no encontrada."
      : response.status === 403
        ? "No tienes permisos para consultar esta factura."
        : body?.errors?.notes?.[0] ?? body?.message ?? "No fue posible completar la acción comercial.";
    throw new InvoiceCommercialApiError(message, response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function getInvoiceDetail(id: number, signal?: AbortSignal): Promise<InvoiceDetail> {
  return commercialRequest(`/api/invoices/${id}`, { signal });
}

export function updateInvoiceNotes(id: number, notes: string | null): Promise<InvoiceDetail> {
  return commercialRequest(`/api/invoices/${id}`, {
    method: "PUT",
    body: JSON.stringify({ notes }),
  });
}

export function markInvoiceReady(id: number): Promise<InvoiceDetail> {
  return commercialRequest(`/api/invoices/${id}/ready`, { method: "POST" });
}

export function deleteInvoice(id: number): Promise<void> {
  return commercialRequest(`/api/invoices/${id}`, { method: "DELETE" });
}
