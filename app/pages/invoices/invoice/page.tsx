"use client";

import React, { useState, useEffect, useRef } from "react";
import AppLayout from "@/app/components/layout/AppLayout";
import {
  Search,
  FileText,
  ShoppingCart,
  Info,
  Plus,
  Pencil,
  ChevronDown,
  Folder,
  Save,
  Eye,
  CheckCircle2,
  ChevronUp,
  Minus,
  X,
  Loader2,
  FilePlus,
  FileText as FileTextIcon,
  CreditCard,
  Mail,
  ExternalLink,
} from "lucide-react";

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

type SectionTitleProps = {
  icon: React.ReactNode;
  title: React.ReactNode;
};

function SectionTitle({ icon, title }: SectionTitleProps) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="text-slate-300">{icon}</div>
      <h2 className="text-[20px] font-bold text-white">{title}</h2>
    </div>
  );
}

// Tipo para Producto en la tabla
type ProductoItem = {
  id: string;
  cantidad: number;
  claves: string;
  claveUnidad: string;
  descripcion: string;
  precio: number;
  subtotal: number;
  descuentoTipo: string; // "-", "$", "%"
  descuentoValor: number;
  impuestos: number;
  total: number;
};

// Productos disponibles para seleccionar
const productosDisponibles = [
  {
    clave: "10101504",
    unidad: "H87",
    descripcion: "LAPTOP 14 PULGADAS 8GB RAM 256GB SSD",
    precio: 12500.00,
  },
  {
    clave: "10101505",
    unidad: "H87",
    descripcion: "LAPTOP 15.6 PULGADAS 16GB RAM 512GB SSD",
    precio: 18500.00,
  },
  {
    clave: "10101506",
    unidad: "H87",
    descripcion: "MONITOR 24 PULGADAS FULL HD",
    precio: 3500.00,
  },
  {
    clave: "10101507",
    unidad: "H87",
    descripcion: "TECLADO MECÁNICO RGB",
    precio: 850.00,
  },
  {
    clave: "10101508",
    unidad: "H87",
    descripcion: "MOUSE INALÁMBRICO",
    precio: 450.00,
  },
];

// Opciones de monedas en orden alfabético
const currencies = [
  "AED - Dirham de los Emiratos Árabes Unidos",
  "AFN - Afgani Afgano",
  "ALL - Lek Albanés",
  "AMD - Dram Armenio",
  "ANG - Florín Antillano Neerlandés",
  "AOA - Kwanza Angoleño",
  "ARS - Peso Argentino",
  "AUD - Dólar Australiano",
  "AWG - Florín Arubeño",
  "AZN - Manat Azerbaiyano",
  "BAM - Marco Convertible de Bosnia y Herzegovina",
  "BBD - Dólar de Barbados",
  "BDT - Taka Bangladesí",
  "BGN - Lev Búlgaro",
  "BHD - Dinar Bahreiní",
  "BIF - Franco Burundés",
  "BMD - Dólar Bermudeño",
  "BND - Dólar de Brunéi",
  "BOB - Boliviano",
  "BRL - Real Brasileño",
  "BSD - Dólar Bahameño",
  "BTN - Ngultrum Butanés",
  "BWP - Pula Botswanesa",
  "BYN - Rublo Bielorruso",
  "BZD - Dólar Beliceño",
  "CAD - Dólar Canadiense",
  "CDF - Franco Congoleño",
  "CHF - Franco Suizo",
  "CLP - Peso Chileno",
  "CNY - Yuan Chino",
  "COP - Peso Colombiano",
  "CRC - Colón Costarricense",
  "CUP - Peso Cubano",
  "CVE - Escudo Caboverdiano",
  "CZK - Corona Checa",
  "DJF - Franco Yibutiano",
  "DKK - Corona Danesa",
  "DOP - Peso Dominicano",
  "DZD - Dinar Argelino",
  "EGP - Libra Egipcia",
  "ERN - Nakfa Eritreo",
  "ETB - Birr Etíope",
  "EUR - Euro",
  "FJD - Dólar Fiyiano",
  "FKP - Libra Malvinense",
  "GBP - Libra Esterlina",
  "GEL - Lari Georgiano",
  "GHS - Cedi Ganés",
  "GIP - Libra Gibraltareña",
  "GMD - Dalasi Gambiano",
  "GNF - Franco Guineano",
  "GTQ - Quetzal Guatemalteco",
  "GYD - Dólar Guyanés",
  "HKD - Dólar de Hong Kong",
  "HNL - Lempira Hondureño",
  "HRK - Kuna Croata",
  "HTG - Gourde Haitiano",
  "HUF - Florín Húngaro",
  "IDR - Rupia Indonesia",
  "ILS - Nuevo Shekel Israelí",
  "INR - Rupia India",
  "IQD - Dinar Iraquí",
  "IRR - Rial Iraní",
  "ISK - Corona Islandesa",
  "JMD - Dólar Jamaiquino",
  "JOD - Dinar Jordano",
  "JPY - Yen Japonés",
  "KES - Chelín Keniata",
  "KGS - Som Kirguís",
  "KHR - Riel Camboyano",
  "KMF - Franco Comorano",
  "KPW - Won Norcoreano",
  "KRW - Won Surcoreano",
  "KWD - Dinar Kuwaití",
  "KYD - Dólar de Islas Caimán",
  "KZT - Tenge Kazajo",
  "LAK - Kip Laosiano",
  "LBP - Libra Libanesa",
  "LKR - Rupia de Sri Lanka",
  "LRD - Dólar Liberiano",
  "LSL - Loti Lesotense",
  "LYD - Dinar Libio",
  "MAD - Dirham Marroquí",
  "MDL - Leu Moldavo",
  "MGA - Ariary Malgache",
  "MKD - Denar Macedonio",
  "MMK - Kyat Birmano",
  "MNT - Tugrik Mongol",
  "MOP - Pataca de Macao",
  "MRU - Ouguiya Mauritana",
  "MUR - Rupia Mauricia",
  "MVR - Rufiyaa Maldiva",
  "MWK - Kwacha Malauí",
  "MXN - Peso Mexicano",
  "MYR - Ringgit Malayo",
  "MZN - Metical Mozambiqueño",
  "NAD - Dólar Namibio",
  "NGN - Naira Nigeriana",
  "NIO - Córdoba Nicaragüense",
  "NOK - Corona Noruega",
  "NPR - Rupia Nepalí",
  "NZD - Dólar Neozelandés",
  "OMR - Rial Omaní",
  "PAB - Balboa Panameño",
  "PEN - Sol Peruano",
  "PGK - Kina Papuano",
  "PHP - Peso Filipino",
  "PKR - Rupia Pakistaní",
  "PLN - Złoty Polaco",
  "PYG - Guaraní Paraguayo",
  "QAR - Riyal Catarí",
  "RON - Leu Rumano",
  "RSD - Dinar Serbio",
  "RUB - Rublo Ruso",
  "RWF - Franco Ruandés",
  "SAR - Riyal Saudí",
  "SBD - Dólar de Islas Salomón",
  "SCR - Rupia Seychellense",
  "SDG - Libra Sudanesa",
  "SEK - Corona Sueca",
  "SGD - Dólar de Singapur",
  "SHP - Libra de Santa Elena",
  "SLL - Leone de Sierra Leona",
  "SOS - Chelín Somalí",
  "SRD - Dólar Surinamés",
  "SSP - Libra Sudanesa del Sur",
  "STN - Dobra de Santo Tomé y Príncipe",
  "SVC - Colón Salvadoreño",
  "SYP - Libra Siria",
  "SZL - Lilangeni Suazi",
  "THB - Baht Tailandés",
  "TJS - Somoni Tayiko",
  "TMT - Manat Turcomano",
  "TND - Dinar Tunecino",
  "TOP - Pa'anga Tongano",
  "TRY - Lira Turca",
  "TTD - Dólar de Trinidad y Tobago",
  "TWD - Nuevo Dólar Taiwanés",
  "TZS - Chelín Tanzano",
  "UAH - Grivna Ucraniana",
  "UGX - Chelín Ugandés",
  "USD - Dólar Estadounidense",
  "UYU - Peso Uruguayo",
  "UZS - Som Uzbekistán",
  "VES - Bolívar Venezolano",
  "VND - Dong Vietnamita",
  "VUV - Vatu Vanuatu",
  "WST - Tala Samoano",
  "XAF - Franco CFA de África Central",
  "XCD - Dólar del Caribe Oriental",
  "XOF - Franco CFA de África Occidental",
  "XPF - Franco CFP",
  "YER - Rial Yemení",
  "ZAR - Rand Sudafricano",
  "ZMW - Kwacha Zambiano",
];

