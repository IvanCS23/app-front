import { describe, expect, it } from "vitest";
import { emptyInvoiceFilters, formatInvoiceDate, formatInvoiceMoney, getInvoiceStatusClass, getInvoiceStatusText, invoiceFiltersToQuery } from "./invoice";
import type { InvoiceStatus } from "@/src/types/invoice";

describe("helpers comerciales de Invoice", () => {
  it.each([
    ["draft", "Borrador"], ["ready", "Lista para emitir"], ["issued", "Emitida"], ["cancelled", "Cancelada"],
  ] as const)("mapea estado %s", (status: InvoiceStatus, label: string) => {
    expect(getInvoiceStatusText(status)).toBe(label);
    expect(getInvoiceStatusClass(status)).toBeTruthy();
  });

  it("formatea importes y fechas protegiendo valores inválidos", () => {
    expect(formatInvoiceMoney("1160.00", "MXN")).toContain("1,160.00");
    expect(formatInvoiceMoney("no-number", "MXN")).toBe("no-number");
    expect(formatInvoiceMoney("10.00", "INVALID")).toBe("10.00");
    expect(formatInvoiceDate("2026-08-13T12:00:00Z")).not.toContain("T12:00");
    expect(formatInvoiceDate("invalid")).toBe("—");
  });

  it("convierte filtros de UI a parámetros API y omite vacíos", () => {
    expect(invoiceFiltersToQuery({ ...emptyInvoiceFilters, search: "  FAC-3 ", status: "issued", paymentMethod: "PUE", dateFrom: "2026-08-01" })).toEqual({
      search: "FAC-3", status: "issued", payment_method: "PUE", date_from: "2026-08-01",
    });
    expect(invoiceFiltersToQuery(emptyInvoiceFilters)).toEqual({});
  });
});
