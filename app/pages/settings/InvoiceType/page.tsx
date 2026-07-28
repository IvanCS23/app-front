"use client";

import React, { useState } from "react";
import AppLayout from "@/app/components/layout/AppLayout";
import {
  Save,
  CheckCircle2,
  FileText,
  Pill,
  FlaskConical,
  FileMinus,
  UtensilsCrossed,
  Receipt,
  CreditCard,
  Briefcase,
  Home,
  Hotel,
  Globe,
  Warehouse,
  X,
  AlertCircle,
  Info,
} from "lucide-react";

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

// Tipo para cada opción de factura
type InvoiceTypeOption = {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
};

// Opciones de tipos de factura
const invoiceTypes: InvoiceTypeOption[] = [
  { id: "facturas", label: "Facturas", icon: <FileText className="h-5 w-5" />, description: "Facturas estándar CFDI 4.0" },
  { id: "farmacias", label: "Factura para farmacias", icon: <Pill className="h-5 w-5" />, description: "Factura especializada para farmacias" },
  { id: "ieps", label: "Factura con IEPS", icon: <FlaskConical className="h-5 w-5" />, description: "Factura que incluye Impuesto Especial sobre Producción y Servicios" },
  { id: "notaCredito", label: "Nota de crédito", icon: <FileMinus className="h-5 w-5" />, description: "Nota de crédito para devoluciones o ajustes" },
  { id: "restaurantes", label: "Factura para restaurantes", icon: <UtensilsCrossed className="h-5 w-5" />, description: "Factura especializada para restaurantes y servicios de alimentos" },
  { id: "reciboDeducible", label: "Recibo deducible", icon: <Receipt className="h-5 w-5" />, description: "Recibo con validez fiscal deducible" },
  { id: "complementoPagos", label: "Complemento de Pagos", icon: <CreditCard className="h-5 w-5" />, description: "Complemento para registrar pagos de facturas" },
  { id: "honorarios", label: "Honorarios", icon: <Briefcase className="h-5 w-5" />, description: "Factura para honorarios profesionales" },
  { id: "retencionIVA", label: "Factura con retención IVA", icon: <Home className="h-5 w-5" />, description: "Factura que incluye retención de IVA" },
  { id: "arrendamiento", label: "Recibo de arrendamiento", icon: <Warehouse className="h-5 w-5" />, description: "Recibo para arrendamiento de inmuebles" },
  { id: "hoteles", label: "Factura para Hoteles", icon: <Hotel className="h-5 w-5" />, description: "Factura especializada para servicios hoteleros" },
  { id: "global", label: "Factura Global", icon: <Globe className="h-5 w-5" />, description: "Factura global para ingresos acumulables" },
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

export default function InvoiceTypes() {
  // Estados para los checkboxes
  const [selectedTypes, setSelectedTypes] = useState<Record<string, boolean>>({
    facturas: true,
    farmacias: false,
    ieps: false,
    notaCredito: false,
    restaurantes: false,
    reciboDeducible: false,
    complementoPagos: false,
    honorarios: false,
    retencionIVA: false,
    arrendamiento: false,
    hoteles: false,
    global: false,
  });

  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "success" as "success" | "error" | "warning" });

  // Mostrar alerta
  const showAlert = (title: string, message: string, type: "success" | "error" | "warning") => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  // Manejar cambio de checkbox
  const handleCheckboxChange = (id: string) => {
    setSelectedTypes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Guardar configuración
  const handleSave = () => {
    const enabledTypes = Object.entries(selectedTypes)
      .filter(([, enabled]) => enabled)
      .map(([id]) => invoiceTypes.find(t => t.id === id)?.label);

    console.log("Tipos de factura seleccionados:", enabledTypes);
    showAlert("Configuración guardada", "Los tipos de factura han sido actualizados correctamente", "success");
  };

  // Seleccionar todos
  const selectAll = () => {
    const allSelected: Record<string, boolean> = {};
    Object.keys(selectedTypes).forEach(key => {
      allSelected[key] = true;
    });
    setSelectedTypes(allSelected);
  };

  // Deseleccionar todos
  const deselectAll = () => {
    const allDeselected: Record<string, boolean> = {};
    Object.keys(selectedTypes).forEach(key => {
      allDeselected[key] = false;
    });
    setSelectedTypes(allDeselected);
  };

  // Contar cuántos están seleccionados
  const selectedCount = Object.values(selectedTypes).filter(Boolean).length;
  const totalCount = Object.keys(selectedTypes).length;

  return (
    <AppLayout>
      <div className="min-h-screen rounded-lg bg-[#F8FAFC]">
        <main className="mx-auto max-w-[1400px]">
          {/* Título principal */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#0F172A]">Tipos de Factura</h1>
            <p className="mt-2 text-[#64748B]">
              Selecciona los tipos de comprobantes fiscales que deseas habilitar en tu sistema.
            </p>
          </div>

          {/* Card principal */}
          <div className="rounded-2xl border-2 border-[#E2E8F0] bg-white p-6 shadow-sm">
            {/* Texto informativo */}
            <div className="mb-6 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <p className="text-[#475569] text-sm leading-relaxed">
                Marca o desmarca las siguientes opciones según los tipos de comprobantes que tu negocio requiera.
                Puedes activar solo los documentos fiscales que necesitas para mantener tu catálogo organizado y optimizado.
              </p>
            </div>

            {/* Botones de acción rápida */}
            <div className="flex justify-end gap-3 mb-6">
              <button
                onClick={selectAll}
                className="px-4 py-2 rounded-xl border-2 border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors text-sm"
              >
                Seleccionar todos
              </button>
              <button
                onClick={deselectAll}
                className="px-4 py-2 rounded-xl border-2 border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors text-sm"
              >
                Deseleccionar todos
              </button>
            </div>

            {/* Grid de checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {invoiceTypes.map((type) => (
                <div
                  key={type.id}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:border-blue-300 ${
                    selectedTypes[type.id]
                      ? "border-blue-400 bg-blue-50/60"
                      : "border-[#E2E8F0] bg-white"
                  }`}
                  onClick={() => handleCheckboxChange(type.id)}
                >
                  {/* Checkbox personalizado */}
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedTypes[type.id]}
                      onChange={() => handleCheckboxChange(type.id)}
                      className="w-5 h-5 rounded border-2 border-[#CBD5E1] bg-white text-blue-500 focus:ring-blue-500 focus:ring-offset-0 checked:bg-blue-500 checked:border-blue-500 transition-colors cursor-pointer"
                    />
                  </div>

                  {/* Icono y texto */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-blue-600">{type.icon}</span>
                      <span className="font-medium text-[#0F172A]">{type.label}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{type.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contador de selección */}
            <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex justify-between items-center">
              <p className="text-sm text-[#64748B]">
                <span className="font-bold text-blue-600">{selectedCount}</span> de <span className="font-bold">{totalCount}</span> tipos seleccionados
              </p>

              {/* Botón Guardar */}
              <button
                onClick={handleSave}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-8 py-3 font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition-all duration-200 hover:bg-blue-400"
              >
                <Save className="h-5 w-5" />
                Guardar configuración
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
