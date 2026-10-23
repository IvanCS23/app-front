// app-front/app/pages/catalogs/clients/page.tsx

"use client";
import React, { useState, useEffect, useCallback } from "react";
import { 
  SquarePen, Trash, Eye, Plus, X, ChevronDown, ChevronUp, Info, Loader2,
  Download, Upload, Activity, FileText as FileTextIcon 
} from "lucide-react";
import AppLayout from "@/app/components/layout/AppLayout";
import Toast, { type ToastData } from "@/app/components/ui/Toast";
import { 
  getClients, 
  createClient, 
  updateClient, 
  deleteClient, 
  Client as ClientType 
} from "@/src/services/client.services";

const selectStyle = "box box-input";
const inputStyle = "box box-input";

type LabelProps = {
  children: React.ReactNode;
  withInfo?: boolean;
  infoText?: string;
};

function Label({ children, withInfo = false, infoText = "" }: LabelProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="mb-2 flex items-center gap-1">
      <label className="text-sm font-bold uppercase tracking-wide text-[#475569]">
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
            <div className="absolute bottom-full left-0 mb-2 z-50 w-64 rounded-lg bg-white border border-[#E2E8F0] p-2 text-xs text-[#475569] shadow-lg">
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
  "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas",
  "Chihuahua", "Ciudad de México", "Coahuila", "Colima", "Durango", "Guanajuato",
  "Guerrero", "Hidalgo", "Jalisco", "México", "Michoacán", "Morelos", "Nayarit",
  "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí",
  "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas",
];

// Países en orden alfabético
const countries = [
  "Afganistán", "Albania", "Alemania", "Andorra", "Angola", "Antigua y Barbuda",
  "Arabia Saudita", "Argelia", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaiyán", "Bahamas", "Bangladés", "Barbados", "Baréin", "Bélgica", "Belice",
  "Benín", "Bielorrusia", "Birmania", "Bolivia", "Bosnia y Herzegovina", "Botsuana",
  "Brasil", "Brunéi", "Bulgaria", "Burkina Faso", "Burundi", "Bután", "Cabo Verde",
  "Camboya", "Camerún", "Canadá", "Catar", "Chad", "Chile", "China", "Chipre",
  "Ciudad del Vaticano", "Colombia", "Comoras", "Corea del Norte", "Corea del Sur",
  "Costa de Marfil", "Costa Rica", "Croacia", "Cuba", "Dinamarca", "Dominica",
  "Ecuador", "Egipto", "El Salvador", "Emiratos Árabes Unidos", "Eritrea", "Eslovaquia",
  "Eslovenia", "España", "Estados Unidos", "Estonia", "Esuatini", "Etiopía", "Filipinas",
  "Finlandia", "Fiyi", "Francia", "Gabón", "Gambia", "Georgia", "Ghana", "Granada",
  "Grecia", "Guatemala", "Guinea", "Guinea-Bisáu", "Guinea Ecuatorial", "Guyana",
  "Haití", "Honduras", "Hungría", "India", "Indonesia", "Irak", "Irán", "Irlanda",
  "Islandia", "Islas Marshall", "Islas Salomón", "Israel", "Italia", "Jamaica",
  "Japón", "Jordania", "Kazajistán", "Kenia", "Kirguistán", "Kiribati", "Kuwait",
  "Laos", "Lesoto", "Letonia", "Líbano", "Liberia", "Libia", "Liechtenstein",
  "Lituania", "Luxemburgo", "Macedonia del Norte", "Madagascar", "Malasia", "Malaui",
  "Maldivas", "Malí", "Malta", "Marruecos", "Mauricio", "Mauritania", "México",
  "Micronesia", "Moldavia", "Mónaco", "Mongolia", "Montenegro", "Mozambique",
  "Namibia", "Nauru", "Nepal", "Nicaragua", "Níger", "Nigeria", "Noruega",
  "Nueva Zelanda", "Omán", "Países Bajos", "Pakistán", "Palaos", "Palestina",
  "Panamá", "Papúa Nueva Guinea", "Paraguay", "Perú", "Polonia", "Portugal",
  "Reino Unido", "República Centroafricana", "República Checa", "República del Congo",
  "República Democrática del Congo", "República Dominicana", "Ruanda", "Rumania",
  "Rusia", "Samoa", "San Cristóbal y Nieves", "San Marino", "San Vicente y las Granadinas",
  "Santa Lucía", "Santo Tomé y Príncipe", "Senegal", "Serbia", "Seychelles",
  "Sierra Leona", "Singapur", "Siria", "Somalia", "Sri Lanka", "Sudáfrica",
  "Sudán", "Sudán del Sur", "Suecia", "Suiza", "Surinam", "Tailandia", "Tanzania",
  "Tayikistán", "Timor Oriental", "Togo", "Tonga", "Trinidad y Tobago", "Túnez",
  "Turkmenistán", "Turquía", "Tuvalu", "Ucrania", "Uganda", "Uruguay", "Uzbekistán",
  "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Yibuti", "Zambia", "Zimbabue",
];

