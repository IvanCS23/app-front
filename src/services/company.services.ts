import { API_URL } from "@/src/config/api";
import { getAuthHeaders } from "@/src/services/http";
import type { CompanyFiscal, CompanyFiscalInput } from "@/src/types/company";
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

const FORBIDDEN_MESSAGE = "No tienes permiso para esta acción. Pide a un administrador que la realice.";

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

  return new CompanyApiError(body?.message ?? fallback, response.status, body?.code ?? null, body?.issues ?? validationIssues);
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
