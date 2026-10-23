"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/app/components/layout/AppLayout";
import DemoNotice from "@/app/components/ui/DemoNotice";
import {
  Save,
  CheckCircle2,
  X,
  AlertCircle,
  Plus,
  Trash,
  Pencil,
  Search,
  Upload,
  Download,
  FileText,
  Activity,
  ChevronDown,
  FileSpreadsheet,
  Info,
} from "lucide-react";

const fieldStyle =
  "w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#64748B] shadow-sm transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

const selectStyle = `${fieldStyle} pr-10`;

const inputStyle = fieldStyle;

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

// Estados de la República Mexicana
const mexicanStates = [
  "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas",
  "Chihuahua", "Ciudad de México", "Coahuila", "Colima", "Durango", "Guanajuato",
  "Guerrero", "Hidalgo", "Jalisco", "México", "Michoacán", "Morelos", "Nayarit",
  "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí",
  "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas",
];

// Bancos de México (25 más usados)
const bancosMexico = [
  "Seleccione un banco",
  "BBVA Bancomer",
  "Banamex (Citibanamex)",
  "Santander",
  "HSBC",
  "Scotiabank",
  "Banorte",
  "Inbursa",
  "Afirme",
  "Bajío",
  "Mifel",
  "Banregio",
  "Banco Azteca",
  "BanCoppel",
  "Banorte (Empresarial)",
  "BBVA Bancomer (Empresarial)",
  "Santander (Empresarial)",
  "Banco del Bienestar",
  "Bancoppel",
  "Banco Inbursa",
  "Banco Multiva",
  "Banco Sabadell",
  "Banco Ve por Más",
  "Bank of America",
  "Citibanamex (Empresarial)",
];

// Opciones para Tipo de contrato
const tipoContratoOptions = [
  { label: "Seleccione el tipo de contrato", value: "" },
  { label: "01 - Contrato de trabajo por tiempo indeterminado", value: "01" },
  { label: "02 - Contrato de trabajo para obra determinada", value: "02" },
  { label: "03 - Contrato de trabajo por tiempo determinado", value: "03" },
  { label: "04 - Contrato de trabajo por temporada", value: "04" },
  { label: "05 - Contrato de trabajo sujeto a prueba", value: "05" },
  { label: "06 - Contrato de trabajo con capacitación inicial", value: "06" },
  { label: "07 - Modalidad de contratación por pago de hora laborada", value: "07" },
  { label: "08 - Modalidad de trabajo por comisión laboral", value: "08" },
  { label: "09 - Modalidades de contratación donde no existe relación de trabajo", value: "09" },
  { label: "10 - Jubilación, pensión, retiro", value: "10" },
  { label: "99 - Otro Contrato", value: "99" },
];

// Opciones para Riesgo de puesto
const riesgoPuestoOptions = [
  { label: "Seleccione el riesgo del puesto", value: "" },
  { label: "1 - Clase I", value: "1" },
  { label: "2 - Clase II", value: "2" },
  { label: "3 - Clase III", value: "3" },
  { label: "4 - Clase IV", value: "4" },
  { label: "5 - Clase V", value: "5" },
  { label: "99 - No aplica", value: "99" },
];

// Opciones para Régimen de contratación (para contratos del 1 al 8)
const regimenContratacionOptions1 = [
  { label: "Selecciona Régimen", value: "" },
  { label: "05 - Asimilados Miembros Sociedades Cooperativas Produccion", value: "05" },
  { label: "06 - Asimilados Integrantes Sociedades Asociaciones Civiles", value: "06" },
  { label: "07 - Asimilados Miembros consejos", value: "07" },
  { label: "08 - Asimilados comisionistas", value: "08" },
  { label: "09 - Asimilados Honorarios", value: "09" },
  { label: "10 - Asimilados acciones", value: "10" },
  { label: "11 - Asimilados a Otros", value: "11" },
  { label: "12 - Jubilados o Pensionados", value: "12" },
  { label: "13 - Indemnización o Separación", value: "13" },
  { label: "99 - Otro Regimen", value: "99" },
];

// Opciones para Régimen de contratación (para contratos 09, 10, 99)
const regimenContratacionOptions2 = [
  { label: "Selecciona Régimen", value: "" },
  { label: "02 - Sueldos", value: "02" },
  { label: "03 - Jubilados", value: "03" },
  { label: "04 - Pensionados", value: "04" },
];

// Opciones para Tipo de jornada
const tipoJornadaOptions = [
  { label: "Seleccione el tipo de jornada", value: "" },
  { label: "01 - Diurna", value: "01" },
  { label: "02 - Nocturna", value: "02" },
  { label: "03 - Mixta", value: "03" },
  { label: "04 - Por hora", value: "04" },
  { label: "05 - Reducida", value: "05" },
  { label: "06 - Continuada", value: "06" },
  { label: "07 - Partida", value: "07" },
  { label: "08 - Por turnos", value: "08" },
  { label: "99 - Otra Jornada", value: "99" },
];

