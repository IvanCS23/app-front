import type { LineTax, LineTaxFields } from "@/src/types/tax";

/**
 * Fase 6.34 — presentación de importes con el cálculo estilo SAT.
 *
 * El backend calcula todo: las líneas se muestran a 2 decimales, el importe
 * exacto (hasta 6) sólo como detalle, y los totales del documento son los
 * del backend. Aquí no se calcula ningún importe: sólo se comparan centavos
 * para decidir si mostrar la nota de redondeo.
 */

export const ROUNDING_NOTE =
  "Los impuestos se calculan sobre los importes exactos de cada concepto y se redondean al final, como en el CFDI.";

/** "1.15" → 115, "-0.05" → -5. Sin aritmética de punto flotante. */
export function toCents(value: string | number | null | undefined): number {
  const text = String(value ?? "0").trim();
  const match = /^(-?)(\d*)(?:\.(\d*))?$/.exec(text);
  if (!match) return Number.NaN;
  const [, sign, whole, fraction = ""] = match;
  const cents = Number(whole || "0") * 100 + Number((fraction + "00").slice(0, 2));
  return sign === "-" ? -cents : cents;
}

/**
 * ¿La suma de los importes visibles de las líneas (a 2 decimales) difiere del
 * total del documento? Pasa con el cálculo estilo SAT (p. ej. tres conceptos
 * de 0.33 con IVA: líneas 0.38 × 3 = 1.14, total 1.15).
 */
export function visibleLinesDifferFromTotal(lineTotals: string[], total: string): boolean {
  if (lineTotals.length === 0) return false;
  const sum = lineTotals.reduce((acc, value) => acc + toCents(value), 0);
  const expected = toCents(total);
  return Number.isFinite(sum) && Number.isFinite(expected) && sum !== expected;
}

/** Un importe exacto del backend sin ceros de más, con al menos 2 decimales: "0.052800" → "0.0528". */
export function formatExact(value: string): string {
  const match = /^(-?\d+)(?:\.(\d+))?$/.exec(value.trim());
  if (!match) return value;
  const fraction = (match[2] ?? "").replace(/0+$/, "").padEnd(2, "0");
  return `${match[1]}.${fraction}`;
}

/** "0.160000" → "16", "0.106667" → "10.6667". */
function percent(rate: string | null): string {
  if (rate === null) return "";
  const match = /^(\d+)(?:\.(\d+))?$/.exec(rate);
  if (!match) return rate;
  // × 100 sin flotantes: con 6 decimales, los últimos 4 dígitos son la fracción.
  const digits = `${match[1]}${(match[2] ?? "").padEnd(6, "0").slice(0, 6)}`;
  const whole = digits.slice(0, -4).replace(/^0+(?=\d)/, "") || "0";
  const fraction = digits.slice(-4).replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole;
}

const TAX_NAMES: Record<string, string> = { "001": "ISR", "002": "IVA", "003": "IEPS" };

/** "IVA 16 %", "IVA retenido 10.6667 %", "IEPS cuota 1.5", "IVA exento". */
export function lineTaxLabel(tax: LineTax): string {
  const name = TAX_NAMES[tax.tax] ?? tax.tax;
  const kind = tax.kind === "retencion" ? " retenido" : "";
  if (tax.factor === "exento") return `${name} exento`;
  if (tax.factor === "cuota") return `${name}${kind} cuota ${formatExact(tax.rate ?? "0")}`;
  return `${name}${kind} ${percent(tax.rate)} %`;
}

export interface ExactDetail {
  label: string;
  value: string;
}

/**
 * El detalle exacto de una línea, tal como lo guardó el backend: importe del
 * concepto y el importe de cada impuesto. Vacío en líneas anteriores a la
 * 6.34 sin importe exacto ni impuestos.
 */
export function lineExactDetails(item: LineTaxFields & { discount?: string }): ExactDetail[] {
  const details: ExactDetail[] = [];
  if (item.subtotal_exact) details.push({ label: "Importe exacto", value: formatExact(item.subtotal_exact) });
  if (item.discount && toCents(item.discount) !== 0) details.push({ label: "Descuento", value: formatExact(item.discount) });
  for (const tax of item.taxes ?? []) {
    if (tax.factor === "exento" || tax.amount === null || tax.amount === undefined) continue;
    details.push({ label: lineTaxLabel(tax), value: `${tax.kind === "retencion" ? "−" : ""}${formatExact(tax.amount)}` });
  }
  return details;
}
