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

export interface ReadinessIssueView {
  message: string;
  href?: string;
  linkLabel?: string;
}

const CLIENTS_FIX = { href: "/pages/catalogs/clients", linkLabel: "Corregir en Clientes" };
const PRODUCTS_FIX = { href: "/pages/catalogs/products", linkLabel: "Corregir en Productos" };
const PAYMENT_FIX = { href: "#sale-payment", linkLabel: "Corregir forma y método de pago" };
const ITEMS_FIX = { href: "#sale-items", linkLabel: "Revisar los conceptos" };

const READINESS_VIEWS: Record<string, ReadinessIssueView> = {
  SALE_CLIENT_MISSING: { message: "La venta no tiene un cliente válido.", href: "#sale-client", linkLabel: "Elegir cliente" },
  SALE_NO_ITEMS: { message: "La venta no tiene conceptos.", ...ITEMS_FIX },
  SALE_CANCELLED: { message: "La venta está cancelada y no puede facturarse." },
  SALE_INVALID_CURRENCY: { message: "La venta no tiene una moneda válida." },
  SALE_TOTALS_MISMATCH: { message: "Los totales de la venta no coinciden con sus conceptos. Edita un concepto para recalcularlos." },
  SALE_PAYMENT_FORM_MISSING: { message: "Falta la forma de pago (ni la empresa tiene una predeterminada).", ...PAYMENT_FIX },
  SALE_PAYMENT_METHOD_MISSING: { message: "Falta el método de pago (ni la empresa tiene uno predeterminado).", ...PAYMENT_FIX },
  SALE_PPD_REQUIRES_FORM_99: { message: "Con método de pago PPD la forma de pago debe ser 99 (Por definir).", ...PAYMENT_FIX },
  SALE_PUE_FORBIDS_FORM_99: { message: "Con método de pago PUE la forma de pago no puede ser 99 (Por definir).", ...PAYMENT_FIX },
  CLIENT_NAME_MISSING: { message: "El cliente no tiene nombre o razón social.", ...CLIENTS_FIX },
  CLIENT_RFC_MISSING: { message: "El cliente no tiene RFC.", ...CLIENTS_FIX },
  CLIENT_POSTAL_CODE_MISSING: { message: "El cliente no tiene código postal.", ...CLIENTS_FIX },
  CLIENT_FISCAL_REGIME_MISSING: { message: "El cliente no tiene régimen fiscal.", ...CLIENTS_FIX },
  CLIENT_CFDI_USE_MISSING: { message: "El cliente no tiene uso de CFDI.", ...CLIENTS_FIX },
  CLIENT_EMAIL_MISSING: { message: "El cliente no tiene correo electrónico para enviarle el CFDI.", ...CLIENTS_FIX },
  ITEM_PRODUCT_MISSING: { message: "Un concepto no tiene un producto válido.", ...ITEMS_FIX },
  ITEM_DESCRIPTION_MISSING: { message: "Un concepto no tiene descripción.", ...ITEMS_FIX },
  ITEM_INVALID_QUANTITY: { message: "Un concepto tiene una cantidad inválida.", ...ITEMS_FIX },
  ITEM_INVALID_UNIT_PRICE: { message: "Un concepto tiene un precio inválido.", ...ITEMS_FIX },
  ITEM_PRODUCT_SAT_KEY_MISSING: { message: "El producto no tiene clave de producto o servicio SAT.", ...PRODUCTS_FIX },
  ITEM_PRODUCT_UNIT_KEY_MISSING: { message: "El producto no tiene clave de unidad SAT.", ...PRODUCTS_FIX },
  ITEM_PRODUCT_OBJETO_IMP_MISSING: { message: "El producto no tiene objeto de impuesto SAT.", ...PRODUCTS_FIX },
  ITEM_PRODUCT_TYPE_INVALID: { message: "El producto no tiene un tipo válido.", ...PRODUCTS_FIX },
  ITEM_TAX_RATE_INVALID: { message: "Un concepto usa una tasa de impuesto inexistente o inactiva.", ...ITEMS_FIX },
  ITEM_TAX_WITHHOLDING_UNSUPPORTED: { message: "Un concepto usa una retención, que todavía no se puede facturar.", ...ITEMS_FIX },
};

/** Mensaje claro y, si aplica, dónde corregirlo; si el código es nuevo, usa el del backend. */
export function readinessIssueView(issue: { code: string; message: string }): ReadinessIssueView {
  return READINESS_VIEWS[issue.code] ?? { message: issue.message };
}

/** Id de la línea a la que se refiere un problema ("items.12.product.clave_producto" → 12). */
export function readinessIssueItemId(field: string): number | null {
  const match = /^items\.(\d+)\b/.exec(field);
  return match ? Number(match[1]) : null;
}

/**
 * Tasa preseleccionada a partir del IVA del producto. El catálogo guarda el
 * IVA como "16.00" o "0.16" según quién lo capturó; ambos equivalen a 16 %.
 */
export function defaultTaxRateId(productIva: number | string | null | undefined, taxRates: { id: number; rate: string; factor_type: string }[]): number | null {
  if (productIva === null || productIva === undefined || productIva === "") return null;
  const raw = Number(productIva);
  if (!Number.isFinite(raw)) return null;
  const rate = raw > 1 ? raw / 100 : raw;
  const match = taxRates.find((taxRate) => taxRate.factor_type === "tasa" && Math.abs(Number(taxRate.rate) - rate) < 0.000001);
  return match?.id ?? null;
}