// Opciones para fecha de emisión
const emissionDates = [
  { label: "Fecha actual", value: "current" },
  { label: "1 día antes", value: "minus1" },
  { label: "2 días antes", value: "minus2" },
];

// Opciones para observación
const observationOptions = [
  { label: "Sin Observación", value: "none" },
  { label: "Con observación", value: "with" },
];

// Opciones para exportación
const exportOptions = [
  { label: "No Aplica", value: "no" },
  { label: "Definitiva con clave A1", value: "a1" },
  { label: "Temporal", value: "temporal" },
  { label: "Definitiva con clave distinta a A1 o cuando no existe enajenación en términos del CFF", value: "other" },
];

// Opciones para CFDI relacionados
const relatedCFDIOptions = [
  { label: "Seleccione una opción", value: "" },
  { label: "01 - Nota de crédito de los documentos relacionados", value: "01" },
  { label: "02 - Nota de débito de los documentos relacionados", value: "02" },
  { label: "03 - Devolución de mercancía sobre facturas o traslados previos", value: "03" },
  { label: "04 - Sustitución de los CFDI previos", value: "04" },
  { label: "05 - Traslados de mercancias facturados previamente", value: "05" },
  { label: "06 - Factura generada por los traslados previos", value: "06" },
  { label: "07 - CFDI por aplicación de anticipo", value: "07" },
];

