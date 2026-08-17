export type InvoiceStatus = "draft" | "ready" | "issued" | "cancelled";

export interface InvoiceListItem {
  id: number;
  client_id: number;
  folio: string;
  status: InvoiceStatus;
  client_name: string | null;
  client_rfc: string | null;
  client_regimen_fiscal: string | null;
  client_uso_cfdi: string | null;
  client_codigo_postal: string | null;
  subtotal: string;
  discount_total: string;
  tax_total: string;
  total: string;
  currency: string;
  notes: string | null;
  payment_form: string | null;
  payment_method: string | null;
  issued_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  product_id: number | null;
  tax_rate_id: number | null;
  description: string;
  quantity: string;
  unit_price: string;
  discount: string;
  subtotal: string;
  tax_total: string;
  total: string;
  product_clave_producto: string | null;
  product_clave_unidad: string | null;
  product_type: string | null;
  product_no_identificacion: string | null;
  product_description: string | null;
  product_objeto_imp: string | null;
  tax_code: string | null;
  tax_name: string | null;
  tax_rate_value: string | null;
  tax_type: string | null;
  tax_factor_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceDetail extends InvoiceListItem {
  company_id: number;
  sale_id: number;
  created_by: number | null;
  client_calle: string | null;
  client_no_exterior: string | null;
  client_no_interior: string | null;
  client_colonia: string | null;
  client_localidad: string | null;
  client_municipio: string | null;
  client_estado: string | null;
  client_pais: string | null;
  items: InvoiceItem[];
}

export interface InvoiceCollectionResponse {
  data: InvoiceListItem[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
}

export interface InvoiceQuery {
  search?: string;
  status?: InvoiceStatus;
  payment_method?: "PUE" | "PPD";
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: 10 | 20 | 50 | 100;
  sort?: "created_at" | "issued_at" | "folio" | "total";
  direction?: "asc" | "desc";
}
