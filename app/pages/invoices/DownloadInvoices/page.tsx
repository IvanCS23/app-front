"use client";

import React, { useState, useEffect, useRef } from "react";
import AppLayout from "@/app/components/layout/AppLayout";
import DemoNotice, { DEMO_ACTION_CLASS, demoActionProps } from "@/app/components/ui/DemoNotice";
import {
  ChevronDown,
  Info,
  Loader2,
  CheckCircle2,
  X,
  AlertCircle,
  Download,
  FileText,
  Clock,
  Calendar,
  FileArchive,
  Mail,
  Search,
  Filter,
  ChevronUp,
} from "lucide-react";

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
      <label className="text-sm font-bold uppercase tracking-wide text-[#0F172A]">
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
            <div className="absolute bottom-full left-0 mb-2 z-50 w-80 rounded-lg bg-white border border-[#E2E8F0] p-2 text-xs text-[#475569] shadow-lg">
              {infoText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Componente Toast
const Toast = ({ message, type, onClose }: { message: string; type: "success" | "error" | "warning"; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    if (type === "success") return <CheckCircle2 className="h-5 w-5" />;
    if (type === "error") return <X className="h-5 w-5" />;
    return <AlertCircle className="h-5 w-5" />;
  };

  const getBgColor = () => {
    if (type === "success") return "bg-emerald-500";
    if (type === "error") return "bg-red-500";
    return "bg-yellow-500";
  };

  return (
    <div className={`fixed bottom-4 right-4 z-[100] flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg animate-in slide-in-from-right-5 duration-300 ${getBgColor()} text-white`}>
      {getIcon()}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

// Modal de alerta
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
      <div className="relative max-w-md w-full rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
        <div className="p-6 text-center">
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${getBgColor()}`}>
            {getIcon()}
          </div>
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">{title}</h2>
          <p className="text-[#64748B] mb-6">{message}</p>
          <button onClick={onClose} className="w-full rounded-xl bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-400">Aceptar</button>
        </div>
      </div>
    </div>
  );
};

// Opciones de filtro de fechas
const filtroFechasOptions = [
  { value: "por_fechas", label: "Por Fechas" },
  { value: "por_folios", label: "Por Folios" },
  { value: "por_mes", label: "Por Mes" },
];

// Opciones de tipo de factura
const tipoFacturaOptions = [
  { value: "emitidas", label: "Emitidas" },
  { value: "nominas", label: "Nóminas" },
  { value: "recibidas", label: "Recibidas" },
];

// Opciones de tipo de formato
const tipoFormatoOptions = [
  { value: "xml", label: "XML" },
  { value: "pdf", label: "PDF" },
  { value: "xml_pdf", label: "XML y PDF" },
];

// Opciones de años
const getYearsOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 1; i++) {
    years.push({ value: i.toString(), label: i.toString() });
  }
  return years;
};

// Opciones de meses
const mesesOptions = [
  { value: "01", label: "Enero" },
  { value: "02", label: "Febrero" },
  { value: "03", label: "Marzo" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Mayo" },
  { value: "06", label: "Junio" },
  { value: "07", label: "Julio" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

// Tipo para registro de historial de descargas
type HistorialDescarga = {
  id: string;
  tipo: string;
  filtro: string;
  mensaje: string;
  procesados: number;
  inicio: string;
  fin: string;
  conceptoDescarga: string;
  archivo: string;
  status: "pending" | "processing" | "completed" | "error";
};

// Historial simulado
const historialMock: HistorialDescarga[] = [
  {
    id: "1",
    tipo: "Emitidas",
    filtro: "Sin filtro",
    mensaje: "Proceso finalizado.",
    procesados: 3,
    inicio: "24/03/2026 01:51:06 p. m.",
    fin: "24/03/2026 01:51:13 p. m.",
    conceptoDescarga: "febrero 2025",
    archivo: "Periodo_02_2025.zip",
    status: "completed",
  },
  {
    id: "2",
    tipo: "Recibidas",
    filtro: "Por Fechas",
    mensaje: "Proceso finalizado.",
    procesados: 15,
    inicio: "25/03/2026 10:30:00 a. m.",
    fin: "25/03/2026 10:31:15 a. m.",
    conceptoDescarga: "01/01/2025 - 31/01/2025",
    archivo: "Facturas_Enero_2025.zip",
    status: "completed",
  },
  {
    id: "3",
    tipo: "Nóminas",
    filtro: "Por Mes",
    mensaje: "Proceso finalizado.",
    procesados: 8,
    inicio: "26/03/2026 02:15:30 p. m.",
    fin: "26/03/2026 02:16:45 p. m.",
    conceptoDescarga: "marzo 2026",
    archivo: "Nominas_03_2026.zip",
    status: "completed",
  },
];

export default function DescargaFacturas() {
  // Estados para los filtros
  const [filtroFechas, setFiltroFechas] = useState("por_fechas");
  const [tipoFactura, setTipoFactura] = useState("emitidas");
  const [tipoFormato, setTipoFormato] = useState("xml_pdf");
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [rfcFilter, setRfcFilter] = useState("");
  const [recibirEmail, setRecibirEmail] = useState(false);

  // Estados para Por Fechas
  const [fechaInicial, setFechaInicial] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");

  // Estados para Por Folios
  const [folioInicial, setFolioInicial] = useState("");
  const [folioFinal, setFolioFinal] = useState("");

  // Estados para Por Mes
  const [mesSeleccionado, setMesSeleccionado] = useState("");
  const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear().toString());

  // Estado para procesamiento
  const [isProcessing, setIsProcessing] = useState(false);

  // Estado para historial
  const [historial, setHistorial] = useState<HistorialDescarga[]>(historialMock);

  // Estados para modales y toast
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "success" as "success" | "error" | "warning" });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" } | null>(null);

  const showAlert = (title: string, message: string, type: "success" | "error" | "warning") => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  const showToast = (message: string, type: "success" | "error" | "warning") => {
    setToast({ message, type });
  };

  // Obtener el concepto de descarga según el filtro seleccionado
  const getConceptoDescarga = () => {
    switch (filtroFechas) {
      case "por_fechas":
        return fechaInicial && fechaFinal ? `${fechaInicial} al ${fechaFinal}` : "Rango de fechas";
      case "por_folios":
        return folioInicial && folioFinal ? `Folios ${folioInicial} al ${folioFinal}` : "Rango de folios";
      case "por_mes":
        const mesLabel = mesesOptions.find(m => m.value === mesSeleccionado)?.label || "";
        return mesSeleccionado && anioSeleccionado ? `${mesLabel} ${anioSeleccionado}` : "Período mensual";
      default:
        return "Sin filtro";
    }
  };

  // Obtener el nombre del archivo
  const getNombreArchivo = () => {
    const tipo = tipoFacturaOptions.find(t => t.value === tipoFactura)?.label || "Facturas";
    const fecha = new Date();
    const timestamp = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}_${fecha.getHours().toString().padStart(2, '0')}${fecha.getMinutes().toString().padStart(2, '0')}${fecha.getSeconds().toString().padStart(2, '0')}`;
    return `${tipo}_${timestamp}.zip`;
  };

  // Obtener el texto del filtro para el historial
  const getFiltroTexto = () => {
    switch (filtroFechas) {
      case "por_fechas":
        return "Por Fechas";
      case "por_folios":
        return "Por Folios";
      case "por_mes":
        return "Por Mes";
      default:
        return "Sin filtro";
    }
  };

  // Validar si se puede generar
  const canGenerate = () => {
    if (filtroFechas === "por_fechas" && (!fechaInicial || !fechaFinal)) {
      showAlert("Campos incompletos", "Debes seleccionar la fecha inicial y final", "warning");
      return false;
    }
    if (filtroFechas === "por_folios" && (!folioInicial || !folioFinal)) {
      showAlert("Campos incompletos", "Debes ingresar el folio inicial y final", "warning");
      return false;
    }
    if (filtroFechas === "por_mes" && (!anioSeleccionado || !mesSeleccionado)) {
      showAlert("Campos incompletos", "Debes seleccionar el año y el mes", "warning");
      return false;
    }
    return true;
  };

  // Generar archivo
  const handleGenerar = () => {
    if (!canGenerate()) return;

    setIsProcessing(true);

    // Crear nuevo registro en el historial
    const newRegistro: HistorialDescarga = {
      id: Date.now().toString(),
      tipo: tipoFacturaOptions.find(t => t.value === tipoFactura)?.label || tipoFactura,
      filtro: getFiltroTexto(),
      mensaje: "Procesando...",
      procesados: 0,
      inicio: new Date().toLocaleString(),
      fin: "",
      conceptoDescarga: getConceptoDescarga(),
      archivo: getNombreArchivo(),
      status: "processing",
    };

    setHistorial(prev => [newRegistro, ...prev]);

    // Simular el proceso
    setTimeout(() => {
      const maxProcesados = Math.floor(Math.random() * 50) + 10;
      let processed = 0;

      const interval = setInterval(() => {
        processed += Math.floor(Math.random() * 10) + 1;
        if (processed >= maxProcesados) {
          processed = maxProcesados;
          clearInterval(interval);

          // Actualizar el registro como completado
          setHistorial(prev => prev.map(h =>
            h.id === newRegistro.id
              ? {
                  ...h,
                  mensaje: "Proceso finalizado.",
                  procesados: processed,
                  fin: new Date().toLocaleString(),
                  status: "completed"
                }
              : h
          ));
          setIsProcessing(false);

          if (recibirEmail) {
            showToast("Archivo generado. Revisa tu correo electrónico para descargarlo", "success");
          } else {
            showToast(`Archivo "${newRegistro.archivo}" generado correctamente`, "success");
          }
        } else {
          setHistorial(prev => prev.map(h =>
            h.id === newRegistro.id
              ? { ...h, procesados: processed }
              : h
          ));
        }
      }, 500);
    }, 1000);
  };

  // Simular descarga de archivo
  const handleDescargar = (archivo: string) => {
    showToast(`Descargando "${archivo}"...`, "success");
  };

  // Obtener el color del estado del mensaje
  const getMessageColor = (status: string) => {
    switch (status) {
      case "completed": return "text-emerald-600";
      case "error": return "text-red-500";
      case "processing": return "text-yellow-600";
      default: return "text-[#64748B]";
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen rounded-lg bg-[#F8FAFC]">
        <main className="mx-auto max-w-[1400px]">
          <DemoNotice />
          <div className="mb-4">
            <h1 className="text-3xl font-extrabold text-[#0F172A]">Descarga de Facturas</h1>
            <p className="mt-2 text-[#64748B]">
              Descarga tus facturas en formato XML, PDF o ambos comprimidos en un archivo .ZIP
            </p>
          </div>

          {/* Contenedor principal */}
          <div className="rounded-2xl border-2 border-[#E2E8F0] bg-white p-6 mb-6 shadow-sm">
            {/* Leyenda */}
            <div className="mb-6 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <p className="text-[#475569] text-sm leading-relaxed">
                Descarga las facturas del mes en un archivo .zip, el tiempo depende de la cantidad de facturas,
                al termino te enviaremos el enlace de descarga.
              </p>
            </div>

            {/* Filtro de fechas principal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label>Filtro de fechas:</Label>
                <div className="relative">
                  <select
                    value={filtroFechas}
                    onChange={(e) => setFiltroFechas(e.target.value)}
                    className={`${selectStyle} appearance-none`}
                  >
                    {filtroFechasOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Campos dinámicos según el filtro seleccionado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {filtroFechas === "por_fechas" && (
                <>
                  <div>
                    <Label>Fecha inicial:</Label>
                    <input
                      type="date"
                      value={fechaInicial}
                      onChange={(e) => setFechaInicial(e.target.value)}
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <Label>Fecha final:</Label>
                    <input
                      type="date"
                      value={fechaFinal}
                      onChange={(e) => setFechaFinal(e.target.value)}
                      className={inputStyle}
                    />
                  </div>
                </>
              )}

              {filtroFechas === "por_folios" && (
                <>
                  <div>
                    <Label>Folio inicial:</Label>
                    <input
                      type="text"
                      value={folioInicial}
                      onChange={(e) => setFolioInicial(e.target.value)}
                      placeholder="Ej: FAC-001"
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <Label>Folio final:</Label>
                    <input
                      type="text"
                      value={folioFinal}
                      onChange={(e) => setFolioFinal(e.target.value)}
                      placeholder="Ej: FAC-100"
                      className={inputStyle}
                    />
                  </div>
                </>
              )}

              {filtroFechas === "por_mes" && (
                <>
                  <div>
                    <Label>Año:</Label>
                    <div className="relative">
                      <select
                        value={anioSeleccionado}
                        onChange={(e) => setAnioSeleccionado(e.target.value)}
                        className={`${selectStyle} appearance-none`}
                      >
                        {getYearsOptions().map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <Label>Mes:</Label>
                    <div className="relative">
                      <select
                        value={mesSeleccionado}
                        onChange={(e) => setMesSeleccionado(e.target.value)}
                        className={`${selectStyle} appearance-none`}
                      >
                        <option value="">Seleccione un mes</option>
                        {mesesOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Tipo de factura y formato */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label>Tipo de Factura:</Label>
                <div className="relative">
                  <select
                    value={tipoFactura}
                    onChange={(e) => setTipoFactura(e.target.value)}
                    className={`${selectStyle} appearance-none`}
                  >
                    {tipoFacturaOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <Label>Tipo de formato:</Label>
                <div className="relative">
                  <select
                    value={tipoFormato}
                    onChange={(e) => setTipoFormato(e.target.value)}
                    className={`${selectStyle} appearance-none`}
                  >
                    {tipoFormatoOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Botón Mostrar más opciones */}
            <div className="mb-6">
              <button
                onClick={() => setShowMoreOptions(!showMoreOptions)}
                className="flex items-center gap-2 text-[15px] font-semibold text-blue-600 hover:opacity-90 transition-opacity"
              >
                {showMoreOptions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {showMoreOptions ? "Mostrar menos opciones" : "Mostrar más opciones"}
              </button>
            </div>

            {/* Más opciones (ocultas) */}
            {showMoreOptions && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pt-6 border-t border-[#E2E8F0]">
                <div>
                  <Label>Filtrar por:</Label>
                  <input
                    type="text"
                    value={rfcFilter}
                    onChange={(e) => setRfcFilter(e.target.value)}
                    placeholder="RFC (opcional)"
                    className={inputStyle}
                  />
                </div>
              </div>
            )}

            {/* Checkbox y botón de generar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#E2E8F0]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={recibirEmail}
                  onChange={(e) => setRecibirEmail(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-[#CBD5E1] text-blue-500 checked:bg-blue-500 checked:border-blue-500"
                />
                <span className="text-[#0F172A]">Recibir email con enlace de descarga</span>
              </label>

              <button
                onClick={handleGenerar}
                {...demoActionProps}
                className={`flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-2.5 font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition-all duration-200 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed ${DEMO_ACTION_CLASS}`}
              >
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileArchive className="h-5 w-5" />}
                Generar archivo
              </button>
            </div>
          </div>

          {/* Tabla de historial de descargas */}
          <div className="rounded-2xl border-2 border-[#E2E8F0] bg-white overflow-hidden">
            <div className="border-b border-[#E2E8F0] p-4 bg-[#F8FAFC]">
              <h3 className="text-lg font-bold text-[#0F172A]">Historial de Descargas</h3>
            </div>

            {historial.length === 0 ? (
              <div className="text-center py-12 text-[#64748B]">
                <FileArchive className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No hay descargas registradas</p>
                <p className="text-sm mt-1">Genera tu primera descarga</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F1F5F9]">
                    <tr className="text-left text-sm uppercase tracking-wide text-[#475569]">
                      <th className="px-6 py-4">Tipo</th>
                      <th className="px-6 py-4">Filtro</th>
                      <th className="px-6 py-4">Mensaje</th>
                      <th className="px-6 py-4 text-center">Procesados</th>
                      <th className="px-6 py-4">Inicio</th>
                      <th className="px-6 py-4">Fin</th>
                      <th className="px-6 py-4">Concepto de descarga</th>
                      <th className="px-6 py-4">Descargar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((registro) => (
                      <tr key={registro.id} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${
                            registro.tipo === "Nóminas"
                              ? "bg-purple-50 text-purple-600"
                              : registro.tipo === "Recibidas"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-blue-50 text-blue-600"
                          }`}>
                            {registro.status === "processing" && <Loader2 className="h-3 w-3 animate-spin" />}
                            {registro.status === "completed" && <CheckCircle2 className="h-3 w-3" />}
                            {registro.tipo}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#334155]">{registro.filtro}</td>
                        <td className={`px-6 py-4 ${getMessageColor(registro.status)}`}>
                          {registro.mensaje}
                          {registro.status === "processing" && (
                            <div className="flex items-center gap-1 mt-1">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              <span className="text-xs">En proceso...</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {registro.status === "processing" ? (
                            <div className="flex items-center justify-center gap-1">
                              <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
                              <span className="text-yellow-600">{registro.procesados}</span>
                            </div>
                          ) : (
                            <span className="font-bold text-emerald-600">{registro.procesados}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-[#64748B] text-sm whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {registro.inicio}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#64748B] text-sm whitespace-nowrap">
                          {registro.fin || (registro.status === "processing" ? "En proceso..." : "-")}
                        </td>
                        <td className="px-6 py-4 text-[#334155]">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-slate-500" />
                            {registro.conceptoDescarga}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDescargar(registro.archivo)}
                            {...demoActionProps}
                            className={`${DEMO_ACTION_CLASS} flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              registro.status === "completed"
                                ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                            }`}
                          >
                            <Download className="h-4 w-4" />
                            {registro.archivo}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pie de la tabla */}
            <div className="border-t border-[#E2E8F0] p-4 bg-[#F8FAFC]">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#64748B]">
                  Los archivos generados están disponibles para descarga durante 7 días.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal de alerta */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
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
