import { describe, expect, it } from "vitest";
import {
  canCancelCfdi,
  canIssueCfdi,
  formatFiscalDate,
  getCancellationStatus,
  getFiscalStatus,
  getOrganizationNotice,
  getTimelineLabel,
  isUuid,
} from "./invoice-billing";
import type { InvoiceBilling, InvoicePacTimelineEvent } from "@/src/types/invoice-billing";

function billing(overrides: Partial<InvoiceBilling> = {}): InvoiceBilling {
  return {
    id: 3,
    folio: "FAC-00000003",
    status: "issued",
    actions: { can_issue: true, can_cancel: false, can_reconcile: false, can_fetch_artifacts: false, can_fetch_cancellation_receipt: false, cancellation_mode: null, can_revert_issue: false, can_send_email: false, can_edit_email_recipients: false },
    pac: { mode: "test", provider: "facturapi", status: null, cancellation_status: null, issue_status: null, reconciliation_required: false, last_sync_at: null, organization_status: "current", organization_archived_at: null },
    cfdi: { uuid: null, stamped_at: null, artifacts: { status: null, xml_available: false, pdf_available: false, downloaded_at: null } },
    cancellation_receipt: { status: null, available: false, downloaded_at: null, error_code: null },
    email: null,
    timeline: [],
    ...overrides,
  };
}

describe("mapeo fiscal", () => {
  it("muestra no timbrado y permite emitir sólo una Invoice issued elegible", () => {
    const value = billing();
    expect(getFiscalStatus(value).label).toBe("No timbrado");
    expect(canIssueCfdi(value)).toBe(true);
  });

  it("centraliza valid, pending, canceled y reconciliation", () => {
    expect(getFiscalStatus(billing({ pac: { ...billing().pac, status: "valid" } })).label).toBe("CFDI válido");
    expect(getFiscalStatus(billing({ pac: { ...billing().pac, issue_status: "pending" } })).label).toBe("Emisión en proceso");
    expect(getFiscalStatus(billing({ pac: { ...billing().pac, status: "canceled" } })).label).toBe("CFDI cancelado");
    expect(getFiscalStatus(billing({ pac: { ...billing().pac, reconciliation_required: true } })).label).toBe("Requiere revisión");
  });

  it("oculta emisión idempotente y controla cancelación", () => {
    const valid = billing({ pac: { ...billing().pac, status: "valid", issue_status: "succeeded" }, cfdi: { ...billing().cfdi, uuid: "96013e83-154b-4153-8e61-c38b8966e560" } });
    expect(canIssueCfdi(valid)).toBe(false);
    expect(canCancelCfdi(valid)).toBe(true);
    expect(canCancelCfdi({ ...valid, pac: { ...valid.pac, cancellation_status: "pending" } })).toBe(false);
  });

  it.each([
    [null, "Sin cancelación"], ["pending", "Cancelación en proceso"], ["verifying", "Cancelación en proceso"],
    ["accepted", "Cancelado"], ["rejected", "Cancelación rechazada"], ["expired", "Solicitud expirada"],
  ] as const)("mapea cancelación %s", (status, label) => expect(getCancellationStatus(status).label).toBe(label));

  it("humaniza timeline conocido y desconocido sin mostrar nombres técnicos", () => {
    const event = (type: string): InvoicePacTimelineEvent => ({ id: 1, type, occurred_at: null, pac_status: null, cancellation_status: null, issue_status: null, pac_code: null, context: {} });
    expect(getTimelineLabel(event("stamp_succeeded"))).toBe("CFDI timbrado");
    expect(getTimelineLabel(event("future_event"))).toBe("Actividad fiscal actualizada");
  });

  it("Fase 6.28: el aviso de folio distinto muestra el esperado y el timbrado", () => {
    const mismatch: InvoicePacTimelineEvent = { id: 2, type: "cfdi_folio_mismatch", occurred_at: null, pac_status: null, cancellation_status: null, issue_status: null, pac_code: null, context: { expected_folio: "FAC19", received_folio: "FAC99" } };
    expect(getTimelineLabel(mismatch)).toBe("El CFDI se timbró con un folio distinto al del ERP (esperado FAC19, timbrado FAC99)");
    expect(getTimelineLabel({ ...mismatch, context: {} })).toBe("El CFDI se timbró con un folio distinto al del ERP");
  });

  it("formatea fechas es-MX y valida UUID sólo como ayuda UX", () => {
    expect(formatFiscalDate("invalid")).toBe("—");
    expect(formatFiscalDate("2026-08-13T12:00:00Z")).not.toContain("T12:00");
    expect(isUuid("96013e83-154b-4153-8e61-c38b8966e560")).toBe(true);
    expect(isUuid("no-es-uuid")).toBe(false);
  });

  it("Fase 6.27: explica sólo las facturas de otra organización o archivadas", () => {
    const withOrganization = (organization_status: InvoiceBilling["pac"]["organization_status"]) =>
      getOrganizationNotice(billing({ pac: { ...billing().pac, organization_status } }));

    expect(withOrganization("other")?.title).toBe("Factura de otra organización fiscal");
    expect(withOrganization("archived")?.title).toBe("Factura archivada");
    expect(withOrganization("current")).toBeNull();
    expect(withOrganization("unknown")).toBeNull();
    expect(withOrganization(null)).toBeNull();
    expect(getTimelineLabel({ type: "organization_archived" } as InvoicePacTimelineEvent)).toBe("Factura archivada: organización fiscal inaccesible");
  });
});

describe("historial del envío por correo (Fase 6.30)", () => {
  const event = (type: string, context: InvoicePacTimelineEvent["context"]): InvoicePacTimelineEvent => ({ id: 9, type, occurred_at: null, pac_status: null, cancellation_status: null, issue_status: null, pac_code: null, context });

  it("dice a quién se envió y si fue automático", () => {
    expect(getTimelineLabel(event("email_sent", { recipients: ["a@example.com", "b@example.com"], trigger: "manual" }))).toBe("CFDI enviado por correo (a a@example.com, b@example.com)");
    expect(getTimelineLabel(event("email_uncertain", { recipients: ["a@example.com"], trigger: "auto" }))).toBe("No se pudo confirmar el envío por correo (a a@example.com; automático)");
    expect(getTimelineLabel(event("email_skipped", { trigger: "auto", reason: "no_recipients" }))).toBe("Envío automático por correo omitido (automático; el cliente no tiene un correo válido)");
  });
});
