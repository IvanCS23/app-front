import type { InvoiceStatus } from "@/src/types/invoice";
import type { LineTaxFields } from "@/src/types/tax";

/** Fase 6.25 — contrato de las ventas (api-v1 SaleResource). */
export type SaleStatus = "draft" | "pending" | "confirmed" | "cancelled";

export type PaymentMethod = "PUE" | "PPD";

/** Fase 6.34: con su importe exacto e impuestos por línea (LineTaxFields). */
export interface SaleItem extends LineTaxFields {
  id: number;
  sale_id: number;
  product_id: number | null;
  tax_rate_id: number | null;
  description: string;
  quantity: string;
  unit_price: string;
  discount: string;
  subtotal: string;
  tax_total: string;
  total: string;
}

export interface SaleClientSummary {
  id: number;
  name: string;
  rfc: string;
}

export interface SaleInvoiceSummary {
  id: number;
  folio: string;
  status: InvoiceStatus;
}

export interface Sale {
  id: number;
  client_id: number | null;
  folio: string;
  status: SaleStatus;
  currency: string;
  payment_form: string | null;
  payment_method: PaymentMethod | null;
  subtotal: string;
  discount_total: string;
  tax_total: string;
  /** Fase 6.34: trasladados y retenidos (tax_total = trasladados). */
  taxes_transferred?: string;
  taxes_withheld?: string;
  total: string;
  notes: string | null;
  confirmed_at: string | null;
  cancelled_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  client?: SaleClientSummary | null;
  invoice?: SaleInvoiceSummary | null;
  items?: SaleItem[];
}

export interface SaleCollectionResponse {
  data: Sale[];
  links: { first: string | null; last: string | null; prev: string | null; next: string | null };
  meta: { current_page: number; from: number | null; last_page: number; per_page: number; to: number | null; total: number };
}

export interface SaleQuery {
  search?: string;
  status?: SaleStatus;
  page?: number;
  per_page?: 10 | 20 | 50 | 100;
}

export interface SalePayload {
  client_id?: number;
  notes?: string | null;
  payment_form?: string | null;
  payment_method?: PaymentMethod | null;
}

export interface SaleItemPayload {
  product_id: number;
  quantity: number;
  unit_price?: number;
  discount?: number;
  tax_rate_id?: number | null;
}

export interface ReadinessIssue {
  code: string;
  field: string;
  message: string;
  /** Fase 6.34: en SALE_TOTALS_WILL_BE_RECALCULATED. */
  previous_total?: string;
  new_total?: string;
  /** Fase 6.34: avisos legales de retención, pendientes de contador. */
  pending_accountant?: boolean;
}

export interface SaleBillingReadiness {
  ready: boolean;
  errors: ReadinessIssue[];
  warnings: ReadinessIssue[];
}

export interface TaxRate {
  id: number;
  code: string | null;
  name: string;
  rate: string;
  tax_type: "traslado" | "retencion";
  factor_type: "tasa" | "cuota" | "exento";
}

/** Resultado de POST /sales/{id}/invoice: 201 = creada, 200 = ya existía. */
export interface InvoiceSaleResult {
  created: boolean;
  invoice: { id: number; folio: string; status: InvoiceStatus };
}
