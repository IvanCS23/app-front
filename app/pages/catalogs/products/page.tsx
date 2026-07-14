"use client";
import React, { useState, useEffect } from "react";
import { 
  SquarePen, Trash, Plus, Minus, X, ChevronDown, Info, CheckCircle2, Loader2, Search,
  Download, Upload, Activity, FileText as FileTextIcon 
} from "lucide-react";
import AppLayout from "@/app/components/layout/AppLayout";
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  Product 
} from "@/src/services/product.services";

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

// Opciones para Objeto Impuesto
const objetoImpuestoOptions = [
  { label: "01 - No objeto de impuesto", value: "01" },
  { label: "02 - Sí objeto de impuesto", value: "02" },
  { label: "03 - Sí objeto del impuesto y no obligado al desglose", value: "03" },
  { label: "04 - Sí objeto del impuesto y no causa impuesto", value: "04" },
  { label: "05 - Si Objeto del Impuesto, IVA Crédito PODEBI", value: "05" },
  { label: "06 - Sí objeto del IVA, No traslado IVA", value: "06" },
  { label: "07 - No traslado del IVA, Si desglose IEPS", value: "07" },
  { label: "08 - No traslado del IVA, No desglose IEPS", value: "08" },
];

// Opciones para IVA
const ivaOptions = [
  { label: "IVA 16%", value: "16" },
  { label: "IVA 8%", value: "8" },
  { label: "IVA 0%", value: "0" },
  { label: "Exento", value: "exento" },
];

// Opciones para IVA RET
const ivaRetOptions = [
  { label: " - ", value: "" },
  { label: "IVA RET 0%", value: "0" },
  { label: "IVA RET 0.2%", value: "0.2" },
  { label: "IVA RET 0.5%", value: "0.5" },
  { label: "IVA RET 0.5333%", value: "0.5333" },
  { label: "IVA RET 0.7%", value: "0.7" },
  { label: "IVA RET 2%", value: "2" },
  { label: "IVA RET 2.5%", value: "2.5" },
  { label: "IVA RET 3%", value: "3" },
  { label: "IVA RET 4%", value: "4" },
  { label: "IVA RET 5%", value: "5" },
  { label: "IVA RET 5.3333%", value: "5.3333" },
  { label: "IVA RET 5.4%", value: "5.4" },
  { label: "IVA RET 6%", value: "6" },
  { label: "IVA RET 8%", value: "8" },
  { label: "IVA RET 9.19%", value: "9.19" },
  { label: "IVA RET 10%", value: "10" },
  { label: "IVA RET 10.6%", value: "10.6" },
  { label: "IVA RET 10.66%", value: "10.66" },
  { label: "IVA RET 10.67%", value: "10.67" },
  { label: "IVA RET 10.666%", value: "10.666" },
  { label: "IVA RET 10.667%", value: "10.667" },
  { label: "IVA RET 10.6666%", value: "10.6666" },
  { label: "IVA RET 10.6667%", value: "10.6667" },
  { label: "IVA RET 10.6668%", value: "10.6668" },
  { label: "IVA RET 16%", value: "16" },
];

// Opciones para IEPS TASA
const iepsTasaOptions = [
  { label: " - ", value: "" },
  { label: "IEPS 0%", value: "0" },
  { label: "IEPS 3%", value: "3" },
  { label: "IEPS 6%", value: "6" },
  { label: "IEPS 7%", value: "7" },
  { label: "IEPS 8%", value: "8" },
  { label: "IEPS 9%", value: "9" },
  { label: "IEPS 25%", value: "25" },
  { label: "IEPS 26.5%", value: "26.5" },
  { label: "IEPS 30%", value: "30" },
  { label: "IEPS 30.4%", value: "30.4" },
  { label: "IEPS 50%", value: "50" },
  { label: "IEPS 53%", value: "53" },
  { label: "IEPS 160%", value: "160" },
];

