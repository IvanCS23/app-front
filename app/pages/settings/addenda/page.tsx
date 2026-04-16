"use client";

import React, { useState } from "react";
import AppLayout from "@/app/components/layout/AppLayout";
import {
  Save,
  CheckCircle2,
  X,
  AlertCircle,
} from "lucide-react";

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

// Lista de addendas
const addendasList = [
  "ABB", "Ahmsa", "Amazon", "AMECE", "Asonioscoc", "BBVA", "CalsonicKansei",
  "CityExpress", "ComerCityMarket", "ContinentalTire", "CoppelMuebles", "CrediTienda",
  "EU", "Ford", "Hapag", "Inbursa", "InnovaSport", "ITSB", "ITSBOVYE", "KNRECEPCION",
  "Lesaffre", "LeviStrauss", "Mabe", "Magna", "Maier", "Mapfre", "Sage", "Sanmina",
  "Sanofi", "Soriana", "Ternium", "Vallen", "Viscofan", "Walmart", "WalmartCartaPorte", "Yanfeng"
];

export default function Addendas() {
  // Estados para las addendas seleccionadas
  const [selectedAddendas, setSelectedAddendas] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    addendasList.forEach(addenda => {
      initial[addenda] = false;
    });
    return initial;
  });
  
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "success" as "success" | "error" | "warning" });

  // Mostrar alerta
  const showAlert = (title: string, message: string, type: "success" | "error" | "warning") => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  // Manejar selección de addenda
  const handleSelectAddenda = (addenda: string) => {
    setSelectedAddendas(prev => ({
      ...prev,
      [addenda]: !prev[addenda]
    }));
  };

  // Guardar configuración
  const handleSave = () => {
    const enabledAddendas = Object.entries(selectedAddendas)
      .filter(([, enabled]) => enabled)
      .map(([addenda]) => addenda);
    
    console.log("Addendas seleccionadas:", enabledAddendas);
    showAlert("Configuración guardada", "Las addendas han sido actualizadas correctamente", "success");
  };

  // Contar cuántos están seleccionados
  const selectedCount = Object.values(selectedAddendas).filter(Boolean).length;
  const totalCount = addendasList.length;

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#071321] text-white">
        <main className="mx-auto max-w-[1400px]">
          {/* Título principal */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-white">Addendas</h1>
            <p className="mt-2 text-slate-400">
              Administra las addendas que deseas incluir en tus comprobantes fiscales.
            </p>
          </div>

          {/* Card principal */}
          <div className="rounded-2xl border-2 border-[#16304f] bg-[#09172b] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.01)]">
            {/* Texto informativo */}
            <div className="mb-6 p-4 rounded-xl bg-[#0a1424] border border-[#173156]">
              <p className="text-slate-300 text-sm leading-relaxed">
                Adquiere y activa las Addendas que requieras para tus operaciones comerciales. 
                Una vez contratadas, podrás incorporarlas automáticamente en tus facturas según 
                el cliente o el tipo de transacción que estés realizando.
              </p>
            </div>

            {/* Grid de botones de addendas */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {addendasList.map((addenda) => (
                <button
                  key={addenda}
                  onClick={() => handleSelectAddenda(addenda)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    selectedAddendas[addenda]
                      ? "bg-blue-500 text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] hover:bg-blue-400"
                      : "bg-[#0d1b35] border-2 border-[#173156] text-slate-300 hover:bg-[#16233b] hover:border-[#3c83f666] hover:text-white"
                  }`}
                >
                  {addenda}
                </button>
              ))}
            </div>

            {/* Contador de selección y botón Guardar */}
            <div className="mt-6 pt-4 border-t border-[#173156] flex justify-between items-center">
              <p className="text-sm text-slate-400">
                <span className="font-bold text-blue-400">{selectedCount}</span> de <span className="font-bold">{totalCount}</span> addendas seleccionadas
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