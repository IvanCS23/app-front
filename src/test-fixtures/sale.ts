import type { Sale, SaleBillingReadiness, SaleCollectionResponse, SaleItem, TaxRate } from "@/src/types/sale";

export function saleItemFixture(overrides: Partial<SaleItem> = {}): SaleItem {
  return {
    id: 1,
    sale_id: 7,
    product_id: 14,
    tax_rate_id: 1,
    description: "Producto prueba Facturapi",
    quantity: "1.000",
    unit_price: "100.00",
    discount: "0.00",
    subtotal: "100.00",
    tax_total: "16.00",
    total: "116.00",
    ...overrides,
  };
}

export function saleFixture(overrides: Partial<Sale> = {}): Sale {
  return {
    id: 7,
    client_id: 3,
    folio: "VTA-00000007",
    status: "draft",
    currency: "MXN",
    payment_form: "03",
    payment_method: "PUE",
    subtotal: "100.00",
    discount_total: "0.00",
    tax_total: "16.00",
    total: "116.00",
    notes: null,
    confirmed_at: null,
    cancelled_at: null,
    created_at: "2026-10-26T12:00:00+00:00",
    updated_at: "2026-10-26T12:00:00+00:00",
    client: { id: 3, name: "Dunder Mifflin", rfc: "ABC101010111" },
    invoice: null,
    items: [saleItemFixture()],
    ...overrides,
  };
}

export function saleCollectionFixture(data: Sale[] = [saleFixture()], meta: Partial<SaleCollectionResponse["meta"]> = {}): SaleCollectionResponse {
  return {
    data,
    links: { first: null, last: null, prev: null, next: null },
    meta: { current_page: 1, from: data.length ? 1 : null, last_page: 1, per_page: 20, to: data.length || null, total: data.length, ...meta },
  };
}

export function readinessFixture(overrides: Partial<SaleBillingReadiness> = {}): SaleBillingReadiness {
  return { ready: true, errors: [], warnings: [], ...overrides };
}

export const taxRatesFixture: TaxRate[] = [
  { id: 1, code: "002", name: "IVA 16%", rate: "0.160000", tax_type: "traslado", factor_type: "tasa" },
  { id: 2, code: "002", name: "IVA 0%", rate: "0.000000", tax_type: "traslado", factor_type: "tasa" },
  { id: 3, code: "002", name: "IVA Exento", rate: "0.000000", tax_type: "traslado", factor_type: "exento" },
];