// Opciones para bancos
const bankOptions = [
  { label: "Seleccione un banco", value: "" },
  { label: "BBVA Bancomer", value: "bbva" },
  { label: "Banamex", value: "banamex" },
  { label: "Santander", value: "santander" },
  { label: "HSBC", value: "hsbc" },
  { label: "Scotiabank", value: "scotiabank" },
  { label: "Banorte", value: "banorte" },
  { label: "Inbursa", value: "inbursa" },
  { label: "Afirme", value: "afirme" },
  { label: "Bajío", value: "bajio" },
  { label: "Mifel", value: "mifel" },
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

// Opciones para IVA RET (25 opciones frecuentes)
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

// Opciones para IEPS TASA (13 opciones más recurrentes)
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

// Opciones para ISR (20 opciones frecuentes)
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

// Tipo para Impuesto Local
type ImpuestoLocal = {
  id: string;
  nombre: string;
  tasa: string;
  monto: string;
  tipo: string;
};

export default function InvoiceForm() {
  const [showAdditionalOptions, setShowAdditionalOptions] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("MXN - Peso Mexicano");
  const [exchangeRate, setExchangeRate] = useState("");
  const [isExchangeRateDisabled, setIsExchangeRateDisabled] = useState(true);
  const [selectedEmissionDate, setSelectedEmissionDate] = useState("current");
  const [selectedObservation, setSelectedObservation] = useState("none");
  const [observationText, setObservationText] = useState("");
  const [selectedExport, setSelectedExport] = useState("no");
  const [confirmationKey, setConfirmationKey] = useState("");
  const [selectedRelatedCFDI, setSelectedRelatedCFDI] = useState("");
  const [folioFiscalInputs, setFolioFiscalInputs] = useState<string[]>([""]);
  const [isFolioFiscalDisabled, setIsFolioFiscalDisabled] = useState(true);
  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");

  // Estados para campos editables con lápiz
  const [isEditingEmitterName, setIsEditingEmitterName] = useState(false);
  const [isEditingEmitterZip, setIsEditingEmitterZip] = useState(false);
  const [emitterName, setEmitterName] = useState("KASHMIR");
  const [emitterZip, setEmitterZip] = useState("53689");

  // Estados para el modal de cliente
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  // Estados para el modal de producto
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  
  // Estados para campos del producto
  const [productInternalName, setProductInternalName] = useState("");
  const [productNoIdentificacion, setProductNoIdentificacion] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productUnitPrice, setProductUnitPrice] = useState("");
  const [productClaveSat, setProductClaveSat] = useState("");
  const [productUnidadSat, setProductUnidadSat] = useState("");
  const [productObjetoImpuesto, setProductObjetoImpuesto] = useState("01");
  
  // Estados para Cuenta Predial
  const [cuentasPrediales, setCuentasPrediales] = useState<string[]>([]);
  const [showCuentasPrediales, setShowCuentasPrediales] = useState(false);
  
  // Estados para Impuestos
  const [productIVA, setProductIVA] = useState("16");
  const [productIVARet, setProductIVARet] = useState("");
  const [iepsType, setIepsType] = useState<"tasa" | "cuota">("tasa");
  const [iepsTasaValue, setIepsTasaValue] = useState("");
  const [iepsCuotaValue, setIepsCuotaValue] = useState("");
  const [productISR, setProductISR] = useState("");
  
  // Estados para Información Aduanera
  const [pedimentos, setPedimentos] = useState<string[]>([]);
  const [showPedimentos, setShowPedimentos] = useState(false);
  
  // Estados para Impuestos Locales
  const [impuestosLocales, setImpuestosLocales] = useState<ImpuestoLocal[]>([]);
  const [showImpuestosLocales, setShowImpuestosLocales] = useState(false);

  // Estados para la tabla de productos
  const [productos, setProductos] = useState<ProductoItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(productosDisponibles);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [subtotalGeneral, setSubtotalGeneral] = useState(0);
  const [totalGeneral, setTotalGeneral] = useState(0);

  // Estados para el envío de factura
  const [isSending, setIsSending] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Estado para Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Estados para los campos del cliente
  const [clientName, setClientName] = useState("");
  const [clientRfc, setClientRfc] = useState("");
  const [clientInvoiceUsage, setClientInvoiceUsage] = useState("");
  const [clientTaxRegime, setClientTaxRegime] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientEmailOptional1, setClientEmailOptional1] = useState("");
  const [clientEmailOptional2, setClientEmailOptional2] = useState("");
  const [clientCp, setClientCp] = useState("");
  const [clientStreet, setClientStreet] = useState("");
  const [clientExteriorNumber, setClientExteriorNumber] = useState("");
  const [clientInteriorNumber, setClientInteriorNumber] = useState("");
  const [clientNeighborhood, setClientNeighborhood] = useState("");
  const [clientLocality, setClientLocality] = useState("");
  const [clientMunicipality, setClientMunicipality] = useState("");
  const [clientState, setClientState] = useState("");
  const [clientCountry, setClientCountry] = useState("México");

  // Filtrar productos según el término de búsqueda
  useEffect(() => {
    const filtered = productosDisponibles.filter(producto =>
      producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.clave.includes(searchTerm)
    );
    setFilteredProducts(filtered);
  }, [searchTerm]);

  // Calcular subtotal y total general cuando cambian los productos
  useEffect(() => {
    const newSubtotal = productos.reduce((sum, item) => sum + item.subtotal, 0);
    const newTotal = productos.reduce((sum, item) => sum + item.total, 0);
    setSubtotalGeneral(newSubtotal);
    setTotalGeneral(newTotal);
  }, [productos]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Función para seleccionar producto
  const seleccionarProducto = (producto: typeof productosDisponibles[0]) => {
  const cantidad = 1;
  const precio = producto.precio;
  const subtotal = cantidad * precio;
  const impuestos = subtotal * 0.16;
  const total = subtotal + impuestos;
  
  const nuevoProducto: ProductoItem = {
    id: Date.now().toString(),
    cantidad: cantidad,
    claves: producto.clave,
    claveUnidad: producto.unidad,
    descripcion: producto.descripcion,
    precio: precio,
    subtotal: subtotal,
    descuentoTipo: "-",
    descuentoValor: 0,
    impuestos: impuestos,
    total: total,
  };
  
  setProductos([...productos, nuevoProducto]);
  setSearchTerm("");
  setShowDropdown(false);
};

const recalcularProducto = (producto: ProductoItem, cambios: Partial<ProductoItem>) => {
  const updated = { ...producto, ...cambios };
  
  // Recalcular subtotal si cambió cantidad o precio
  const subtotal = updated.cantidad * updated.precio;
  
  // Calcular impuestos sobre el subtotal (sin descuento)
  const impuestos = subtotal * 0.16;
  
  // Calcular total base (subtotal + impuestos)
  let totalBase = subtotal + impuestos;
  
  // Aplicar descuento al total
  let descuentoAplicado = 0;
  if (updated.descuentoTipo === "$") {
    descuentoAplicado = updated.descuentoValor;
  } else if (updated.descuentoTipo === "%") {
    descuentoAplicado = totalBase * (updated.descuentoValor / 100);
  }
  
  const total = totalBase - descuentoAplicado;
  
  return {
    ...updated,
    subtotal: subtotal,
    impuestos: impuestos,
    total: total,
  };
};

// Función para enviar factura
const handleSendInvoice = () => {
  setIsSending(true);
  
  // Simular envío con loader de 2 segundos
  setTimeout(() => {
    setIsSending(false);
    setShowSuccessModal(true);
  }, 2000);
};

// Función para cerrar modal de éxito
const closeSuccessModal = () => {
  setShowSuccessModal(false);
};

  // Funciones para manejar la edición del nombre emisor
  const handleEditEmitterName = () => {
    setIsEditingEmitterName(true);
  };

  const handleSaveEmitterName = () => {
    setIsEditingEmitterName(false);
  };

  const handleCancelEditName = () => {
    setIsEditingEmitterName(false);
    setEmitterName("KASHMIR");
  };

  // Funciones para manejar la edición del código postal
  const handleEditEmitterZip = () => {
    setIsEditingEmitterZip(true);
  };

  const handleSaveEmitterZip = () => {
    setIsEditingEmitterZip(false);
  };

  const handleCancelEditZip = () => {
    setIsEditingEmitterZip(false);
    setEmitterZip("53689");
  };

  // Funciones para el modal de cliente
  const openClientModal = () => {
    setIsClientModalOpen(true);
  };

  const closeClientModal = () => {
    setIsClientModalOpen(false);
    resetClientForm();
  };

  const resetClientForm = () => {
    setClientName("");
    setClientRfc("");
    setClientInvoiceUsage("");
    setClientTaxRegime("");
    setClientEmail("");
    setClientEmailOptional1("");
    setClientEmailOptional2("");
    setClientCp("");
    setClientStreet("");
    setClientExteriorNumber("");
    setClientInteriorNumber("");
    setClientNeighborhood("");
    setClientLocality("");
    setClientMunicipality("");
    setClientState("");
    setClientCountry("México");
    setShowOptionalFields(false);
  };

  const handleSaveClient = () => {
    // Validar campos obligatorios
    if (!clientName) {
      setToast({ message: "El campo Nombre / Razón Social es obligatorio", type: "error" });
      return;
    }
    if (!clientRfc) {
      setToast({ message: "El campo RFC es obligatorio", type: "error" });
      return;
    }
    if (!clientInvoiceUsage) {
      setToast({ message: "El campo Uso de la factura es obligatorio", type: "error" });
      return;
    }
    if (!clientTaxRegime) {
      setToast({ message: "El campo Régimen fiscal es obligatorio", type: "error" });
      return;
    }
    if (!clientEmail) {
      setToast({ message: "El campo E-Mail es obligatorio", type: "error" });
      return;
    }
    if (!clientCp) {
      setToast({ message: "El campo C.P. es obligatorio", type: "error" });
      return;
    }

    console.log("Cliente guardado:", {
      name: clientName,
      rfc: clientRfc,
      invoiceUsage: clientInvoiceUsage,
      taxRegime: clientTaxRegime,
      email: clientEmail,
      emailOptional1: clientEmailOptional1,
      emailOptional2: clientEmailOptional2,
      cp: clientCp,
      street: clientStreet,
      exteriorNumber: clientExteriorNumber,
      interiorNumber: clientInteriorNumber,
      neighborhood: clientNeighborhood,
      locality: clientLocality,
      municipality: clientMunicipality,
      state: clientState,
      country: clientCountry,
    });
    
    setToast({ message: "Cliente agregado correctamente", type: "success" });
    closeClientModal();
  };

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
    // Validar campos obligatorios
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

  // Desbloquear tipo de cambio cuando se selecciona una moneda diferente a MXN
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCurrency(value);
    setIsExchangeRateDisabled(value === "MXN - Peso Mexicano");
    if (value === "MXN - Peso Mexicano") {
      setExchangeRate("");
    }
  };

  // Manejar cambio de CFDI relacionado
  const handleRelatedCFDIChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedRelatedCFDI(value);
    setIsFolioFiscalDisabled(value === "");
    if (value === "") {
      setFolioFiscalInputs([""]);
    }
  };

  // Agregar campo de folio fiscal
  const addFolioFiscalField = () => {
    setFolioFiscalInputs([...folioFiscalInputs, ""]);
  };

  // Eliminar campo de folio fiscal
  const removeFolioFiscalField = (index: number) => {
    if (folioFiscalInputs.length > 1) {
      const newInputs = folioFiscalInputs.filter((_, i) => i !== index);
      setFolioFiscalInputs(newInputs);
    }
  };

  // Actualizar valor de folio fiscal
  const updateFolioFiscal = (index: number, value: string) => {
    const newInputs = [...folioFiscalInputs];
    newInputs[index] = value;
    setFolioFiscalInputs(newInputs);
  };

  // Componente para manejar la tecla ESC
  function EscHandler({ onClose }: { onClose: () => void }) {
    useEffect(() => {
      const handleEscKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleEscKey);
      return () => {
        document.removeEventListener('keydown', handleEscKey);
      };
    }, [onClose]);
    return null;
  }

  // Modal de éxito
  const SuccessModal = () => {
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [email1, setEmail1] = useState("");
    const [email2, setEmail2] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isSendingEmail, setIsSendingEmail] = useState(false);

    if (!showSuccessModal) return null;

    const handleSendEmail = () => {
      if (!email1) {
        setToast({ message: "El campo Correo 1 es obligatorio", type: "error" });
        return;
      }
      
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email1)) {
        setToast({ message: "Ingrese un correo electrónico válido", type: "error" });
        return;
      }
      
      if (email2 && !emailRegex.test(email2)) {
        setToast({ message: "Ingrese un correo electrónico válido en Correo 2", type: "error" });
        return;
      }
      
      setIsSendingEmail(true);
      
      // Simular envío de email
      setTimeout(() => {
        setIsSendingEmail(false);
        setShowEmailForm(false);
        setEmail1("");
        setEmail2("");
        setSubject("");
        setMessage("");
        setToast({ message: "¡Correo enviado correctamente!", type: "success" });
      }, 2000);
    };

    const handleBack = () => {
      setShowEmailForm(false);
      setEmail1("");
      setEmail2("");
      setSubject("");
      setMessage("");
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={closeSuccessModal}
        />
        
        <div className="relative max-w-md w-full rounded-2xl border border-[#173156] bg-[#071321] shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="p-6 text-center">
            {/* Icono de éxito */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">
              ¡Factura Generada!
            </h2>
            <p className="text-slate-400 mb-4">
              Su Factura se ha generado correctamente
            </p>
            
            {/* Formulario de email (oculto inicialmente) */}
            {showEmailForm ? (
  <div className="space-y-2 text-left">
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">
        Correo 1 <span className="text-red-500">*</span>
      </label>
      <input
        type="email"
        value={email1}
        onChange={(e) => setEmail1(e.target.value)}
        placeholder="correo@ejemplo.com"
        className="box box-input"
      />
    </div>
    
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">
        Correo 2 <span className="text-slate-500 text-xs">(Opcional)</span>
      </label>
      <input
        type="email"
        value={email2}
        onChange={(e) => setEmail2(e.target.value)}
        placeholder="correo@ejemplo.com"
        className="box box-input"
      />
    </div>
    
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">
        Asunto <span className="text-slate-500 text-xs">(Opcional)</span>
      </label>
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Asunto del correo"
        className="box box-input"
      />
    </div>
    
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">
        Mensaje <span className="text-slate-500 text-xs">(Opcional)</span>
      </label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value.slice(0, 500))}
        placeholder="Escribe tu mensaje aquí..."
        rows={2}
        maxLength={500}
        className="w-full rounded-xl border-2 border-[#1e293b] bg-[#081423] px-3 py-1.5 text-white outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 resize-none hover:border-[#0552cf66]"
      />
      <p className="text-xs text-slate-500 mt-0.5 text-right">
        {message.length}/500 caracteres
      </p>
    </div>
    
    <div className="flex gap-3 pt-1">
      <button
        onClick={handleBack}
        className="flex-1 rounded-xl border-2 border-[#1e293b] bg-[#081423] px-4 py-1.5 font-medium text-slate-300 transition hover:bg-[#0d1b35] hover:text-white hover:border-[#0552cf66]"
      >
        Regresar
      </button>
      <button
        onClick={handleSendEmail}
        disabled={isSendingEmail}
        className={`flex-1 rounded-xl bg-blue-500 px-4 py-1.5 font-medium text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition-all duration-200 ${
          isSendingEmail ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-400"
        }`}
      >
        {isSendingEmail ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Enviando...</span>
          </div>
        ) : (
          "Enviar"
        )}
      </button>
    </div>
  </div>
) : (
              <>
                {/* Botones principales */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  <button
                    onClick={() => {
                      closeSuccessModal();
                      window.location.reload();
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#0d1b35] border-2 border-[#173156] px-4 py-3 text-white hover:bg-[#16233b] transition-colors focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 hover:border-[#3c83f666]"
                  >
                    <FilePlus className="h-5 w-5 text-[#1d9bf0]" />
                    <span className="text-sm font-medium">Crear Nueva Factura</span>
                  </button>
                  
                  <button
                    onClick={closeSuccessModal}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#0d1b35] border-2 border-[#173156] px-4 py-3 text-white hover:bg-[#16233b] transition-colors focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 hover:border-[#3c83f666]"
                  >
                    <FileTextIcon className="h-5 w-5 text-[#1d9bf0]" />
                    <span className="text-sm font-medium">Anexar Addenda</span>
                  </button>
                  
                  <button
                    onClick={closeSuccessModal}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#0d1b35] border-2 border-[#173156] px-4 py-3 text-white hover:bg-[#16233b] transition-colors focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 hover:border-[#3c83f666]"
                  >
                    <CreditCard className="h-5 w-5 text-[#1d9bf0]" />
                    <span className="text-sm font-medium">Ir a Cuentas por Cobrar</span>
                  </button>
                </div>
                
                {/* Botones secundarios */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowEmailForm(true)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-2.5 font-medium text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] hover:bg-blue-400 transition-colors flex-1"
                  >
                    <Mail className="h-5 w-5" />
                    <span>Enviar por email</span>
                  </button>
                  
                  <button
                    onClick={closeSuccessModal}
                    className="flex items-center justify-center gap-2 rounded-xl border border-[#173156] bg-[#0d1b35] px-6 py-2.5 font-medium text-white hover:bg-[#16233b] transition-colors flex-1 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 hover:border-[#3c83f666]"
                  >
                    <ExternalLink className="h-5 w-5 text-[#1d9bf0]" />
                    <span>Ver consultar</span>
                  </button>
                </div>
              </>
            )}
          </div>
          
          <button
            onClick={closeSuccessModal}
            className="absolute right-4 top-4 rounded-xl p-1 text-slate-400 hover:bg-[#0d1b35] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#071321] text-white">
        {/* Main */}
        <main className="mx-auto max-w-[1400px]">
          <SectionTitle
            icon={<FileText className="h-6 w-6" />}
            title={
              <>
                Datos de la Factura:{" "}
                <span className="text-[#1d9bf0]">CFDI 4.0</span>
              </>
            }
          />

          {/* Card formulario */}
          <section className="rounded-2xl border-2 border-[#16304f] bg-[#09172b] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.01)]">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {/* Nombre Emisor */}
              <div>
                <Label>Nombre Emisor:</Label>
                <div className="flex gap-2">
                  {isEditingEmitterName ? (
                    <>
                      <input
                        type="text"
                        value={emitterName}
                        onChange={(e) => setEmitterName(e.target.value)}
                        className={`${inputStyle} flex-1`}
                        autoFocus
                      />
                      <button
                        onClick={handleSaveEmitterName}
                        className="flex h-[49px] w-[49px] items-center justify-center rounded-xl border-2 border-[#1e293b] bg-[#081423] text-emerald-500 hover:border-emerald-500"
                        title="Guardar"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleCancelEditName}
                        className="flex h-[49px] w-[49px] items-center justify-center rounded-xl border-2 border-[#1e293b] bg-[#081423] text-red-500 hover:border-red-500"
                        title="Cancelar"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={emitterName}
                        readOnly
                        className={`${inputStyle} flex-1 bg-[#0a1424] cursor-not-allowed opacity-75`}
                      />
                      <button
                        onClick={handleEditEmitterName}
                        className="flex h-[49px] w-[49px] items-center justify-center rounded-xl border-2 border-[#1e293b] bg-[#081423] text-[#1d9bf0] hover:border-[#3c83f666]"
                        title="Editar"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Código Postal Emisor */}
              <div>
                <Label>Código Postal Emisor:</Label>
                <div className="flex gap-2">
                  {isEditingEmitterZip ? (
                    <>
                      <input
                        type="text"
                        value={emitterZip}
                        onChange={(e) => setEmitterZip(e.target.value)}
                        className={`${inputStyle} flex-1`}
                        maxLength={5}
                        autoFocus
                      />
                      <button
                        onClick={handleSaveEmitterZip}
                        className="flex h-[49px] w-[49px] items-center justify-center rounded-xl border-2 border-[#1e293b] bg-[#081423] text-emerald-500 hover:border-emerald-500"
                        title="Guardar"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleCancelEditZip}
                        className="flex h-[49px] w-[49px] items-center justify-center rounded-xl border-2 border-[#1e293b] bg-[#081423] text-red-500 hover:border-red-500"
                        title="Cancelar"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={emitterZip}
                        readOnly
                        className={`${inputStyle} flex-1 bg-[#0a1424] cursor-not-allowed opacity-75`}
                      />
                      <button
                        onClick={handleEditEmitterZip}
                        className="flex h-[49px] w-[49px] items-center justify-center rounded-xl border-2 border-[#1e293b] bg-[#081423] text-[#1d9bf0] hover:border-[#3c83f666]"
                        title="Editar"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div>
                <Label withInfo infoText="Número de decimales a utilizar en los importes">Uso de decimales:</Label>
                <div className="relative">
                  <select defaultValue="2" className={`${selectStyle} appearance-none`}>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <Label>Seleccionar Cliente:</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select defaultValue="" className={`${selectStyle} appearance-none`}>
                      <option value="">Seleccionar Cliente</option>
                      <option value="1">Cliente 1</option>
                      <option value="2">Cliente 2</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>

                  <button
                    onClick={openClientModal}
                    className="flex h-[49px] w-[49px] items-center justify-center rounded-xl border-2 border-[#1e293b] bg-[#081423] text-[#1d9bf0] hover:border-[#3c83f666]"
                    title="Agregar Cliente"
                  >
                    <Plus className="h-5 w-5" />
                  </button>

                  <button className="flex h-[49px] w-[49px] items-center justify-center rounded-xl border-2 border-[#1e293b] bg-[#081423] text-[#1d9bf0] hover:border-[#3c83f666]"
                    title="Editar Cliente">
                    <Pencil className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div>
                <Label>Tipo de factura:</Label>
                <div className="relative">
                  <select defaultValue="factura" className={`${selectStyle} appearance-none`}>
                    <option value="factura">Factura</option>
                    <option value="nota-credito">Nota de crédito</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <Label>Lugar de expedición:</Label>
                <div className="relative">
                  <select defaultValue="principal" className={`${selectStyle} appearance-none`}>
                    <option value="principal">Principal (53689)</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <Label>Forma de pago:</Label>
                <div className="relative">
                  <select defaultValue="" className={`${selectStyle} appearance-none`}>
                    <option value="">Seleccionar Forma de pago</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <Label>Método de pago:</Label>
                <div className="relative">
                  <select defaultValue="pue" className={`${selectStyle} appearance-none`}>
                    <option value="pue">PUE - Pago en una sola exhibición</option>
                    <option value="ppd">PPD - Pago en parcialidades</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setShowAdditionalOptions(!showAdditionalOptions)}
                  className="flex items-center gap-2 text-[15px] font-semibold text-[#1d9bf0] hover:opacity-90"
                >
                  {showAdditionalOptions ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  {showAdditionalOptions ? "Ocultar opciones adicionales" : "Ver opciones adicionales"}
                </button>
              </div>
            </div>

            {/* Opciones adicionales */}
            {showAdditionalOptions && (
              <div className="mt-8 border-t border-[#16304f] pt-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {/* Número de pedido */}
                  <div>
                    <Label>Número de pedido:</Label>
                    <input
                      type="text"
                      placeholder="Número de pedido"
                      className={inputStyle}
                    />
                  </div>

                  {/* Moneda */}
                  <div>
                    <Label>Moneda:</Label>
                    <div className="relative">
                      <select
                        value={selectedCurrency}
                        onChange={handleCurrencyChange}
                        className={`${selectStyle} appearance-none`}
                      >
                        {currencies.map((currency) => (
                          <option key={currency} value={currency}>
                            {currency}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  {/* Tipo de cambio */}
                  <div>
                    <Label>Tipo de cambio:</Label>
                    <input
                      type="text"
                      placeholder="Tipo de cambio respecto al peso"
                      value={exchangeRate}
                      onChange={(e) => setExchangeRate(e.target.value)}
                      disabled={isExchangeRateDisabled}
                      className={`${inputStyle} ${isExchangeRateDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Tipo de cambio respecto al peso mexicano
                    </p>
                  </div>

                  {/* Fecha de Emisión */}
                  <div>
                    <Label>Fecha de Emisión:</Label>
                    <div className="relative">
                      <select
                        value={selectedEmissionDate}
                        onChange={(e) => setSelectedEmissionDate(e.target.value)}
                        className={`${selectStyle} appearance-none`}
                      >
                        {emissionDates.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  {/* Número de cuenta */}
                  <div>
                    <Label>Número de cuenta:</Label>
                    <input
                      type="text"
                      placeholder="Número de cuenta de pago (4 digitos)"
                      maxLength={4}
                      className={inputStyle}
                    />
                  </div>

                  {/* Nombre del Banco */}
                  <div>
                    <Label>Nombre del Banco:</Label>
                    <div className="relative">
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className={`${selectStyle} appearance-none`}
                      >
                        {bankOptions.map((bank) => (
                          <option key={bank.value} value={bank.value}>
                            {bank.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  {/* Condiciones de pago */}
                  <div>
                    <Label>Condiciones de pago:</Label>
                    <input
                      type="text"
                      placeholder="Condiciones de pago"
                      className={inputStyle}
                    />
                  </div>

                  {/* Selecciona observación */}
                  <div>
                    <Label>Selecciona observación:</Label>
                    <div className="relative">
                      <select
                        value={selectedObservation}
                        onChange={(e) => setSelectedObservation(e.target.value)}
                        className={`${selectStyle} appearance-none`}
                      >
                        {observationOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                    
                    {/* Textarea que aparece solo si se selecciona "Con observación" */}
                    {selectedObservation === "with" && (
                      <div className="mt-3">
                        <textarea
                          placeholder="Escribe tus observaciones aquí..."
                          value={observationText}
                          onChange={(e) => setObservationText(e.target.value)}
                          rows={4}
                          className="w-full rounded-xl border-2 border-[#1e293b] bg-[#081423] px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 resize-y"
                        />
                        <p className="mt-1 text-xs text-slate-500">
                          Describe las observaciones relevantes para esta factura
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Exportación */}
                  <div>
                    <Label withInfo infoText="Atributo requerido para expresar si el comprobante ampara una operación de exportación.">
                      Exportación:
                    </Label>
                    <div className="relative">
                      <select
                        value={selectedExport}
                        onChange={(e) => setSelectedExport(e.target.value)}
                        className={`${selectStyle} appearance-none`}
                      >
                        {exportOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  {/* Confirmación */}
                  <div>
                    <Label withInfo infoText="Atributo condicional para registrar la clave de confirmación que entregue el PAC para expedir el comprobante con importes grandes, con un tipo de cambio fuera del rango establecido o con ambos casos.">
                      Confirmación:
                    </Label>
                    <input
                      type="text"
                      placeholder="Clave de Confirmación"
                      value={confirmationKey}
                      onChange={(e) => setConfirmationKey(e.target.value)}
                      className={inputStyle}
                    />
                  </div>

                  {/* CFDI Relacionados */}
                  <div>
                    <Label>CFDI Relacionados:</Label>
                    <div className="relative">
                      <select
                        value={selectedRelatedCFDI}
                        onChange={handleRelatedCFDIChange}
                        className={`${selectStyle} appearance-none`}
                      >
                        {relatedCFDIOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  {/* Folio Fiscal (campos dinámicos) */}
                  {!isFolioFiscalDisabled && (
                    <div className="md:col-span-2 xl:col-span-3">
                      <Label>Folio Fiscal:</Label>
                      <div className="space-y-3">
                        {folioFiscalInputs.map((folio, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Folio Fiscal del CFDI a Relacionar"
                              value={folio}
                              onChange={(e) => updateFolioFiscal(index, e.target.value)}
                              className={`${inputStyle} flex-1`}
                            />
                            {index === folioFiscalInputs.length - 1 && (
                              <button
                                type="button"
                                onClick={addFolioFiscalField}
                                className="flex h-[49px] w-[49px] items-center justify-center rounded-xl border-2 border-[#1e293b] bg-[#081423] text-[#1d9bf0] hover:border-[#3c83f666]"
                              >
                                <Plus className="h-5 w-5" />
                              </button>
                            )}
                            {folioFiscalInputs.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeFolioFiscalField(index)}
                                className="flex h-[49px] w-[49px] items-center justify-center rounded-xl border-2 border-[#1e293b] bg-[#081423] text-red-500 hover:border-red-500"
                              >
                                <Minus className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Productos */}
          <div className="mt-12">
            <SectionTitle
              icon={<ShoppingCart className="h-6 w-6" />}
              title="Seleccionar producto o servicio:"
            />

            <section className="overflow-hidden rounded-2xl border-2 border-[#16304f] bg-[#09172b]">
              {/* Buscador con dropdown */}
              <div className="border-b border-[#16304f] p-6">
                <div className="relative" ref={dropdownRef}>
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setShowDropdown(true)}
                      placeholder="Busca tu producto o servicio (ej: laptop)"
                      className="w-220 rounded-xl border-2 border-[#1e293b] bg-[#081423] py-3 pl-11 pr-4 text-white outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 hover:border-[#3c83f666]"
                    />
                    <button
                      onClick={openProductModal}
                      className="absolute right-1 top-1/2 -translate-y-1/2 flex h-[53px] w-[53px] items-center justify-center rounded-xl border-2 border-[#1e293b] bg-[#081423] text-[#1d9bf0] hover:border-[#3c83f666]"
                      title="Agregar Producto"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  
                  
                  {/* Dropdown de productos */}
                  {showDropdown && filteredProducts.length > 0 && (
                    <div className="absolute z-50 mt-1 w-220 max-h-60 overflow-y-auto rounded-xl border border-[#173156] bg-[#0a1424] shadow-xl">
                      {filteredProducts.map((producto, index) => (
                        <button
                          key={index}
                          onClick={() => seleccionarProducto(producto)}
                          className="w-220 text-left px-4 py-3 hover:bg-[#0d1b35] transition-colors border-b border-[#173156] last:border-b-0"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-white font-medium">{producto.descripcion}</p>
                              <p className="text-xs text-slate-400">Clave: {producto.clave} | Unidad: {producto.unidad}</p>
                            </div>
                            <p className="text-blue-400 font-bold">${producto.precio.toFixed(2)}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {showDropdown && searchTerm && filteredProducts.length === 0 && (
                    <div className="absolute z-50 mt-1 w-full rounded-xl border border-[#173156] bg-[#0a1424] p-4 text-center text-slate-400">
                      No se encontraron productos. <button onClick={openProductModal} className="text-[#1d9bf0] hover:underline">Agrega uno nuevo</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Tabla */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead className="bg-[#16253e]">
                    <tr className="text-left text-sm uppercase tracking-wide text-slate-400">
                      <th className="px-6 py-4">Cant.</th>
                      <th className="px-6 py-4">Claves</th>
                      <th className="px-6 py-4">Descripción</th>
                      <th className="px-6 py-4">Precio</th>
                      <th className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          Subtotal
                          <div className="relative">
                            <Info 
                              className="h-3.5 w-3.5 cursor-help text-[#1d9bf0]" 
                              onMouseEnter={(e) => {
                                const tooltip = e.currentTarget.nextElementSibling;
                                if (tooltip) tooltip.classList.remove('hidden');
                              }}
                              onMouseLeave={(e) => {
                                const tooltip = e.currentTarget.nextElementSibling;
                                if (tooltip) tooltip.classList.add('hidden');
                              }}
                            />
                            <div className="hidden absolute left-0 mb-2 z-50 w-80 rounded-lg bg-[#0a0f1a] border border-[#2d3748] p-2 text-xs text-slate-300 shadow-lg">
                              Es posible modificar el subtotal en ciertos rangos autorizados, esto permite cuadrar el monto, en caso de estar fuera de la variación permitida, la plataforma regresará en automático al subtotal calculado.
                            </div>
                          </div>
                        </div>
                      </th>
                      <th className="px-6 py-4">Descuento</th>
                      <th className="px-6 py-4">Impuestos</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {productos.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-6 py-16 text-center text-[17px] italic text-slate-400">
                          No hay productos seleccionados. Usa el buscador superior para agregar ítems.
                        </td>
                      </tr>
                    ) : (
                      productos.map((producto) => (
                        <tr key={producto.id} className="border-t border-[#16304f]">
                          {/* Cantidad */}
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              value={producto.cantidad}
                              onChange={(e) => {
                                const nuevaCantidad = parseInt(e.target.value) || 0;
                                const nuevoProducto = recalcularProducto(producto, { cantidad: nuevaCantidad });
                                setProductos(productos.map(p => p.id === producto.id ? nuevoProducto : p));
                              }}
                              className="w-20 rounded-xl border-2 border-[#1e293b] bg-[#081423] px-3 py-2 text-white outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 hover:border-[#3c83f666]"
                            />
                          </td>
                          
                          {/* Claves - dos inputs */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <textarea
                                  value={`Clave Producto: ${producto.claves}`}
                                  readOnly
                                  placeholder="Clave Prod."
                                  className="w-32 h-16 rounded-xl border-2 border-[#1e293b] bg-[#0a1424] px-2 py-1 text-sm text-white cursor-not-allowed opacity-75 resize-none overflow-hidden outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20  hover:border-[#3c83f666]"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <textarea
                                  value={`Clave Unidad: ${producto.claveUnidad}`}
                                  readOnly
                                  placeholder="Clave Unidad"
                                  className="w-32 h-16 rounded-xl border-2 border-[#1e293b] bg-[#0a1424] px-2 py-1 text-sm text-white cursor-not-allowed opacity-75 resize-none overflow-hidden outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 hover:border-[#3c83f666]"
                                />
                              </div>
                            </div>
                          </td>
                          
                          {/* Descripción editable */}
                          <td className="px-6 py-4">
                            <textarea
                              value={producto.descripcion}
                              onChange={(e) => {
                                setProductos(productos.map(p => p.id === producto.id ? { ...p, descripcion: e.target.value } : p));
                              }}
                              className="w-52 h-32 rounded-xl border-2 border-[#1e293b] hover:border-[#3c83f666] bg-[#081423] px-3 py-2 text-white resize-none overflow-y-auto outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 "
                              style={{ minHeight: '60px', maxHeight: '200px' }}
                            />
                          </td>
                          
                          {/* Precio editable */}
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              step="0.01"
                              value={producto.precio}
                              onChange={(e) => {
                                const nuevoPrecio = parseFloat(e.target.value) || 0;
                                const nuevoProducto = recalcularProducto(producto, { precio: nuevoPrecio });
                                setProductos(productos.map(p => p.id === producto.id ? nuevoProducto : p));
                              }}
                              className="w-28 rounded-xl border-2 hover:border-[#3c83f666] border-[#1e293b] bg-[#081423] px-3 py-2 text-white outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20"
                            />
                          </td>
                          
                          {/* Subtotal editable */}
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              step="0.01"
                              value={producto.subtotal.toFixed(2)}
                              onChange={(e) => {
                                const nuevoSubtotal = parseFloat(e.target.value) || 0;
                                const impuestos = nuevoSubtotal * 0.16;
                                const total = nuevoSubtotal + impuestos;
                                setProductos(productos.map(p => p.id === producto.id ? { ...p, subtotal: nuevoSubtotal, impuestos: impuestos, total: total } : p));
                              }}
                              className="w-28 rounded-xl border-2 hover:border-[#3c83f666] border-[#1e293b] bg-[#081423] px-3 py-2 text-white outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 "
                            />
                          </td>
                          
                          {/* Descuento - Dropdown + Input */}
                          <td className="px-6 py-4">
                            <div className="flex gap-1">
                              <select
                                value={producto.descuentoTipo}
                                onChange={(e) => {
                                  const nuevoTipo = e.target.value;
                                  const nuevoProducto = recalcularProducto(producto, { descuentoTipo: nuevoTipo, descuentoValor: 0 });
                                  setProductos(productos.map(p => p.id === producto.id ? nuevoProducto : p));
                                }}
                                className="w-14 rounded-xl border-2 border-[#1e293b] hover:border-[#3c83f666] bg-[#081423] px-2 py-2 text-white outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 "
                              >
                                <option value="-">-</option>
                                <option value="$">$</option>
                                <option value="%">%</option>
                              </select>
                              <input
                                type="number"
                                value={producto.descuentoValor}
                                disabled={producto.descuentoTipo === "-"}
                                onChange={(e) => {
                                  const nuevoValor = parseFloat(e.target.value) || 0;
                                  const nuevoProducto = recalcularProducto(producto, { descuentoValor: nuevoValor });
                                  setProductos(productos.map(p => p.id === producto.id ? nuevoProducto : p));
                                }}
                                className={`w-24 rounded-xl border-2 border-[#1e293b] hover:border-[#3c83f666] bg-[#081423] px-3 py-2 text-white outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 ${producto.descuentoTipo === "-" ? "opacity-50 cursor-not-allowed" : ""}`}
                                placeholder={producto.descuentoTipo === "%" ? "Porcentaje" : "Monto"}
                              />
                            </div>
                          </td>
                          
                          {/* Impuestos */}
                          <td className="px-6 py-4 text-white">${producto.impuestos.toFixed(2)}</td>
                          
                          {/* Total */}
                          <td className="px-6 py-4 text-white">${producto.total.toFixed(2)}</td>
                          
                          {/* Acciones */}
                          <td className="px-6 py-4">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => setProductos(productos.filter(p => p.id !== producto.id))}
                                className="text-red-500 hover:text-red-400 transition-colors"
                                title="Eliminar"
                              >
                                <X className="h-5 w-5" />
                              </button>
                              <button
                                className="text-[#1d9bf0] hover:text-blue-400 transition-colors"
                                title="Editar"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Totales y acciones - Sección sticky */}
          <div className="sticky bottom-0 z-20 mt-6">
            <div className="flex flex-col gap-6 rounded-2xl border-2 border-[#16304f] bg-[#0d1c34] px-6 py-8 shadow-lg lg:flex-row lg:items-center lg:justify-between">
              <div className="flex gap-10">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
                    Subtotal
                  </p>
                  <h3 className="mt-1 text-2xl font-bold text-white">${subtotalGeneral.toFixed(2)}</h3>
                </div>

                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
                    Total
                  </p>
                  <h3 className="mt-1 text-2xl font-bold text-white">${totalGeneral.toFixed(2)}</h3>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-5 text-[#1d9bf0]">
                  <button className="hover:opacity-80">
                    <Folder className="h-6 w-6" />
                  </button>
                  <button className="hover:opacity-80">
                    <Save className="h-6 w-6" />
                  </button>
                </div>

                <button className="flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-8 py-3 font-bold text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] hover:bg-blue-400">
                  <Eye className="h-5 w-5" />
                  Vista previa
                </button>

                <button
                  onClick={handleSendInvoice}
                  disabled={isSending || productos.length === 0}
                  className={`flex items-center justify-center gap-2 rounded-xl px-8 py-3 font-bold text-white shadow-lg transition-all duration-200 ${
                    isSending || productos.length === 0
                      ? "bg-emerald-500/50 cursor-not-allowed"
                      : "bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20"
                  }`}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      <span>Crear Factura</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Alerta */}
          <section className="mt-7 rounded-2xl border-2 border-[#164a7a] bg-[#0b1d32] p-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 text-[#1d9bf0]">
                <Info className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-[22px] font-bold text-white">
                  Validación CFDI 4.0 Activa
                </h3>
                <p className="mt-1 text-[17px] text-slate-300">
                  Asegúrate de que los datos del cliente coincidan exactamente con su
                  Constancia de Situación Fiscal para evitar errores en el timbrado.
                </p>
              </div>
            </div>
          </section>
        </main>

        <br />

        {/* Footer */}
        <footer className="border-t border-[#16304f] px-6 py-8 text-sm text-slate-500">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p>© 2023 FacturaPro. Todos los derechos reservados.</p>

            <div className="flex gap-6">
              <a href="#" className="hover:text-white">
                Términos y condiciones
              </a>
              <a href="#" className="hover:text-white">
                Privacidad
              </a>
              <a href="#" className="hover:text-white">
                Ayuda
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Modal para agregar cliente */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeClientModal}
          />
          
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[#173156] bg-[#071321] shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#173156] bg-[#071321] px-6 py-4">
              <h2 className="text-xl font-bold text-white">Agregar Nuevo Cliente</h2>
              <button
                onClick={closeClientModal}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors duration-200 hover:bg-[#0d1b35] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label>Nombre / Razón Social:</Label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nombre o razón social del cliente"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <Label>RFC:</Label>
                  <input
                    type="text"
                    value={clientRfc}
                    onChange={(e) => setClientRfc(e.target.value.toUpperCase())}
                    placeholder="RFC del cliente"
                    maxLength={13}
                    className={inputStyle}
                  />
                </div>

                <div>
                  <Label>Uso de la factura:</Label>
                  <div className="relative">
                    <select
                      value={clientInvoiceUsage}
                      onChange={(e) => setClientInvoiceUsage(e.target.value)}
                      className={`${selectStyle} appearance-none`}
                    >
                      {invoiceUsageOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div>
                  <Label withInfo infoText="El campo Regimen Fiscal será obligatorio para los receptores a partir de julio 2022">
                    Régimen fiscal:
                  </Label>
                  <div className="relative">
                    <select
                      value={clientTaxRegime}
                      onChange={(e) => setClientTaxRegime(e.target.value)}
                      className={`${selectStyle} appearance-none`}
                    >
                      {taxRegimeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div>
                  <Label>E-Mail:</Label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <Label>E-Mail opcional No.1:</Label>
                  <input
                    type="email"
                    value={clientEmailOptional1}
                    onChange={(e) => setClientEmailOptional1(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <Label>E-Mail opcional No.2:</Label>
                  <input
                    type="email"
                    value={clientEmailOptional2}
                    onChange={(e) => setClientEmailOptional2(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <Label withInfo infoText="El campo CP será obligatorio para los receptores a partir de julio 2022">
                    C.P.:
                  </Label>
                  <input
                    type="text"
                    value={clientCp}
                    onChange={(e) => setClientCp(e.target.value)}
                    placeholder="Código postal"
                    maxLength={5}
                    className={inputStyle}
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    onClick={() => setShowOptionalFields(!showOptionalFields)}
                    className="flex items-center gap-2 text-[15px] font-semibold text-[#1d9bf0] hover:opacity-90 transition-opacity"
                  >
                    {showOptionalFields ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    {showOptionalFields ? "Ocultar datos opcionales" : "Agregar datos opcionales"}
                  </button>
                </div>

                {showOptionalFields && (
                  <div className="md:col-span-2">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <Label>Calle</Label>
                        <input
                          type="text"
                          value={clientStreet}
                          onChange={(e) => setClientStreet(e.target.value)}
                          placeholder="Calle"
                          className={inputStyle}
                        />
                      </div>
                      
                      <div>
                        <Label>No. Exterior:</Label>
                        <input
                          type="text"
                          value={clientExteriorNumber}
                          onChange={(e) => setClientExteriorNumber(e.target.value)}
                          placeholder="Número exterior"
                          className={inputStyle}
                        />
                      </div>

                      <div>
                        <Label>No. Interior:</Label>
                        <input
                          type="text"
                          value={clientInteriorNumber}
                          onChange={(e) => setClientInteriorNumber(e.target.value)}
                          placeholder="Número interior (opcional)"
                          className={inputStyle}
                        />
                      </div>

                      <div>
                        <Label>Colonia:</Label>
                        <input
                          type="text"
                          value={clientNeighborhood}
                          onChange={(e) => setClientNeighborhood(e.target.value)}
                          placeholder="Colonia"
                          className={inputStyle}
                        />
                      </div>

                      <div>
                        <Label>Localidad:</Label>
                        <input
                          type="text"
                          value={clientLocality}
                          onChange={(e) => setClientLocality(e.target.value)}
                          placeholder="Localidad (opcional)"
                          className={inputStyle}
                        />
                      </div>

                      <div>
                        <Label>Municipio:</Label>
                        <input
                          type="text"
                          value={clientMunicipality}
                          onChange={(e) => setClientMunicipality(e.target.value)}
                          placeholder="Municipio"
                          className={inputStyle}
                        />
                      </div>

                      <div>
                        <Label>Estado:</Label>
                        <div className="relative">
                          <select
                            value={clientState}
                            onChange={(e) => setClientState(e.target.value)}
                            className={`${selectStyle} appearance-none`}
                          >
                            <option value="">Seleccione un estado</option>
                            {mexicanStates.map((state) => (
                              <option key={state} value={state}>
                                {state}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>

                      <div>
                        <Label>País:</Label>
                        <div className="relative">
                          <select
                            value={clientCountry}
                            onChange={(e) => setClientCountry(e.target.value)}
                            className={`${selectStyle} appearance-none`}
                          >
                            {countries.map((country) => (
                              <option key={country} value={country}>
                                {country}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 flex justify-end gap-4 border-t border-[#173156] bg-[#071321] px-6 py-4">
              <button
                onClick={closeClientModal}
                className="rounded-xl bg-red-500 px-6 py-2 font-medium text-white shadow-[0_10px_30px_rgba(255,0,0,0.25)] transition-colors duration-200 hover:bg-red-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveClient}
                className="rounded-xl bg-blue-500 px-6 py-2 font-medium text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition-colors duration-200 hover:bg-blue-400"
              >
                Guardar Cliente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar producto */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeProductModal}
          />
          
          <div className="relative max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-[#173156] bg-[#071321] shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#173156] bg-[#071321] px-6 py-4">
              <h2 className="text-xl font-bold text-white">Nuevo Producto</h2>
              <button
                onClick={closeProductModal}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors duration-200 hover:bg-[#0d1b35] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Sección izquierda y derecha en grid */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Columna izquierda - Datos del producto */}
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

                {/* Columna derecha - Cambios obligatorios CFDI 4.0 SAT */}
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

              {/* Sección Cuenta Predial - Opcionales */}
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

              {/* Sección Impuestos Federales */}
              <div className="mt-6">
                <h3 className="text-md font-bold text-white">Impuestos Federales</h3>
                <p className="text-sm text-slate-400 mb-4">Selecciona únicamente los impuestos que necesite tu producto</p>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {/* IVA */}
                  <div>
                    <Label>IVA</Label>
                    <div className="relative">
                      <select
                        value={productIVA}
                        onChange={(e) => setProductIVA(e.target.value)}
                        className={`${selectStyle} appearance-none`}
                        title="Impuesto al Valor Agregado" 
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

                  {/* IVA RET */}
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

                  {/* IEPS */}
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
                          <span className="text-sm text-slate-300 mb-2 mr-16">CUOTA</span>
                        </label>
                      </div>
                    </div>
                    {iepsType === "tasa" ? (
                      <div className="relative">
                        <select
                          value={iepsTasaValue}
                          onChange={(e) => setIepsTasaValue(e.target.value)}
                          className={`${selectStyle} appearance-none`}
                          title="Impuesto Especial sobre Producción y Servicios"
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

                  {/* ISR */}
                  <div>
                    <Label>ISR</Label>
                    <div className="relative">
                      <select
                        value={productISR}
                        onChange={(e) => setProductISR(e.target.value)}
                        className={`${selectStyle} appearance-none`}
                        title="Impuesto Sobre la Renta"
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

              {/* Sección Información Aduanera */}
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

              {/* Sección Impuestos Locales */}
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
                onClick={closeProductModal} 
                className="rounded-xl bg-red-500 px-6 py-2 font-medium text-white shadow-[0_10px_30px_rgba(255,0,0,0.25)] transition-colors duration-200 hover:bg-red-400"
              >
                Cerrar
              </button>
              <button
                onClick={handleSaveProduct}
                className="rounded-xl bg-blue-500 px-6 py-2 font-medium text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition-colors duration-200 hover:bg-blue-400"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de éxito */}
      <SuccessModal />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Efectos para cerrar con tecla ESC */}
      {isClientModalOpen && <EscHandler onClose={closeClientModal} />}
      {isProductModalOpen && <EscHandler onClose={closeProductModal} />}
      {showSuccessModal && <EscHandler onClose={closeSuccessModal} />}
    </AppLayout>
  );
}