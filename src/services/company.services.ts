import { API_URL } from "@/src/config/api";
import { FORBIDDEN_MESSAGE, getAuthHeaders, translateApiMessage } from "@/src/services/http";
import type { CompanyEmailSettings, CompanyFiscal, CompanyFiscalInput } from "@/src/types/company";
import type { FiscalIssue } from "@/src/types/sat";

/**
 * Fase 6.27b: datos fiscales de la empresa del usuario. El backend decide
 * la empresa y su organización de Facturapi a partir de la sesión; aquí
 * nunca se envían ids.
 */
export class CompanyApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string | null = null,
    public readonly issues: FiscalIssue[] = [],
  ) {
    super(message);
    this.name = "CompanyApiError";
  }
}

async function toError(response: Response, fallback: string): Promise<CompanyApiError> {
  const body = (await response.json().catch(() => null)) as
    | { code?: string; message?: string; issues?: FiscalIssue[]; errors?: Record<string, string[]> }
    | null;

  if (response.status === 403 && !body?.code) {
    return new CompanyApiError(FORBIDDEN_MESSAGE, 403);
  }

  if (response.status === 429) {
    return new CompanyApiError("Demasiados intentos. Espera un minuto y vuelve a intentarlo.", 429, "TOO_MANY_REQUESTS");
  }

  const validationIssues: FiscalIssue[] = Object.entries(body?.errors ?? {}).map(([field, messages]) => ({
    code: "VALIDATION_ERROR",
    field,
    message: messages[0] ?? fallback,
  }));

  return new CompanyApiError(translateApiMessage(body?.message, response.status, fallback), response.status, body?.code ?? null, body?.issues ?? validationIssues);
}

export async function getCompanyFiscal(): Promise<CompanyFiscal> {
  const response = await fetch(`${API_URL}/api/company/fiscal`, { headers: getAuthHeaders() });

  if (!response.ok) throw await toError(response, "No fue posible cargar los datos fiscales.");

  return (await response.json()) as CompanyFiscal;
}

export async function updateCompanyFiscal(values: CompanyFiscalInput): Promise<CompanyFiscal> {
  const response = await fetch(`${API_URL}/api/company/fiscal`, {
    method: "PUT",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!response.ok) throw await toError(response, "No fue posible guardar los datos fiscales.");

  return (await response.json()) as CompanyFiscal;
}

/**
 * Fase 6.27b: sube el CSD a la organización de Facturapi de la empresa. Los
 * archivos y la contraseña se envían una sola vez y no se guardan.
 */
export async function uploadCompanyCsd(cer: File, key: File, password: string): Promise<CompanyFiscal> {
  const body = new FormData();
  body.append("cer", cer);
  body.append("key", key);
  body.append("csd_password", password);

  const response = await fetch(`${API_URL}/api/company/csd`, { method: "POST", headers: getAuthHeaders(), body });

  if (!response.ok) throw await toError(response, "No fue posible subir el CSD.");

  return (await response.json()) as CompanyFiscal;
}

/** Fase 6.29: límites de Facturapi para el logotipo del PDF. */
export const LOGO_MAX_BYTES = 500 * 1024;
export const LOGO_TYPES = ["image/png", "image/jpeg"];

/**
 * Fase 6.29: sube el logotipo del PDF. El backend lo envía primero a
 * Facturapi y sólo guarda la copia local si Facturapi lo acepta.
 */
export async function uploadCompanyLogo(logo: File): Promise<CompanyFiscal> {
  const body = new FormData();
  body.append("logo", logo);

  const response = await fetch(`${API_URL}/api/company/logo`, { method: "POST", headers: getAuthHeaders(), body });

  if (!response.ok) throw await toError(response, "No fue posible subir el logotipo.");

  return (await response.json()) as CompanyFiscal;
}

/** Fase 6.29: copia privada del logotipo para la vista previa; null si no hay. */
export async function getCompanyLogo(): Promise<Blob | null> {
  const response = await fetch(`${API_URL}/api/company/logo`, { headers: getAuthHeaders() });

  if (response.status === 404) return null;
  if (!response.ok) throw await toError(response, "No fue posible cargar el logotipo.");

  return response.blob();
}

/** Fase 6.30: configuración del envío de facturas por correo (Admin y Contador la consultan). */
export async function getCompanyEmailSettings(): Promise<CompanyEmailSettings> {
  const response = await fetch(`${API_URL}/api/company/email-settings`, { headers: getAuthHeaders() });

  if (!response.ok) throw await toError(response, "No fue posible cargar la configuración de correo.");

  return (await response.json()) as CompanyEmailSettings;
}

/** Fase 6.30: sólo Admin activa o desactiva el envío automático. */
export async function updateCompanyEmailSettings(autoEmailInvoices: boolean): Promise<CompanyEmailSettings> {
  const response = await fetch(`${API_URL}/api/company/email-settings`, {
    method: "PUT",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ auto_email_invoices: autoEmailInvoices }),
  });

  if (!response.ok) throw await toError(response, "No fue posible guardar la configuración de correo.");

  return (await response.json()) as CompanyEmailSettings;
}
