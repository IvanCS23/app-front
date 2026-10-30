import type { InvoiceCollectionResponse, InvoiceDetail, InvoiceListItem } from "@/src/types/invoice";

export function invoiceFixture(overrides: Partial<InvoiceListItem> = {}): InvoiceListItem {
  return {
    id: 3,
    client_id: 5,
    folio: "FAC-00000003",
    cfdi_series: "FAC",
    cfdi_folio_number: 3,
    cfdi_folio: "FAC-3",
    cfdi_folio_matches_erp: true,
    status: "issued",
    client_name: "Comercializadora del Centro",
    client_rfc: "CCC010101AAA",
    client_regimen_fiscal: "601",
    client_uso_cfdi: "G03",
    client_codigo_postal: "06000",
    subtotal: "1000.00",
    discount_total: "0.00",
    tax_total: "160.00",
    total: "1160.00",
    currency: "MXN",
    notes: null,
    payment_form: "03",
    payment_method: "PUE",
    issued_at: "2026-08-13T12:00:00Z",
    cancelled_at: null,
    created_at: "2026-08-12T12:00:00Z",
    updated_at: "2026-08-13T12:00:00Z",
    ...overrides,
  };
}

export function invoiceDetailFixture(overrides: Partial<InvoiceDetail> = {}): InvoiceDetail {
  return {
    ...invoiceFixture(),
    company_id: 1,
    sale_id: 8,
    created_by: 2,
    client_calle: "Avenida Reforma",
    client_no_exterior: "100",
    client_no_interior: null,
    client_colonia: "Centro",
    client_localidad: "Cuauhtémoc",
    client_municipio: "Cuauhtémoc",
    client_estado: "Ciudad de México",
    client_pais: "MEX",
    items: [{
      id: 31,
      invoice_id: 3,
      product_id: 9,
      tax_rate_id: 1,
      description: "Servicio de consultoría",
      quantity: "1.000000",
      unit_price: "1000.00",
      discount: "0.00",
      subtotal: "1000.00",
      tax_total: "160.00",
      total: "1160.00",
      product_clave_producto: "80101500",
      product_clave_unidad: "E48",
      product_type: "service",
      product_no_identificacion: "SRV-001",
      product_description: "Servicio de consultoría",
      product_objeto_imp: "02",
      tax_code: "002",
      tax_name: "IVA",
      tax_rate_value: "0.160000",
      tax_type: "transferred",
      tax_factor_type: "Tasa",
      created_at: "2026-08-12T12:00:00Z",
      updated_at: "2026-08-12T12:00:00Z",
    }],
    ...overrides,
  };
}

export function invoiceCollectionFixture(data: InvoiceListItem[] = [invoiceFixture()], meta: Partial<InvoiceCollectionResponse["meta"]> = {}): InvoiceCollectionResponse {
  const total = meta.total ?? data.length;
  const perPage = meta.per_page ?? 20;
  return {
    data,
    links: { first: null, last: null, prev: null, next: null },
    meta: {
      current_page: 1,
      from: data.length ? 1 : null,
      last_page: Math.max(1, Math.ceil(total / perPage)),
      path: "/api/invoices",
      per_page: perPage,
      to: data.length || null,
      total,
      ...meta,
    },
  };
}