// Opciones para Periodicidad de Pago
const periodicidadPagoOptions = [
  { label: "Periodicidad de Pago", value: "" },
  { label: "01 - Diario", value: "01" },
  { label: "02 - Semanal", value: "02" },
  { label: "03 - Catorcenal", value: "03" },
  { label: "04 - Quincenal", value: "04" },
  { label: "05 - Mensual", value: "05" },
  { label: "06 - Bimestral", value: "06" },
  { label: "07 - Unidad Obra", value: "07" },
  { label: "08 - Comisión", value: "08" },
  { label: "09 - Precio alzado", value: "09" },
  { label: "10 - Decenal", value: "10" },
  { label: "99 - Otra periodicidad", value: "99" },
];

// Tipo para Subcontratación
type Subcontratacion = {
  id: string;
  rfcEmpresa: string;
  porcentajeTiempo: string;
};

// Tipo para Empleado
type Empleado = {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  curp: string;
  rfc: string;
  calle: string;
  colonia: string;
  noExt: string;
  noInt: string;
  cp: string;
  localidad: string;
  municipio: string;
  estado: string;
  email: string;
  grupo: string;
  sucursal: string;
  salarioDiario: string;
  tipoContrato: string;
  fechaInicioRelLaboral: string;
  salarioDiarioIntegrado: string;
  noSeguridadSocial: string;
  riesgoPuesto: string;
  regimenContratacion: string;
  tipoJornada: string;
  banco: string;
  clabe: string;
  periodicidadPago: string;
  departamento: string;
  puesto: string;
  numeroEmpleado: string;
  subcontrataciones: Subcontratacion[];
};

// Tipo para Grupo
type Grupo = {
  id: string;
  nombre: string;
};

// Tipo para Sucursal (simulada)
type Sucursal = {
  id: string;
  nombre: string;
};

// Datos simulados
const gruposMock: Grupo[] = [
  { id: "1", nombre: "Administración" },
  { id: "2", nombre: "Ventas" },
  { id: "3", nombre: "Operaciones" },
];

const sucursalesMock: Sucursal[] = [
  { id: "1", nombre: "Principal" },
  { id: "2", nombre: "Sucursal Norte" },
  { id: "3", nombre: "Sucursal Sur" },
];

const empleadosMock: Empleado[] = [
  {
    id: "1",
    nombre: "Juan Carlos",
    apellidoPaterno: "Pérez",
    apellidoMaterno: "González",
    curp: "PEGJ800101HDFRRN01",
    rfc: "PEGJ800101XYZ",
    calle: "Av. Insurgentes",
    colonia: "Condesa",
    noExt: "123",
    noInt: "",
    cp: "06700",
    localidad: "Ciudad de México",
    municipio: "Cuauhtémoc",
    estado: "Ciudad de México",
    email: "juan.perez@empresa.com",
    grupo: "Administración",
    sucursal: "Principal",
    salarioDiario: "500.00",
    tipoContrato: "01",
    fechaInicioRelLaboral: "2023-01-15",
    salarioDiarioIntegrado: "550.00",
    noSeguridadSocial: "12345678901",
    riesgoPuesto: "2",
    regimenContratacion: "05",
    tipoJornada: "01",
    banco: "BBVA Bancomer",
    clabe: "012345678901234567",
    periodicidadPago: "04",
    departamento: "Contabilidad",
    puesto: "Auxiliar Contable",
    numeroEmpleado: "001",
    subcontrataciones: [],
  },
  {
    id: "2",
    nombre: "María",
    apellidoPaterno: "López",
    apellidoMaterno: "Hernández",
    curp: "LOHM850202MDFRRN02",
    rfc: "LOHM850202XYZ",
    calle: "Av. Reforma",
    colonia: "Juárez",
    noExt: "456",
    noInt: "3B",
    cp: "06600",
    localidad: "Ciudad de México",
    municipio: "Cuauhtémoc",
    estado: "Ciudad de México",
    email: "maria.lopez@empresa.com",
    grupo: "Ventas",
    sucursal: "Sucursal Norte",
    salarioDiario: "600.00",
    tipoContrato: "02",
    fechaInicioRelLaboral: "2023-03-10",
    salarioDiarioIntegrado: "660.00",
    noSeguridadSocial: "98765432109",
    riesgoPuesto: "3",
    regimenContratacion: "06",
    tipoJornada: "02",
    banco: "Santander",
    clabe: "987654321098765432",
    periodicidadPago: "05",
    departamento: "Ventas",
    puesto: "Ejecutiva de Ventas",
    numeroEmpleado: "002",
    subcontrataciones: [],
  },
];

