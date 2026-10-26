import type { PaymentMethod, SaleStatus } from "@/src/types/sale";

/** Fase 6.25 — utilidades de presentación de ventas. */
export const saleStatusOptions = [
  { value: "all", label: "Todas" },
  { value: "draft", label: "Borrador" },
  { value: "pending", label: "Pendiente" },
  { value: "confirmed", label: "Confirmada" },
  { value: "cancelled", label: "Cancelada" },
] as const;

export function getSaleStatusText(status: SaleStatus): string {
  return { draft: "Borrador", pending: "Pendiente", confirmed: "Confirmada", cancelled: "Cancelada" }[status];
}

export function getSaleStatusClass(status: SaleStatus): string {
  return {
    draft: "status-warning",
    pending: "inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700",
    confirmed: "status-success",
    cancelled: "status-danger",
  }[status];
}

/** Sólo un borrador o una venta pendiente admiten cambios (Sale::isEditable). */
export const isSaleEditable = (status: SaleStatus): boolean => status === "draft" || status === "pending";

/**
 * Formas de pago más usadas (c_FormaPago). El catálogo completo y su
 * validación llegan en la Fase 6.26; el backend sólo exige 2 dígitos.
 */
export const paymentFormOptions = [
  { value: "01", label: "01 - Efectivo" },
  { value: "02", label: "02 - Cheque nominativo" },
  { value: "03", label: "03 - Transferencia electrónica" },
  { value: "04", label: "04 - Tarjeta de crédito" },
  { value: "28", label: "28 - Tarjeta de débito" },
  { value: "99", label: "99 - Por definir" },
] as const;

export const paymentMethodOptions: { value: PaymentMethod; label: string }[] = [
  { value: "PUE", label: "PUE - Pago en una sola exhibición" },
  { value: "PPD", label: "PPD - Pago en parcialidades o diferido" },
];

/** Misma regla que el backend (SalePaymentRules): PPD exige 99 y PUE no la admite. */
export function paymentCombinationError(form: string | null, method: PaymentMethod | null): string | null {
  if (!form || !method) return null;
  if (method === "PPD" && form !== "99") return "Con método de pago PPD la forma de pago debe ser 99 (Por definir).";
  if (method === "PUE" && form === "99") return "Con método de pago PUE la forma de pago no puede ser 99 (Por definir).";
  return null;
}
