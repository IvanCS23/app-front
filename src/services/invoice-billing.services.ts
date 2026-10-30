import { API_URL } from "@/src/config/api";
import { PPD_NOT_AVAILABLE_MESSAGE } from "@/src/lib/sale";
import { clearSession } from "@/src/services/auth.services";
import { getAuthHeaders, translateApiMessage } from "@/src/services/http";
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

/**
 * El 422 INVOICE_NOT_READY_FOR_PAC sólo trae {code, field} por motivo; estos
 * motivos tienen una explicación propia para el usuario.
 */
const NOT_READY_MESSAGES: Record<string, string> = {
  INVOICE_PPD_NOT_AVAILABLE: PPD_NOT_AVAILABLE_MESSAGE,
};

function notReadyMessage(body: InvoiceApiErrorBody | null): string | null {
  if (body?.code !== "INVOICE_NOT_READY_FOR_PAC" || !Array.isArray(body.errors)) return null;
  const messages = body.errors.map((error) => NOT_READY_MESSAGES[error.code]).filter((message): message is string => Boolean(message));
  return messages.length > 0 ? `${body.message ?? "La factura no está lista para emisión fiscal."} ${messages.join(" ")}` : null;
}

async function parseError(response: Response): Promise<InvoiceApiError> {
  const body = (await response.json().catch(() => null)) as InvoiceApiErrorBody | null;
  const fallback = response.status === 403
    ? "No tienes permisos para realizar esta acción."
    : "No fue posible completar la operación fiscal.";
  const message = notReadyMessage(body) ?? translateApiMessage(body?.message, response.status, fallback);
  return new InvoiceApiError(message, response.status, body?.code ?? null);
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
