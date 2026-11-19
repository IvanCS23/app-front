import { describe, expect, it } from "vitest";
import { formatExact, lineExactDetails, lineTaxLabel, toCents, visibleLinesDifferFromTotal } from "./amounts";

describe("importes estilo CFDI (Fase 6.34)", () => {
  it("convierte importes a centavos sin flotantes", () => {
    expect(toCents("1.15")).toBe(115);
    expect(toCents("0.38")).toBe(38);
    expect(toCents("1147.5")).toBe(114750);
    expect(toCents("-0.05")).toBe(-5);
    expect(toCents(null)).toBe(0);
  });

  it("caso H: tres líneas de 0.38 suman 1.14 y el total es 1.15", () => {
    expect(visibleLinesDifferFromTotal(["0.38", "0.38", "0.38"], "1.15")).toBe(true);
    expect(visibleLinesDifferFromTotal(["0.38", "0.38", "0.39"], "1.15")).toBe(false);
    expect(visibleLinesDifferFromTotal([], "0.00")).toBe(false);
  });

  it("muestra el exacto sin ceros de más, con al menos 2 decimales", () => {
    expect(formatExact("0.052800")).toBe("0.0528");
    expect(formatExact("0.330000")).toBe("0.33");
    expect(formatExact("12.675500")).toBe("12.6755");
    expect(formatExact("100.000000")).toBe("100.00");
  });

  it("nombra cada impuesto", () => {
    expect(lineTaxLabel({ tax: "002", kind: "traslado", factor: "tasa", rate: "0.160000", ieps_mode: null, position: 0 })).toBe("IVA 16 %");
    expect(lineTaxLabel({ tax: "002", kind: "retencion", factor: "tasa", rate: "0.106667", ieps_mode: null, position: 1 })).toBe("IVA retenido 10.6667 %");
    expect(lineTaxLabel({ tax: "001", kind: "retencion", factor: "tasa", rate: "0.012500", ieps_mode: null, position: 2 })).toBe("ISR retenido 1.25 %");
    expect(lineTaxLabel({ tax: "003", kind: "traslado", factor: "cuota", rate: "1.500000", ieps_mode: "sum_before_taxes", position: 0 })).toBe("IEPS cuota 1.50");
    expect(lineTaxLabel({ tax: "002", kind: "traslado", factor: "exento", rate: null, ieps_mode: null, position: 0 })).toBe("IVA exento");
  });

  it("el detalle exacto viene tal cual del backend (importe y cada impuesto)", () => {
    expect(lineExactDetails({
      subtotal_exact: "0.330000",
      discount: "0.00",
      taxes: [{ tax: "002", kind: "traslado", factor: "tasa", rate: "0.160000", ieps_mode: null, position: 0, amount: "0.052800" }],
    })).toEqual([
      { label: "Importe exacto", value: "0.33" },
      { label: "IVA 16 %", value: "0.0528" },
    ]);

    expect(lineExactDetails({
      subtotal_exact: "1000.000000",
      taxes: [{ tax: "001", kind: "retencion", factor: "tasa", rate: "0.100000", ieps_mode: null, position: 0, amount: "100.000000" }],
    })).toContainEqual({ label: "ISR retenido 10 %", value: "−100.00" });

    // Líneas anteriores a la 6.34: sin detalle.
    expect(lineExactDetails({ subtotal_exact: null })).toEqual([]);
  });
});
