"use client";

import React, { useState, useEffect, useRef } from "react";
import AppLayout from "@/app/components/layout/AppLayout";
import {
  ChevronDown,
  Download,
  Info,
  Loader2,
  CheckCircle2,
  X,
  AlertCircle,
  FileText,
  FileSpreadsheet,
  Mail,
  Copy,
  Ban,
  Printer,
  ChevronUp,
  Send,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const selectStyle =
  "box box-input";

const inputStyle =
  "box box-input";

type LabelProps = {
  children: React.ReactNode;
  withInfo?: boolean;
  infoText?: string;
};

function Label({ children, withInfo = false, infoText = "" }: LabelProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className=" flex items-center gap-1">
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

// Opciones de meses (nombres abreviados)
const mesesOptions = [
  { value: "01", label: "Ene" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Abr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Ago" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dic" },
];

// Opciones de sucursales
const sucursalesOptions = [
  { value: "principal", label: "Principal" },
  { value: "sucursal_norte", label: "Sucursal Norte" },
  { value: "sucursal_sur", label: "Sucursal Sur" },
  { value: "sucursal_este", label: "Sucursal Este" },
  { value: "sucursal_oeste", label: "Sucursal Oeste" },
];

// Opciones de Tipo Comprobante
const tipoComprobanteOptions = [
  { value: "todos", label: "Todos" },
  { value: "factura", label: "Factura" },
  { value: "egreso", label: "Egreso" },
  { value: "pago", label: "Pago" },
];

// Opciones de Status
const statusOptions = [
  { value: "todas", label: "Todas" },
  { value: "activas", label: "Activas" },
  { value: "canceladas", label: "Canceladas" },
  { value: "pendientes", label: "Pendientes" },
  { value: "sin_respuesta", label: "Sin Respuesta SAT" },
];

// Opciones de Método de pago
const metodoPagoOptions = [
  { value: "todos", label: "Todos" },
  { value: "ppd", label: "PPD" },
  { value: "pue", label: "PUE" },
];

// Tipos de factura para filtrar resultados
const tiposFactura = [
  { id: "emitidas", label: "Emitidas", icon: <FileText className="h-4 w-4" /> },
  { id: "recibidas", label: "Recibidas", icon: <FileText className="h-4 w-4" /> },
  { id: "nominas", label: "Nóminas", icon: <FileText className="h-4 w-4" /> },
  { id: "retenciones", label: "Retenciones", icon: <FileText className="h-4 w-4" /> },
];

// Tipo para Factura
type Factura = {
  id: string;
  folio: string;
  fecha: string;
  receptor: string;
  rfc: string;
  total: number;
  status: "enviado" | "pendiente" | "cancelada";
  tipo: string;
  xml?: string;
  pdf?: string;
};

// Datos simulados de facturas
const facturasMock: Factura[] = [
  {
    id: "1",
    folio: "FAC-001",
    fecha: "2025-01-15",
    receptor: "Juan Pérez García",
    rfc: "PEGJ800101XYZ",
    total: 12500.00,
    status: "enviado",
    tipo: "emitidas",
  },
  {
    id: "2",
    folio: "FAC-002",
    fecha: "2025-01-20",
    receptor: "María López Hernández",
    rfc: "LOHM850202XYZ",
    total: 8500.00,
    status: "enviado",
    tipo: "emitidas",
  },
  {
    id: "3",
    folio: "FAC-003",
    fecha: "2025-01-25",
    receptor: "Constructora Integral SA de CV",
    rfc: "CIN506812S34",
    total: 32500.00,
    status: "pendiente",
    tipo: "emitidas",
  },
  {
    id: "4",
    folio: "FAC-004",
    fecha: "2025-01-28",
    receptor: "Carlos Méndez Ruiz",
    rfc: "MERC850101XYZ",
    total: 4500.00,
    status: "cancelada",
    tipo: "emitidas",
  },
  {
    id: "5",
    folio: "NOM-001",
    fecha: "2025-01-31",
    receptor: "Laura Gómez Silva",
    rfc: "GOSL850101XYZ",
    total: 18500.00,
    status: "enviado",
    tipo: "nominas",
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
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-w-md w-full rounded-2xl border border-[#173156] bg-[#071321] shadow-2xl">
        <div className="p-6 text-center">
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${getBgColor()}`}>
            {getIcon()}
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
          <p className="text-slate-400 mb-6">{message}</p>
          <button onClick={onClose} className="w-full rounded-xl bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-400">Aceptar</button>
        </div>
      </div>
    </div>
  );
};

// Modal para enviar factura
const EnviarFacturaModal = ({ isOpen, onClose, onSend, facturaFolio, isMultiple = false }: { isOpen: boolean; onClose: () => void; onSend: (email1: string, email2: string, subject: string, message: string) => void; facturaFolio?: string; isMultiple?: boolean }) => {
  const [email1, setEmail1] = useState("");
  const [email2, setEmail2] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "success" as "success" | "error" | "warning" });

  const showAlert = (title: string, message: string, type: "success" | "error" | "warning") => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  const handleSubmit = () => {
    if (!email1) {
      showAlert("Campo requerido", "El correo 1 es obligatorio", "error");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email1)) {
      showAlert("Correo inválido", "Ingrese un correo electrónico válido", "error");
      return;
    }
    if (email2 && !emailRegex.test(email2)) {
      showAlert("Correo inválido", "Ingrese un correo electrónico válido en Correo 2", "error");
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      onSend(email1, email2, subject, message);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-w-md w-full overflow-y-auto rounded-2xl border border-[#173156] bg-[#071321] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#173156] bg-[#071321] px-6 py-4">
          <h2 className="text-xl font-bold text-white">
            {isMultiple ? "Enviar Varias Facturas" : `Enviar Factura ${facturaFolio ? `- ${facturaFolio}` : ""}`}
          </h2>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-[#0d1b35] hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          <div><Label>Correo 1:</Label><input type="email" value={email1} onChange={(e) => setEmail1(e.target.value)} placeholder="correo@ejemplo.com" className={inputStyle} /></div>
          <div><Label>Correo 2 <span className="text-slate-500 text-xs">(Opcional)</span>:</Label><input type="email" value={email2} onChange={(e) => setEmail2(e.target.value)} placeholder="correo@ejemplo.com" className={inputStyle} /></div>
          <div><Label>Asunto <span className="text-slate-500 text-xs">(Opcional)</span>:</Label><input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Asunto del correo" className={inputStyle} /></div>
          <div><Label>Mensaje <span className="text-slate-500 text-xs">(Opcional)</span>:</Label><textarea value={message} onChange={(e) => setMessage(e.target.value.slice(0, 500))} placeholder="Escribe tu mensaje aquí..." rows={3} maxLength={500} className="w-full rounded-xl border-2 border-[#1e293b] bg-[#081423] px-4 py-3 text-white outline-none focus:border-blue-500/60 resize-none" /><p className="text-xs text-slate-500 mt-1 text-right">{message.length}/500 caracteres</p></div>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-4 border-t border-[#173156] bg-[#071321] px-6 py-4">
          <button onClick={onClose} className="rounded-xl bg-red-500 px-6 py-2 font-medium text-white shadow-[0_10px_30px_rgba(255,0,0,0.25)] hover:bg-red-400">Cancelar</button>
          <button onClick={handleSubmit} disabled={isSending} className="rounded-xl bg-blue-500 px-6 py-2 font-medium text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] hover:bg-blue-400 disabled:opacity-50">
            {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Enviar"}
          </button>
        </div>
      </div>

      <AlertModal isOpen={alertModal.isOpen} onClose={() => setAlertModal({ ...alertModal, isOpen: false })} title={alertModal.title} message={alertModal.message} type={alertModal.type} />
    </div>
  );
};

// Componente de menú desplegable para el botón Enviar
const EnviarDropdown = ({ onEnviarUna, onEnviarVarias }: { onEnviarUna: () => void; onEnviarVarias: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#0d1b35] transition-colors"
        title="Enviar"
      >
        <Mail className="h-5 w-5" /> Enviar <ChevronDown className="h-4 w-4" />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-56 rounded-xl border border-[#173156] bg-[#0a1424] shadow-xl overflow-hidden z-50">
          <button
            onClick={() => {
              onEnviarUna();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-white hover:bg-[#0d1b35] transition-colors flex items-center gap-2"
          >
            <Mail className="h-4 w-4 text-blue-400" />
            Enviar esta Factura
          </button>
          <button
            onClick={() => {
              onEnviarVarias();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-white hover:bg-[#0d1b35] transition-colors flex items-center gap-2 border-t border-[#173156]"
          >
            <Send className="h-4 w-4 text-emerald-400" />
            Enviar Varias Facturas
          </button>
        </div>
      )}
    </div>
  );
};

// Componente selector de año con botones
const YearSelector = ({ selectedYear, onChange }: { selectedYear: string; onChange: (year: string) => void }) => {
  const anioActual = new Date().getFullYear();
  const minYear = anioActual - 5;
  const maxYear = anioActual + 5;

  const incrementYear = () => {
    const newYear = parseInt(selectedYear) + 1;
    if (newYear <= maxYear) {
      onChange(newYear.toString());
    }
  };

  const decrementYear = () => {
    const newYear = parseInt(selectedYear) - 1;
    if (newYear >= minYear) {
      onChange(newYear.toString());
    }
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-bold uppercase tracking-wide text-slate-400">Año:</span>
      <div className="flex items-center gap-2 bg-transparent">
        <button
          onClick={decrementYear}
          disabled={parseInt(selectedYear) <= minYear}
          className="p-1 rounded-md text-slate-400 hover:text-blue-400 hover:bg-transparent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-2xl font-bold text-white min-w-[80px] text-center tabular-nums">
          {selectedYear}
        </span>
        <button
          onClick={incrementYear}
          disabled={parseInt(selectedYear) >= maxYear}
          className="p-1 rounded-md text-slate-400 hover:text-blue-400 hover:bg-transparent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default function ConsultaFacturas() {
  // Estados para el selector de año y mes
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState("");
  
  // Estados para los filtros
  const [lugarExpedicion, setLugarExpedicion] = useState("");
  const [rfc, setRfc] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [folio, setFolio] = useState("");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [tipoComprobante, setTipoComprobante] = useState("todos");
  const [status, setStatus] = useState("todas");
  const [metodoPago, setMetodoPago] = useState("todos");
  const [fechaInicial, setFechaInicial] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  
  // Estado para el tipo de factura seleccionado (Emitidas, Recibidas, Nóminas, Retenciones)
  const [tipoFacturaSeleccionado, setTipoFacturaSeleccionado] = useState("nominas");
  
  // Estado para las facturas
  const [facturas, setFacturas] = useState<Factura[]>(facturasMock);
  const [facturasFiltradas, setFacturasFiltradas] = useState<Factura[]>(facturasMock);
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  
  // Estado para selección múltiple de facturas
  const [selectedFacturasIds, setSelectedFacturasIds] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  
  // Estado para el modal de envío
  const [isEnviarModalOpen, setIsEnviarModalOpen] = useState(false);
  const [enviarMultiple, setEnviarMultiple] = useState(false);
  
  // Estado para loader y alerta
  const [isLoading, setIsLoading] = useState(false);
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "success" as "success" | "error" | "warning" });

  const showAlert = (title: string, message: string, type: "success" | "error" | "warning") => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  // Filtrar facturas según los criterios
  const handleBuscar = () => {
    setIsLoading(true);
    setTimeout(() => {
      let filtered = [...facturas];
      
      if (selectedMonth) {
        filtered = filtered.filter(f => f.fecha.split("-")[1] === selectedMonth);
      }
      if (selectedYear) {
        filtered = filtered.filter(f => f.fecha.split("-")[0] === selectedYear);
      }
      if (lugarExpedicion) {
        // Filtrar por sucursal (simulado)
      }
      if (rfc) {
        filtered = filtered.filter(f => f.rfc.toLowerCase().includes(rfc.toLowerCase()));
      }
      if (razonSocial) {
        filtered = filtered.filter(f => f.receptor.toLowerCase().includes(razonSocial.toLowerCase()));
      }
      if (folio) {
        filtered = filtered.filter(f => f.folio.toLowerCase().includes(folio.toLowerCase()));
      }
      if (tipoComprobante !== "todos") {
        // Filtrar por tipo de comprobante
      }
      if (status !== "todas") {
        filtered = filtered.filter(f => f.status === status);
      }
      if (fechaInicial) {
        filtered = filtered.filter(f => f.fecha >= fechaInicial);
      }
      if (fechaFinal) {
        filtered = filtered.filter(f => f.fecha <= fechaFinal);
      }
      
      // Filtrar por tipo de factura (Emitidas, Recibidas, Nóminas, Retenciones)
      filtered = filtered.filter(f => f.tipo === tipoFacturaSeleccionado);
      
      setFacturasFiltradas(filtered);
      setIsLoading(false);
      showAlert("Búsqueda completada", `Se encontraron ${filtered.length} facturas`, "success");
    }, 1000);
  };

  // Filtrar por tipo de factura (Emitidas, Recibidas, Nóminas, Retenciones)
  const filtrarPorTipoFactura = (tipo: string) => {
    setTipoFacturaSeleccionado(tipo);
    const filtered = facturas.filter(f => f.tipo === tipo);
    setFacturasFiltradas(filtered);
  };

  // Seleccionar factura para ver detalle
  const handleSelectFactura = (factura: Factura) => {
    setSelectedFactura(factura);
  };

  // Toggle selección de factura para envío múltiple
  const toggleSelectFactura = (id: string) => {
    if (selectedFacturasIds.includes(id)) {
      setSelectedFacturasIds(selectedFacturasIds.filter(i => i !== id));
    } else {
      setSelectedFacturasIds([...selectedFacturasIds, id]);
    }
  };

  // Abrir modal de envío para una factura
  const handleEnviarUna = () => {
    if (selectedFactura) {
      setEnviarMultiple(false);
      setIsEnviarModalOpen(true);
    }
  };

  // Activar modo selección múltiple
  const handleEnviarVarias = () => {
    setIsSelectMode(true);
    setSelectedFacturasIds([]);
  };

  // Enviar facturas seleccionadas
  const handleEnviarSeleccionadas = () => {
    if (selectedFacturasIds.length === 0) {
      showAlert("Selección requerida", "Seleccione al menos una factura para enviar", "warning");
      return;
    }
    setEnviarMultiple(true);
    setIsEnviarModalOpen(true);
  };

  // Cancelar modo selección
  const cancelarSeleccionMultiple = () => {
    setIsSelectMode(false);
    setSelectedFacturasIds([]);
  };

  // Función de envío
  const handleSend = (email1: string, email2: string, subject: string, message: string) => {
    if (enviarMultiple) {
      showAlert("Facturas enviadas", `Se enviaron ${selectedFacturasIds.length} facturas a ${email1}`, "success");
      setIsSelectMode(false);
      setSelectedFacturasIds([]);
    } else {
      showAlert("Factura enviada", `La factura ${selectedFactura?.folio} ha sido enviada a ${email1}`, "success");
    }
    setIsEnviarModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "enviado": return "border-emerald-500 bg-emerald-500/10";
      case "pendiente": return "border-yellow-500 bg-yellow-500/10";
      case "cancelada": return "border-red-500 bg-red-500/10";
      default: return "border-slate-500 bg-slate-500/10";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "enviado": return "Enviado";
      case "pendiente": return "Pendiente";
      case "cancelada": return "Cancelada";
      default: return "Desconocido";
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#071321] text-white">
        <main className="mx-auto max-w-[1400px]">
          <div className="mb-4">
            <h1 className="text-3xl font-extrabold text-white">Búsqueda de facturas</h1>
            <p className="mt-2 text-slate-400">Consulta y gestiona tus comprobantes fiscales.</p>
          </div>

          {/* Selector de año y meses - Todo al mismo nivel */}
          <div className="flex flex-wrap items-center gap-6 mb-6">
            <YearSelector selectedYear={selectedYear} onChange={setSelectedYear} />
            
            <div className="h-8 w-px bg-[#16304f]" />
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold uppercase tracking-wide text-slate-400">Mes:</span>
              <div className="flex flex-wrap gap-2">
                {mesesOptions.map((mes) => (
                  <button
                    key={mes.value}
                    onClick={() => setSelectedMonth(selectedMonth === mes.value ? "" : mes.value)}
                    className={`min-w-[56px] px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      selectedMonth === mes.value
                        ? "bg-blue-500 text-white shadow-[0_5px_15px_rgba(37,99,235,0.25)]"
                        : "bg-[#0d1b35] border border-[#173156] text-slate-300 hover:bg-[#16233b] hover:border-[#3c83f666]"
                    }`}
                  >
                    {mes.label}
                  </button>
                ))}
              </div>
              {selectedMonth && (
                <button
                  onClick={() => setSelectedMonth("")}
                  className="ml-2 rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Filtros de búsqueda */}
          <div className="rounded-2xl border-2 border-[#16304f] bg-[#09172b] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.01)] mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <Label>Lugar de expedición:</Label>
                <div className="relative">
                  <select
                    value={lugarExpedicion}
                    onChange={(e) => setLugarExpedicion(e.target.value)}
                    className={`${selectStyle} appearance-none`}
                  >
                    <option value="">Seleccione sucursal</option>
                    {sucursalesOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div>
                <Label>RFC:</Label>
                <input type="text" value={rfc} onChange={(e) => setRfc(e.target.value)} placeholder="RFC" className={inputStyle} />
              </div>
              <div>
                <Label>Razón Social:</Label>
                <input type="text" value={razonSocial} onChange={(e) => setRazonSocial(e.target.value)} placeholder="Razón Social" className={inputStyle} />
              </div>
              <div>
                <Label>Folio:</Label>
                <input type="text" value={folio} onChange={(e) => setFolio(e.target.value)} placeholder="Folio" className={inputStyle} />
              </div>
            </div>

            {/* Botón Más filtros */}
            <div className="mt-4">
              <button
                onClick={() => setShowMoreFilters(!showMoreFilters)}
                className="flex items-center gap-2 text-[15px] font-semibold text-[#1d9bf0] hover:opacity-90 transition-opacity"
              >
                {showMoreFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {showMoreFilters ? "Menos filtros" : "Más filtros"}
              </button>
            </div>

            {/* Más filtros */}
            {showMoreFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 pt-6 border-t border-[#16304f]">
                <div>
                  <Label>Tipo Comprobante:</Label>
                  <div className="relative">
                    <select
                      value={tipoComprobante}
                      onChange={(e) => setTipoComprobante(e.target.value)}
                      className={`${selectStyle} appearance-none`}
                    >
                      {tipoComprobanteOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div>
                  <Label>Status:</Label>
                  <div className="relative">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className={`${selectStyle} appearance-none`}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div>
                  <Label>Método de pago:</Label>
                  <div className="relative">
                    <select
                      value={metodoPago}
                      onChange={(e) => setMetodoPago(e.target.value)}
                      className={`${selectStyle} appearance-none`}
                    >
                      {metodoPagoOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div>
                  <Label>Fecha inicial:</Label>
                  <input type="date" value={fechaInicial} onChange={(e) => setFechaInicial(e.target.value)} className={inputStyle} />
                </div>
                <div>
                  <Label>Fecha final:</Label>
                  <input type="date" value={fechaFinal} onChange={(e) => setFechaFinal(e.target.value)} className={inputStyle} />
                </div>
              </div>
            )}

            {/* Botón Buscar */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleBuscar}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-8 py-3 font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition-all duration-200 hover:bg-blue-400 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                Buscar
              </button>
            </div>
          </div>

          {/* Contenedores de resultados y detalle */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contenedor izquierdo - Lista de facturas */}
            <div className="rounded-2xl border-2 border-[#16304f] bg-[#09172b] overflow-hidden">
              {/* Botones de tipo de factura */}
              <div className="flex border-b border-[#16304f] bg-[#0a1424]">
                {tiposFactura.map((tipo) => (
                  <button
                    key={tipo.id}
                    onClick={() => filtrarPorTipoFactura(tipo.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-all duration-200 ${
                      tipoFacturaSeleccionado === tipo.id
                        ? "text-blue-400 border-b-2 border-blue-400 bg-blue-500/5"
                        : "text-slate-400 hover:text-white hover:bg-[#0d1b35]"
                    }`}
                  >
                    {tipo.icon}
                    {tipo.label}
                  </button>
                ))}
              </div>

              {/* Modo selección múltiple */}
              {isSelectMode && (
                <div className="flex items-center justify-between p-4 bg-[#0d1b35] border-b border-[#173156]">
                  <span className="text-sm text-slate-300">
                    {selectedFacturasIds.length} factura(s) seleccionada(s)
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={cancelarSeleccionMultiple}
                      className="px-4 py-1 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleEnviarSeleccionadas}
                      className="px-4 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-sm hover:bg-blue-500/20 transition-colors"
                    >
                      Enviar seleccionadas
                    </button>
                  </div>
                </div>
              )}

              {/* Lista de facturas */}
              <div className="divide-y divide-[#16304f] max-h-[600px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                  </div>
                ) : facturasFiltradas.length === 0 ? (
                  <div className="text-center py-20 text-slate-400">
                    No se encontraron facturas
                  </div>
                ) : (
                  facturasFiltradas.map((factura) => (
                    <div
                      key={factura.id}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedFactura?.id === factura.id ? "bg-[#0d1b35]" : "hover:bg-[#0d1b35]"
                      } ${getStatusColor(factura.status)} border-l-4`}
                      onClick={() => handleSelectFactura(factura)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {isSelectMode && (
                              <input
                                type="checkbox"
                                checked={selectedFacturasIds.includes(factura.id)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  toggleSelectFactura(factura.id);
                                }}
                                className="w-4 h-4 rounded border-2 border-[#1e293b] text-blue-500 checked:bg-blue-500"
                              />
                            )}
                            <span className="font-bold text-white">{factura.folio}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              factura.status === "enviado" ? "bg-emerald-500/20 text-emerald-400" :
                              factura.status === "pendiente" ? "bg-yellow-500/20 text-yellow-400" :
                              "bg-red-500/20 text-red-400"
                            }`}>
                              {getStatusText(factura.status)}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400">Fecha: {factura.fecha}</p>
                          <p className="text-sm text-slate-400">Receptor: {factura.receptor}</p>
                          <p className="text-sm text-slate-400">RFC: {factura.rfc}</p>
                          <p className="text-lg font-bold text-emerald-400 mt-2">${factura.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Contenedor derecho - Detalle de factura */}
            <div className="rounded-2xl border-2 border-[#16304f] bg-[#09172b] overflow-hidden">
              <div className="border-b border-[#16304f] p-4 bg-[#0a1424]">
                <h3 className="text-lg font-bold text-white">Detalle de factura</h3>
              </div>

              {selectedFactura ? (
                <>
                  {/* Botones de acción con menú desplegable en Enviar */}
                  <div className="flex flex-wrap gap-2 p-4 border-b border-[#16304f] bg-[#0a1424]">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#0d1b35] transition-colors" title="PDF">
                      <FileText className="h-5 w-5" /> PDF
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#0d1b35] transition-colors" title="XML">
                      <FileSpreadsheet className="h-5 w-5" /> XML
                    </button>
                    
                    {/* Botón Enviar con menú desplegable */}
                    <EnviarDropdown onEnviarUna={handleEnviarUna} onEnviarVarias={handleEnviarVarias} />
                    
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#0d1b35] transition-colors" title="Duplicar">
                      <Copy className="h-5 w-5" /> Duplicar
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#0d1b35] transition-colors" title="Cancelar">
                      <Ban className="h-5 w-5" /> Cancelar
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#0d1b35] transition-colors" title="Imprimir">
                      <Printer className="h-5 w-5" /> Imprimir
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#0d1b35] transition-colors" title="Descargar">
                      <Download className="h-5 w-5" /> Descargar
                    </button>
                  </div>

                  {/* Detalle de la factura */}
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div><p className="text-sm text-slate-400">Folio</p><p className="text-white font-bold">{selectedFactura.folio}</p></div>
                      <div><p className="text-sm text-slate-400">Fecha</p><p className="text-white">{selectedFactura.fecha}</p></div>
                      <div className="col-span-2"><p className="text-sm text-slate-400">Receptor</p><p className="text-white">{selectedFactura.receptor}</p></div>
                      <div><p className="text-sm text-slate-400">RFC</p><p className="text-white">{selectedFactura.rfc}</p></div>
                      <div><p className="text-sm text-slate-400">Total</p><p className="text-xl font-bold text-emerald-400">${selectedFactura.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p></div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <FileText className="h-16 w-16 mb-4 opacity-50" />
                  <p>Selecciona una factura para ver el detalle</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal de envío */}
      <EnviarFacturaModal
        isOpen={isEnviarModalOpen}
        onClose={() => setIsEnviarModalOpen(false)}
        onSend={handleSend}
        facturaFolio={selectedFactura?.folio}
        isMultiple={enviarMultiple}
      />

      {/* Modal de alerta */}
      <AlertModal isOpen={alertModal.isOpen} onClose={() => setAlertModal({ ...alertModal, isOpen: false })} title={alertModal.title} message={alertModal.message} type={alertModal.type} />
    </AppLayout>
  );
}