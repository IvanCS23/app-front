"use client";
import React, { useState, useEffect } from "react";
import { 
  SquarePen, Trash, Eye, Plus, X, ChevronDown, ChevronUp, Info, CheckCircle2, Loader2,
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

const clientesMock = [
  {
    iniciales: "AD",
    nombre: "AARON DIAZ FLORES",
    rfc: "DIFA806512XYZ",
    email: "aaron.diaz@example.com",
    cp: "06700",
  },
  {
    iniciales: "AP",
    nombre: "AUTOS PREMIER GK",
    rfc: "APG120304HJK",
    email: "contacto@autospremier.mx",
    cp: "64000",
  },
  {
    iniciales: "BC",
    nombre: "BERNARDO CARRILLO",
    rfc: "CABB50101789",
    email: "b.carrillo@provider.net",
    cp: "45010",
  },
  {
    iniciales: "CI",
    nombre: "CONSTRUCTORA INTEGRAL",
    rfc: "CIN506812S34",
    email: "pagos@constructora-int.com",
    cp: "72000",
  },
];

export default function CatalogoClientes() {
  const [search, setSearch] = useState("");
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  // Estado para los clientes filtrados
  const [filteredClientes, setFilteredClientes] = useState(clientesMock);

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

  // Filtrar clientes cuando cambia el término de búsqueda
  useEffect(() => {
    const searchLower = search.toLowerCase();
    const filtered = clientesMock.filter(cliente => 
      cliente.nombre.toLowerCase().includes(searchLower) ||
      cliente.rfc.toLowerCase().includes(searchLower) ||
      cliente.email.toLowerCase().includes(searchLower) ||
      cliente.cp.includes(search)
    );
    setFilteredClientes(filtered);
  }, [search]);

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

  // Funciones para el modal de carga masiva
  const openBulkUploadModal = () => {
    setIsBulkUploadModalOpen(true);
  };

  const closeBulkUploadModal = () => {
    setIsBulkUploadModalOpen(false);
  };

  // Modal de carga masiva
  const BulkUploadModal = () => {
  if (!isBulkUploadModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={closeBulkUploadModal}
      />
      
      {/* Añade overflow-y-auto y max-height al contenedor principal */}
      <div className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-[#173156] bg-[#071321] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#173156] bg-[#071321] px-6 py-4">
          <h2 className="text-xl font-bold text-white">Carga Masiva de Clientes</h2>
          <button
            onClick={closeBulkUploadModal}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors duration-200 hover:bg-[#0d1b35] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Resto del contenido del modal - igual que antes */}
          <div className="mb-6 p-4 rounded-xl bg-[#0a1424] border border-[#173156]">
            <p className="text-slate-300 text-sm leading-relaxed">
              Aquí podrás subir tu catálogo de clientes de forma masiva, a través de un archivo .csv. 
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


  return (
    <AppLayout>
      <div className="min-h-screen bg-[#151c24] text-white p-3 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Catálogo de Clientes</h1>
            <p className="text-gray-400">
              Gestiona la base de datos de tus socios comerciales, consulta sus datos fiscales y realiza cargas masivas de información.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={openBulkUploadModal}
              className="w-36 bg-emerald-500 hover:bg-emerald-400 rounded-lg font-semibold shadow text-white shadow-lg shadow-emerald-500/30"
            >
              Carga masiva de clientes
            </button>
            <button 
              onClick={openClientModal}
              className="w-36 bg-blue-500 hover:bg-blue-400 rounded-lg font-semibold shadow text-white shadow-lg shadow-blue-500/30"
            >
              Agregar cliente
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <input
            className="box box-input flex-1"
            placeholder="Filtrar por nombre, RFC o correo..."
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
                <th className="p-3 text-left">NOMBRE / RAZÓN SOCIAL</th>
                <th className="p-3 text-left">RFC</th>
                <th className="p-3 text-left">EMAIL</th>
                <th className="p-3 text-left">CÓDIGO POSTAL</th>
              </tr>
            </thead>
            <tbody>
              {filteredClientes.map((c, i) => (
                <tr key={i} className="border-t border-[#232b36] hover:bg-[#1a222c]">
                  <td className="p-3 flex gap-2">
                    <button className="text-gray-400 hover:text-blue-400"><SquarePen className="h-4 w-4" /></button>
                    <button className="text-gray-400 hover:text-red-400"><Trash className="h-4 w-4" /></button>
                    <button className="text-gray-400 hover:text-green-400"><Eye className="h-4 w-4" /></button>
                  </td>
                  <td className="p-3 flex items-center gap-3 font-bold">
                    <span className={`rounded-lg px-2 py-1 text-xs font-bold ${i === 1 ? 'bg-yellow-600 text-yellow-200' : 'bg-blue-900 text-blue-200'}`}>{c.iniciales}</span>
                    {c.nombre}
                  </td>
                  <td className="p-3">
                    <span className="bg-[#1e293b] text-blue-300 px-2 py-1 rounded text-xs font-mono cursor-pointer hover:underline">
                      {c.rfc}
                    </span>
                  </td>
                  <td className="p-3 text-gray-300">{c.email}</td>
                  <td className="p-3">{c.cp}</td>
                </tr>
              ))}
              {filteredClientes.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    No se encontraron clientes que coincidan con tu búsqueda
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-between items-center p-4 border-t border-[#232b36] text-gray-400 text-sm">
            <span>Mostrando {filteredClientes.length} de {clientesMock.length} registros</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-[#1a222c] rounded">Anterior</button>
              <button className="px-3 py-1 bg-blue-600 rounded text-white">1</button>
              <button className="px-3 py-1 bg-[#1a222c] rounded">2</button>
              <button className="px-3 py-1 bg-[#1a222c] rounded">3</button>
              <button className="px-3 py-1 bg-[#1a222c] rounded">Siguiente</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-[#1a222c] rounded-xl p-6 flex flex-col items-start border-2 border-[#16304f]">
            <span className="text-base font-bold mb-2">Resumen de Actividad</span>
            <span className="text-gray-300 mb-2">Has agregado 12 clientes nuevos este mes. Tu base de datos ha crecido un 8% respecto al periodo anterior.</span>
            <a href="#" className="text-blue-400 hover:underline text-sm">Ver reporte detallado</a>
          </div>
          <div className="bg-[#1a222c] rounded-xl p-6 flex flex-col items-start border-2 border-[#16304f]">
            <span className="text-base font-bold mb-2">PRÓXIMO VENCIMIENTO</span>
            <span className="text-3xl font-extrabold mb-2">15 Clientes</span>
            <span className="text-gray-300 mb-2">Requieren actualización de constancia fiscal.</span>
            <div className="flex gap-1 mt-2">
              <span className="bg-blue-800 text-white rounded-full px-2 py-1 text-xs font-bold">JD</span>
              <span className="bg-blue-800 text-white rounded-full px-2 py-1 text-xs font-bold">ML</span>
              <span className="bg-yellow-700 text-white rounded-full px-2 py-1 text-xs font-bold">RC</span>
              <span className="bg-gray-700 text-white rounded-full px-2 py-1 text-xs font-bold">+12</span>
            </div>
          </div>
        </div>
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

      {/* Modal de carga masiva */}
      <BulkUploadModal />

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