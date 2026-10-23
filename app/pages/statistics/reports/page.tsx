"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/app/components/layout/AppLayout";
import DemoNotice, { DEMO_ACTION_CLASS, demoActionProps } from "@/app/components/ui/DemoNotice";
import {
  ChevronDown,
  Download,
  Info,
  Loader2,
  CheckCircle2,
  X,
  AlertCircle,
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

// Opciones
type MultiSelectOption = {
  value: string;
  label: string;
};

const estatusOptions: MultiSelectOption[] = [
  { value: "activas", label: "Activas" },
  { value: "canceladas", label: "Canceladas" },
];

const tipoComprobanteOptions: MultiSelectOption[] = [
  { value: "emitidas", label: "Emitidas" },
  { value: "recibidas", label: "Recibidas" },
  { value: "nominas", label: "Nóminas" },
  { value: "retenciones", label: "Retenciones" },
];

const tipoFacturaOptions: MultiSelectOption[] = [
  { value: "factura", label: "Factura" },
  { value: "nota_credito", label: "Nota de Crédito" },
  { value: "complemento_pago", label: "Complemento de Pago" },
  { value: "factura_global", label: "Factura Global" },
];

const tipoRelacionOptions: MultiSelectOption[] = [
  { value: "solo_facturas", label: "Solo Facturas" },
  { value: "complemento_pagos_facturas", label: "Complemento Pagos - Facturas" },
];

const sucursalesOptions: MultiSelectOption[] = [
  { value: "principal", label: "Principal" },
  { value: "sucursal_norte", label: "Sucursal Norte" },
  { value: "sucursal_sur", label: "Sucursal Sur" },
  { value: "sucursal_este", label: "Sucursal Este" },
  { value: "sucursal_oeste", label: "Sucursal Oeste" },
];

const mesesOptions: MultiSelectOption[] = [
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

const incluirConceptoOptions: MultiSelectOption[] = [
  { value: "primer_concepto", label: "Incluir el Primer Concepto" },
  { value: "todos_conceptos", label: "Incluir todos los Conceptos" },
];

// Componente para selección múltiple (Checkboxes)
const MultiSelect = ({ options, selected, onChange, placeholder, disabled = false }: { options: MultiSelectOption[]; selected: string[]; onChange: (selected: string[]) => void; placeholder: string; disabled?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (value: string) => {
    if (disabled) return;
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const getSelectedLabels = () => {
    const selectedOptions = options.filter(opt => selected.includes(opt.value));
    if (selectedOptions.length === 0) return placeholder;
    if (selectedOptions.length === 1) return selectedOptions[0].label;
    return `${selectedOptions[0].label} +${selectedOptions.length - 1}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`box box-input flex items-center justify-between ${disabled ? "opacity-50 cursor-not-allowed bg-slate-100" : ""}`}
      >
        <span className={selected.length === 0 ? "text-slate-500" : "text-[#0F172A]"}>
          {getSelectedLabels()}
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 rounded-xl border border-[#E2E8F0] bg-white shadow-xl overflow-hidden">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8FAFC] cursor-pointer transition-colors border-b border-[#E2E8F0] last:border-b-0"
            >
              <input
                type="checkbox"
                checked={selected.includes(option.value)}
                onChange={() => toggleOption(option.value)}
                className="w-4 h-4 rounded border-2 border-[#CBD5E1] text-blue-500 checked:bg-blue-500 checked:border-blue-500"
              />
              <span className="text-[#0F172A] text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

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

export default function Reportes() {
  // Estados para los filtros en el orden solicitado
  const [estatus, setEstatus] = useState<string[]>(["activas"]);
  const [tipoComprobante, setTipoComprobante] = useState("emitidas");
  const [tipoFactura, setTipoFactura] = useState<string[]>(["factura"]);
  const [tipoRelacion, setTipoRelacion] = useState("");
  const [sucursales, setSucursales] = useState<string[]>(["principal"]);
  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState(new Date().getFullYear().toString());
  const [incluirPrimerConcepto, setIncluirPrimerConcepto] = useState("primer_concepto");
  const [fechaInicial, setFechaInicial] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");

  // Estados para loader y alerta
  const [isLoading, setIsLoading] = useState(false);
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "success" as "success" | "error" | "warning" });

  const showAlert = (title: string, message: string, type: "success" | "error" | "warning") => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  // Verificar si los filtros deben estar habilitados
  const isEmitidas = tipoComprobante === "emitidas";
  const isEmitidasORecibidas = tipoComprobante === "emitidas" || tipoComprobante === "recibidas";
  const mostrarFechas = incluirPrimerConcepto === "todos_conceptos";

  // Resetear campos cuando cambia el tipo de comprobante
  useEffect(() => {
    if (!isEmitidas) {
      setSucursales([]);
      setTipoFactura([]);
    }
    if (!isEmitidasORecibidas) {
      setTipoRelacion("");
    }
  }, [tipoComprobante, isEmitidas, isEmitidasORecibidas]);

  const handleDescargarReporte = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      showAlert("Reporte generado", "El reporte se ha descargado correctamente", "success");
    }, 2000);
  };

  // Generar opciones de años
  const anioActual = new Date().getFullYear();
  const aniosOptions = [];
  for (let i = anioActual - 5; i <= anioActual + 5; i++) {
    aniosOptions.push({ value: i.toString(), label: i.toString() });
  }

  return (
    <AppLayout>
      <div className="min-h-screen rounded-lg bg-[#F8FAFC]">
        <main className="mx-auto max-w-[1400px]">
          <DemoNotice />
          <div className="mb-4">
            <h1 className="text-3xl font-extrabold text-[#0F172A]">Reportes</h1>
            <p className="mt-2 text-[#64748B]">Genera reportes personalizados de tus facturas y documentos fiscales.</p>
          </div>

          {/* Contenedor de filtros */}
          <div className="rounded-2xl border-2 border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 1. Estatus de las facturas */}
              <div>
                <Label>Estatus de las facturas:</Label>
                <MultiSelect
                  options={estatusOptions}
                  selected={estatus}
                  onChange={setEstatus}
                  placeholder="Seleccione estatus"
                />
              </div>

              {/* 2. Tipo de comprobante */}
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

              {/* 3. Tipo de factura */}
              <div>
                <Label>Tipo de factura:</Label>
                <MultiSelect
                  options={tipoFacturaOptions}
                  selected={tipoFactura}
                  onChange={setTipoFactura}
                  placeholder="Seleccione tipo de factura"
                  disabled={!isEmitidas}
                />
                {!isEmitidas && (
                  <p className="text-xs text-slate-500 mt-1">* Solo disponible para comprobantes "Emitidas"</p>
                )}
              </div>

              {/* 4. Tipo de relación */}
              <div>
                <Label>Tipo de relación:</Label>
                <div className="relative">
                  <select
                    value={tipoRelacion}
                    onChange={(e) => setTipoRelacion(e.target.value)}
                    className={`${selectStyle} appearance-none`}
                    disabled={!isEmitidasORecibidas}
                  >
                    <option value="">Seleccione tipo de relación</option>
                    {tipoRelacionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
                {!isEmitidasORecibidas && (
                  <p className="text-xs text-slate-500 mt-1">* Solo disponible para comprobantes "Emitidas" o "Recibidas"</p>
                )}
              </div>

              {/* 5. Sucursal */}
              <div>
                <Label>Sucursal:</Label>
                <MultiSelect
                  options={sucursalesOptions}
                  selected={sucursales}
                  onChange={setSucursales}
                  placeholder="Seleccione sucursal"
                  disabled={!isEmitidas}
                />
                {!isEmitidas && (
                  <p className="text-xs text-slate-500 mt-1">* Solo disponible para comprobantes "Emitidas"</p>
                )}
              </div>

              {/* 6. Seleccione mes */}
              {!mostrarFechas && (
                <div>
                  <Label>Seleccione mes:</Label>
                  <div className="relative">
                    <select
                      value={mes}
                      onChange={(e) => setMes(e.target.value)}
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
              )}

              {/* 7. Selecciona año */}
              {!mostrarFechas && (
                <div>
                  <Label>Selecciona año:</Label>
                  <div className="relative">
                    <select
                      value={anio}
                      onChange={(e) => setAnio(e.target.value)}
                      className={`${selectStyle} appearance-none`}
                    >
                      {aniosOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              )}

              {/* 8. Incluir el Primer Concepto */}
              <div>
                <Label>Incluir el Primer Concepto:</Label>
                <div className="relative">
                  <select
                    value={incluirPrimerConcepto}
                    onChange={(e) => setIncluirPrimerConcepto(e.target.value)}
                    className={`${selectStyle} appearance-none`}
                  >
                    {incluirConceptoOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* Fechas (aparecen cuando se selecciona "Incluir todos los Conceptos") */}
              {mostrarFechas && (
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
            </div>

            {/* Botón de descarga */}
            <div className="flex justify-center mt-8">
              <button
                onClick={handleDescargarReporte}
                {...demoActionProps}
                className={`flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-8 py-3 font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition-all duration-200 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed ${DEMO_ACTION_CLASS}`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generando reporte...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    Descargar Reporte
                  </>
                )}
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
