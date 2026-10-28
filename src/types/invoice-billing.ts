export type InvoicePacStatus = "draft" | "pending" | "valid" | "canceled" | string | null;
export type InvoiceIssueStatus = "pending" | "succeeded" | "failed" | "reconciliation_required" | string | null;
export type InvoiceCancellationStatus = "pending" | "verifying" | "accepted" | "rejected" | "expired" | string | null;

export interface InvoicePacState {
  /** Fase 6.22: modo PAC configurado; nunca incluye la llave. */
  mode: "test" | "live" | null;
  provider: string | null;
  status: InvoicePacStatus;
  cancellation_status: InvoiceCancellationStatus;
  issue_status: InvoiceIssueStatus;
  reconciliation_required: boolean;
  last_sync_at: string | null;
  /**
   * Fase 6.27: organización de Facturapi de la factura frente a la de la
   * empresa (null si nunca llegó al PAC). Nunca incluye el ID.
   */
  organization_status: InvoiceOrganizationStatus;
  organization_archived_at: string | null;
}

export type InvoiceOrganizationStatus = "current" | "other" | "archived" | "unknown" | null;

export interface InvoiceArtifactState {
  status: string | null;
  xml_available: boolean;
  pdf_available: boolean;
  downloaded_at: string | null;
}

export interface InvoiceCfdiState {
  uuid: string | null;
  stamped_at: string | null;
  artifacts: InvoiceArtifactState;
}

export interface InvoiceCancellationReceiptState {
  status: string | null;
  available: boolean;
  downloaded_at: string | null;
  error_code: string | null;
}

export type InvoicePacEventContext = Record<string, string | number | boolean | string[] | null>;

export interface InvoicePacTimelineEvent {
  id: number;
  type: string;
  occurred_at: string | null;
  pac_status: string | null;
  cancellation_status: string | null;
  issue_status: string | null;
  pac_code: string | null;
  context: InvoicePacEventContext;
}

export interface InvoiceBilling {
  id: number;
  folio: string;
  status: InvoiceStatus | null;
  actions: InvoiceBusinessActions;
  pac: InvoicePacState;
  cfdi: InvoiceCfdiState;
  cancellation_receipt: InvoiceCancellationReceiptState;
  timeline: InvoicePacTimelineEvent[];
}

export type InvoiceCancellationMode = "erp_only" | "pac" | "erp_convergence" | null;

export interface InvoiceBusinessActions {
  can_issue: boolean;
  can_cancel: boolean;
  can_reconcile: boolean;
  /** Fase 6.21: CFDI vigente o cancelado sin XML/PDF y sin descarga en curso. */
  can_fetch_artifacts: boolean;
  /** Fase 6.22: acuse obtenible; en test se apaga tras el primer bloqueo de identidad, en live tras 3. */
  can_fetch_cancellation_receipt: boolean;
  cancellation_mode: InvoiceCancellationMode;
}

export interface InvoiceSummary {
  id: number;
  folio: string;
  total: string | number;
  currency: string;
  client_name: string | null;
}

export type CfdiCancellationMotive = "01" | "02" | "03" | "04";

export interface CancelInvoicePacPayload {
  motive: CfdiCancellationMotive;
  substitution_uuid?: string;
  confirm: true;
}

export interface CancelInvoiceBusinessPayload {
  motive?: CfdiCancellationMotive;
  substitution_uuid?: string;
  confirm: true;
}

export interface InvoiceApiErrorBody {
  message?: string;
  code?: string;
  errors?: Record<string, string[]> | Array<{ code: string; field: string }>;
}
import type { InvoiceStatus } from "@/src/types/invoice";
