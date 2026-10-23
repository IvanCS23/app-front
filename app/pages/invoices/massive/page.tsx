"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/app/components/layout/AppLayout";
import DemoNotice, { DEMO_ACTION_CLASS, demoActionProps } from "@/app/components/ui/DemoNotice";
import {
  ChevronDown,
  Info,
  Loader2,
  CheckCircle2,
  X,
  AlertCircle,
  Upload,
  Play,
  FileText,
  Clock,
  Calendar,
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
            <div className="absolute bottom-full left-0 mb-2 z-50 w-64 rounded-lg bg-white border border-[#E2E8F0] p-2 text-xs text-[#475569] shadow-lg">
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

// Opciones de Tipo de Proceso
const tipoProcesoOptions = [
  { value: "", label: "Seleccione un tipo de proceso" },
  { value: "facturacion", label: "Facturación" },
  { value: "cancelacion", label: "Cancelación" },
];

// Opciones de Tipo de Comprobante (solo para Facturación)
const tipoComprobanteOptions = [
  { value: "", label: "Seleccione un tipo de comprobante" },
  { value: "factura", label: "Factura" },
  { value: "factura_global", label: "Factura Global" },
  { value: "nota_credito", label: "Nota de Crédito" },
  { value: "factura_retencion_iva", label: "Factura con Retención de IVA" },
  { value: "complemento_pago", label: "Complemento de Pago" },
  { value: "factura_terceros", label: "Factura con complemento de terceros" },
  { value: "recibo_pago", label: "Recibo de Pago" },
  { value: "factura_descuento", label: "Factura con Descuento" },
  { value: "factura_sku_ean", label: "Factura con SKU y EAN" },
  { value: "retencion_plataformas", label: "Retención con complemento de Plataformas Tecnológicas" },
  { value: "retencion_intereses", label: "Retención con complemento de Intereses" },
  { value: "factura_descuento_ieps", label: "Facturación con Descuento/IEPS" },
];

// Opciones de Lugar de Expedición (simuladas)
const lugaresExpedicionOptions = [
  { value: "", label: "Seleccione un lugar de expedición" },
  { value: "principal", label: "Principal - Av. Insurgentes Sur 123, CDMX" },
  { value: "sucursal_norte", label: "Sucursal Norte - Av. Real del Monte 45, EdoMex" },
  { value: "sucursal_sur", label: "Sucursal Sur - Calzada de Tlalpan 1500, CDMX" },
];

// Tipo para los archivos procesados
type ArchivoProcesado = {
  id: string;
  tipo: string;
  nombreArchivo: string;
  mensaje: string;
  facturasProcesadas: number;
  inicio: string;
  final: string;
  status: "pending" | "processing" | "completed" | "error";
};

export default function FacturacionMasiva() {
  // Estados del formulario
  const [tipoProceso, setTipoProceso] = useState("");
  const [lugarExpedicion, setLugarExpedicion] = useState("");
  const [tipoComprobante, setTipoComprobante] = useState("");
  const [fechaEmision, setFechaEmision] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Estado para el archivo seleccionado
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Estado para la tabla de archivos procesados
  const [archivosProcesados, setArchivosProcesados] = useState<ArchivoProcesado[]>([]);

  // Estados para modales y toast
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "success" as "success" | "error" | "warning" });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" } | null>(null);

  // Referencia para el input de archivo
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Determinar si es modo cancelación
  const isCancelacion = tipoProceso === "cancelacion";

  const showAlert = (title: string, message: string, type: "success" | "error" | "warning") => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  const showToast = (message: string, type: "success" | "error" | "warning") => {
    setToast({ message, type });
  };

  // Manejar selección de archivo
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar extensión del archivo
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension !== 'csv' && extension !== 'xlsx' && extension !== 'xls') {
        showAlert("Formato no válido", "Solo se permiten archivos .csv, .xlsx o .xls", "error");
        return;
      }
      setSelectedFile(file);
      showToast(`Archivo "${file.name}" seleccionado correctamente`, "success");
    }
  };

  // Subir archivo (trigger del input)
  const handleSubirArchivo = () => {
    fileInputRef.current?.click();
  };

  // Validar si se puede iniciar el proceso
  const canStartProcess = () => {
    if (!tipoProceso) {
      showAlert("Campos incompletos", "Debes seleccionar el tipo de proceso", "warning");
      return false;
    }
    if (!isCancelacion && !lugarExpedicion) {
      showAlert("Campos incompletos", "Debes seleccionar el lugar de expedición", "warning");
      return false;
    }
    if (!isCancelacion && !tipoComprobante) {
      showAlert("Campos incompletos", "Debes seleccionar el tipo de comprobante", "warning");
      return false;
    }
    if (!selectedFile) {
      showAlert("Archivo requerido", "Debes seleccionar un archivo a procesar", "error");
      return false;
    }
    // Verificar si ya hay un proceso en ejecución
    const hasProcessing = archivosProcesados.some(a => a.status === "processing");
    if (hasProcessing) {
      showAlert("Proceso en curso", "Ya hay un archivo procesando. Espera a que termine para iniciar otro", "warning");
      return false;
    }
    return true;
  };

  // Iniciar el proceso
  const handleStartProcess = () => {
    if (!canStartProcess()) return;

    setIsProcessing(true);

    // Crear nuevo registro en la tabla
    const newArchivo: ArchivoProcesado = {
      id: Date.now().toString(),
      tipo: isCancelacion ? "Cancelación" : (tipoComprobanteOptions.find(t => t.value === tipoComprobante)?.label || tipoComprobante),
      nombreArchivo: selectedFile!.name,
      mensaje: "Procesando...",
      facturasProcesadas: 0,
      inicio: new Date().toLocaleString(),
      final: "",
      status: "processing",
    };

    setArchivosProcesados(prev => [newArchivo, ...prev]);

    // Simular el proceso (esto sería una llamada a API real)
    setTimeout(() => {
      // Simular el procesamiento
      const maxFacturas = Math.floor(Math.random() * 1000) + 100;
      let processed = 0;

      const interval = setInterval(() => {
        processed += Math.floor(Math.random() * 50) + 10;
        if (processed >= maxFacturas) {
          processed = maxFacturas;
          clearInterval(interval);

          // Actualizar el registro como completado
          setArchivosProcesados(prev => prev.map(a =>
            a.id === newArchivo.id
              ? {
                  ...a,
                  mensaje: isCancelacion ? "Cancelación completada exitosamente" : "Proceso completado exitosamente",
                  facturasProcesadas: processed,
                  final: new Date().toLocaleString(),
                  status: "completed"
                }
              : a
          ));
          setIsProcessing(false);
          showToast(isCancelacion
            ? `Cancelación completada: ${processed} facturas canceladas`
            : `Proceso completado: ${processed} facturas procesadas`,
            "success"
          );

          // Limpiar selección de archivo
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else {
          setArchivosProcesados(prev => prev.map(a =>
            a.id === newArchivo.id
              ? { ...a, facturasProcesadas: processed }
              : a
          ));
        }
      }, 500);
    }, 1000);
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
            <h1 className="text-3xl font-extrabold text-[#0F172A]">Facturación Masiva</h1>
            <p className="mt-2 text-[#64748B]">
              {isCancelacion ? "Cancela múltiples facturas de manera simultánea" : "Procesa múltiples facturas de manera simultánea"}
            </p>
          </div>

          {/* Contenedor principal */}
          <div className="rounded-2xl border-2 border-[#E2E8F0] bg-white p-6 mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tipo de proceso */}
              <div>
                <Label>Tipo de proceso:</Label>
                <div className="relative">
                  <select
                    value={tipoProceso}
                    onChange={(e) => {
                      setTipoProceso(e.target.value);
                      // Resetear campos cuando cambia el proceso
                      if (e.target.value !== "facturacion") {
                        setTipoComprobante("");
                        setLugarExpedicion("");
                      }
                    }}
                    className={`${selectStyle} appearance-none`}
                  >
                    {tipoProcesoOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* Lugar de Expedición (solo si se selecciona Facturación) */}
              {!isCancelacion && (
                <div>
                  <Label>Lugar de Expedición:</Label>
                  <div className="relative">
                    <select
                      value={lugarExpedicion}
                      onChange={(e) => setLugarExpedicion(e.target.value)}
                      className={`${selectStyle} appearance-none`}
                    >
                      {lugaresExpedicionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              )}

              {/* Tipo de comprobante (solo si se selecciona Facturación) */}
              {!isCancelacion && (
                <div>
                  <Label>Tipo de comprobante:</Label>
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
              )}

              {/* Fecha emisión (solo si se selecciona Facturación) */}
              {!isCancelacion && (
                <div>
                  <Label withInfo infoText="Subir los archivos antes de las 11:00 pm ya que de lo contrario la fecha de timbrado puede variar">
                    Fecha emisión:
                  </Label>
                  <div className="relative">
                    <input
                      type="date"
                      value={fechaEmision}
                      onChange={(e) => setFechaEmision(e.target.value)}
                      className={inputStyle}
                    />
                    <Calendar className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-[#E2E8F0]">
              <div className="flex items-center gap-4">
                {/* Botón Subir archivo (sin fondo) */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={handleSubirArchivo}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Upload className="h-5 w-5" />
                  Subir archivo
                </button>

                {/* Mostrar nombre del archivo seleccionado */}
                {selectedFile && (
                  <span className="text-sm text-[#64748B]">
                    Archivo: <span className="text-emerald-600">{selectedFile.name}</span>
                  </span>
                )}
              </div>

              {/* Botón Empezar el proceso */}
              <button
                onClick={handleStartProcess}
                {...demoActionProps}
                className={`flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-2.5 font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition-all duration-200 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed ${DEMO_ACTION_CLASS}`}
              >
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5" />}
                Empezar el proceso
              </button>
            </div>

            {/* Mensaje IMPORTANTE (solo si se selecciona Facturación) */}
            {!isCancelacion && (
              <div className="mt-4 p-3 rounded-xl bg-yellow-50 border border-yellow-200">
                <p className="text-yellow-700 text-sm font-medium">
                  ⚠ IMPORTANTE: La plantilla acepta máximo 1000 conceptos y/o facturas
                </p>
              </div>
            )}

            {/* Mensaje para Cancelación */}
            {isCancelacion && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200">
                <p className="text-red-600 text-sm font-medium">
                  ⚠ IMPORTANTE: Para cancelaciones, asegúrate de que el archivo contenga los folios fiscales de las facturas a cancelar
                </p>
              </div>
            )}
          </div>

          {/* Tabla de archivos procesados */}
          <div className="rounded-2xl border-2 border-[#E2E8F0] bg-white overflow-hidden">
            <div className="border-b border-[#E2E8F0] p-4 bg-[#F8FAFC]">
              <h3 className="text-lg font-bold text-[#0F172A]">Historial de Procesos</h3>
            </div>

            {archivosProcesados.length === 0 ? (
              <div className="text-center py-12 text-[#64748B]">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No hay procesos registrados</p>
                <p className="text-sm mt-1">Sube un archivo para comenzar</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F1F5F9]">
                    <tr className="text-left text-sm uppercase tracking-wide text-[#475569]">
                      <th className="px-6 py-4">Tipo</th>
                      <th className="px-6 py-4">Nombre archivo</th>
                      <th className="px-6 py-4">Mensaje</th>
                      <th className="px-6 py-4 text-center">
                        {isCancelacion ? "Facturas canceladas" : "Facturas procesadas"}
                      </th>
                      <th className="px-6 py-4">Inicio</th>
                      <th className="px-6 py-4">Final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {archivosProcesados.map((archivo) => (
                      <tr key={archivo.id} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${
                            archivo.tipo === "Cancelación"
                              ? "bg-red-50 text-red-600"
                              : "bg-blue-50 text-blue-600"
                          }`}>
                            {archivo.status === "processing" && <Loader2 className="h-3 w-3 animate-spin" />}
                            {archivo.status === "completed" && <CheckCircle2 className="h-3 w-3" />}
                            {archivo.tipo}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-400" />
                            <span className="text-[#334155]">{archivo.nombreArchivo}</span>
                          </div>
                        </td>
                        <td className={`px-6 py-4 ${getMessageColor(archivo.status)}`}>
                          {archivo.mensaje}
                          {archivo.status === "processing" && (
                            <div className="flex items-center gap-1 mt-1">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              <span className="text-xs">En proceso...</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {archivo.status === "processing" ? (
                            <div className="flex items-center justify-center gap-1">
                              <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
                              <span className="text-yellow-600">{archivo.facturasProcesadas}</span>
                            </div>
                          ) : (
                            <span className="font-bold text-emerald-600">{archivo.facturasProcesadas}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-[#64748B] text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {archivo.inicio}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#64748B] text-sm">
                          {archivo.final || (archivo.status === "processing" ? "En proceso..." : "-")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Nota al pie de la tabla */}
            <div className="border-t border-[#E2E8F0] p-4 bg-[#F8FAFC]">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#64748B]">
                  NOTA: Solo puedes tener un archivo procesando, sigue las indicaciones para un timbrado eficiente.
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
