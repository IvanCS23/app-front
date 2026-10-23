"use client";

import React, { useState } from "react";
import AppLayout from "@/app/components/layout/AppLayout";
import DemoNotice, { DEMO_ACTION_CLASS, demoActionProps } from "@/app/components/ui/DemoNotice";
import {
  Upload,
  Calendar,
  RefreshCw,
  CheckCircle2,
  X,
  AlertCircle,
  ChevronDown,
  Fingerprint,
  Info,
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
    <div className="mb-1 flex items-center gap-1">
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

export default function RecuperacionFacturas() {
  // RFC del perfil (simulado)
  const rfcPerfil = "KASHMIR800101XYZ";

  const [tipoFactura, setTipoFactura] = useState("emitidas");
  const [fechaInicial, setFechaInicial] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "success" as "success" | "error" | "warning" });

  const showAlert = (title: string, message: string, type: "success" | "error" | "warning") => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  const handleRecuperar = () => {
    if (!fechaInicial) {
      showAlert("Campos incompletos", "La fecha inicial es obligatoria", "error");
      return;
    }
    if (!fechaFinal) {
      showAlert("Campos incompletos", "La fecha final es obligatoria", "error");
      return;
    }
    if (fechaInicial > fechaFinal) {
      showAlert("Rango inválido", "La fecha inicial no puede ser mayor a la fecha final", "error");
      return;
    }

    showAlert("Recuperación iniciada", "Se están recuperando las facturas. Este proceso puede tomar unos momentos.", "success");
  };

  return (
    <AppLayout>
      <div className="min-h-screen rounded-lg bg-[#F8FAFC]">
        <main className="mx-auto max-w-[1400px]">
          <DemoNotice />
          <div className="mb-2">
            <h1 className="text-3xl font-extrabold text-[#0F172A]">Recuperación de Facturas</h1>
            <p className="mt-2 text-[#64748B]">
              Recupera tus comprobantes fiscales emitidos o recibidos utilizando tu FIEL.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-[#E2E8F0] bg-white p-6 shadow-sm">
            {/* Título con RFC */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-[#475569]">
                Recuperar facturas de:{" "}
                <span className="text-blue-600 font-mono font-bold">{rfcPerfil}</span>
              </h2>
            </div>

            {/* Área de carga de archivos FIEL */}
            <div className="mb-8 p-6 rounded-xl bg-[#F8FAFC] border-2 border-dashed border-[#CBD5E1] hover:border-blue-500 transition-colors">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                  <Fingerprint className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-[#475569] text-sm mb-2">
                  Sube tus archivos de la <span className="text-blue-600 font-medium">FIEL</span> o{" "}
                  <span className="text-blue-600 font-medium">Firma Electrónica Avanzada</span> para poder realizar tu recuperación
                </p>
                <p className="text-slate-500 text-xs mb-4">
                  Archivos requeridos: .cer y .key
                </p>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 rounded-xl bg-white border-2 border-[#E2E8F0] px-4 py-2 text-[#475569] hover:bg-[#F8FAFC] transition-colors">
                    <Upload className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Subir FIEL</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Campos de filtro */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tipo de factura */}
              <div>
                <Label>Total de factura:</Label>
                <div className="relative">
                  <select
                    value={tipoFactura}
                    onChange={(e) => setTipoFactura(e.target.value)}
                    className={`${selectStyle} appearance-none`}
                  >
                    <option value="emitidas">Emitidas</option>
                    <option value="recibidas">Recibidas</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* Fecha Inicial */}
              <div>
                <Label>Fecha Inicial:</Label>
                <div className="relative">
                  <input
                    type="date"
                    value={fechaInicial}
                    onChange={(e) => setFechaInicial(e.target.value)}
                    className={inputStyle}
                  />
                  <Calendar className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Fecha Final */}
              <div>
                <Label>Fecha Final:</Label>
                <div className="relative">
                  <input
                    type="date"
                    value={fechaFinal}
                    onChange={(e) => setFechaFinal(e.target.value)}
                    className={inputStyle}
                  />
                  <Calendar className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Botón Recuperar facturas */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleRecuperar}
                {...demoActionProps}
                className={`flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-8 py-3 font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition-all duration-200 hover:bg-blue-400 ${DEMO_ACTION_CLASS}`}
              >
                <RefreshCw className="h-5 w-5" />
                Recuperar facturas
              </button>
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
    </AppLayout>
  );
}