// Componente Modal de Alerta
const AlertModal = ({ isOpen, onClose, title, message, type }: { isOpen: boolean; onClose: () => void; title: string; message: string; type: "success" | "error" | "warning" }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    if (type === "success") return <CheckCircle2 className="h-10 w-10 text-emerald-500" />;
    if (type === "error") return <X className="h-10 w-10 text-red-500" />;
    return <AlertCircle className="h-10 w-10 text-yellow-500" />;
  };

  const getBgColor = () => {
    if (type === "success") return "bg-emerald-500/20";
    if (type === "error") return "bg-red-500/20";
    return "bg-yellow-500/20";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-w-md w-full rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="p-6 text-center">
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${getBgColor()}`}>
            {getIcon()}
          </div>
          <h2 className="mb-2 text-xl font-bold text-[#0F172A]">{title}</h2>
          <p className="mb-6 text-[#64748B]">{message}</p>
          <button onClick={onClose} className="w-full rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md">Aceptar</button>
        </div>
      </div>
    </div>
  );
};

// Componente Modal de Confirmación
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-w-md w-full rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
            <AlertCircle className="h-10 w-10 text-amber-500" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-[#0F172A]">{title}</h2>
          <p className="mb-6 text-[#64748B]">{message}</p>
          <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 font-semibold text-[#0F172A] shadow-sm transition hover:bg-slate-50 hover:shadow-md">Cancelar</button>
            <button onClick={onConfirm} className="flex-1 rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md">Aceptar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal para agregar/editar grupo
const GrupoModal = ({ isOpen, onClose, onSave, editingGrupo, grupos }: { isOpen: boolean; onClose: () => void; onSave: (grupo: Grupo) => void; editingGrupo?: Grupo | null; grupos: Grupo[] }) => {
  const [nombre, setNombre] = useState(editingGrupo?.nombre || "");
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "success" as "success" | "error" | "warning" });

  const showAlert = (title: string, message: string, type: "success" | "error" | "warning") => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  const handleSubmit = () => {
    if (!nombre) {
      showAlert("Campo requerido", "El nombre del grupo es obligatorio", "error");
      return;
    }

    // Verificar si ya existe un grupo con el mismo nombre
    if (!editingGrupo && grupos.some(g => g.nombre.toLowerCase() === nombre.toLowerCase())) {
      showAlert("Error", "Ya existe un grupo con ese nombre", "error");
      return;
    }

    const newGrupo = {
      id: editingGrupo?.id || Date.now().toString(),
      nombre,
    };

    onSave(newGrupo);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative max-w-md w-full overflow-y-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E2E8F0] bg-white px-6 py-4">
          <h2 className="text-xl font-bold text-[#0F172A]">{editingGrupo ? "Editar Grupo" : "Nuevo Grupo"}</h2>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-slate-500 transition hover:border-[#E2E8F0] hover:bg-blue-50 hover:text-blue-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-slate-50 p-6">
          <div>
            <Label>Nombre del Grupo:</Label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Principal"
              className={inputStyle}
            />
          </div>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-4 border-t border-[#E2E8F0] bg-white px-6 py-4">
          <button onClick={onClose} className="rounded-xl border border-red-100 bg-red-50 px-6 py-2 font-semibold text-red-600 shadow-sm transition hover:bg-red-100 hover:shadow-md">Cancelar</button>
          <button onClick={handleSubmit} className="rounded-xl bg-blue-600 px-6 py-2 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md">Guardar</button>
        </div>
      </div>

      <AlertModal isOpen={alertModal.isOpen} onClose={() => setAlertModal({ ...alertModal, isOpen: false })} title={alertModal.title} message={alertModal.message} type={alertModal.type} />
    </div>
  );
};

// Modal para agregar/editar empleado
const EmpleadoModal = ({ isOpen, onClose, onSave, editingEmpleado, grupos, sucursales }: { isOpen: boolean; onClose: () => void; onSave: (empleado: any) => void; editingEmpleado?: Empleado | null; grupos: Grupo[]; sucursales: Sucursal[] }) => {
  // Datos básicos
  const [nombre, setNombre] = useState(editingEmpleado?.nombre || "");
  const [apellidoPaterno, setApellidoPaterno] = useState(editingEmpleado?.apellidoPaterno || "");
  const [apellidoMaterno, setApellidoMaterno] = useState(editingEmpleado?.apellidoMaterno || "");
  const [curp, setCurp] = useState(editingEmpleado?.curp || "");
  const [rfc, setRfc] = useState(editingEmpleado?.rfc || "");
  const [calle, setCalle] = useState(editingEmpleado?.calle || "");
  const [colonia, setColonia] = useState(editingEmpleado?.colonia || "");
  const [noExt, setNoExt] = useState(editingEmpleado?.noExt || "");
  const [noInt, setNoInt] = useState(editingEmpleado?.noInt || "");
  const [cp, setCp] = useState(editingEmpleado?.cp || "");
  const [localidad, setLocalidad] = useState(editingEmpleado?.localidad || "");
  const [municipio, setMunicipio] = useState(editingEmpleado?.municipio || "");
  const [estado, setEstado] = useState(editingEmpleado?.estado || "");
  const [email, setEmail] = useState(editingEmpleado?.email || "");
  const [grupo, setGrupo] = useState(editingEmpleado?.grupo || "");
  const [sucursal, setSucursal] = useState(editingEmpleado?.sucursal || "");
  const [salarioDiario, setSalarioDiario] = useState(editingEmpleado?.salarioDiario || "");
  
  // Campos condicionales
  const [tipoContrato, setTipoContrato] = useState(editingEmpleado?.tipoContrato || "");
  const [fechaInicioRelLaboral, setFechaInicioRelLaboral] = useState(editingEmpleado?.fechaInicioRelLaboral || "");
  const [salarioDiarioIntegrado, setSalarioDiarioIntegrado] = useState(editingEmpleado?.salarioDiarioIntegrado || "");
  const [noSeguridadSocial, setNoSeguridadSocial] = useState(editingEmpleado?.noSeguridadSocial || "");
  const [riesgoPuesto, setRiesgoPuesto] = useState(editingEmpleado?.riesgoPuesto || "");
  const [regimenContratacion, setRegimenContratacion] = useState(editingEmpleado?.regimenContratacion || "");
  const [tipoJornada, setTipoJornada] = useState(editingEmpleado?.tipoJornada || "");
  const [banco, setBanco] = useState(editingEmpleado?.banco || "");
  const [clabe, setClabe] = useState(editingEmpleado?.clabe || "");
  const [periodicidadPago, setPeriodicidadPago] = useState(editingEmpleado?.periodicidadPago || "");
  const [departamento, setDepartamento] = useState(editingEmpleado?.departamento || "");
  const [puesto, setPuesto] = useState(editingEmpleado?.puesto || "");
  const [numeroEmpleado, setNumeroEmpleado] = useState(editingEmpleado?.numeroEmpleado || "");
  
  // Subcontrataciones
  const [subcontrataciones, setSubcontrataciones] = useState<Subcontratacion[]>(editingEmpleado?.subcontrataciones || []);
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "success" as "success" | "error" | "warning" });

  const showAlert = (title: string, message: string, type: "success" | "error" | "warning") => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  // Determinar qué opciones de régimen mostrar según el tipo de contrato
  const getRegimenOptions = () => {
    const contratoValue = tipoContrato;
    if (contratoValue === "09" || contratoValue === "10" || contratoValue === "99") {
      return regimenContratacionOptions2;
    }
    return regimenContratacionOptions1;
  };

  // Determinar si mostrar campos condicionales (contratos del 1 al 8)
  const showConditionalFields = () => {
    const contratoValue = tipoContrato;
    return contratoValue && ["01", "02", "03", "04", "05", "06", "07", "08"].includes(contratoValue);
  };

  // Agregar subcontratación
  const addSubcontratacion = () => {
    setSubcontrataciones([...subcontrataciones, { id: Date.now().toString(), rfcEmpresa: "", porcentajeTiempo: "" }]);
  };

  // Eliminar subcontratación
  const removeSubcontratacion = (id: string) => {
    setSubcontrataciones(subcontrataciones.filter(s => s.id !== id));
  };

  // Actualizar subcontratación
  const updateSubcontratacion = (id: string, field: keyof Subcontratacion, value: string) => {
    setSubcontrataciones(subcontrataciones.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSubmit = () => {
    if (!nombre) {
      showAlert("Campo requerido", "El nombre(s) es obligatorio", "error");
      return;
    }
    if (!apellidoPaterno) {
      showAlert("Campo requerido", "El apellido paterno es obligatorio", "error");
      return;
    }
    if (!curp) {
      showAlert("Campo requerido", "La CURP es obligatoria", "error");
      return;
    }
    if (!rfc) {
      showAlert("Campo requerido", "El RFC es obligatorio", "error");
      return;
    }
    if (!email) {
      showAlert("Campo requerido", "El correo electrónico es obligatorio", "error");
      return;
    }
    if (!grupo) {
      showAlert("Campo requerido", "El grupo es obligatorio", "error");
      return;
    }
    if (!sucursal) {
      showAlert("Campo requerido", "La sucursal es obligatoria", "error");
      return;
    }
    if (!salarioDiario) {
      showAlert("Campo requerido", "El salario diario es obligatorio", "error");
      return;
    }
    if (!tipoContrato) {
      showAlert("Campo requerido", "El tipo de contrato es obligatorio", "error");
      return;
    }

    const newEmpleado = {
      id: editingEmpleado?.id || Date.now().toString(),
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      curp,
      rfc,
      calle,
      colonia,
      noExt,
      noInt,
      cp,
      localidad,
      municipio,
      estado,
      email,
      grupo,
      sucursal,
      salarioDiario,
      tipoContrato,
      fechaInicioRelLaboral: showConditionalFields() ? fechaInicioRelLaboral : "",
      salarioDiarioIntegrado: showConditionalFields() ? salarioDiarioIntegrado : "",
      noSeguridadSocial: showConditionalFields() ? noSeguridadSocial : "",
      riesgoPuesto: showConditionalFields() ? riesgoPuesto : "",
      regimenContratacion,
      tipoJornada,
      banco,
      clabe,
      periodicidadPago,
      departamento,
      puesto,
      numeroEmpleado,
      subcontrataciones,
    };

    onSave(newEmpleado);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E2E8F0] bg-white px-6 py-4">
          <h2 className="text-xl font-bold text-[#0F172A]">{editingEmpleado ? "Editar Empleado" : "Nuevo Empleado"}</h2>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-slate-500 transition hover:border-[#E2E8F0] hover:bg-blue-50 hover:text-blue-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-slate-50 p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div><Label>Nombre(s):</Label><input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre(s)" className={inputStyle} /></div>
            <div><Label>Apellido Paterno:</Label><input type="text" value={apellidoPaterno} onChange={(e) => setApellidoPaterno(e.target.value)} placeholder="Apellido Paterno" className={inputStyle} /></div>
            <div><Label>Apellido Materno:</Label><input type="text" value={apellidoMaterno} onChange={(e) => setApellidoMaterno(e.target.value)} placeholder="Apellido Materno" className={inputStyle} /></div>
            <div><Label>CURP:</Label><input type="text" value={curp} onChange={(e) => setCurp(e.target.value.toUpperCase())} placeholder="CURP" className={inputStyle} /></div>
            <div><Label>RFC:</Label><input type="text" value={rfc} onChange={(e) => setRfc(e.target.value.toUpperCase())} placeholder="RFC" className={inputStyle} /></div>
            <div><Label>Calle:</Label><input type="text" value={calle} onChange={(e) => setCalle(e.target.value)} placeholder="Calle" className={inputStyle} /></div>
            <div><Label>Colonia:</Label><input type="text" value={colonia} onChange={(e) => setColonia(e.target.value)} placeholder="Colonia" className={inputStyle} /></div>
            <div><Label>No. Ext:</Label><input type="text" value={noExt} onChange={(e) => setNoExt(e.target.value)} placeholder="No. Exterior" className={inputStyle} /></div>
            <div><Label>No. Int:</Label><input type="text" value={noInt} onChange={(e) => setNoInt(e.target.value)} placeholder="No. Interior" className={inputStyle} /></div>
            <div><Label>Código Postal:</Label><input type="text" value={cp} onChange={(e) => setCp(e.target.value)} placeholder="C.P." className={inputStyle} /></div>
            <div><Label>Localidad:</Label><input type="text" value={localidad} onChange={(e) => setLocalidad(e.target.value)} placeholder="Localidad" className={inputStyle} /></div>
            <div><Label>Municipio:</Label><input type="text" value={municipio} onChange={(e) => setMunicipio(e.target.value)} placeholder="Municipio" className={inputStyle} /></div>
            <div><Label>Estado:</Label><div className="relative"><select value={estado} onChange={(e) => setEstado(e.target.value)} className={`${selectStyle} appearance-none`}><option value="">Seleccione un estado</option>{mexicanStates.map((state) => (<option key={state} value={state}>{state}</option>))}</select><ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /></div></div>
            <div><Label>E-Mail:</Label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-Mail" className={inputStyle} /></div>
            <div><Label>Grupo:</Label><div className="relative"><select value={grupo} onChange={(e) => setGrupo(e.target.value)} className={`${selectStyle} appearance-none`}><option value="">Seleccione un grupo</option>{grupos.map((g) => (<option key={g.id} value={g.nombre}>{g.nombre}</option>))}</select><ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /></div></div>
            <div><Label>Sucursal:</Label><div className="relative"><select value={sucursal} onChange={(e) => setSucursal(e.target.value)} className={`${selectStyle} appearance-none`}><option value="">Seleccione una sucursal</option>{sucursales.map((s) => (<option key={s.id} value={s.nombre}>{s.nombre}</option>))}</select><ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /></div></div>
            <div><Label>Salario diario cuotas y aportaciones:</Label><input type="text" value={salarioDiario} onChange={(e) => setSalarioDiario(e.target.value)} placeholder="Ej. 500.00" className={inputStyle} /></div>
            <div><Label>Tipo de contrato:</Label><div className="relative"><select value={tipoContrato} onChange={(e) => setTipoContrato(e.target.value)} className={`${selectStyle} appearance-none`}>{tipoContratoOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}</select><ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /></div></div>
          </div>

          {/* Campos condicionales (para contratos 01-08) */}
          {showConditionalFields() && (
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div><Label>Inicio relación laboral:</Label><input type="date" value={fechaInicioRelLaboral} onChange={(e) => setFechaInicioRelLaboral(e.target.value)} className={inputStyle} /></div>
              <div><Label>Salario diario integrado:</Label><input type="text" value={salarioDiarioIntegrado} onChange={(e) => setSalarioDiarioIntegrado(e.target.value)} placeholder="Salario base" className={inputStyle} /></div>
              <div><Label>No. de Seguridad Social:</Label><input type="text" value={noSeguridadSocial} onChange={(e) => setNoSeguridadSocial(e.target.value)} placeholder="N° de Seguridad Social (Opcional)" className={inputStyle} /></div>
              <div><Label>Riesgo de puesto:</Label><div className="relative"><select value={riesgoPuesto} onChange={(e) => setRiesgoPuesto(e.target.value)} className={`${selectStyle} appearance-none`}>{riesgoPuestoOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}</select><ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /></div></div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div><Label>Régimen de contratación:</Label><div className="relative"><select value={regimenContratacion} onChange={(e) => setRegimenContratacion(e.target.value)} className={`${selectStyle} appearance-none`}>{getRegimenOptions().map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}</select><ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /></div></div>
            <div><Label>Tipo de jornada:</Label><div className="relative"><select value={tipoJornada} onChange={(e) => setTipoJornada(e.target.value)} className={`${selectStyle} appearance-none`}>{tipoJornadaOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}</select><ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /></div></div>
            <div><Label>Banco:</Label><div className="relative"><select value={banco} onChange={(e) => setBanco(e.target.value)} className={`${selectStyle} appearance-none`}>{bancosMexico.map((bank) => (<option key={bank} value={bank}>{bank}</option>))}</select><ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /></div></div>
            <div><Label>CLABE:</Label><input type="text" value={clabe} onChange={(e) => setClabe(e.target.value)} placeholder="CLABE Interbancaria (Opcional)" className={inputStyle} /></div>
            <div><Label>Periocidad de Pago:</Label><div className="relative"><select value={periodicidadPago} onChange={(e) => setPeriodicidadPago(e.target.value)} className={`${selectStyle} appearance-none`}>{periodicidadPagoOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}</select><ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /></div></div>
            <div><Label>Departamento:</Label><input type="text" value={departamento} onChange={(e) => setDepartamento(e.target.value)} placeholder="Departamento (Opcional)" className={inputStyle} /></div>
            <div><Label>Puesto:</Label><input type="text" value={puesto} onChange={(e) => setPuesto(e.target.value)} placeholder="Puesto (Opcional)" className={inputStyle} /></div>
            <div><Label>Número de Empleado:</Label><input type="text" value={numeroEmpleado} onChange={(e) => setNumeroEmpleado(e.target.value)} placeholder="No. de Empleado (de control interno)" className={inputStyle} /></div>
          </div>

          {/* Subcontratación */}
          <div className="mt-6">
            <h3 className="mb-2 text-md font-bold text-[#0F172A]">Opcional</h3>
            <div className="mb-3 flex items-center gap-4">
              <span className="text-sm text-[#64748B]">Subcontratación</span>
              <button type="button" onClick={addSubcontratacion} className="flex items-center gap-1 text-xs font-semibold text-blue-600 transition hover:text-blue-700"><Plus className="h-3 w-3" />Agregar</button>
              <button type="button" onClick={() => setSubcontrataciones([])} className="flex items-center gap-1 text-xs font-semibold text-red-600 transition hover:text-red-700"><Trash className="h-3 w-3" />Eliminar todos</button>
            </div>
            {subcontrataciones.map((sub, index) => (
              <div key={sub.id} className="flex gap-2 mt-2 items-center">
                <input type="text" value={sub.rfcEmpresa} onChange={(e) => updateSubcontratacion(sub.id, "rfcEmpresa", e.target.value)} placeholder="RFC Empresa/Persona Terceriza" className={`${inputStyle} flex-8`} />
                <input type="text" value={sub.porcentajeTiempo} onChange={(e) => updateSubcontratacion(sub.id, "porcentajeTiempo", e.target.value)} placeholder="% Tiempo" className={`${inputStyle} flex-1`} />
                <button type="button" onClick={() => removeSubcontratacion(sub.id)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-red-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:shadow-md" title="Eliminar">
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-4 border-t border-[#E2E8F0] bg-white px-6 py-4">
          <button onClick={onClose} className="rounded-xl border border-red-100 bg-red-50 px-6 py-2 font-semibold text-red-600 shadow-sm transition hover:bg-red-100 hover:shadow-md">Cancelar</button>
          <button onClick={handleSubmit} className="rounded-xl bg-blue-600 px-6 py-2 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md">Guardar</button>
        </div>
      </div>

      <AlertModal isOpen={alertModal.isOpen} onClose={() => setAlertModal({ ...alertModal, isOpen: false })} title={alertModal.title} message={alertModal.message} type={alertModal.type} />
    </div>
  );
};

// Componente para la sección de carga masiva
const BulkUploadSection = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg overflow-y-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E2E8F0] bg-white px-6 py-4">
          <h2 className="text-xl font-bold text-[#0F172A]">Carga Masiva de Empleados</h2>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-slate-500 transition hover:border-[#E2E8F0] hover:bg-blue-50 hover:text-blue-600"><X className="h-5 w-5" /></button>
        </div>
        <div className="bg-slate-50 p-6">
          <div className="mb-6 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <p className="text-sm leading-relaxed text-[#64748B]">
              Importa tu catálogo de empleados de forma masiva mediante un archivo .csv. 
              En el apartado de "Ejemplo de empleados" obtendrás la plantilla base y un 
              instructivo detallado para el correcto llenado de la información.
            </p>
          </div>
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button className="flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-[#0F172A] shadow-sm transition hover:bg-blue-50 hover:shadow-md"><FileText className="h-5 w-5 text-blue-600" /><span className="text-sm font-semibold">Ejemplo de empleados</span></button>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-[#0F172A] shadow-sm transition hover:bg-blue-50 hover:shadow-md"><Download className="h-5 w-5 text-blue-600" /><span className="text-sm font-semibold">Descargar .csv</span></button>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-[#0F172A] shadow-sm transition hover:bg-blue-50 hover:shadow-md"><Upload className="h-5 w-5 text-blue-600" /><span className="text-sm font-semibold">Subir archivo .csv</span></button>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-[#0F172A] shadow-sm transition hover:bg-blue-50 hover:shadow-md"><Activity className="h-5 w-5 text-blue-600" /><span className="text-sm font-semibold">Ver estado de los procesos</span></button>
          </div>
          <div className="flex justify-center">
            <button className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"><FileSpreadsheet className="h-5 w-5" />Procesar archivo</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Empleados() {
  const [empleados, setEmpleados] = useState<Empleado[]>(empleadosMock);
  const [grupos, setGrupos] = useState<Grupo[]>(gruposMock);
  const [sucursales] = useState<Sucursal[]>(sucursalesMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGrupoModalOpen, setIsGrupoModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState<Empleado | null>(null);
  const [editingGrupo, setEditingGrupo] = useState<Grupo | null>(null);
  const [selectedGrupo, setSelectedGrupo] = useState("");
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "success" as "success" | "error" | "warning" });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: () => {} });

  const showAlert = (title: string, message: string, type: "success" | "error" | "warning") => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModal({ isOpen: true, title, message, onConfirm });
  };

  // Filtrar empleados
  const filteredEmpleados = empleados.filter(emp =>
    `${emp.nombre} ${emp.apellidoPaterno} ${emp.apellidoMaterno}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.rfc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.numeroEmpleado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveEmpleado = (empleado: Empleado) => {
    const existingIndex = empleados.findIndex(e => e.id === empleado.id);
    if (existingIndex !== -1) {
      const updatedEmpleados = [...empleados];
      updatedEmpleados[existingIndex] = empleado;
      setEmpleados(updatedEmpleados);
      showAlert("Éxito", "Empleado actualizado correctamente", "success");
    } else {
      setEmpleados([...empleados, empleado]);
      showAlert("Éxito", "Empleado agregado correctamente", "success");
    }
    setIsModalOpen(false);
    setEditingEmpleado(null);
  };

  const handleSaveGrupo = (grupo: Grupo) => {
    const existingIndex = grupos.findIndex(g => g.id === grupo.id);
    if (existingIndex !== -1) {
      const updatedGrupos = [...grupos];
      updatedGrupos[existingIndex] = grupo;
      setGrupos(updatedGrupos);
      showAlert("Éxito", "Grupo actualizado correctamente", "success");
    } else {
      setGrupos([...grupos, grupo]);
      showAlert("Éxito", "Grupo agregado correctamente", "success");
    }
    setIsGrupoModalOpen(false);
    setEditingGrupo(null);
  };

  const handleEditGrupo = () => {
    if (!selectedGrupo) {
      showAlert("Selección requerida", "Seleccione primero un grupo", "warning");
      return;
    }
    const grupoToEdit = grupos.find(g => g.nombre === selectedGrupo);
    if (grupoToEdit) {
      setEditingGrupo(grupoToEdit);
      setIsGrupoModalOpen(true);
    }
  };

  const handleDeleteGrupo = () => {
    if (!selectedGrupo) {
      showAlert("Selección requerida", "Seleccione primero un grupo", "warning");
      return;
    }
    const grupoToDelete = grupos.find(g => g.nombre === selectedGrupo);
    if (grupoToDelete) {
      showConfirm("Confirmar eliminación", `¿Estás seguro de eliminar el grupo "${selectedGrupo}"?`, () => {
        setGrupos(grupos.filter(g => g.nombre !== selectedGrupo));
        setSelectedGrupo("");
        showAlert("Eliminado", `El grupo "${selectedGrupo}" ha sido eliminado`, "success");
        setConfirmModal({ ...confirmModal, isOpen: false });
      });
    }
  };

  const handleDeleteEmpleado = (id: string, nombre: string) => {
    showConfirm("Confirmar eliminación", `¿Estás seguro de eliminar al empleado "${nombre}"?`, () => {
      setEmpleados(empleados.filter(e => e.id !== id));
      showAlert("Eliminado", `El empleado "${nombre}" ha sido eliminado`, "success");
      setConfirmModal({ ...confirmModal, isOpen: false });
    });
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-50 p-6 text-[#0F172A]">
        <main className="mx-auto max-w-7xl space-y-6">
          <DemoNotice readOnly />
          <fieldset disabled className="contents">
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A]">Catálogo de Empleados</h1>
                <p className="mt-1 text-sm text-[#64748B]">Administra la información de tus empleados.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setIsBulkUploadOpen(true)} className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 hover:shadow-md">Carga masiva de empleados</button>
                <button onClick={() => { setEditingEmpleado(null); setIsModalOpen(true); }} className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md">Agregar empleado</button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-2xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94A3B8]" />
                <input type="text" placeholder="Buscar por nombre, RFC o número de empleado..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`${inputStyle} pl-11`} />
              </div>
              <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                <span className="text-sm font-semibold uppercase tracking-wide text-[#64748B]">Seleccionar un grupo</span>
                <div className="relative min-w-56">
                  <select value={selectedGrupo} onChange={(e) => setSelectedGrupo(e.target.value)} className={selectStyle}>
                    <option value="">Seleccione un grupo</option>
                    {grupos.map((g) => (<option key={g.id} value={g.nombre}>{g.nombre}</option>))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
                <button onClick={() => { setEditingGrupo(null); setIsGrupoModalOpen(true); }} className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E2E8F0] bg-blue-50 text-blue-600 shadow-sm transition hover:bg-blue-100 hover:shadow-md" title="Agregar grupo"><Plus className="h-5 w-5" /></button>
                <button onClick={handleEditGrupo} className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E2E8F0] bg-blue-50 text-blue-600 shadow-sm transition hover:bg-blue-100 hover:shadow-md" title="Editar grupo"><Pencil className="h-5 w-5" /></button>
                <button onClick={handleDeleteGrupo} className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E2E8F0] bg-red-50 text-red-600 shadow-sm transition hover:bg-red-100 hover:shadow-md" title="Eliminar grupo"><Trash className="h-5 w-5" /></button>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-4xl">
                <thead className="bg-slate-100 text-left text-xs uppercase tracking-[0.08em] text-slate-700"><tr><th className="px-6 py-4 font-semibold">Puesto</th><th className="px-6 py-4 font-semibold">Nombre del empleado</th><th className="px-6 py-4 font-semibold">RFC</th><th className="px-6 py-4 font-semibold">No. Seguridad Social</th><th className="px-6 py-4 font-semibold w-24">Acciones</th></tr></thead>
                <tbody className="divide-y divide-[#E2E8F0] bg-white">{filteredEmpleados.map((emp) => (<tr key={emp.id} className="text-[#0F172A] transition-colors hover:bg-blue-50"><td className="px-6 py-4 text-[#64748B]">{emp.puesto || "—"}</td><td className="px-6 py-4 font-semibold text-[#0F172A]">{`${emp.nombre} ${emp.apellidoPaterno} ${emp.apellidoMaterno}`}</td><td className="px-6 py-4 font-mono text-[#0F172A]">{emp.rfc}</td><td className="px-6 py-4 text-[#64748B]">{emp.noSeguridadSocial || "—"}</td><td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => { setEditingEmpleado(emp); setIsModalOpen(true); }} className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600 shadow-sm transition hover:bg-blue-100 hover:shadow-md" title="Editar"><Pencil className="h-4 w-4" /></button><button onClick={() => handleDeleteEmpleado(emp.id, `${emp.nombre} ${emp.apellidoPaterno}`)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 shadow-sm transition hover:bg-red-100 hover:shadow-md" title="Eliminar"><Trash className="h-4 w-4" /></button></div></td></tr>))}
                {filteredEmpleados.length === 0 && (<tr><td colSpan={5} className="px-6 py-16 text-center text-[#64748B]">No hay empleados registrados</td></tr>)}</tbody>
              </table>
            </div>
          </div>
          </fieldset>
        </main>
      </div>

      <EmpleadoModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingEmpleado(null); }} onSave={handleSaveEmpleado} editingEmpleado={editingEmpleado} grupos={grupos} sucursales={sucursales} />
      <GrupoModal isOpen={isGrupoModalOpen} onClose={() => { setIsGrupoModalOpen(false); setEditingGrupo(null); }} onSave={handleSaveGrupo} editingGrupo={editingGrupo} grupos={grupos} />
      <BulkUploadSection isOpen={isBulkUploadOpen} onClose={() => setIsBulkUploadOpen(false)} />
      <AlertModal isOpen={alertModal.isOpen} onClose={() => setAlertModal({ ...alertModal, isOpen: false })} title={alertModal.title} message={alertModal.message} type={alertModal.type} />
      <ConfirmModal isOpen={confirmModal.isOpen} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} onConfirm={confirmModal.onConfirm} title={confirmModal.title} message={confirmModal.message} />
    </AppLayout>
  );
}