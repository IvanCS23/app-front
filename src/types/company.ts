import type { FiscalIssue } from "@/src/types/sat";

/** Fase 6.27b: domicilio fiscal de la empresa (todos opcionales salvo el C.P.). */
export interface CompanyAddress {
  street: string | null;
  external_number: string | null;
  internal_number: string | null;
  colony: string | null;
  city: string | null;
  municipality: string | null;
  state: string | null;
}

/** Copia local de la organización de Facturapi (sin llave ni id). */
export interface CompanyOrganizationStatus {
  legal_name: string | null;
  /** Fase 6.29: nombre comercial (legal.name) que imprime el PDF. */
  trade_name: string | null;
  /** Fase 6.29: Facturapi tiene un logotipo cargado (el que imprime el PDF). */
  has_logo: boolean | null;
  legal_tax_id: string | null;
  legal_tax_system: string | null;
  legal_zip: string | null;
  /** Fase 6.31: ambiente de la empresa. */
  pac_environment: "test" | "live" | null;
  /** Fase 6.31: el correo de contacto frente al de respuesta de Facturapi. */
  contact_email_issue: "missing" | "mismatch" | null;
  /** null si Facturapi aún no tiene RFC (se toma del CSD). */
  rfc_matches: boolean | null;
  snapshot_at: string | null;
  certificate: {
    has_certificate: boolean;
    serial_number: string | null;
    expires_at: string | null;
    updated_at: string | null;
    days_left: number | null;
  };
}

export interface CompanyFiscal {
  legal_name: string | null;
  trade_name: string | null;
  /** Fase 6.30: correo de contacto; Facturapi lo muestra en los PDF y correos. */
  email: string | null;
  rfc: string | null;
  fiscal_regime: string | null;
  postal_code: string | null;
  address: CompanyAddress;
  issues: FiscalIssue[];
  can_edit: boolean;
  /** Fase 6.29: copia privada del logotipo subido desde aquí. */
  logo: { available: boolean; updated_at: string | null };
  organization: CompanyOrganizationStatus | null;
}

export interface CompanyFiscalInput {
  legal_name: string;
  trade_name: string;
  email: string;
  rfc: string;
  fiscal_regime: string;
  postal_code: string;
  street: string;
  external_number: string;
  internal_number: string;
  colony: string;
  city: string;
  municipality: string;
  state: string;
}

/** Fase 6.30: configuración del envío de facturas por correo. */
export interface CompanyEmailSettings {
  auto_email_invoices: boolean;
  pac_mode: "test" | "live" | null;
  daily_limit: number;
  sent_last_24h: number;
  can_edit: boolean;
}
