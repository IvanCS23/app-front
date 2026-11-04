// app-front/app/pages/catalogs/clients/page.tsx

"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  SquarePen, Trash, Eye, Plus, X, ChevronDown, ChevronUp, Info, Loader2, AlertTriangle
} from "lucide-react";
import AppLayout from "@/app/components/layout/AppLayout";
import { COMING_SOON_ACTION_CLASS, ComingSoonBadge, comingSoonActionProps } from "@/app/components/ui/ComingSoon";
import Toast, { type ToastData } from "@/app/components/ui/Toast";
import { 
  getClients, 
  createClient, 
  updateClient, 
  deleteClient, 
  Client as ClientType
} from "@/src/services/client.services";
import { getSatCatalogs } from "@/src/services/sat.services";
import { isEmailAddress } from "@/src/lib/email";
import { clientFiscalErrors, regimesFor, usesFor, type ClientFiscalInput } from "@/src/lib/sat";
import type { FiscalIssue, SatCatalogs } from "@/src/types/sat";

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

// Fase 6.26: régimen fiscal y uso de CFDI vienen del catálogo oficial del SAT
// (GET /api/sat/catalogs), filtrados por tipo de persona y régimen.

/** Error de un campo fiscal, bajo el control. */
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-medium text-red-600">{message}</p>;
}

/** Opciones de un select de catálogo; conserva un valor guardado que ya no aplica. */
function catalogOptions(entries: { code: string; description: string }[], current: string) {
  const options = entries.map((entry) => ({ value: entry.code, label: `${entry.code} - ${entry.description}` }));
  if (current !== "" && !options.some((option) => option.value === current)) {
    options.unshift({ value: current, label: `${current} (no válido para este cliente)` });
  }
  return options;
}

