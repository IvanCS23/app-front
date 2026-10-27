"use client";
import React, { useState, useEffect } from "react";
import {
  SquarePen, Trash, X, ChevronDown, Info, CheckCircle2, Loader2, Search,
  Activity, FileText as FileTextIcon, AlertTriangle
} from "lucide-react";
import AppLayout from "@/app/components/layout/AppLayout";
import ComingSoon, { COMING_SOON_ACTION_CLASS, ComingSoonBadge, comingSoonActionProps } from "@/app/components/ui/ComingSoon";
import SatKeySearch, { type SatKeyOption } from "@/app/components/sat/SatKeySearch";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  Product
} from "@/src/services/product.services";
import { getSatCatalogs, searchProductKeys, searchUnitKeys } from "@/src/services/sat.services";
import { getTaxRates } from "@/src/services/sale.services";
import { TAX_OBJECT_TAXED, taxObjectError } from "@/src/lib/sat";
import type { TaxRate } from "@/src/types/sale";
import type { FiscalIssue, SatCatalogEntry } from "@/src/types/sat";

// Fase 6.26: búsquedas en los catálogos SAT locales (estables, fuera del componente).
const searchProductKeyOptions = (query: string, signal: AbortSignal): Promise<SatKeyOption[]> =>
  searchProductKeys(query, signal).then((keys) => keys.map((key) => ({ code: key.code, label: key.description })));
const searchUnitKeyOptions = (query: string, signal: AbortSignal): Promise<SatKeyOption[]> =>
  searchUnitKeys(query, signal).then((keys) => keys.map((key) => ({ code: key.code, label: key.symbol ? `${key.name} (${key.symbol})` : key.name })));
const upperCase = (value: string) => value.toUpperCase();

type ProductFiscalField = "clave_producto" | "clave_unidad" | "objeto_imp" | "tax_rate_id";

const fieldStyle =
  "w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#64748B] shadow-sm transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";
const selectStyle = `${fieldStyle} pr-10`;
const inputStyle = fieldStyle;

