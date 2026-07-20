"use client";

import React, { useState } from "react";
import AppLayout from "@/app/components/layout/AppLayout";
import {
  Save,
  CheckCircle2,
  X,
  AlertCircle,
  ChevronDown,
  Mail,
  DollarSign,
  Settings as SettingsIcon,
} from "lucide-react";

const selectStyle =
  "box box-input";

type LabelProps = {
  children: React.ReactNode;
  withInfo?: boolean;
  infoText?: string;
};

function Label({ children, withInfo = false, infoText = "" }: LabelProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex items-center gap-1">
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
            <div className="absolute bottom-full left-0 z-50 w-64 rounded-lg bg-white border border-[#E2E8F0] p-2 text-xs text-[#475569] shadow-lg">
              {infoText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Opciones de decimales
const decimalOptions = [
  { label: "2 Decimales", value: "2" },
  { label: "3 Decimales", value: "3" },
  { label: "4 Decimales", value: "4" },
  { label: "5 Decimales", value: "5" },
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

export default function ConfiguracionGeneral() {
  // Estados para decimales
  const [decimales, setDecimales] = useState("2");
  const [porcentajeDecimales, setPorcentajeDecimales] = useState("2");

  // Estado para correos
  const [dejarRecibirCorreos, setDejarRecibirCorreos] = useState(false);

  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "success" as "success" | "error" | "warning" });

  const showAlert = (title: string, message: string, type: "success" | "error" | "warning") => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  const handleSave = () => {
    console.log("Configuración guardada:", {
      decimales,
      porcentajeDecimales,
      dejarRecibirCorreos,
    });
    showAlert("Configuración guardada", "Los cambios han sido aplicados correctamente", "success");
  };

  return (
    <AppLayout>
      <div className="min-h-screen rounded-lg bg-[#F8FAFC]">
        <main className="mx-auto max-w-[1400px]">
          {/* Título principal */}
          <div className="mb-4">
            <h1 className="text-3xl font-extrabold text-[#0F172A]">Configuración General</h1>
            <p className="mt-2 text-[#64748B]">
              Administra las preferencias generales de tu sistema.
            </p>
          </div>

          {/* Card de Decimales */}
          <div className="mb-4 rounded-2xl border-2 border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-[#0F172A]">Formato de Decimales en PDF</h2>
            </div>
            <p className="text-[#64748B] text-sm mb-6">
              Define cómo se mostrarán los valores numéricos en los documentos generados.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Decimal */}
              <div>
                <Label>Decimal:</Label>
                <div className="relative">
                  <select
                    value={decimales}
                    onChange={(e) => setDecimales(e.target.value)}
                    className={`${selectStyle} appearance-none`}
                  >
                    {decimalOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* Porcentaje */}
              <div>
                <Label>Porcentaje:</Label>
                <div className="relative">
                  <select
                    value={porcentajeDecimales}
                    onChange={(e) => setPorcentajeDecimales(e.target.value)}
                    className={`${selectStyle} appearance-none`}
                  >
                    {decimalOptions.map((option) => (
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

          {/* Card de Correo */}
          <div className="rounded-2xl border-2 border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-[#0F172A]">Configuración de Correo</h2>
            </div>
            <p className="text-[#64748B] text-sm mb-6">
              Administra las notificaciones por correo electrónico.
            </p>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={dejarRecibirCorreos}
                onChange={(e) => setDejarRecibirCorreos(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-[#CBD5E1] bg-white text-blue-500 focus:ring-blue-500 focus:ring-offset-0 checked:bg-blue-500 checked:border-blue-500 transition-colors cursor-pointer"
              />
              <span className="text-[#0F172A]">Dejar de recibir correos</span>
            </div>
            <p className="text-slate-500 text-xs mt-2">
              Al activar esta opción, dejarás de recibir notificaciones por correo electrónico.
            </p>
          </div>

          {/* Botón Guardar */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-8 py-3 font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition-all duration-200 hover:bg-blue-400"
            >
              <Save className="h-5 w-5" />
              Guardar configuración
            </button>
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