export default function CatalogoClientes() {
  const [search, setSearch] = useState("");
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingClientId, setEditingClientId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  
  // Estado para los clientes
  const [clients, setClients] = useState<ClientType[]>([]);
  const [filteredClients, setFilteredClients] = useState<ClientType[]>([]);

  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(25);

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

  // Cargar clientes desde la API
  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getClients();
      setClients(data);
      setFilteredClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setToast({ 
        message: error instanceof Error ? error.message : "Error al cargar clientes", 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar clientes al montar el componente
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Filtrar clientes cuando cambia el término de búsqueda o la lista de clientes
  useEffect(() => {
    const searchLower = search.toLowerCase();
    const filtered = clients.filter(cliente => 
      (cliente.name || '').toLowerCase().includes(searchLower) ||
      (cliente.rfc || '').toLowerCase().includes(searchLower) ||
      (cliente.email || '').toLowerCase().includes(searchLower) ||
      (cliente.codigo_postal || '').includes(search)
    );
    setFilteredClients(filtered);
    setCurrentPage(1);
  }, [search, clients]);

  // Calcular clientes paginados
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const totalPages = Math.ceil(filteredClients.length / recordsPerPage);

  // Mapear campos del formulario al objeto Client
  const mapFormToClient = (): ClientType => {
    return {
      name: clientName,
      rfc: clientRfc,
      uso_cfdi: clientInvoiceUsage,
      regimen_fiscal: clientTaxRegime,
      email: clientEmail,
      codigo_postal: clientCp,
      calle: clientStreet || undefined,
      no_exterior: clientExteriorNumber || undefined,
      no_interior: clientInteriorNumber || undefined,
      colonia: clientNeighborhood || undefined,
      localidad: clientLocality || undefined,
      municipio: clientMunicipality || undefined,
      estado: clientState || undefined,
      pais: clientCountry || undefined,
    };
  };

  // Mapear cliente a campos del formulario
  const mapClientToForm = (client: ClientType) => {
    setClientName(client.name || '');
    setClientRfc(client.rfc || '');
    setClientInvoiceUsage(client.uso_cfdi || '');
    setClientTaxRegime(client.regimen_fiscal || '');
    setClientEmail(client.email || '');
    setClientEmailOptional1('');
    setClientEmailOptional2('');
    setClientCp(client.codigo_postal || '');
    setClientStreet(client.calle || '');
    setClientExteriorNumber(client.no_exterior || '');
    setClientInteriorNumber(client.no_interior || '');
    setClientNeighborhood(client.colonia || '');
    setClientLocality(client.localidad || '');
    setClientMunicipality(client.municipio || '');
    setClientState(client.estado || '');
    setClientCountry(client.pais || 'México');
    
    // Si hay campos opcionales con datos, mostrar la sección opcional
    if (client.calle || client.no_exterior || client.colonia || client.municipio || client.estado) {
      setShowOptionalFields(true);
    } else {
      setShowOptionalFields(false);
    }
  };

  // Funciones para el modal de cliente
  const openClientModal = (client?: ClientType) => {
    if (client) {
      setEditingClientId(client.id || null);
      mapClientToForm(client);
    } else {
      setEditingClientId(null);
      resetClientForm();
    }
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
    setEditingClientId(null);
  };

  const validateForm = (): boolean => {
    if (!clientName.trim()) {
      setToast({ message: "El campo Nombre / Razón Social es obligatorio", type: "error" });
      return false;
    }
    if (!clientRfc.trim()) {
      setToast({ message: "El campo RFC es obligatorio", type: "error" });
      return false;
    }
    if (!clientInvoiceUsage) {
      setToast({ message: "El campo Uso de la factura es obligatorio", type: "error" });
      return false;
    }
    if (!clientTaxRegime) {
      setToast({ message: "El campo Régimen fiscal es obligatorio", type: "error" });
      return false;
    }
    if (!clientEmail.trim()) {
      setToast({ message: "El campo E-Mail es obligatorio", type: "error" });
      return false;
    }
    if (!clientCp.trim()) {
      setToast({ message: "El campo C.P. es obligatorio", type: "error" });
      return false;
    }
    return true;
  };

  const handleSaveClient = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const clientData = mapFormToClient();

      if (editingClientId) {
        await updateClient(editingClientId, clientData);
        setToast({ message: "Cliente actualizado correctamente", type: "success" });
      } else {
        await createClient(clientData);
        setToast({ message: "Cliente agregado correctamente", type: "success" });
      }

      await fetchClients();
      closeClientModal();
    } catch (error) {
      console.error("Error saving client:", error);
      setToast({ 
        message: error instanceof Error ? error.message : "Error al guardar cliente", 
        type: "error" 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClient = async (clientId: number) => {
    setConfirmDeleteId(clientId);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    
    setIsLoading(true);
    try {
      await deleteClient(confirmDeleteId);
      setToast({ message: "Cliente eliminado correctamente", type: "success" });
      await fetchClients();
    } catch (error) {
      console.error("Error deleting client:", error);
      setToast({ 
        message: error instanceof Error ? error.message : "Error al eliminar cliente", 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
      setConfirmDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const handleViewClient = () => {
    // Implementar lógica para ver detalles del cliente
    setToast({ message: "Vista de detalles en desarrollo", type: "info" });
  };

  // Modal de carga masiva
  const BulkUploadModal = () => {
    if (!isBulkUploadModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setIsBulkUploadModalOpen(false)}
        />
        
        <div className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
            <h2 className="text-xl font-bold text-[#0F172A]">Carga Masiva de Clientes</h2>
            <button
              onClick={() => setIsBulkUploadModalOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <p className="text-[#475569] text-sm leading-relaxed">
                Aquí podrás subir tu catálogo de clientes de forma masiva, a través de un archivo .csv. 
                En <span className="text-blue-600 font-medium">Ejemplo de carga masiva</span> se descargará la plantilla base 
                y un documento con los detalles para el llenado del archivo.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <button className="flex items-center justify-center gap-2 rounded-xl bg-white border border-[#E2E8F0] px-4 py-3 text-[#0F172A] hover:bg-[#F8FAFC] transition-colors hover:border-[#CBD5E1] shadow-sm">
                <FileTextIcon className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Ejemplo de carga masiva</span>
              </button>
              
              <button className="flex items-center justify-center gap-2 rounded-xl bg-white border border-[#E2E8F0] px-4 py-3 text-[#0F172A] hover:bg-[#F8FAFC] transition-colors hover:border-[#CBD5E1] shadow-sm">
                <Download className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Descarga .csv</span>
              </button>
              
              <button className="flex items-center justify-center gap-2 rounded-xl bg-white border border-[#E2E8F0] px-4 py-3 text-[#0F172A] hover:bg-[#F8FAFC] transition-colors hover:border-[#CBD5E1] shadow-sm">
                <Upload className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Subir archivo .csv</span>
              </button>
              
              <button className="flex items-center justify-center gap-2 rounded-xl bg-white border border-[#E2E8F0] px-4 py-3 text-[#0F172A] hover:bg-[#F8FAFC] transition-colors hover:border-[#CBD5E1] shadow-sm">
                <Activity className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Ver estado de los procesos</span>
              </button>
            </div>

            <div className="border-t border-[#E2E8F0] my-6"></div>

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
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] p-3 rounded-lg">
        {/* Barra de carga */}
        {isLoading && (
          <div className="fixed top-0 left-0 right-0 z-50">
            <div className="h-1 bg-blue-500">
              <div className="h-full bg-blue-400 animate-pulse"></div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0F172A]">Catálogo de Clientes</h1>
            <p className="text-[#64748B]">
              Gestiona la base de datos de tus socios comerciales, consulta sus datos fiscales y realiza cargas masivas de información.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsBulkUploadModalOpen(true)}
              className="w-36 bg-emerald-500 hover:bg-emerald-400 rounded-lg font-semibold shadow text-white shadow-lg shadow-emerald-500/30 transition-colors"
            >
              Carga masiva
            </button>
            <button 
              onClick={() => openClientModal()}
              className="w-36 bg-blue-500 hover:bg-blue-400 rounded-lg font-semibold shadow text-white shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-colors"
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" />
              Agregar cliente
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <input
            className={inputStyle + " flex-1"}
            placeholder="Filtrar por nombre, RFC o correo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <span className="text-[#64748B] text-sm">MOSTRAR</span>
            <select 
              className={selectStyle}
              value={recordsPerPage}
              onChange={(e) => {
                setRecordsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={25}>25 registros</option>
              <option value={50}>50 registros</option>
              <option value={100}>100 registros</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl overflow-hidden mb-8 border border-[#E2E8F0] shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#F1F5F9] text-[#475569]">
              <tr>
                <th className="p-3 text-left">ACCIONES</th>
                <th className="p-3 text-left">NOMBRE / RAZÓN SOCIAL</th>
                <th className="p-3 text-left">RFC</th>
                <th className="p-3 text-left">EMAIL</th>
                <th className="p-3 text-left">CÓDIGO POSTAL</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                      <span className="text-[#64748B]">Cargando clientes...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedClients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#64748B]">
                    {search ? "No se encontraron clientes que coincidan con tu búsqueda" : "No hay clientes registrados"}
                  </td>
                </tr>
              ) : (
                paginatedClients.map((client) => (
                  <tr key={client.id} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openClientModal(client)}
                          className="text-[#94A3B8] hover:text-blue-600 transition-colors"
                          title="Editar cliente"
                        >
                          <SquarePen className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => client.id && handleDeleteClient(client.id)}
                          className="text-[#94A3B8] hover:text-red-500 transition-colors"
                          title="Eliminar cliente"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleViewClient()}
                          className="text-[#94A3B8] hover:text-emerald-600 transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="p-3 font-bold">
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-50 text-blue-700 rounded-lg px-2 py-1 text-xs font-bold">
                          {(client.name || '').substring(0, 2).toUpperCase()}
                        </span>
                        {client.name}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="bg-[#EFF6FF] text-blue-700 px-2 py-1 rounded text-xs font-mono cursor-pointer hover:underline">
                        {client.rfc}
                      </span>
                    </td>
                    <td className="p-3 text-[#475569]">{client.email}</td>
                    <td className="p-3">{client.codigo_postal}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {/* Paginación */}
          {filteredClients.length > 0 && (
            <div className="flex justify-between items-center p-4 border-t border-[#E2E8F0] text-[#64748B] text-sm">
              <span>
                Mostrando {paginatedClients.length} de {filteredClients.length} registros
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded transition-colors border ${
                    currentPage === 1
                      ? 'bg-slate-100 border-[#E2E8F0] text-slate-400 cursor-not-allowed'
                      : 'bg-white border-[#E2E8F0] text-[#475569] hover:bg-blue-600 hover:text-white hover:border-blue-600'
                  }`}
                >
                  Anterior
                </button>
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded transition-colors border ${
                        currentPage === pageNum
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-[#E2E8F0] text-[#475569] hover:bg-blue-600 hover:text-white hover:border-blue-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`px-3 py-1 rounded transition-colors border ${
                    currentPage === totalPages || totalPages === 0
                      ? 'bg-slate-100 border-[#E2E8F0] text-slate-400 cursor-not-allowed'
                      : 'bg-white border-[#E2E8F0] text-[#475569] hover:bg-blue-600 hover:text-white hover:border-blue-600'
                  }`}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-xl p-6 flex flex-col items-start border border-[#E2E8F0] shadow-sm">
            <span className="text-base font-bold text-[#0F172A] mb-2">Resumen de Actividad</span>
            <span className="text-[#64748B] mb-2">
              Has agregado {clients.length} clientes en total. Gestiona tu catálogo de forma eficiente.
            </span>
            <a href="#" className="text-blue-600 hover:underline text-sm">Ver reporte detallado</a>
          </div>
          <div className="bg-white rounded-xl p-6 flex flex-col items-start border border-[#E2E8F0] shadow-sm">
            <span className="text-base font-bold text-[#64748B] uppercase tracking-wide mb-2">Estadísticas</span>
            <span className="text-3xl font-extrabold text-[#0F172A] mb-2">{clients.length} Clientes</span>
            <span className="text-[#64748B] mb-2">Registrados en el sistema.</span>
            <div className="flex gap-1 mt-2">
              <span className="bg-blue-50 text-blue-700 rounded-full px-2 py-1 text-xs font-bold">
                {clients.length > 0 ? "+" + clients.length : "0"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para agregar/editar cliente */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeClientModal}
          />
          
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
              <h2 className="text-xl font-bold text-[#0F172A]">
                {editingClientId ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}
              </h2>
              <button
                onClick={closeClientModal}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-700"
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
                    disabled={isSaving}
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
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <Label>Uso de la factura:</Label>
                  <div className="relative">
                    <select
                      value={clientInvoiceUsage}
                      onChange={(e) => setClientInvoiceUsage(e.target.value)}
                      className={`${selectStyle} appearance-none`}
                      disabled={isSaving}
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
                      disabled={isSaving}
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
                    disabled={isSaving}
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
                    disabled={isSaving}
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
                    disabled={isSaving}
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
                    disabled={isSaving}
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    onClick={() => setShowOptionalFields(!showOptionalFields)}
                    className="flex items-center gap-2 text-[15px] font-semibold text-blue-600 hover:opacity-90 transition-opacity"
                    type="button"
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
                          disabled={isSaving}
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
                          disabled={isSaving}
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
                          disabled={isSaving}
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
                          disabled={isSaving}
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
                          disabled={isSaving}
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
                          disabled={isSaving}
                        />
                      </div>

                      <div>
                        <Label>Estado:</Label>
                        <div className="relative">
                          <select
                            value={clientState}
                            onChange={(e) => setClientState(e.target.value)}
                            className={`${selectStyle} appearance-none`}
                            disabled={isSaving}
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
                            disabled={isSaving}
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

            <div className="sticky bottom-0 flex justify-end gap-4 border-t border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
              <button
                onClick={closeClientModal}
                className="rounded-xl bg-red-500 px-6 py-2 font-medium text-white shadow-[0_10px_30px_rgba(255,0,0,0.25)] transition-colors duration-200 hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSaving}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveClient}
                disabled={isSaving}
                className="rounded-xl bg-blue-500 px-6 py-2 font-medium text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition-colors duration-200 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  editingClientId ? 'Actualizar Cliente' : 'Guardar Cliente'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={cancelDelete}
          />
          
          <div className="relative max-w-md w-full rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
              <h2 className="text-xl font-bold text-[#0F172A]">Confirmar Eliminación</h2>
              <button
                onClick={cancelDelete}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Trash className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <p className="text-[#0F172A] font-medium">¿Estás seguro de eliminar este cliente?</p>
                  <p className="text-[#64748B] text-sm mt-1">
                    Esta acción no se puede deshacer. Se eliminará permanentemente el cliente y todos sus datos asociados.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 border-t border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
              <button
                onClick={cancelDelete}
                className="rounded-xl border border-[#E2E8F0] bg-white px-6 py-2 font-medium text-[#475569] transition-colors duration-200 hover:bg-slate-50"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={isLoading}
                className="rounded-xl bg-red-500 px-6 py-2 font-medium text-white shadow-[0_10px_30px_rgba(255,0,0,0.25)] transition-colors duration-200 hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  'Eliminar Cliente'
                )}
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