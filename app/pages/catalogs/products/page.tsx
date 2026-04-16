"use client";
import React, { useState, useEffect } from "react";
import { 
  SquarePen, Trash, Eye, Plus, Minus, X, ChevronDown, ChevronUp, Info, CheckCircle2, Loader2,
  Download, Upload, Activity, FileText as FileTextIcon 
} from "lucide-react";
import AppLayout from "@/app/components/layout/AppLayout";

const selectStyle =
  "box box-input";

const inputStyle =
  "box box-input";

// Componente Toast
const Toast = ({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 z-[100] flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg animate-in slide-in-from-right-5 duration-300 ${
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
      <label className="text-sm font-bold uppercase tracking-wide text-slate-400">
        {children}
      </label>
      {withInfo && (
        <div className="relative">
          <Info 
            className="h-4 w-4 cursor-help text-[#1d9bf0]" 
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          {showTooltip && (
            <div className="absolute bottom-full left-0 mb-2 z-50 w-64 rounded-lg bg-[#0a0f1a] border border-[#2d3748] p-2 text-xs text-slate-300 shadow-lg">
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

const productosMock = [
  {
    codigo: "43231501",
    nombre: "Licencia Software Pro",
    descripcion: "Suscripción anual para entorno corporativo...",
    clave: "E48",
    unidad: "Unidad de servicio",
    precio: "$12,450.00",
    precioNumerico: 12450,
  },
  {
    codigo: "81111504",
    nombre: "Consultoría IT Nivel 2",
    descripcion: "Servicios profesionales de arquitectura ...",
    clave: "HUR",
    unidad: "Hora",
    precio: "$2,800.00",
    precioNumerico: 2800,
  },
  {
    codigo: "43201484",
    nombre: "Servidor Rack G10",
    descripcion: "Hardware de alto rendimiento para pro...",
    clave: "H87",
    unidad: "Pieza",
    precio: "$85,200.00",
    precioNumerico: 85200,
  },
  {
    codigo: "43232107",
    nombre: "Firewall Appliance X",
    descripcion: "Seguridad perimetral con filtrado avanz...",
    clave: "H87",
    unidad: "Pieza",
    precio: "$15,300.00",
    precioNumerico: 15300,
  },
];

// Props para el modal de producto
type ProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
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
};

// Componente ProductModal (fuera del componente principal)
const ProductModal = ({
  isOpen,
  onClose,
  onSave,
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
}: ProductModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-[#173156] bg-[#071321] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#173156] bg-[#071321] px-6 py-4">
          <h2 className="text-xl font-bold text-white">Nuevo Producto</h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors duration-200 hover:bg-[#0d1b35] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h3 className="mb-4 text-lg font-bold text-white border-b border-[#173156] pb-2">Datos del producto</h3>
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
              <h3 className="mb-4 text-lg font-bold text-white border-b border-[#173156] pb-2">Cambios obligatorios CFDI 4.0 SAT</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-300 mb-2">
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
                    <button className="flex h-[49px] items-center justify-center rounded-xl border-2 border-[#1e293b] bg-[#081423] px-4 text-[#1d9bf0] hover:border-[#3c83f666] whitespace-nowrap">
                      Buscar Clave
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-300 mb-2">
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
                    <button className="flex h-[49px] items-center justify-center rounded-xl border-2 border-[#1e293b] bg-[#081423] px-4 text-[#1d9bf0] hover:border-[#3c83f666] whitespace-nowrap">
                      Buscar Unidad
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-300 mb-2">Objeto Impuesto</p>
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
            <h3 className="mb-4 text-lg font-bold text-white border-b border-[#173156] pb-2">Opcionales</h3>
            
            <div className="mb-6">
              <button
                onClick={addCuentaPredial}
                className="flex items-center gap-2 text-[15px] font-semibold text-[#1d9bf0] hover:opacity-90 transition-opacity"
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
                    className="flex h-[49px] w-[49px] items-center justify-center rounded-xl border-2 border-[#1e293b] bg-[#081423] text-red-500 hover:border-red-500"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  {index === cuentasPrediales.length - 1 && (
                    <button
                      onClick={addCuentaPredial}
                      className="flex h-[49px] w-[49px] items-center justify-center rounded-xl border-2 border-[#1e293b] bg-[#081423] text-[#1d9bf0] hover:border-[#3c83f666]"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-md font-bold text-white">Impuestos Federales</h3>
            <p className="text-sm text-slate-400 mb-4">Selecciona únicamente los impuestos que necesite tu producto</p>
            
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
                        className="w-4 h-4 rounded-full border-slate-700 bg-[#081423] text-blue-500 focus:ring-blue-500 focus:ring-offset-0 checked:bg-blue-500 checked:border-blue-500 mb-2"
                      />
                      <span className="text-sm text-slate-300 mb-2">TASA</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="iepsType"
                        checked={iepsType === "cuota"}
                        onChange={() => setIepsType("cuota")}
                        className="w-4 h-4 rounded-full border-slate-700 bg-[#081423] text-blue-500 focus:ring-blue-500 focus:ring-offset-0 checked:bg-blue-500 checked:border-blue-500 mb-2"
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
            <h3 className="mb-2 text-md font-bold text-white">Información Aduanera</h3>
            <p className="text-sm text-slate-400 mb-3">Numero de Pedimento</p>
            
            <button
              onClick={addPedimento}
              className="flex items-center gap-2 text-[15px] font-semibold text-[#1d9bf0] hover:opacity-90 transition-opacity"
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
                  className="flex h-[49px] w-[49px] items-center justify-center rounded-xl border-2 border-[#1e293b] bg-[#081423] text-red-500 hover:border-red-500"
                >
                  <Minus className="h-5 w-5" />
                </button>
                {index === pedimentos.length - 1 && (
                  <button
                    onClick={addPedimento}
                    className="flex h-[49px] w-[49px] items-center justify-center rounded-xl border-2 border-[#1e293b] bg-[#081423] text-[#1d9bf0] hover:border-[#3c83f666]"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-md font-bold text-white">Impuestos Locales</h3>
              <div className="relative">
                <Info 
                  className="h-4 w-4 cursor-help text-yellow-500" 
                  onMouseEnter={(e) => {
                    const tooltip = e.currentTarget.nextElementSibling;
                    if (tooltip) tooltip.classList.remove('hidden');
                  }}
                  onMouseLeave={(e) => {
                    const tooltip = e.currentTarget.nextElementSibling;
                    if (tooltip) tooltip.classList.add('hidden');
                  }}
                />
                <div className="hidden absolute bottom-full left-0 mb-2 z-50 w-80 rounded-lg bg-[#0a0f1a] border border-[#2d3748] p-2 text-xs text-slate-300 shadow-lg">
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
              className="flex items-center gap-2 text-[15px] font-semibold text-[#1d9bf0] hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4" />
              Agregar Impuestos Locales
            </button>
            
            {showImpuestosLocales && impuestosLocales.map((impuesto) => (
              <div key={impuesto.id} className="flex flex-wrap gap-2 mt-3 items-end">
                <div className="flex-1 min-w-[150px]">
                  <input
                    type="text"
                    value={impuesto.nombre}
                    onChange={(e) => updateImpuestoLocal(impuesto.id, "nombre", e.target.value)}
                    placeholder="Nombre"
                    className={inputStyle}
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <input
                    type="text"
                    value={impuesto.tasa}
                    onChange={(e) => updateImpuestoLocal(impuesto.id, "tasa", e.target.value)}
                    placeholder="Ej. 0.005, 0.03"
                    className={inputStyle}
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <input
                    type="text"
                    value={impuesto.monto}
                    onChange={(e) => updateImpuestoLocal(impuesto.id, "monto", e.target.value)}
                    placeholder="Ej. 10.00"
                    className={inputStyle}
                  />
                </div>
                <div className="w-[130px]">
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
                  className="flex h-[49px] w-[49px] items-center justify-center rounded-xl border-2 border-[#1e293b] bg-[#081423] text-red-500 hover:border-red-500"
                >
                  <Minus className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-4 border-t border-[#173156] bg-[#071321] px-6 py-4">
          <button
            onClick={onClose} 
            className="rounded-xl bg-red-500 px-6 py-2 font-medium text-white shadow-[0_10px_30px_rgba(255,0,0,0.25)] transition-colors duration-200 hover:bg-red-400"
          >
            Cerrar
          </button>
          <button
            onClick={onSave}
            className="rounded-xl bg-blue-500 px-6 py-2 font-medium text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition-colors duration-200 hover:bg-blue-400"
          >
            Guardar
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

// Componente BulkUploadModal (fuera del componente principal)
const BulkUploadModal = ({ isOpen, onClose }: BulkUploadModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-[#173156] bg-[#071321] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#173156] bg-[#071321] px-6 py-4">
          <h2 className="text-xl font-bold text-white">Carga Masiva de Productos</h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors duration-200 hover:bg-[#0d1b35] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 rounded-xl bg-[#0a1424] border border-[#173156]">
            <p className="text-slate-300 text-sm leading-relaxed">
              Aquí podrás subir tu catálogo de productos de forma masiva, a través de un archivo .csv. 
              En <span className="text-blue-400 font-medium">Ejemplo de carga masiva</span> se descargará la plantilla base 
              y un documento con los detalles para el llenado del archivo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <button className="flex items-center justify-center gap-2 rounded-xl bg-[#0d1b35] border-2 border-[#173156] px-4 py-3 text-white hover:bg-[#16233b] transition-colors hover:border-[#3c83f666]">
              <FileTextIcon className="h-5 w-5 text-[#1d9bf0]" />
              <span className="text-sm font-medium">Ejemplo de carga masiva</span>
            </button>
            
            <button className="flex items-center justify-center gap-2 rounded-xl bg-[#0d1b35] border-2 border-[#173156] px-4 py-3 text-white hover:bg-[#16233b] transition-colors hover:border-[#3c83f666]">
              <Download className="h-5 w-5 text-[#1d9bf0]" />
              <span className="text-sm font-medium">Descarga .csv</span>
            </button>
            
            <button className="flex items-center justify-center gap-2 rounded-xl bg-[#0d1b35] border-2 border-[#173156] px-4 py-3 text-white hover:bg-[#16233b] transition-colors hover:border-[#3c83f666]">
              <Upload className="h-5 w-5 text-[#1d9bf0]" />
              <span className="text-sm font-medium">Subir archivo .csv</span>
            </button>
            
            <button className="flex items-center justify-center gap-2 rounded-xl bg-[#0d1b35] border-2 border-[#173156] px-4 py-3 text-white hover:bg-[#16233b] transition-colors hover:border-[#3c83f666]">
              <Activity className="h-5 w-5 text-[#1d9bf0]" />
              <span className="text-sm font-medium">Ver estado de los procesos</span>
            </button>
          </div>

          <div className="border-t border-[#173156] my-6"></div>

          <div className="flex gap-4">
            <button className="flex-1 rounded-xl bg-blue-500 px-4 py-2.5 font-medium text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition-colors duration-200 hover:bg-blue-400">
              Procesar archivos
            </button>
            <button className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 font-medium text-white shadow-[0_10px_30px_rgba(255,0,0,0.25)] transition-colors duration-200 hover:bg-red-400">
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
  
  // Estado para los productos filtrados
  const [filteredProductos, setFilteredProductos] = useState(productosMock);

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

  // Filtrar productos cuando cambia el término de búsqueda
  useEffect(() => {
    const searchLower = search.toLowerCase();
    const filtered = productosMock.filter(producto => 
      producto.nombre.toLowerCase().includes(searchLower) ||
      producto.codigo.includes(search) ||
      producto.descripcion.toLowerCase().includes(searchLower) ||
      producto.clave.toLowerCase().includes(searchLower) ||
      producto.unidad.toLowerCase().includes(searchLower)
    );
    setFilteredProductos(filtered);
  }, [search]);

  // Funciones para el modal de producto
  const openProductModal = () => {
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

  const handleSaveProduct = () => {
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
    if (!productUnidadSat) {
      setToast({ message: "El campo Unidad es obligatorio", type: "error" });
      return;
    }

    console.log("Producto guardado:", {
      internalName: productInternalName,
      noIdentificacion: productNoIdentificacion,
      description: productDescription,
      unitPrice: productUnitPrice,
      claveSat: productClaveSat,
      unidadSat: productUnidadSat,
      objetoImpuesto: productObjetoImpuesto,
      cuentasPrediales,
      iva: productIVA,
      ivaRet: productIVARet,
      iepsType,
      iepsValue: iepsType === "tasa" ? iepsTasaValue : iepsCuotaValue,
      isr: productISR,
      pedimentos,
      impuestosLocales,
    });
    
    setToast({ message: "Producto agregado correctamente", type: "success" });
    closeProductModal();
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

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#151c24] rounded-lg text-white p-3">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Catálogo de Productos</h1>
            <p className="text-gray-400">
              Administra tus productos, servicios y claves SAT para facturación.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={openBulkUploadModal}
              className="w-36 bg-emerald-500 hover:bg-emerald-400 rounded-lg font-semibold shadow text-white shadow-lg shadow-emerald-500/30"
            >
              Carga masiva de productos
            </button>
            <button 
              onClick={openProductModal}
              className="w-36 bg-blue-500 hover:bg-blue-400 rounded-lg font-semibold shadow text-white shadow-lg shadow-blue-500/30"
            >
              Agregar un producto
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <input
            className="box box-input flex-1"
            placeholder="Buscar por código, nombre, descripción, clave unidad o unidad..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <span className="text-gray-400">MOSTRAR</span>
            <select className="box box-input">
              <option>25 registros</option>
              <option>50 registros</option>
              <option>100 registros</option>
            </select>
          </div>
        </div>

        <div className="bg-[#232b36] rounded-xl overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead className="bg-[#1a222c] text-gray-400">
              <tr>
                <th className="p-3 text-left">ACCIONES</th>
                <th className="p-3 text-left">CÓDIGO SAT</th>
                <th className="p-3 text-left">NOMBRE</th>
                <th className="p-3 text-left">DESCRIPCIÓN</th>
                <th className="p-3 text-left">CLAVE UNIDAD</th>
                <th className="p-3 text-left">UNIDAD</th>
                <th className="p-3 text-right">PRECIO</th>
              </tr>
            </thead>
            <tbody>
              {filteredProductos.map((p, i) => (
                <tr key={i} className="border-t border-[#232b36] hover:bg-[#1a222c]">
                  <td className="p-3 flex gap-2">
                    <button className="text-gray-400 hover:text-blue-400">
                      <SquarePen className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-400">
                      <Trash className="h-4 w-4" />
                    </button>
                  </td>
                  <td className="p-3">
                    <span className="bg-[#1e293b] text-blue-300 px-2 py-1 rounded text-xs font-mono cursor-pointer hover:underline">
                      {p.codigo}
                    </span>
                  </td>
                  <td className="p-3 font-bold">{p.nombre}</td>
                  <td className="p-3 text-gray-400">{p.descripcion}</td>
                  <td className="p-3">{p.clave}</td>
                  <td className="p-3">{p.unidad}</td>
                  <td className="p-3 text-right font-bold text-yellow-400">{p.precio}</td>
                </tr>
              ))}
              {filteredProductos.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    No se encontraron productos que coincidan con tu búsqueda
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-between items-center p-4 border-t border-[#232b36] text-gray-400 text-sm">
            <span>Mostrando {filteredProductos.length} de {productosMock.length} resultados</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-[#1a222c] rounded">Anterior</button>
              <button className="px-3 py-1 bg-blue-600 rounded text-white">1</button>
              <button className="px-3 py-1 bg-[#1a222c] rounded">2</button>
              <button className="px-3 py-1 bg-[#1a222c] rounded">3</button>
              <button className="px-3 py-1 bg-[#1a222c] rounded">Siguiente</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-[#1a222c] rounded-xl p-6 flex flex-col items-start border-2 border-[#16304f]">
            <span className="text-xs text-gray-400 font-bold mb-2">TOTAL PRODUCTOS</span>
            <span className="text-3xl font-extrabold mb-2">1,250</span>
            <div className="w-full h-1 bg-blue-700 rounded" />
          </div>
          <div className="bg-[#1a222c] rounded-xl p-6 flex flex-col items-start border-2 border-[#16304f]">
            <span className="text-xs text-yellow-400 font-bold mb-2">SERVICIOS SAT</span>
            <span className="text-3xl font-extrabold mb-2">84</span>
            <div className="w-full h-1 bg-yellow-400 rounded" />
          </div>
          <div className="bg-[#1a222c] rounded-xl p-6 flex flex-col items-start border-2 border-[#16304f]">
            <span className="text-xs text-gray-400 font-bold mb-2">OPTIMIZACIÓN</span>
            <span className="text-base mb-2">Claves actualizadas al catálogo 2024.</span>
          </div>
        </div>
      </div>

      {/* Modal de producto */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={closeProductModal}
        onSave={handleSaveProduct}
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