import { describe, expect, it } from "vitest";
import {
  canCancelCfdi,
  canIssueCfdi,
  formatFiscalDate,
  getCancellationStatus,
  getFiscalStatus,
  getTimelineLabel,
  isUuid,
} from "./invoice-billing";
import type { InvoiceBilling, InvoicePacTimelineEvent } from "@/src/types/invoice-billing";

function billing(overrides: Partial<InvoiceBilling> = {}): InvoiceBilling {
  return {
    id: 3,
    folio: "FAC-00000003",
    status: "issued",
    actions: { can_issue: true, can_cancel: false, can_reconcile: false, can_fetch_artifacts: false, cancellation_mode: null },
    pac: { provider: "facturapi", status: null, cancellation_status: null, issue_status: null, reconciliation_required: false, last_sync_at: null },
    cfdi: { uuid: null, stamped_at: null, artifacts: { status: null, xml_available: false, pdf_available: false, downloaded_at: null } },
    cancellation_receipt: { status: null, available: false, downloaded_at: null, error_code: null },
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

  it("formatea fechas es-MX y valida UUID sólo como ayuda UX", () => {
    expect(formatFiscalDate("invalid")).toBe("—");
    expect(formatFiscalDate("2026-08-13T12:00:00Z")).not.toContain("T12:00");
    expect(isUuid("96013e83-154b-4153-8e61-c38b8966e560")).toBe(true);
    expect(isUuid("no-es-uuid")).toBe(false);
  });
});