// Opciones para ISR
const isrOptions = [
  { label: " - ", value: "" },
  { label: "ISR 0%", value: "0" },
  { label: "ISR 0.1%", value: "0.1" },
  { label: "ISR 0.4%", value: "0.4" },
  { label: "ISR 0.5%", value: "0.5" },
  { label: "ISR 0.9%", value: "0.9" },
  { label: "ISR 1%", value: "1" },
  { label: "ISR 1.1%", value: "1.1" },
  { label: "ISR 1.25%", value: "1.25" },
  { label: "ISR 2%", value: "2" },
  { label: "ISR 2.10%", value: "2.10" },
  { label: "ISR 2.5%", value: "2.5" },
  { label: "ISR 3%", value: "3" },
  { label: "ISR 4%", value: "4" },
  { label: "ISR 5.4%", value: "5.4" },
  { label: "ISR 10%", value: "10" },
  { label: "ISR 10.666%", value: "10.666" },
  { label: "ISR 20%", value: "20" },
  { label: "ISR 25%", value: "25" },
  { label: "ISR 30%", value: "30" },
  { label: "ISR 30.5%", value: "30.5" },
];

// Opciones para Impuestos Locales Tipo
const impuestoLocalTipoOptions = [
  { label: "Retencion", value: "retencion" },
  { label: "Translado", value: "translado" },
];

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
  cuentasPrediales: string[];
  addCuentaPredial: () => void;
  removeCuentaPredial: (index: number) => void;
  updateCuentaPredial: (index: number, value: string) => void;
  showCuentasPrediales: boolean;
  productIVA: string;
  setProductIVA: (value: string) => void;
  productIVARet: string;
  setProductIVARet: (value: string) => void;
  iepsType: "tasa" | "cuota";
  setIepsType: (value: "tasa" | "cuota") => void;
  iepsTasaValue: string;
  setIepsTasaValue: (value: string) => void;
  iepsCuotaValue: string;
  setIepsCuotaValue: (value: string) => void;
  productISR: string;
  setProductISR: (value: string) => void;
  pedimentos: string[];
  addPedimento: () => void;
  removePedimento: (index: number) => void;
  updatePedimento: (index: number, value: string) => void;
  showPedimentos: boolean;
  impuestosLocales: ImpuestoLocal[];
  addImpuestoLocal: () => void;
  removeImpuestoLocal: (id: string) => void;
  updateImpuestoLocal: (id: string, field: keyof ImpuestoLocal, value: string) => void;
  showImpuestosLocales: boolean;
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
  cuentasPrediales,
  addCuentaPredial,
  removeCuentaPredial,
  updateCuentaPredial,
  showCuentasPrediales,
  productIVA,
  setProductIVA,
  productIVARet,
  setProductIVARet,
  iepsType,
  setIepsType,
  iepsTasaValue,
  setIepsTasaValue,
  iepsCuotaValue,
  setIepsCuotaValue,
  productISR,
  setProductISR,
  pedimentos,
  addPedimento,
  removePedimento,
  updatePedimento,
  showPedimentos,
  impuestosLocales,
  addImpuestoLocal,
  removeImpuestoLocal,
  updateImpuestoLocal,
  showImpuestosLocales,
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
                    Asocia tu producto al CATALOGO del SAT<br />
                    Busca tu CLAVE, escríbela en el campo de abajo, espera opciones y selecciona una (8 caracteres):
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={productClaveSat}
                      onChange={(e) => setProductClaveSat(e.target.value)}
                      placeholder="Clave de Producto o Servicio"
                      className={`${inputStyle} flex-1`}
                      maxLength={8}
                    />
                    <button className="flex h-12 items-center justify-center whitespace-nowrap rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm font-semibold text-blue-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:shadow-md">
                      Buscar Clave
                    </button>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm text-[#64748B]">
                    Define la UNIDAD de tu producto<br />
                    Busca tu UNIDAD, escríbela en el campo, espera opciones y selecciona una (De 2 o 3 caracteres):
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={productUnidadSat}
                      onChange={(e) => setProductUnidadSat(e.target.value)}
                      placeholder="Unidad"
                      className={`${inputStyle} flex-1`}
                      maxLength={3}
                    />
                    <button className="flex h-12 items-center justify-center whitespace-nowrap rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm font-semibold text-blue-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:shadow-md">
                      Buscar Unidad
                    </button>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm text-[#64748B]">Objeto Impuesto</p>
                  <div className="relative">
                    <select
                      value={productObjetoImpuesto}
                      onChange={(e) => setProductObjetoImpuesto(e.target.value)}
                      className={`${selectStyle} appearance-none`}
                    >
                      {objetoImpuestoOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="mb-4 border-b border-[#E2E8F0] pb-2 text-lg font-bold text-[#0F172A]">Opcionales</h3>
            
            <div className="mb-6">
              <button
                onClick={addCuentaPredial}
                className="flex items-center gap-2 text-[15px] font-semibold text-blue-600 transition hover:text-blue-700"
              >
                <Plus className="h-4 w-4" />
                Agregar Cuenta Predial
              </button>
              
              {showCuentasPrediales && cuentasPrediales.map((cuenta, index) => (
                <div key={index} className="flex gap-2 mt-3">
                  <input
                    type="text"
                    value={cuenta}
                    onChange={(e) => updateCuentaPredial(index, e.target.value)}
                    placeholder="Cuenta Predial"
                    className={`${inputStyle} flex-1`}
                  />
                  <button
                    onClick={() => removeCuentaPredial(index)}
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-red-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:shadow-md"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  {index === cuentasPrediales.length - 1 && (
                    <button
                      onClick={addCuentaPredial}
                      className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-blue-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:shadow-md"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-md font-bold text-[#0F172A]">Impuestos Federales</h3>
            <p className="mb-4 text-sm text-[#64748B]">Selecciona únicamente los impuestos que necesite tu producto</p>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label>IVA</Label>
                <div className="relative">
                  <select
                    value={productIVA}
                    onChange={(e) => setProductIVA(e.target.value)}
                    className={`${selectStyle} appearance-none`}
                  >
                    {ivaOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <Label>IVA RET</Label>
                <div className="relative">
                  <select
                    value={productIVARet}
                    onChange={(e) => setProductIVARet(e.target.value)}
                    className={`${selectStyle} appearance-none`}
                  >
                    {ivaRetOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label>IEPS</Label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="iepsType"
                        checked={iepsType === "tasa"}
                        onChange={() => setIepsType("tasa")}
                        className="mb-2 h-4 w-4 rounded-full border-slate-300 bg-white text-blue-600 focus:ring-blue-500 focus:ring-offset-0 checked:border-blue-600 checked:bg-blue-600"
                      />
                      <span className="text-sm text-slate-300 mb-2">TASA</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="iepsType"
                        checked={iepsType === "cuota"}
                        onChange={() => setIepsType("cuota")}
                        className="mb-2 h-4 w-4 rounded-full border-slate-300 bg-white text-blue-600 focus:ring-blue-500 focus:ring-offset-0 checked:border-blue-600 checked:bg-blue-600"
                      />
                      <span className="text-sm text-slate-300 mb-2">CUOTA</span>
                    </label>
                  </div>
                </div>
                {iepsType === "tasa" ? (
                  <div className="relative">
                    <select
                      value={iepsTasaValue}
                      onChange={(e) => setIepsTasaValue(e.target.value)}
                      className={`${selectStyle} appearance-none`}
                    >
                      {iepsTasaOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={iepsCuotaValue}
                    onChange={(e) => setIepsCuotaValue(e.target.value)}
                    placeholder="Ej. 0.005, 0.003"
                    className={inputStyle}
                  />
                )}
              </div>

              <div>
                <Label>ISR</Label>
                <div className="relative">
                  <select
                    value={productISR}
                    onChange={(e) => setProductISR(e.target.value)}
                    className={`${selectStyle} appearance-none`}
                  >
                    {isrOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="mb-2 text-md font-bold text-[#0F172A]">Información Aduanera</h3>
            <p className="mb-3 text-sm text-[#64748B]">Numero de Pedimento</p>
            
            <button
              onClick={addPedimento}
              className="flex items-center gap-2 text-[15px] font-semibold text-blue-600 transition hover:text-blue-700"
            >
              <Plus className="h-4 w-4" />
              Agregar Numero de Pedimento
            </button>
            
            {showPedimentos && pedimentos.map((pedimento, index) => (
              <div key={index} className="flex gap-2 mt-3">
                <input
                  type="text"
                  value={pedimento}
                  onChange={(e) => updatePedimento(index, e.target.value)}
                  placeholder="Ej. 99 99 9999 9999999"
                  className={`${inputStyle} flex-1`}
                />
                <button
                  onClick={() => removePedimento(index)}
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-red-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:shadow-md"
                  title="Quitar">
                  <Minus className="h-5 w-5" />
                </button>
                {index === pedimentos.length - 1 && (
                  <button
                    onClick={addPedimento}
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-blue-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:shadow-md"
                    title="Agregar">
                    <Plus className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-md font-bold text-[#0F172A]">Impuestos Locales</h3>
              <div className="relative">
                <Info 
                  className="h-4 w-4 cursor-help text-amber-500" 
                  onMouseEnter={(e) => {
                    const tooltip = e.currentTarget.nextElementSibling;
                    if (tooltip) tooltip.classList.remove('hidden');
                  }}
                  onMouseLeave={(e) => {
                    const tooltip = e.currentTarget.nextElementSibling;
                    if (tooltip) tooltip.classList.add('hidden');
                  }}
                />
                <div className="hidden absolute bottom-full left-0 z-50 mb-2 w-80 rounded-xl border border-[#E2E8F0] bg-white p-3 text-xs text-[#64748B] shadow-sm">
                  En el nombre no se permiten caracteres especiales salvo el signo %.
                  <br /><br />
                  Si escribes la <b>Tasa</b>, el monto será calculado con base al subtotal.
                  <br />
                  Si escribes el <b>Monto</b>, se le asignará una tasa de 0.
                  <br />
                  Si escribes tanto <b>Tasa como Monto</b>, estos se tomarán tal cual.
                </div>
              </div>
            </div>
                          
            <button
              onClick={addImpuestoLocal}
              className="flex items-center gap-2 text-[15px] font-semibold text-blue-600 transition hover:text-blue-700"
            >
              <Plus className="h-4 w-4" />
              Agregar Impuestos Locales
            </button>
            
            {showImpuestosLocales && impuestosLocales.map((impuesto) => (
              <div key={impuesto.id} className="flex flex-wrap gap-2 mt-3 items-end">
                <div className="flex-1 min-w-40">
                  <input
                    type="text"
                    value={impuesto.nombre}
                    onChange={(e) => updateImpuestoLocal(impuesto.id, "nombre", e.target.value)}
                    placeholder="Nombre"
                    className={inputStyle}
                  />
                </div>
                <div className="flex-1 min-w-32">
                  <input
                    type="text"
                    value={impuesto.tasa}
                    onChange={(e) => updateImpuestoLocal(impuesto.id, "tasa", e.target.value)}
                    placeholder="Ej. 0.005, 0.03"
                    className={inputStyle}
                  />
                </div>
                <div className="flex-1 min-w-32">
                  <input
                    type="text"
                    value={impuesto.monto}
                    onChange={(e) => updateImpuestoLocal(impuesto.id, "monto", e.target.value)}
                    placeholder="Ej. 10.00"
                    className={inputStyle}
                  />
                </div>
                <div className="w-32">
                  <div className="relative">
                    <select
                      value={impuesto.tipo}
                      onChange={(e) => updateImpuestoLocal(impuesto.id, "tipo", e.target.value)}
                      className={`${selectStyle} appearance-none`}
                    >
                      {impuestoLocalTipoOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <button
                  onClick={() => removeImpuestoLocal(impuesto.id)}
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-red-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:shadow-md"
                  title="Quitar">
                  <Minus className="h-5 w-5" />
                </button>
              </div>
            ))}
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

// Props para el modal de carga masiva
type BulkUploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// Componente BulkUploadModal
const BulkUploadModal = ({ isOpen, onClose }: BulkUploadModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E2E8F0] bg-white px-6 py-4">
          <h2 className="text-xl font-bold text-[#0F172A]">Carga Masiva de Productos</h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-slate-500 transition hover:border-[#E2E8F0] hover:bg-blue-50 hover:text-blue-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-slate-50 p-6">
          <div className="mb-6 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <p className="text-sm leading-relaxed text-[#64748B]">
              Aquí podrás subir tu catálogo de productos de forma masiva, a través de un archivo .csv. 
              En <span className="font-medium text-blue-600">Ejemplo de carga masiva</span> se descargará la plantilla base 
              y un documento con los detalles para el llenado del archivo.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 mb-6 sm:grid-cols-2">
            <button className="flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-[#0F172A] shadow-sm transition hover:bg-blue-50 hover:shadow-md">
              <FileTextIcon className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-semibold">Ejemplo de carga masiva</span>
            </button>
            
            <button className="flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-[#0F172A] shadow-sm transition hover:bg-blue-50 hover:shadow-md">
              <Download className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-semibold">Descarga .csv</span>
            </button>
            
            <button className="flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-[#0F172A] shadow-sm transition hover:bg-blue-50 hover:shadow-md">
              <Upload className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-semibold">Subir archivo .csv</span>
            </button>
            
            <button className="flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-[#0F172A] shadow-sm transition hover:bg-blue-50 hover:shadow-md">
              <Activity className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-semibold">Ver estado de los procesos</span>
            </button>
          </div>

          <div className="my-6 border-t border-[#E2E8F0]"></div>

          <div className="flex gap-4">
            <button className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md">
              Procesar archivos
            </button>
            <button className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-red-600 hover:shadow-md">
              Eliminar todos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal
export default function CatalogoProductos() {
  const [search, setSearch] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
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
  const [productObjetoImpuesto, setProductObjetoImpuesto] = useState("01");
  const [cuentasPrediales, setCuentasPrediales] = useState<string[]>([]);
  const [showCuentasPrediales, setShowCuentasPrediales] = useState(false);
  const [productIVA, setProductIVA] = useState("16");
  const [productIVARet, setProductIVARet] = useState("");
  const [iepsType, setIepsType] = useState<"tasa" | "cuota">("tasa");
  const [iepsTasaValue, setIepsTasaValue] = useState("");
  const [iepsCuotaValue, setIepsCuotaValue] = useState("");
  const [productISR, setProductISR] = useState("");
  const [pedimentos, setPedimentos] = useState<string[]>([]);
  const [showPedimentos, setShowPedimentos] = useState(false);
  const [impuestosLocales, setImpuestosLocales] = useState<ImpuestoLocal[]>([]);
  const [showImpuestosLocales, setShowImpuestosLocales] = useState(false);

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
    setProductObjetoImpuesto(producto.objeto_imp || "01");
    setProductIVA(producto.iva?.toString() || "16");
    setProductIVARet(producto.iva_retenido?.toString() || "");
    setProductISR(producto.isr?.toString() || "");
    
    // Manejar IEPS
    if (producto.ieps) {
      setIepsType("tasa");
      setIepsTasaValue(producto.ieps.toString());
    } else {
      setIepsType("tasa");
      setIepsTasaValue("");
      setIepsCuotaValue("");
    }
    
    // Manejar cuenta predial
    if (producto.cuenta_predial) {
      setCuentasPrediales([producto.cuenta_predial]);
      setShowCuentasPrediales(true);
    } else {
      setCuentasPrediales([]);
      setShowCuentasPrediales(false);
    }
    
    // Manejar pedimento
    if (producto.no_pedimento) {
      setPedimentos([producto.no_pedimento]);
      setShowPedimentos(true);
    } else {
      setPedimentos([]);
      setShowPedimentos(false);
    }
    
    // Manejar impuestos locales
    if (producto.impuesto_local) {
      try {
        const parsedImpuestos = JSON.parse(producto.impuesto_local);
        if (Array.isArray(parsedImpuestos)) {
          setImpuestosLocales(parsedImpuestos);
          setShowImpuestosLocales(true);
        }
      } catch {
        setImpuestosLocales([]);
        setShowImpuestosLocales(false);
      }
    } else {
      setImpuestosLocales([]);
      setShowImpuestosLocales(false);
    }
    
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
    setProductObjetoImpuesto("01");
    setCuentasPrediales([]);
    setShowCuentasPrediales(false);
    setProductIVA("16");
    setProductIVARet("");
    setIepsType("tasa");
    setIepsTasaValue("");
    setIepsCuotaValue("");
    setProductISR("");
    setPedimentos([]);
    setShowPedimentos(false);
    setImpuestosLocales([]);
    setShowImpuestosLocales(false);
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

    const productData: Product = {
  name: productInternalName,
  no_identificacion: productNoIdentificacion || undefined,
  descripcion: productDescription,
  precio_unitario: parseFloat(productUnitPrice) || 0,
      cuenta_predial: cuentasPrediales.length > 0 ? cuentasPrediales[0] : undefined,
      clave_producto: productClaveSat,
      clave_unidad: productUnidadSat || undefined,
      objeto_imp: productObjetoImpuesto,
      no_pedimento: pedimentos.length > 0 ? pedimentos[0] : undefined,
      impuesto_local: impuestosLocales.length > 0 ? JSON.stringify(impuestosLocales) : "",
      iva: productIVA ? parseFloat(productIVA) : undefined,
      iva_retenido: productIVARet ? parseFloat(productIVARet) : undefined,
      ieps: iepsType === "tasa" ? (iepsTasaValue ? parseFloat(iepsTasaValue) : undefined) : (iepsCuotaValue ? parseFloat(iepsCuotaValue) : undefined),
      isr: productISR ? parseFloat(productISR) : undefined,
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

  // Funciones para Cuenta Predial
  const addCuentaPredial = () => {
    setCuentasPrediales([...cuentasPrediales, ""]);
    setShowCuentasPrediales(true);
  };

  const removeCuentaPredial = (index: number) => {
    const newCuentas = cuentasPrediales.filter((_, i) => i !== index);
    setCuentasPrediales(newCuentas);
    if (newCuentas.length === 0) {
      setShowCuentasPrediales(false);
    }
  };

  const updateCuentaPredial = (index: number, value: string) => {
    const newCuentas = [...cuentasPrediales];
    newCuentas[index] = value;
    setCuentasPrediales(newCuentas);
  };

  // Funciones para Pedimentos
  const addPedimento = () => {
    setPedimentos([...pedimentos, ""]);
    setShowPedimentos(true);
  };

  const removePedimento = (index: number) => {
    const newPedimentos = pedimentos.filter((_, i) => i !== index);
    setPedimentos(newPedimentos);
    if (newPedimentos.length === 0) {
      setShowPedimentos(false);
    }
  };

  const updatePedimento = (index: number, value: string) => {
    const newPedimentos = [...pedimentos];
    newPedimentos[index] = value;
    setPedimentos(newPedimentos);
  };

  // Funciones para Impuestos Locales
  const addImpuestoLocal = () => {
    const newImpuesto: ImpuestoLocal = {
      id: Date.now().toString(),
      nombre: "",
      tasa: "",
      monto: "",
      tipo: "retencion",
    };
    setImpuestosLocales([...impuestosLocales, newImpuesto]);
    setShowImpuestosLocales(true);
  };

  const removeImpuestoLocal = (id: string) => {
    const newImpuestos = impuestosLocales.filter((imp) => imp.id !== id);
    setImpuestosLocales(newImpuestos);
    if (newImpuestos.length === 0) {
      setShowImpuestosLocales(false);
    }
  };

  const updateImpuestoLocal = (id: string, field: keyof ImpuestoLocal, value: string) => {
    const newImpuestos = impuestosLocales.map((imp) =>
      imp.id === id ? { ...imp, [field]: value } : imp
    );
    setImpuestosLocales(newImpuestos);
  };

  // Funciones para el modal de carga masiva
  const openBulkUploadModal = () => {
    setIsBulkUploadModalOpen(true);
  };

  const closeBulkUploadModal = () => {
    setIsBulkUploadModalOpen(false);
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
                <button
                  onClick={openBulkUploadModal}
                  className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 hover:shadow-md"
                >
                  Carga masiva
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
                      <th className="px-4 py-3.5 font-semibold">Unidad</th>
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
                        <td className="px-4 py-4 font-semibold text-[#0F172A]">{producto.name}</td>
                        <td className="px-4 py-4 text-[#64748B]">{producto.descripcion}</td>
                        <td className="px-4 py-4 text-[#64748B]">{producto.clave_unidad || "-"}</td>
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
        cuentasPrediales={cuentasPrediales}
        addCuentaPredial={addCuentaPredial}
        removeCuentaPredial={removeCuentaPredial}
        updateCuentaPredial={updateCuentaPredial}
        showCuentasPrediales={showCuentasPrediales}
        productIVA={productIVA}
        setProductIVA={setProductIVA}
        productIVARet={productIVARet}
        setProductIVARet={setProductIVARet}
        iepsType={iepsType}
        setIepsType={setIepsType}
        iepsTasaValue={iepsTasaValue}
        setIepsTasaValue={setIepsTasaValue}
        iepsCuotaValue={iepsCuotaValue}
        setIepsCuotaValue={setIepsCuotaValue}
        productISR={productISR}
        setProductISR={setProductISR}
        pedimentos={pedimentos}
        addPedimento={addPedimento}
        removePedimento={removePedimento}
        updatePedimento={updatePedimento}
        showPedimentos={showPedimentos}
        impuestosLocales={impuestosLocales}
        addImpuestoLocal={addImpuestoLocal}
        removeImpuestoLocal={removeImpuestoLocal}
        updateImpuestoLocal={updateImpuestoLocal}
        showImpuestosLocales={showImpuestosLocales}
        isLoading={isSaving}
      />

      {/* Modal de carga masiva */}
      <BulkUploadModal
        isOpen={isBulkUploadModalOpen}
        onClose={closeBulkUploadModal}
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