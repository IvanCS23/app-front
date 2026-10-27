/** Fase 6.26 — catálogos SAT del CFDI 4.0 (api-v1 GET /api/sat/*). */
export interface SatTaxRegime {
  code: string;
  description: string;
  physical: boolean;
  moral: boolean;
}

export interface SatCfdiUse extends SatTaxRegime {
  /** Regímenes del receptor con los que el SAT admite este uso. */
  regimes: string[];
}

export interface SatCatalogEntry {
  code: string;
  description: string;
}

export interface SatCatalogs {
  tax_regimes: SatTaxRegime[];
  cfdi_uses: SatCfdiUse[];
  payment_forms: SatCatalogEntry[];
  tax_objects: SatCatalogEntry[];
}

export interface SatProductKey {
  code: string;
  description: string;
}

export interface SatUnitKey {
  code: string;
  name: string;
  symbol: string | null;
}

/** Problema SAT de un registro guardado (`fiscal_issues` de la API). */
export interface FiscalIssue {
  code: string;
  field: string;
  message: string;
}

export type PersonType = "moral" | "physical";
