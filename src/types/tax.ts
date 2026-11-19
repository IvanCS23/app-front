/**
 * Fase 6.34 — un impuesto de una línea (api-v1 LineTaxResource).
 * `amount` es el importe exacto (hasta 6 decimales); `amount_rounded`, a 2.
 */
export interface LineTax {
  /** c_Impuesto: 001 ISR, 002 IVA, 003 IEPS. */
  tax: string;
  kind: "traslado" | "retencion";
  factor: "tasa" | "cuota" | "exento";
  rate: string | null;
  ieps_mode: string | null;
  position: number;
  base?: string;
  amount?: string | null;
  amount_rounded?: string;
}

/** Campos de importes exactos e impuestos que comparten las líneas de venta y de factura. */
export interface LineTaxFields {
  /** Importe exacto del concepto (6 decimales); null en líneas anteriores a la 6.34. */
  subtotal_exact?: string | null;
  taxes_transferred?: string;
  taxes_withheld?: string;
  taxes?: LineTax[];
}
