import type { PersonType, SatCatalogs, SatCfdiUse, SatTaxRegime } from "@/src/types/sat";

/**
 * Fase 6.26 — espejo de App\Services\Sat\SatFiscalValidator para avisar
 * antes de enviar. El backend sigue siendo la fuente: aquí sólo se evita un
 * viaje con datos que de todas formas rechazaría.
 */
export const GENERIC_RFCS = ["XAXX010101000", "XEXX010101000"] as const;
export const GENERIC_REGIME = "616";
export const GENERIC_USE = "S01";

const RFC_PATTERN = /^([A-ZÑ&]{3,4})(\d{2})(\d{2})(\d{2})([A-Z\d]{3})$/u;

export function normalizeRfc(rfc: string): string {
  return rfc.trim().toUpperCase();
}

export function isGenericRfc(rfc: string): boolean {
  return (GENERIC_RFCS as readonly string[]).includes(normalizeRfc(rfc));
}

/** Moral (12 caracteres) o física (13); null si el RFC no es válido. */
export function personType(rfc: string): PersonType | null {
  const match = RFC_PATTERN.exec(normalizeRfc(rfc));
  if (!match) return null;

  const month = Number(match[3]);
  const day = Number(match[4]);
  // Mismo criterio que el backend: año 2000 (bisiesto), admite 29 de febrero.
  const date = new Date(Date.UTC(2000, month - 1, day));
  if (month < 1 || month > 12 || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;

  return match[1].length === 3 ? "moral" : "physical";
}

const appliesTo = (entry: SatTaxRegime, person: PersonType | null): boolean =>
  person === null || (person === "moral" ? entry.moral : entry.physical);

/** Regímenes aplicables al tipo de persona del RFC (todos si aún no se sabe). */
export function regimesFor(catalogs: SatCatalogs, rfc: string): SatTaxRegime[] {
  const person = personType(rfc);
  if (isGenericRfc(rfc)) return catalogs.tax_regimes.filter((regime) => regime.code === GENERIC_REGIME);

  return catalogs.tax_regimes.filter((regime) => appliesTo(regime, person));
}

/** Usos aplicables al tipo de persona y compatibles con el régimen elegido. */
export function usesFor(catalogs: SatCatalogs, rfc: string, regime: string): SatCfdiUse[] {
  const person = personType(rfc);
  if (isGenericRfc(rfc)) return catalogs.cfdi_uses.filter((use) => use.code === GENERIC_USE);

  return catalogs.cfdi_uses.filter((use) => appliesTo(use, person) && (regime === "" || use.regimes.includes(regime)));
}

export interface ClientFiscalInput {
  rfc: string;
  codigo_postal: string;
  regimen_fiscal: string;
  uso_cfdi: string;
}

/** Errores por campo, con los mismos criterios y mensajes que el backend. */
export function clientFiscalErrors(input: ClientFiscalInput, catalogs: SatCatalogs | null): Partial<Record<keyof ClientFiscalInput, string>> {
  const errors: Partial<Record<keyof ClientFiscalInput, string>> = {};
  const rfc = normalizeRfc(input.rfc);
  const person = rfc === "" ? null : personType(rfc);

  if (rfc !== "" && person === null) {
    errors.rfc = "El RFC no tiene un formato válido: 12 caracteres para persona moral o 13 para persona física (letras, fecha AAMMDD y homoclave).";
  }

  if (input.codigo_postal.trim() !== "" && !/^\d{5}$/.test(input.codigo_postal.trim())) {
    errors.codigo_postal = "El código postal debe tener 5 dígitos.";
  }

  if (catalogs === null) return errors;

  const regime = catalogs.tax_regimes.find((entry) => entry.code === input.regimen_fiscal);
  const use = catalogs.cfdi_uses.find((entry) => entry.code === input.uso_cfdi);
  const personLabel = person === "moral" ? "moral" : "física";

  // Fase 6.26.1: con un RFC genérico se exige 616/S01 antes que revisar el
  // tipo de persona (XAXX/XEXX se leen como persona física y confundía).
  if (input.regimen_fiscal !== "" && !regime) {
    errors.regimen_fiscal = `El régimen fiscal ${input.regimen_fiscal} no existe en el catálogo del SAT.`;
  } else if (regime && isGenericRfc(rfc) && regime.code !== GENERIC_REGIME) {
    errors.regimen_fiscal = "Con un RFC genérico el régimen fiscal debe ser 616.";
  } else if (regime && !appliesTo(regime, person)) {
    errors.regimen_fiscal = `El régimen fiscal ${regime.code} no aplica a una persona ${personLabel}.`;
  }

  if (input.uso_cfdi !== "" && !use) {
    errors.uso_cfdi = `El uso de CFDI ${input.uso_cfdi} no existe en el catálogo del SAT.`;
  } else if (use && isGenericRfc(rfc) && use.code !== GENERIC_USE) {
    errors.uso_cfdi = "Con un RFC genérico el uso de CFDI debe ser S01 (Sin efectos fiscales).";
  } else if (use && !appliesTo(use, person)) {
    errors.uso_cfdi = `El uso de CFDI ${use.code} no aplica a una persona ${personLabel}.`;
  } else if (use && regime && !errors.regimen_fiscal && !use.regimes.includes(regime.code)) {
    errors.uso_cfdi = `El uso de CFDI ${use.code} no es compatible con el régimen fiscal ${regime.code}.`;
  }

  return errors;
}

export interface IssuerFiscalInput {
  rfc: string;
  legal_name: string;
  fiscal_regime: string;
  postal_code: string;
}

/** Régimen societario al final de la razón social (mismo patrón que el backend). */
const CORPORATE_REGIME_SUFFIX = /(?:^|[\s,])(?:S\.?\s*A\.?\s*P\.?\s*I\.?|S\.?\s*A\.?\s*S\.?|S\.?\s*A\.?|S\.?\s*DE\s+R\.?\s*L\.?|S\.?\s*C\.?|A\.?\s*C\.?)(?:\s*DE\s+C\.?\s*V\.?)?\s*$/iu;

/**
 * Fase 6.27b — espejo de SatFiscalValidator::issuerIssues: datos fiscales de
 * la empresa emisora, con los mismos mensajes que el backend.
 */
export function issuerFiscalErrors(input: IssuerFiscalInput, catalogs: SatCatalogs | null): Partial<Record<keyof IssuerFiscalInput, string>> {
  const errors: Partial<Record<keyof IssuerFiscalInput, string>> = {};
  const rfc = normalizeRfc(input.rfc);
  const legalName = input.legal_name.trim();
  const regimeCode = input.fiscal_regime.trim();
  const postalCode = input.postal_code.trim();
  let person: PersonType | null = null;

  if (rfc === "") {
    errors.rfc = "Falta el RFC de la empresa.";
  } else if (isGenericRfc(rfc)) {
    errors.rfc = "Un RFC genérico (XAXX010101000 o XEXX010101000) no puede emitir facturas.";
  } else if ((person = personType(rfc)) === null) {
    errors.rfc = "El RFC no tiene un formato válido: 12 caracteres para persona moral o 13 para persona física (letras, fecha AAMMDD y homoclave).";
  }

  if (legalName === "") {
    errors.legal_name = "Falta la razón social de la empresa.";
  } else if (CORPORATE_REGIME_SUFFIX.test(legalName)) {
    errors.legal_name = 'Escribe la razón social sin el régimen societario (por ejemplo, sin "S.A. de C.V."), como aparece en la constancia de situación fiscal.';
  }

  const regime = catalogs?.tax_regimes.find((entry) => entry.code === regimeCode);

  if (regimeCode === "") {
    errors.fiscal_regime = "Falta el régimen fiscal de la empresa.";
  } else if (catalogs !== null && !regime) {
    errors.fiscal_regime = `El régimen fiscal ${regimeCode} no existe en el catálogo del SAT.`;
  } else if (regime && person !== null && !appliesTo(regime, person)) {
    errors.fiscal_regime = `El régimen fiscal ${regimeCode} no aplica a una persona ${person === "moral" ? "moral" : "física"}.`;
  }

  if (postalCode === "") {
    errors.postal_code = "Falta el código postal del domicilio fiscal (lugar de expedición).";
  } else if (!/^\d{5}$/.test(postalCode)) {
    errors.postal_code = "El código postal debe tener 5 dígitos.";
  }

  return errors;
}

/** Objeto de impuesto que exige IVA y los que no lo admiten (05–08 no se validan). */
export const TAX_OBJECT_TAXED = "02";
export const TAX_OBJECTS_WITHOUT_TAX = ["01", "03", "04"];

/** Coherencia entre el objeto de impuesto y la tasa de IVA del producto. */
export function taxObjectError(taxObject: string, taxRateId: number | null): string | null {
  if (taxObject === TAX_OBJECT_TAXED && taxRateId === null) {
    return "Con objeto de impuesto 02 el producto debe tener IVA (16 %, 0 % o exento).";
  }
  if (TAX_OBJECTS_WITHOUT_TAX.includes(taxObject) && taxRateId !== null) {
    return `Con objeto de impuesto ${taxObject} el producto no lleva IVA: quita la tasa o usa el objeto 02.`;
  }
  return null;
}
