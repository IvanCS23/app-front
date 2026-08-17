import { API_URL } from "@/src/config/api";
import { clearSession } from "@/src/services/auth.services";
import { getAuthHeaders } from "@/src/services/http";
import type {
  CancelInvoiceBusinessPayload,
  CancelInvoicePacPayload,
  InvoiceApiErrorBody,
  InvoiceBilling,
  InvoiceSummary,
} from "@/src/types/invoice-billing";

export class InvoiceApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string | null,
  ) {
    super(message);
    this.name = "InvoiceApiError";
  }
}

async function parseError(response: Response): Promise<InvoiceApiError> {
  const body = (await response.json().catch(() => null)) as InvoiceApiErrorBody | null;
  const fallback = response.status === 403
    ? "No tienes permisos para realizar esta acción."
    : "No fue posible completar la operación fiscal.";
  return new InvoiceApiError(body?.message || fallback, response.status, body?.code ?? null);
}

function handleUnauthorized(response: Response): void {
  if (response.status !== 401 || typeof window === "undefined") return;
  clearSession();
  window.location.assign("/login");
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
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
  return response.json() as Promise<T>;
}

export function getInvoiceBilling(id: number): Promise<InvoiceBilling> {
  return requestJson(`/api/invoices/${id}/billing`);
}

export function getInvoiceSummary(id: number): Promise<InvoiceSummary> {
  return requestJson(`/api/invoices/${id}`);
}

export function issueInvoicePac(id: number): Promise<InvoiceBilling> {
  return requestJson(`/api/invoices/${id}/pac/issue`, { method: "POST", body: JSON.stringify({ confirm: true }) });
}

export function issueInvoiceBusiness(id: number): Promise<InvoiceBilling> {
  return requestJson(`/api/invoices/${id}/operations/issue`, { method: "POST", body: JSON.stringify({ confirm: true }) });
}

export function reconcileInvoicePac(id: number): Promise<InvoiceBilling> {
  return requestJson(`/api/invoices/${id}/pac/reconcile`, { method: "POST" });
}

export function fetchInvoiceArtifacts(id: number): Promise<InvoiceBilling> {
  return requestJson(`/api/invoices/${id}/pac/artifacts`, { method: "POST" });
}

export function cancelInvoicePac(id: number, payload: CancelInvoicePacPayload): Promise<InvoiceBilling> {
  return requestJson(`/api/invoices/${id}/pac/cancel`, { method: "POST", body: JSON.stringify(payload) });
}

export function cancelInvoiceBusiness(id: number, payload: CancelInvoiceBusinessPayload): Promise<InvoiceBilling> {
  return requestJson(`/api/invoices/${id}/operations/cancel`, { method: "POST", body: JSON.stringify(payload) });
}

export function fetchCancellationReceipt(id: number): Promise<InvoiceBilling> {
  return requestJson(`/api/invoices/${id}/pac/cancellation-receipt`, { method: "POST" });
}

export async function downloadAuthenticatedFile(path: string, filename: string): Promise<void> {
  const response = await fetch(`${API_URL}${path}`, { headers: getAuthHeaders() });
  handleUnauthorized(response);
  if (!response.ok) throw await parseError(response);
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  try {
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export const downloadCfdiXml = (id: number, folio: string) => downloadAuthenticatedFile(`/api/invoices/${id}/cfdi/xml`, `CFDI-${folio}.xml`);
export const downloadCfdiPdf = (id: number, folio: string) => downloadAuthenticatedFile(`/api/invoices/${id}/cfdi/pdf`, `CFDI-${folio}.pdf`);
export const downloadCancellationReceiptXml = (id: number, folio: string) => downloadAuthenticatedFile(`/api/invoices/${id}/cancellation-receipt/xml`, `ACUSE-${folio}.xml`);
export const downloadCancellationReceiptPdf = (id: number, folio: string) => downloadAuthenticatedFile(`/api/invoices/${id}/cancellation-receipt/pdf`, `ACUSE-${folio}.pdf`);