// Componente Toast
const Toast = ({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-xl border border-[#E2E8F0] px-4 py-3 shadow-sm animate-in slide-in-from-right-5 duration-300 ${
      type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
    }`}>
      {type === "success" ? (
        <CheckCircle2 className="h-5 w-5" />
      ) : (
        <X className="h-5 w-5" />
      )}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

type LabelProps = {
  children: React.ReactNode;
  withInfo?: boolean;
  infoText?: string;
};

function Label({ children, withInfo = false, infoText = "" }: LabelProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="mb-2 flex items-center gap-1">
      <label className="text-sm font-semibold uppercase tracking-wide text-[#0F172A]">
        {children}
      </label>
      {withInfo && (
        <div className="relative">
          <Info 
            className="h-4 w-4 cursor-help text-blue-600" 
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          {showTooltip && (
            <div className="absolute bottom-full left-0 z-50 mb-2 w-64 rounded-xl border border-[#E2E8F0] bg-white p-3 text-xs text-[#64748B] shadow-sm">
              {infoText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Opciones para Uso de la factura (CFDI)
const invoiceUsageOptions = [
  { label: "Seleccione un uso", value: "" },
  { label: "G01 - Adquisición de mercancías", value: "G01" },
  { label: "G02 - Devoluciones, descuentos o bonificaciones", value: "G02" },
  { label: "G03 - Gastos en general", value: "G03" },
  { label: "I01 - Construcciones", value: "I01" },
  { label: "I02 - Mobiliario y equipo de oficina", value: "I02" },
  { label: "I03 - Equipo de transporte", value: "I03" },
  { label: "I04 - Equipo de computo", value: "I04" },
  { label: "I05 - Dados, troqueles, moldes, matrices y herramental", value: "I05" },
  { label: "I06 - Comunicaciones telefónicas", value: "I06" },
  { label: "I07 - Comunicaciones satelitales", value: "I07" },
  { label: "I08 - Otra maquinaria y equipo", value: "I08" },
  { label: "D01 - Honorarios médicos, dentales y gastos hospitalarios", value: "D01" },
  { label: "D02 - Gastos médicos por incapacidad o discapacidad", value: "D02" },
  { label: "D03 - Gastos funerarios", value: "D03" },
  { label: "D04 - Donativos", value: "D04" },
  { label: "D05 - Intereses reales efectivamente pagados por créditos hipotecarios", value: "D05" },
  { label: "D06 - Aportaciones voluntarias al SAR", value: "D06" },
  { label: "D07 - Primas por seguros de gastos médicos", value: "D07" },
  { label: "D08 - Gastos de transportación escolar obligatoria", value: "D08" },
  { label: "D09 - Depósitos en cuentas para el ahorro", value: "D09" },
  { label: "D10 - Pagos por servicios educativos", value: "D10" },
  { label: "P01 - Por definir", value: "P01" },
];

// Opciones para Régimen fiscal
const taxRegimeOptions = [
  { label: "Seleccione un régimen", value: "" },
  { label: "601 - General de Ley Personas Morales", value: "601" },
  { label: "603 - Personas Morales con Fines no Lucrativos", value: "603" },
  { label: "605 - Sueldos y Salarios e Ingresos Asimilados a Salarios", value: "605" },
  { label: "606 - Arrendamiento", value: "606" },
  { label: "607 - Régimen de Enajenación o Adquisición de Bienes", value: "607" },
  { label: "608 - Demás ingresos", value: "608" },
  { label: "610 - Residentes en el Extranjero sin Establecimiento Permanente en México", value: "610" },
  { label: "611 - Ingresos por Dividendos", value: "611" },
  { label: "612 - Personas Físicas con Actividades Empresariales y Profesionales", value: "612" },
  { label: "614 - Ingresos por intereses", value: "614" },
  { label: "615 - Régimen de los ingresos por obtención de premios", value: "615" },
  { label: "616 - Sin obligaciones fiscales", value: "616" },
  { label: "620 - Sociedades Cooperativas de Producción que optan por diferir sus ingresos", value: "620" },
  { label: "621 - Incorporación Fiscal", value: "621" },
  { label: "622 - Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras", value: "622" },
  { label: "623 - Opcional para Grupos de Sociedades", value: "623" },
  { label: "624 - Coordinados", value: "624" },
  { label: "625 - Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas", value: "625" },
  { label: "626 - Régimen Simplificado de Confianza", value: "626" },
];

// Fase 6.26: el objeto de impuesto viene del catálogo c_ObjetoImp del SAT y el
// IVA es una tasa de tax_rates (16 %, 0 % o exento): un número no distinguía
// "exento" de la tasa 0 % y "Exento" llegaba al backend como null.

// Fase 6.26.1: IVA RET, IEPS, ISR, cuenta predial, pedimento e impuestos
// locales se guardan en el producto pero ninguno llega a las ventas, las
// facturas ni al PAC. Se muestran deshabilitados con su valor y no se envían,
// así el backend conserva lo capturado hasta que tengan soporte real.
type PendingTaxes = {
  ivaRetenido: string;
  ieps: string;
  isr: string;
  cuentaPredial: string;
  noPedimento: string;
  impuestosLocales: string[];
};

const NO_PENDING_TAXES: PendingTaxes = { ivaRetenido: "", ieps: "", isr: "", cuentaPredial: "", noPedimento: "", impuestosLocales: [] };

const PENDING_TAXES_WARNING =
  "Este producto tiene impuestos capturados que el sistema todavía no aplica a las ventas ni a las facturas. Solo se aplica el IVA seleccionado.";

const stored = (value: unknown): string => (value === null || value === undefined ? "" : String(value).trim());

/** Impuestos locales guardados como JSON (o texto suelto) en una línea legible por impuesto. */
function localTaxLabels(raw: unknown): string[] {
  const text = stored(raw);
  if (text === "") return [];
  try {
    const parsed: unknown = JSON.parse(text);
    if (!Array.isArray(parsed)) return [text];
    return parsed
      .map((tax: Partial<ImpuestoLocal>) =>
        [tax.nombre, tax.tasa && `tasa ${tax.tasa}`, tax.monto && `monto ${tax.monto}`, tax.tipo].filter(Boolean).join(" · "),
      )
      .filter((label) => label !== "");
  } catch {
    return [text];
  }
}

function pendingTaxesOf(product: Product): PendingTaxes {
  return {
    ivaRetenido: stored(product.iva_retenido),
    ieps: stored(product.ieps),
    isr: stored(product.isr),
    cuentaPredial: stored(product.cuenta_predial),
    noPedimento: stored(product.no_pedimento),
    impuestosLocales: localTaxLabels(product.impuesto_local),
  };
}

const hasPendingTaxes = (taxes: PendingTaxes): boolean =>
  [taxes.ivaRetenido, taxes.ieps, taxes.isr, taxes.cuentaPredial, taxes.noPedimento].some((value) => value !== "") ||
  taxes.impuestosLocales.length > 0;

function PendingTaxField({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[#0F172A]">{label}</span>
      <input type="text" value={value} readOnly placeholder="Sin capturar" className={`${inputStyle} disabled:bg-slate-100 disabled:text-slate-500`} />
    </label>
  );
}

// Estados de la República Mexicana
const mexicanStates = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Coahuila",
  "Colima",
  "Durango",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "México",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas",
];

// Países en orden alfabético
const countries = [
  "Afganistán",
  "Albania",
  "Alemania",
  "Andorra",
  "Angola",
  "Antigua y Barbuda",
  "Arabia Saudita",
  "Argelia",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaiyán",
  "Bahamas",
  "Bangladés",
  "Barbados",
  "Baréin",
  "Bélgica",
  "Belice",
  "Benín",
  "Bielorrusia",
  "Birmania",
  "Bolivia",
  "Bosnia y Herzegovina",
  "Botsuana",
  "Brasil",
  "Brunéi",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Bután",
  "Cabo Verde",
  "Camboya",
  "Camerún",
  "Canadá",
  "Catar",
  "Chad",
  "Chile",
  "China",
  "Chipre",
  "Ciudad del Vaticano",
  "Colombia",
  "Comoras",
  "Corea del Norte",
  "Corea del Sur",
  "Costa de Marfil",
  "Costa Rica",
  "Croacia",
  "Cuba",
  "Dinamarca",
  "Dominica",
  "Ecuador",
  "Egipto",
  "El Salvador",
  "Emiratos Árabes Unidos",
  "Eritrea",
  "Eslovaquia",
  "Eslovenia",
  "España",
  "Estados Unidos",
  "Estonia",
  "Esuatini",
  "Etiopía",
  "Filipinas",
  "Finlandia",
  "Fiyi",
  "Francia",
  "Gabón",
  "Gambia",
  "Georgia",
  "Ghana",
  "Granada",
  "Grecia",
  "Guatemala",
  "Guinea",
  "Guinea-Bisáu",
  "Guinea Ecuatorial",
  "Guyana",
  "Haití",
  "Honduras",
  "Hungría",
  "India",
  "Indonesia",
  "Irak",
  "Irán",
  "Irlanda",
  "Islandia",
  "Islas Marshall",
  "Islas Salomón",
  "Israel",
  "Italia",
  "Jamaica",
  "Japón",
  "Jordania",
  "Kazajistán",
  "Kenia",
  "Kirguistán",
  "Kiribati",
  "Kuwait",
  "Laos",
  "Lesoto",
  "Letonia",
  "Líbano",
  "Liberia",
  "Libia",
  "Liechtenstein",
  "Lituania",
  "Luxemburgo",
  "Macedonia del Norte",
  "Madagascar",
  "Malasia",
  "Malaui",
  "Maldivas",
  "Malí",
  "Malta",
  "Marruecos",
  "Mauricio",
  "Mauritania",
  "México",
  "Micronesia",
  "Moldavia",
  "Mónaco",
  "Mongolia",
  "Montenegro",
  "Mozambique",
  "Namibia",
  "Nauru",
  "Nepal",
  "Nicaragua",
  "Níger",
  "Nigeria",
  "Noruega",
  "Nueva Zelanda",
  "Omán",
  "Países Bajos",
  "Pakistán",
  "Palaos",
  "Palestina",
  "Panamá",
  "Papúa Nueva Guinea",
  "Paraguay",
  "Perú",
  "Polonia",
  "Portugal",
  "Reino Unido",
  "República Centroafricana",
  "República Checa",
  "República del Congo",
  "República Democrática del Congo",
  "República Dominicana",
  "Ruanda",
  "Rumania",
  "Rusia",
  "Samoa",
  "San Cristóbal y Nieves",
  "San Marino",
  "San Vicente y las Granadinas",
  "Santa Lucía",
  "Santo Tomé y Príncipe",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leona",
  "Singapur",
  "Siria",
  "Somalia",
  "Sri Lanka",
  "Sudáfrica",
  "Sudán",
  "Sudán del Sur",
  "Suecia",
  "Suiza",
  "Surinam",
  "Tailandia",
  "Tanzania",
  "Tayikistán",
  "Timor Oriental",
  "Togo",
  "Tonga",
  "Trinidad y Tobago",
  "Túnez",
  "Turkmenistán",
  "Turquía",
  "Tuvalu",
  "Ucrania",
  "Uganda",
  "Uruguay",
  "Uzbekistán",
  "Vanuatu",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Yibuti",
  "Zambia",
  "Zimbabue",
];

// Tipo para Impuesto Local
type ImpuestoLocal = {
  id: string;
  nombre: string;
  tasa: string;
  monto: string;
  tipo: string;
};

// Props para el modal de producto
type ProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  isEditing: boolean;
  productInternalName: string;
  setProductInternalName: (value: string) => void;
  productNoIdentificacion: string;
  setProductNoIdentificacion: (value: string) => void;
  productDescription: string;
  setProductDescription: (value: string) => void;
  productUnitPrice: string;
  setProductUnitPrice: (value: string) => void;
  productClaveSat: string;
  setProductClaveSat: (value: string) => void;
  productUnidadSat: string;
  setProductUnidadSat: (value: string) => void;
  productObjetoImpuesto: string;
  setProductObjetoImpuesto: (value: string) => void;
  productTaxRateId: string;
  setProductTaxRateId: (value: string) => void;
  taxRates: TaxRate[];
  taxObjects: SatCatalogEntry[];
  fiscalErrors: Partial<Record<ProductFiscalField, string>>;
  savedFiscalIssues: FiscalIssue[];
  pendingTaxes: PendingTaxes;
  isLoading?: boolean;
};

// Componente ProductModal
const ProductModal = ({
  isOpen,
  onClose,
  onSave,
  isEditing,
  productInternalName,
  setProductInternalName,
  productNoIdentificacion,
  setProductNoIdentificacion,
  productDescription,
  setProductDescription,
  productUnitPrice,
  setProductUnitPrice,
  productClaveSat,
  setProductClaveSat,
  productUnidadSat,
  setProductUnidadSat,
  productObjetoImpuesto,
  setProductObjetoImpuesto,
  productTaxRateId,
  setProductTaxRateId,
  taxRates,
  taxObjects,
  fiscalErrors,
  savedFiscalIssues,
  pendingTaxes,
  isLoading = false,
}: ProductModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E2E8F0] bg-white px-6 py-4">
          <h2 className="text-xl font-bold text-[#0F172A]">
            {isEditing ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-slate-500 transition hover:border-[#E2E8F0] hover:bg-blue-50 hover:text-blue-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-slate-50 p-6">
          {savedFiscalIssues.length > 0 && (
            <div role="alert" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                Este producto se guardó con datos que el SAT no acepta
              </p>
              <p className="mt-1">Corrígelos para poder facturarlo; al guardar se validan de nuevo.</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {savedFiscalIssues.map((issue) => (
                  <li key={`${issue.code}-${issue.field}`}>{issue.message}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h3 className="mb-4 border-b border-[#E2E8F0] pb-2 text-lg font-bold text-[#0F172A]">Datos del producto</h3>
              <div className="space-y-4">
                <div>
                  <Label>Nombre Interno:</Label>
                  <input
                    type="text"
                    value={productInternalName}
                    onChange={(e) => setProductInternalName(e.target.value)}
                    placeholder="Nombre Interno"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <Label>No Identificación (obligatorio solo para comercio exterior):</Label>
                  <input
                    type="text"
                    value={productNoIdentificacion}
                    onChange={(e) => setProductNoIdentificacion(e.target.value)}
                    placeholder="Codigo Interno (Opcional)"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <Label>Descripción:</Label>
                  <textarea
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Descripción"
                    rows={3}
                    className={`${inputStyle} resize-y`}
                  />
                </div>

                <div>
                  <Label>Precio Unitario:</Label>
                  <input
                    type="text"
                    value={productUnitPrice}
                    onChange={(e) => setProductUnitPrice(e.target.value)}
                    placeholder="Precio"
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 border-b border-[#E2E8F0] pb-2 text-lg font-bold text-[#0F172A]">Cambios obligatorios CFDI 4.0 SAT</h3>
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-sm text-[#64748B]">
                    Asocia tu producto al catálogo c_ClaveProdServ del SAT<br />
                    Escribe la clave (8 dígitos) o una palabra y elige una opción:
                  </p>
                  <SatKeySearch
                    label="Clave de Producto o Servicio"
                    value={productClaveSat}
                    onChange={setProductClaveSat}
                    search={searchProductKeyOptions}
                    placeholder="Ej. 43232408 o software"
                    error={fiscalErrors.clave_producto}
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm text-[#64748B]">
                    Define la unidad (catálogo c_ClaveUnidad del SAT)<br />
                    Escribe la clave (2 o 3 caracteres) o el nombre y elige una opción:
                  </p>
                  <SatKeySearch
                    label="Unidad"
                    value={productUnidadSat}
                    onChange={setProductUnidadSat}
                    search={searchUnitKeyOptions}
                    normalize={upperCase}
                    placeholder="Ej. H87, E48 o pieza"
                    error={fiscalErrors.clave_unidad}
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm text-[#64748B]">Objeto Impuesto</p>
                  <div className="relative">
                    <select
                      aria-label="Objeto de impuesto"
                      value={productObjetoImpuesto}
                      onChange={(e) => setProductObjetoImpuesto(e.target.value)}
                      className={`${selectStyle} appearance-none`}
                      aria-invalid={Boolean(fiscalErrors.objeto_imp)}
                    >
                      <option value="">{taxObjects.length > 0 ? "Seleccione un objeto de impuesto" : "Cargando catálogo del SAT..."}</option>
                      {productObjetoImpuesto !== "" && !taxObjects.some((entry) => entry.code === productObjetoImpuesto) && (
                        <option value={productObjetoImpuesto}>{productObjetoImpuesto}</option>
                      )}
                      {taxObjects.map((entry) => (
                        <option key={entry.code} value={entry.code}>
                          {entry.code} - {entry.description}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                  {fiscalErrors.objeto_imp && <p className="mt-1 text-xs font-medium text-red-600">{fiscalErrors.objeto_imp}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-md font-bold text-[#0F172A]">Impuestos Federales</h3>
            <p className="mb-4 text-sm text-[#64748B]">IVA que lleva el producto: 16 %, 0 %, Exento o Sin IVA.</p>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label withInfo infoText="Exento y tasa 0 % son tratamientos fiscales distintos. Con objeto de impuesto 02 el producto necesita IVA; con 01, 03 o 04 no lleva.">
                  IVA
                </Label>
                <div className="relative">
                  <select
                    aria-label="IVA"
                    value={productTaxRateId}
                    onChange={(e) => setProductTaxRateId(e.target.value)}
                    className={`${selectStyle} appearance-none`}
                    aria-invalid={Boolean(fiscalErrors.tax_rate_id)}
                  >
                    <option value="">Sin IVA</option>
                    {taxRates.map((taxRate) => (
                      <option key={taxRate.id} value={String(taxRate.id)}>
                        {taxRate.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
                {fiscalErrors.tax_rate_id && <p className="mt-1 text-xs font-medium text-red-600">{fiscalErrors.tax_rate_id}</p>}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <ComingSoon
              title="Otros impuestos y datos aduaneros"
              note="Por ahora el sistema solo aplica IVA (16 %, 0 % o Exento). IVA RET, IEPS, ISR, cuenta predial, pedimento e impuestos locales todavía no se pueden capturar."
            >
              {hasPendingTaxes(pendingTaxes) && (
                <p role="note" aria-label="Impuestos sin aplicar" className="mb-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  {PENDING_TAXES_WARNING}
                </p>
              )}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <PendingTaxField label="IVA RET (%)" value={pendingTaxes.ivaRetenido} />
                <PendingTaxField label="IEPS" value={pendingTaxes.ieps} />
                <PendingTaxField label="ISR (%)" value={pendingTaxes.isr} />
                <PendingTaxField label="Cuenta predial" value={pendingTaxes.cuentaPredial} />
                <PendingTaxField label="Número de pedimento" value={pendingTaxes.noPedimento} />
                <PendingTaxField label="Impuestos locales" value={pendingTaxes.impuestosLocales.join("; ")} />
              </div>
            </ComingSoon>
          </div>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-4 border-t border-[#E2E8F0] bg-white px-6 py-4">
          <button
            onClick={onClose} 
            className="rounded-xl border border-red-100 bg-red-50 px-6 py-2 font-semibold text-red-600 shadow-sm transition hover:bg-red-100 hover:shadow-md"
            disabled={isLoading}
          >
            Cerrar
          </button>
          <button
            onClick={onSave}
            className="rounded-xl bg-blue-600 px-6 py-2 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {isEditing ? "Actualizando..." : "Guardando..."}
              </span>
            ) : (
              isEditing ? "Actualizar" : "Guardar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente principal
export default function CatalogoProductos() {
  const [search, setSearch] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  // Estados para productos desde API
  const [productos, setProductos] = useState<Product[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  // Estados para el modal de producto
  const [productInternalName, setProductInternalName] = useState("");
  const [productNoIdentificacion, setProductNoIdentificacion] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productUnitPrice, setProductUnitPrice] = useState("");
  const [productClaveSat, setProductClaveSat] = useState("");
  const [productUnidadSat, setProductUnidadSat] = useState("");
  // Fase 6.26: por omisión "02" con IVA 16 % (antes "01", que dejaba
  // productos con IVA marcados como "no objeto de impuesto").
  const [productObjetoImpuesto, setProductObjetoImpuesto] = useState(TAX_OBJECT_TAXED);
  const [productTaxRateId, setProductTaxRateId] = useState("");
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [taxObjects, setTaxObjects] = useState<SatCatalogEntry[]>([]);
  const [fiscalErrors, setFiscalErrors] = useState<Partial<Record<ProductFiscalField, string>>>({});
  const [savedFiscalIssues, setSavedFiscalIssues] = useState<FiscalIssue[]>([]);
  const [pendingTaxes, setPendingTaxes] = useState<PendingTaxes>(NO_PENDING_TAXES);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Cargar productos al iniciar
  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProductos(data);
      setFilteredProductos(data);
    } catch (error: any) {
      setToast({ 
        message: error.message || "Error al cargar productos", 
        type: "error" 
      });
      setProductos([]);
      setFilteredProductos([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Fase 6.26: tasas de IVA (traslados activos) y objetos de impuesto del SAT.
  useEffect(() => {
    getTaxRates()
      .then(setTaxRates)
      .catch(() => setToast({ message: "No fue posible cargar las tasas de IVA.", type: "error" }));
    getSatCatalogs()
      .then((catalogs) => setTaxObjects(catalogs.tax_objects))
      .catch(() => setToast({ message: "No fue posible cargar los catálogos del SAT.", type: "error" }));
  }, []);

  /** IVA 16 % del catálogo, para un producto nuevo con objeto 02. */
  const defaultTaxRateId = (): string => {
    const sixteen = taxRates.find((taxRate) => taxRate.factor_type === "tasa" && Math.abs(Number(taxRate.rate) - 0.16) < 0.000001);
    return sixteen ? String(sixteen.id) : "";
  };

  // Filtrar productos cuando cambia el término de búsqueda
  useEffect(() => {
    const searchLower = search.toLowerCase();
    const filtered = productos.filter(producto => 
      producto.name?.toLowerCase().includes(searchLower) ||
      producto.clave_producto?.includes(search) ||
      producto.descripcion?.toLowerCase().includes(searchLower) ||
      producto.clave_unidad?.toLowerCase().includes(searchLower)
    );
    setFilteredProductos(filtered);
    setCurrentPage(1); // Resetear a primera página al buscar
  }, [search, productos]);

  // Calcular productos paginados
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProductos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProductos.length / itemsPerPage);

  // Funciones para el modal de producto
  const openProductModal = () => {
    setEditingProductId(null);
    resetProductForm();
    setIsProductModalOpen(true);
  };

  const openEditModal = (producto: Product) => {
    setEditingProductId(producto.id || null);
    setProductInternalName(producto.name || "");
    setProductNoIdentificacion(producto.no_identificacion || "");
    setProductDescription(producto.descripcion || "");
    setProductUnitPrice(producto.precio_unitario?.toString() || "");
    setProductClaveSat(producto.clave_producto || "");
    setProductUnidadSat(producto.clave_unidad || "");
    setProductObjetoImpuesto(producto.objeto_imp || "");
    setProductTaxRateId(producto.tax_rate_id ? String(producto.tax_rate_id) : "");
    setSavedFiscalIssues(producto.fiscal_issues ?? []);
    setFiscalErrors({});
    setPendingTaxes(pendingTaxesOf(producto));

    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    resetProductForm();
  };

  const resetProductForm = () => {
    setProductInternalName("");
    setProductNoIdentificacion("");
    setProductDescription("");
    setProductUnitPrice("");
    setProductClaveSat("");
    setProductUnidadSat("");
    setProductObjetoImpuesto(TAX_OBJECT_TAXED);
    setProductTaxRateId(defaultTaxRateId());
    setFiscalErrors({});
    setSavedFiscalIssues([]);
    setPendingTaxes(NO_PENDING_TAXES);
  };

  const handleSaveProduct = async () => {
    // Validaciones
    if (!productInternalName) {
      setToast({ message: "El campo Nombre Interno es obligatorio", type: "error" });
      return;
    }
    if (!productDescription) {
      setToast({ message: "El campo Descripción es obligatorio", type: "error" });
      return;
    }
    if (!productUnitPrice) {
      setToast({ message: "El campo Precio Unitario es obligatorio", type: "error" });
      return;
    }
    if (!productClaveSat) {
      setToast({ message: "El campo Clave de Producto o Servicio es obligatorio", type: "error" });
      return;
    }

    // Fase 6.26: formato y coherencia antes de enviar; que la clave y la
    // unidad existan en el catálogo lo confirma el backend.
    const taxRateId = productTaxRateId === "" ? null : Number(productTaxRateId);
    const errors: Partial<Record<ProductFiscalField, string>> = {};
    if (!/^\d{8}$/.test(productClaveSat.trim())) errors.clave_producto = "La clave de producto SAT debe tener 8 dígitos.";
    if (productUnidadSat.trim() === "") errors.clave_unidad = "La clave de unidad SAT es obligatoria.";
    if (productObjetoImpuesto === "") errors.objeto_imp = "El objeto de impuesto es obligatorio.";
    const coherence = productObjetoImpuesto === "" ? null : taxObjectError(productObjetoImpuesto, taxRateId);
    if (coherence) errors.tax_rate_id = coherence;
    setFiscalErrors(errors);
    const firstError = Object.values(errors)[0];
    if (firstError) {
      setToast({ message: firstError, type: "error" });
      return;
    }

    const productData: Product = {
  name: productInternalName,
  no_identificacion: productNoIdentificacion || undefined,
  descripcion: productDescription,
  precio_unitario: parseFloat(productUnitPrice) || 0,
      clave_producto: productClaveSat.trim(),
      clave_unidad: productUnidadSat.trim(),
      objeto_imp: productObjetoImpuesto,
      tax_rate_id: taxRateId,
      // Fase 6.26.1: IVA RET, IEPS, ISR, cuenta predial, pedimento e impuestos
      // locales no se envían; el backend conserva lo que el producto tenga.
    };

    setIsSaving(true);
    try {
      if (editingProductId) {
        await updateProduct(editingProductId, productData);
        setToast({ message: "Producto actualizado correctamente", type: "success" });
      } else {
        await createProduct(productData);
        setToast({ message: "Producto agregado correctamente", type: "success" });
      }
      closeProductModal();
      await loadProducts(); // Recargar productos
    } catch (error: any) {
      setToast({ message: error.message || "Error al guardar producto", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      return;
    }
    
    try {
      await deleteProduct(productId);
      setToast({ message: "Producto eliminado correctamente", type: "success" });
      await loadProducts(); // Recargar productos
    } catch (error: any) {
      setToast({ message: error.message || "Error al eliminar producto", type: "error" });
    }
  };

  // Funciones para paginación
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-50 p-6 text-[#0F172A]">
        <div className="space-y-6">
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A]">Catálogo de Productos</h1>
                <p className="mt-1 text-sm text-[#64748B]">
                  Administra productos, servicios y claves SAT para facturación.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {/* Fase 6.26.1: la importación masiva todavía no existe (no hay endpoint). */}
                <button
                  {...comingSoonActionProps}
                  className={`flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-sm ${COMING_SOON_ACTION_CLASS}`}
                >
                  Carga masiva
                  <ComingSoonBadge />
                </button>
                <button
                  onClick={openProductModal}
                  className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                >
                  Agregar producto
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-2xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  className={`${inputStyle} pl-11`}
                  placeholder="Buscar por código, nombre, descripción, clave unidad o unidad..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <span className="text-sm font-semibold uppercase tracking-wide text-[#64748B]">Mostrar</span>
                <select
                  className={`${selectStyle} min-w-40`}
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value="25">25 registros</option>
                  <option value="50">50 registros</option>
                  <option value="100">100 registros</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-4xl text-sm">
                  <thead className="bg-[#F8FAFC] text-left text-xs uppercase tracking-[0.08em] text-[#64748B]">
                    <tr>
                      <th className="px-4 py-3.5 font-semibold">Acciones</th>
                      <th className="px-4 py-3.5 font-semibold">Código SAT</th>
                      <th className="px-4 py-3.5 font-semibold">Nombre</th>
                      <th className="px-4 py-3.5 font-semibold">Descripción</th>
                      <th className="px-4 py-3.5 font-semibold">Clave Unidad</th>
                      <th className="px-4 py-3.5 text-right font-semibold">Precio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] bg-white">
                    {currentProducts.map((producto) => (
                      <tr key={producto.id} className="bg-white transition-colors hover:bg-blue-50">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600 transition hover:bg-blue-100 hover:shadow-sm"
                              onClick={() => openEditModal(producto)}
                              title="Editar producto"
                            >
                              <SquarePen className="h-4 w-4" />
                            </button>
                            <button
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100 hover:shadow-sm"
                              onClick={() => producto.id && handleDeleteProduct(producto.id)}
                              title="Eliminar producto"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
                            {producto.clave_producto}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-semibold text-[#0F172A]">
                          <div className="flex flex-wrap items-center gap-2">
                            {producto.name}
                            {(producto.fiscal_issues?.length ?? 0) > 0 && (
                              <span
                                className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800"
                                title={producto.fiscal_issues?.map((issue) => issue.message).join("\n")}
                              >
                                <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                                Revisar datos SAT
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-[#64748B]">{producto.descripcion}</td>
                        <td className="px-4 py-4 text-[#64748B]">{producto.clave_unidad || "-"}</td>
                        <td className="px-4 py-4 text-right text-sm font-semibold text-blue-600">
                          ${producto.precio_unitario?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    {currentProducts.length === 0 && !isLoading && (
                      <tr>
                        <td colSpan={7} className="px-6 py-10 text-center text-[#64748B]">
                          No se encontraron productos que coincidan con tu búsqueda
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 border-t border-[#E2E8F0] px-6 py-4 text-sm text-[#64748B] md:flex-row md:items-center md:justify-between">
                <span>
                  Mostrando {currentProducts.length} de {filteredProductos.length} resultados
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 font-medium text-[#0F172A] shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                  {paginationNumbers().map((page) => (
                    <button
                      key={page}
                      className={`rounded-xl border px-3 py-2 font-medium shadow-sm transition hover:shadow-md ${
                        currentPage === page
                          ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
                          : "border-[#E2E8F0] bg-white text-[#0F172A] hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 font-medium text-[#0F172A] shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Activity className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#64748B]">Total productos</p>
              <h3 className="mt-2 text-3xl font-bold text-[#0F172A]">{productos.length}</h3>
              <p className="mt-2 text-sm text-[#64748B]">Productos registrados en el catálogo.</p>
            </div>

            <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <FileTextIcon className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#64748B]">Servicios SAT</p>
              <h3 className="mt-2 text-3xl font-bold text-[#0F172A]">
                {productos.filter((p) => p.clave_producto).length}
              </h3>
              <p className="mt-2 text-sm text-[#64748B]">Productos con clave SAT asignada.</p>
            </div>

            <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#64748B]">Optimización</p>
              <h3 className="mt-2 text-3xl font-bold text-[#0F172A]">Activo</h3>
              <p className="mt-2 text-sm text-[#64748B]">Catálogo actualizado en tiempo real.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de producto */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={closeProductModal}
        onSave={handleSaveProduct}
        isEditing={editingProductId !== null}
        productInternalName={productInternalName}
        setProductInternalName={setProductInternalName}
        productNoIdentificacion={productNoIdentificacion}
        setProductNoIdentificacion={setProductNoIdentificacion}
        productDescription={productDescription}
        setProductDescription={setProductDescription}
        productUnitPrice={productUnitPrice}
        setProductUnitPrice={setProductUnitPrice}
        productClaveSat={productClaveSat}
        setProductClaveSat={setProductClaveSat}
        productUnidadSat={productUnidadSat}
        setProductUnidadSat={setProductUnidadSat}
        productObjetoImpuesto={productObjetoImpuesto}
        setProductObjetoImpuesto={setProductObjetoImpuesto}
        productTaxRateId={productTaxRateId}
        setProductTaxRateId={setProductTaxRateId}
        taxRates={taxRates}
        taxObjects={taxObjects}
        fiscalErrors={fiscalErrors}
        savedFiscalIssues={savedFiscalIssues}
        pendingTaxes={pendingTaxes}
        isLoading={isSaving}
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AppLayout>
  );
}