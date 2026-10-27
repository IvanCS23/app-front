import type { SatCatalogs } from "@/src/types/sat";

/**
 * Fase 6.26: muestra real de los catálogos del SAT (copiada de
 * api-v1/database/data/sat), con la matriz régimen ↔ uso ↔ tipo de persona.
 */
export function satCatalogsFixture(): SatCatalogs {
  return {
    tax_regimes: [
      { code: "601", description: "General de Ley Personas Morales", physical: false, moral: true },
      { code: "605", description: "Sueldos y Salarios e Ingresos Asimilados a Salarios", physical: true, moral: false },
      { code: "612", description: "Personas Físicas con Actividades Empresariales y Profesionales", physical: true, moral: false },
      { code: "616", description: "Sin obligaciones fiscales", physical: true, moral: false },
      { code: "626", description: "Régimen Simplificado de Confianza", physical: true, moral: true },
    ],
    cfdi_uses: [
      { code: "G01", description: "Adquisición de mercancías.", physical: true, moral: true, regimes: ["601", "603", "606", "612", "620", "621", "622", "623", "624", "625", "626"] },
      { code: "G03", description: "Gastos en general.", physical: true, moral: true, regimes: ["601", "603", "606", "612", "620", "621", "622", "623", "624", "625", "626"] },
      { code: "D01", description: "Honorarios médicos, dentales y gastos hospitalarios.", physical: true, moral: false, regimes: ["605", "606", "608", "611", "612", "614", "607", "615", "625"] },
      { code: "S01", description: "Sin efectos fiscales.", physical: true, moral: true, regimes: ["601", "603", "605", "606", "608", "610", "611", "612", "614", "616", "620", "621", "622", "623", "624", "607", "615", "625", "626"] },
      { code: "CN01", description: "Nómina", physical: true, moral: false, regimes: ["605"] },
    ],
    payment_forms: [
      { code: "01", description: "Efectivo" },
      { code: "03", description: "Transferencia electrónica de fondos" },
      { code: "04", description: "Tarjeta de crédito" },
      { code: "28", description: "Tarjeta de débito" },
      { code: "31", description: "Intermediario pagos" },
      { code: "99", description: "Por definir" },
    ],
    tax_objects: [
      { code: "01", description: "No objeto de impuesto." },
      { code: "02", description: "Sí objeto de impuesto." },
      { code: "03", description: "Sí objeto del impuesto y no obligado al desglose." },
      { code: "04", description: "Sí objeto del impuesto y no causa impuesto." },
    ],
  };
}
