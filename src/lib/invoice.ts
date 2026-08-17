import type { InvoiceListItem, InvoiceQuery, InvoiceStatus } from "@/src/types/invoice";

export interface InvoiceFilters {
  search: string;
  status: "all" | InvoiceStatus;
  paymentMethod: "all" | "PUE" | "PPD";
  dateFrom: string;
  dateTo: string;
}

export const emptyInvoiceFilters: InvoiceFilters = {
  search: "",
  status: "all",
  paymentMethod: "all",
  dateFrom: "",
  dateTo: "",
};

export const invoiceStatusOptions = [
  { value: "all", label: "Todas" },
  { value: "draft", label: "Borrador" },
  { value: "ready", label: "Lista para emitir" },
  { value: "issued", label: "Emitida" },
  { value: "cancelled", label: "Cancelada" },
] as const;

export function getInvoiceStatusText(status: InvoiceStatus): string {
  return {
    draft: "Borrador",
    ready: "Lista para emitir",
    issued: "Emitida",
    cancelled: "Cancelada",
  }[status];
}

export function getInvoiceStatusClass(status: InvoiceStatus): string {
  return {
    draft: "status-warning",
    ready: "inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700",
    issued: "status-success",
    cancelled: "status-danger",
  }[status];
}

export const isInvoiceEditable = (status: InvoiceStatus): boolean => status === "draft" || status === "ready";
export const canMarkInvoiceReady = (status: InvoiceStatus): boolean => status === "draft";
export const canDeleteInvoice = isInvoiceEditable;

export function formatInvoiceMoney(value: string, currency: string): string {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return value;
  try {
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: currency || "MXN" }).format(amount);
  } catch {
    return value;
  }
}

export function invoiceDateValue(invoice: InvoiceListItem): string {
  return invoice.issued_at ?? invoice.created_at;
}

export function formatInvoiceDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" }).format(date);
}

export function invoiceFiltersToQuery(filters: InvoiceFilters): InvoiceQuery {
  const search = filters.search.trim();
  return {
    ...(search ? { search } : {}),
    ...(filters.status !== "all" ? { status: filters.status } : {}),
    ...(filters.paymentMethod !== "all" ? { payment_method: filters.paymentMethod } : {}),
    ...(filters.dateFrom ? { date_from: filters.dateFrom } : {}),
    ...(filters.dateTo ? { date_to: filters.dateTo } : {}),
  };
}