/** Marca un cliente guardado con datos que el SAT no acepta (fiscal_issues). */
function FiscalIssuesBadge({ issues }: { issues?: FiscalIssue[] }) {
  if (!issues || issues.length === 0) return null;
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800"
      title={issues.map((issue) => issue.message).join("\n")}
    >
      <AlertTriangle className="h-3 w-3" aria-hidden="true" />
      Revisar datos SAT
    </span>
  );
}

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

  // Fase 6.26: catálogos SAT, errores por campo y problemas del cliente guardado.
  const [satCatalogs, setSatCatalogs] = useState<SatCatalogs | null>(null);
  const [satCatalogsError, setSatCatalogsError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ClientFiscalInput | "email_optional_1" | "email_optional_2", string>>>({});
  const [savedFiscalIssues, setSavedFiscalIssues] = useState<FiscalIssue[]>([]);

  useEffect(() => {
    getSatCatalogs()
      .then(setSatCatalogs)
      .catch((error: unknown) => setSatCatalogsError(error instanceof Error ? error.message : "No fue posible cargar los catálogos del SAT."));
  }, []);

  const fiscalInput: ClientFiscalInput = {
    rfc: clientRfc,
    codigo_postal: clientCp,
    regimen_fiscal: clientTaxRegime,
    uso_cfdi: clientInvoiceUsage,
  };
  const regimeOptions = catalogOptions(satCatalogs ? regimesFor(satCatalogs, clientRfc) : [], clientTaxRegime);
  const useOptions = catalogOptions(satCatalogs ? usesFor(satCatalogs, clientRfc, clientTaxRegime) : [], clientInvoiceUsage);

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
      // Fase 6.30: vacío los borra (el API lo guarda como null).
      email_optional_1: clientEmailOptional1.trim(),
      email_optional_2: clientEmailOptional2.trim(),
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
    setClientEmailOptional1(client.email_optional_1 || '');
    setClientEmailOptional2(client.email_optional_2 || '');
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
      setSavedFiscalIssues(client.fiscal_issues ?? []);
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
    setFieldErrors({});
    setSavedFiscalIssues([]);
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

    // Fase 6.26: mismas reglas SAT que el backend (formato, catálogo y matriz).
    const errors: Partial<Record<keyof ClientFiscalInput | "email_optional_1" | "email_optional_2", string>> = clientFiscalErrors(fiscalInput, satCatalogs);
    // Fase 6.30: los correos opcionales, si se capturan, deben ser válidos.
    if (clientEmailOptional1.trim() && !isEmailAddress(clientEmailOptional1)) errors.email_optional_1 = "El E-Mail opcional No.1 no tiene un formato válido.";
    if (clientEmailOptional2.trim() && !isEmailAddress(clientEmailOptional2)) errors.email_optional_2 = "El E-Mail opcional No.2 no tiene un formato válido.";
    setFieldErrors(errors);
    const firstError = Object.values(errors)[0];
    if (firstError) {
      setToast({ message: firstError, type: "error" });
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

  const renderClientActions = (client: ClientType) => (
    <div className="flex shrink-0 gap-3 md:gap-2">
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
  );

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
        
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">Catálogo de Clientes</h1>
            <p className="text-[#64748B]">
              Gestiona la base de datos de tus socios comerciales y consulta sus datos fiscales.
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            {/* Fase 6.26.1: la importación masiva todavía no existe (no hay endpoint). */}
            <button
              {...comingSoonActionProps}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-white sm:flex-none ${COMING_SOON_ACTION_CLASS}`}
            >
              Carga masiva
              <ComingSoonBadge />
            </button>
            <button
              onClick={() => openClientModal()}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white shadow-lg shadow-blue-500/30 transition-colors hover:bg-blue-400 sm:w-40 sm:flex-none"
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" />
              Agregar cliente
            </button>
          </div>
        </div>

        {satCatalogsError && (
          <div role="alert" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            {satCatalogsError} El régimen y el uso de CFDI no se podrán elegir hasta recargar la página.
          </div>
        )}

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <input
            className={inputStyle + " min-w-0 flex-1"}
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
          {isLoading && clients.length === 0 ? (
            <div className="flex items-center justify-center gap-3 p-8">
              <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
              <span className="text-[#64748B]">Cargando clientes...</span>
            </div>
          ) : paginatedClients.length === 0 ? (
            <p className="p-8 text-center text-[#64748B]">
              {search ? "No se encontraron clientes que coincidan con tu búsqueda" : "No hay clientes registrados"}
            </p>
          ) : (
            <>
              {/* Fase 6.26: tarjetas en pantallas angostas; la tabla cortaba columnas. */}
              <ul className="divide-y divide-[#F1F5F9] md:hidden" aria-label="Clientes">
                {paginatedClients.map((client) => (
                  <li key={client.id} className="flex flex-col gap-2 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="break-words font-bold text-[#0F172A]">{client.name}</p>
                        <p className="font-mono text-xs text-blue-700">{client.rfc}</p>
                      </div>
                      {renderClientActions(client)}
                    </div>
                    <p className="break-all text-sm text-[#475569]">{client.email}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                      <span>C.P. {client.codigo_postal}</span>
                      <FiscalIssuesBadge issues={client.fiscal_issues} />
                    </div>
                  </li>
                ))}
              </ul>

              <div className="hidden overflow-x-auto md:block">
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
                    {paginatedClients.map((client) => (
                      <tr key={client.id} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                        <td className="p-3">
                          {renderClientActions(client)}
                        </td>
                        <td className="p-3 font-bold">
                          <div className="flex items-center gap-3">
                            <span className="bg-blue-50 text-blue-700 rounded-lg px-2 py-1 text-xs font-bold">
                              {(client.name || '').substring(0, 2).toUpperCase()}
                            </span>
                            <span className="min-w-0 break-words">{client.name}</span>
                            <FiscalIssuesBadge issues={client.fiscal_issues} />
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="bg-[#EFF6FF] text-blue-700 px-2 py-1 rounded text-xs font-mono">
                            {client.rfc}
                          </span>
                        </td>
                        <td className="p-3 break-all text-[#475569]">{client.email}</td>
                        <td className="p-3">{client.codigo_postal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Paginación */}
          {filteredClients.length > 0 && (
            <div className="flex flex-col gap-3 p-4 border-t border-[#E2E8F0] text-[#64748B] text-sm sm:flex-row sm:items-center sm:justify-between">
              <span>
                Mostrando {paginatedClients.length} de {filteredClients.length} registros
              </span>
              <div className="flex flex-wrap gap-2">
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
              {savedFiscalIssues.length > 0 && (
                <div role="alert" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <p className="flex items-center gap-2 font-semibold">
                    <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                    Este cliente se guardó con datos que el SAT no acepta
                  </p>
                  <p className="mt-1">Corrígelos para poder facturarle; al guardar se validan de nuevo.</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {savedFiscalIssues.map((issue) => (
                      <li key={`${issue.code}-${issue.field}`}>{issue.message}</li>
                    ))}
                  </ul>
                </div>
              )}
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
                    aria-invalid={Boolean(fieldErrors.rfc)}
                  />
                  <FieldError message={fieldErrors.rfc} />
                </div>

                <div>
                  <Label withInfo infoText="Catálogo c_RegimenFiscal del SAT; sólo se muestran los regímenes que aplican al tipo de persona del RFC (moral 12 caracteres, física 13).">
                    Régimen fiscal:
                  </Label>
                  <div className="relative">
                    <select
                      aria-label="Régimen fiscal"
                      value={clientTaxRegime}
                      onChange={(e) => setClientTaxRegime(e.target.value)}
                      className={`${selectStyle} appearance-none`}
                      disabled={isSaving || !satCatalogs}
                      aria-invalid={Boolean(fieldErrors.regimen_fiscal)}
                    >
                      <option value="">{satCatalogs ? "Seleccione un régimen" : "Cargando catálogo del SAT..."}</option>
                      {regimeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                  <FieldError message={fieldErrors.regimen_fiscal} />
                </div>

                <div>
                  <Label withInfo infoText="Catálogo c_UsoCFDI del SAT; sólo se muestran los usos compatibles con el régimen y el tipo de persona.">
                    Uso de la factura:
                  </Label>
                  <div className="relative">
                    <select
                      aria-label="Uso de la factura"
                      value={clientInvoiceUsage}
                      onChange={(e) => setClientInvoiceUsage(e.target.value)}
                      className={`${selectStyle} appearance-none`}
                      disabled={isSaving || !satCatalogs}
                      aria-invalid={Boolean(fieldErrors.uso_cfdi)}
                    >
                      <option value="">{satCatalogs ? "Seleccione un uso" : "Cargando catálogo del SAT..."}</option>
                      {useOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                  <FieldError message={fieldErrors.uso_cfdi} />
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
                    aria-label="E-Mail opcional No.1"
                    aria-invalid={Boolean(fieldErrors.email_optional_1)}
                  />
                  <FieldError message={fieldErrors.email_optional_1} />
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
                    aria-label="E-Mail opcional No.2"
                    aria-invalid={Boolean(fieldErrors.email_optional_2)}
                  />
                  <FieldError message={fieldErrors.email_optional_2} />
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
                    inputMode="numeric"
                    className={inputStyle}
                    disabled={isSaving}
                    aria-invalid={Boolean(fieldErrors.codigo_postal)}
                  />
                  <FieldError message={fieldErrors.codigo_postal} />
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