import type {
  InvoiceBilling,
  InvoiceCancellationStatus,
  InvoicePacTimelineEvent,
} from "@/src/types/invoice-billing";

export type FiscalTone = "success" | "warning" | "danger" | "neutral";

export interface HumanStatus {
  label: string;
  description: string;
  tone: FiscalTone;
}

export const cancellationMotives = [
  { value: "01", label: "01 — Comprobante emitido con errores con relación" },
  { value: "02", label: "02 — Comprobante emitido con errores sin relación" },
  { value: "03", label: "03 — No se llevó a cabo la operación" },
  { value: "04", label: "04 — Operación nominativa relacionada en factura global" },
] as const;

export function getFiscalStatus(billing: InvoiceBilling): HumanStatus {
  if (billing.pac.reconciliation_required || billing.pac.issue_status === "reconciliation_required") {
    return { label: "Requiere revisión", description: "El estado fiscal debe reconciliarse con el PAC.", tone: "warning" };
  }
  if (billing.pac.status === "canceled") {
    return { label: "CFDI cancelado", description: "La cancelación fiscal fue confirmada.", tone: "danger" };
  }
  if (billing.pac.issue_status === "pending" || billing.pac.status === "pending") {
    return { label: "Emisión en proceso", description: "El proveedor fiscal está procesando la emisión.", tone: "warning" };
  }
  if (billing.pac.status === "valid" || billing.pac.issue_status === "succeeded") {
    return { label: "CFDI válido", description: "El comprobante fiscal fue timbrado correctamente.", tone: "success" };
  }
  return { label: "No timbrado", description: "La factura aún no cuenta con un CFDI.", tone: "neutral" };
}

export function getCancellationStatus(status: InvoiceCancellationStatus): HumanStatus {
  const states: Record<string, HumanStatus> = {
    pending: { label: "Cancelación en proceso", description: "La solicitud está pendiente.", tone: "warning" },
    verifying: { label: "Cancelación en proceso", description: "El SAT está verificando la solicitud.", tone: "warning" },
    accepted: { label: "Cancelado", description: "La cancelación fue aceptada.", tone: "danger" },
    rejected: { label: "Cancelación rechazada", description: "La solicitud fue rechazada.", tone: "danger" },
    expired: { label: "Solicitud expirada", description: "La solicitud de cancelación expiró.", tone: "warning" },
  };
  return status ? states[status] ?? { label: "Estado por revisar", description: "Estado de cancelación no reconocido.", tone: "neutral" } : { label: "Sin cancelación", description: "No hay una solicitud de cancelación activa.", tone: "neutral" };
}

const timelineLabels: Record<string, string> = {
  draft_created: "Preparación fiscal iniciada",
  draft_synced: "Información fiscal sincronizada",
  draft_updated: "Datos fiscales actualizados",
  issue_attempted: "Emisión solicitada",
  issue_succeeded: "CFDI emitido",
  issue_failed: "La emisión no pudo completarse",
  stamp_attempted: "Timbrado solicitado",
  stamp_succeeded: "CFDI timbrado",
  stamp_failed: "El timbrado no pudo confirmarse",
  reconciled: "Estado reconciliado con el PAC",
  reconciliation_required: "Revisión fiscal requerida",
  artifacts_stored: "XML y PDF almacenados",
  artifacts_failed: "No fue posible obtener XML y PDF",
  cancellation_requested: "Cancelación solicitada",
  cancellation_pending: "Cancelación en proceso",
  cancellation_accepted: "Cancelación aceptada",
  cancellation_rejected: "Cancelación rechazada",
  cancellation_expired: "Solicitud de cancelación expirada",
  cancellation_receipt_attempted: "Acuse solicitado",
  cancellation_receipt_stored: "Acuse almacenado",
  cancellation_receipt_unavailable: "Acuse aún no disponible",
  cancellation_receipt_identity_mismatch: "Problema de identidad del acuse",
};

export function getTimelineLabel(event: InvoicePacTimelineEvent): string {
  return timelineLabels[event.type] ?? "Actividad fiscal actualizada";
}

export function formatFiscalDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function formatInvoiceTotal(total: string | number, currency: string): string {
  const amount = typeof total === "number" ? total : Number(total);
  if (!Number.isFinite(amount)) return "—";
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: currency || "MXN" }).format(amount);
}

export function canIssueCfdi(billing: InvoiceBilling): boolean {
  return billing.status === "issued"
    && !billing.cfdi.uuid
    && billing.pac.status !== "valid"
    && billing.pac.issue_status !== "succeeded"
    && billing.pac.issue_status !== "pending"
    && !billing.pac.reconciliation_required;
}

export function canCancelCfdi(billing: InvoiceBilling): boolean {
  return billing.pac.status === "valid"
    && !["pending", "verifying", "accepted"].includes(billing.pac.cancellation_status ?? "");
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.trim());
}
