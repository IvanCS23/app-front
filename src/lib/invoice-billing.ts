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
] as const;

/** Fase 6.31: etiqueta del ambiente del PAC de la factura. */
export function getEnvironmentLabel(billing: InvoiceBilling): { label: string; live: boolean } | null {
  if (billing.pac.mode === "live") return { label: "Producción", live: true };
  if (billing.pac.mode === "test") return { label: "Pruebas", live: false };
  return null;
}

/** Fase 6.31: factura de otro ambiente o con operaciones sin ambiente registrado. */
export function getEnvironmentNotice(billing: InvoiceBilling): { title: string; description: string } | null {
  if (billing.pac.environment_status === "mismatch") {
    return {
      title: "Factura de otro ambiente fiscal",
      description: "Se operó en un ambiente del proveedor fiscal (pruebas o producción) distinto del que usa ahora la empresa. Se conserva como registro; no admite acciones fiscales.",
    };
  }
  if (billing.pac.environment_status === "unbound") {
    return {
      title: "Ambiente fiscal sin registrar",
      description: "La factura tiene operaciones del proveedor fiscal anteriores al registro del ambiente. Un administrador debe registrarlo antes de continuar.",
    };
  }
  return null;
}

/** Fase 6.31: aviso del correo de contacto (en pruebas no bloquea la emisión). */
export function getContactEmailNotice(issue: "missing" | "mismatch" | null, live: boolean): string | null {
  if (issue === "missing") return `La empresa no tiene correo de contacto: es la dirección a la que responden tus clientes.${live ? " En producción no se puede emitir sin él." : " En producción será obligatorio."} Captúralo en Configuración > Datos fiscales.`;
  if (issue === "mismatch") return `El correo de respuesta de Facturapi no es el correo de contacto de la empresa.${live ? " En producción no se puede emitir así." : " En producción será obligatorio que coincidan."} Guarda de nuevo los Datos fiscales para sincronizarlo.`;
  return null;
}

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
  organization_archived: "Factura archivada: organización fiscal inaccesible",
  cfdi_folio_mismatch: "El CFDI se timbró con un folio distinto al del ERP",
  issue_reverted: "La factura regresó a Lista para emitir",
  email_sent: "CFDI enviado por correo",
  email_failed: "El correo no se envió",
  email_uncertain: "No se pudo confirmar el envío por correo",
  email_skipped: "Envío automático por correo omitido",
};

/**
 * Fase 6.27: una factura emitida en otra organización de Facturapi (o
 * archivada por eso) no admite acciones fiscales; Laravel ya las apaga y
 * aquí sólo se explica por qué.
 */
export function getOrganizationNotice(billing: InvoiceBilling): { title: string; description: string } | null {
  if (billing.pac.organization_status === "archived") {
    return {
      title: "Factura archivada",
      description: "Se emitió en una organización de Facturapi a la que esta empresa ya no tiene acceso. Se conserva como registro; no admite acciones fiscales.",
    };
  }
  if (billing.pac.organization_status === "other") {
    return {
      title: "Factura de otra organización fiscal",
      description: "Se emitió en una organización de Facturapi distinta de la de esta empresa, así que no se puede consultar, cancelar ni descargar con la configuración actual. Un administrador debe revisarla.",
    };
  }
  return null;
}

const EMAIL_SKIP_REASONS: Record<string, string> = {
  no_recipients: "el cliente no tiene un correo válido",
  daily_limit: "se alcanzó el límite diario de envíos",
};

export function getTimelineLabel(event: InvoicePacTimelineEvent): string {
  const label = timelineLabels[event.type] ?? "Actividad fiscal actualizada";
  // Fase 6.28: el folio esperado y el timbrado explican la diferencia.
  const expected = event.context?.expected_folio;
  const received = event.context?.received_folio;
  if (event.type === "cfdi_folio_mismatch" && typeof expected === "string" && typeof received === "string") {
    return `${label} (esperado ${expected}, timbrado ${received})`;
  }
  // Fase 6.30: a quién y si fue automático; o por qué se omitió.
  if (event.type.startsWith("email_")) {
    const recipients = Array.isArray(event.context?.recipients) ? event.context.recipients.filter((value): value is string => typeof value === "string") : [];
    const parts = [recipients.length > 0 ? `a ${recipients.join(", ")}` : null, event.context?.trigger === "auto" ? "automático" : null, event.type === "email_skipped" ? EMAIL_SKIP_REASONS[String(event.context?.reason)] ?? null : null].filter(Boolean);
    return parts.length > 0 ? `${label} (${parts.join("; ")})` : label;
  }
  return label;
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
