"use client";

import React, { useState } from "react";
import AppLayout from "@/app/components/layout/AppLayout";
import {
  CheckCircle2,
  X,
  AlertCircle,
  Plus,
  Trash,
  Pencil,
} from "lucide-react";

const inputStyle =
  "w-full rounded-xl border-2 border-[#1e293b] bg-[#081423] px-4 py-3 text-white outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20";

type LabelProps = {
  children: React.ReactNode;
  withInfo?: boolean;
  infoText?: string;
};

function Label({ children, withInfo = false, infoText = "" }: LabelProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="mb-2 flex items-center gap-1">
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

// Tipo para Observación
type Observacion = {
  id: string;
  titulo: string;
  descripcion: string;
  isDefault: boolean;
};

// Observaciones simuladas
const observacionesMock: Observacion[] = [
  {
    id: "1",
    titulo: "Falta de factura",
    descripcion: "El cliente solicitó la factura pero aún no ha sido enviada",
    isDefault: true,
  },
  {
    id: "2",
    titulo: "Pago pendiente",
    descripcion: "El pago está programado para la próxima semana",
    isDefault: false,
  },
  {
    id: "3",
    titulo: "Devolución de mercancía",
    descripcion: "El cliente solicitó la devolución de parte de los productos",
    isDefault: false,
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

// Componente Modal de Confirmación
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-w-md w-full rounded-2xl border border-[#173156] bg-[#071321] shadow-2xl">
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/20">
            <AlertCircle className="h-10 w-10 text-yellow-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
          <p className="text-slate-400 mb-6">{message}</p>
          <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 rounded-xl bg-gray-600 px-4 py-2 font-medium text-white hover:bg-gray-500">Cancelar</button>
            <button onClick={onConfirm} className="flex-1 rounded-xl bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-400">Aceptar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal para agregar/editar observación
const ObservacionModal = ({ isOpen, onClose, onSave, editingObservacion }: { isOpen: boolean; onClose: () => void; onSave: (observacion: any) => void; editingObservacion?: Observacion | null }) => {
  const [titulo, setTitulo] = useState(editingObservacion?.titulo || "");
  const [descripcion, setDescripcion] = useState(editingObservacion?.descripcion || "");

  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "success" as "success" | "error" | "warning" });

  const showAlert = (title: string, message: string, type: "success" | "error" | "warning") => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  const handleSubmit = () => {
    if (!titulo) {
      showAlert("Campo requerido", "El título es obligatorio", "error");
      return;
    }
    if (!descripcion) {
      showAlert("Campo requerido", "La descripción es obligatoria", "error");
      return;
    }

    const newObservacion = {
      id: editingObservacion?.id || Date.now().toString(),
      titulo,
      descripcion,
      isDefault: editingObservacion?.isDefault || false,
    };

    onSave(newObservacion);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#173156] bg-[#071321] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#173156] bg-[#071321] px-6 py-4">
          <h2 className="text-xl font-bold text-white">{editingObservacion ? "Editar Observación" : "Nueva Observación"}</h2>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-[#0d1b35] hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label>Título:</Label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ingrese el título de la observación"
                className={inputStyle}
              />
            </div>
            <div>
              <Label>Descripción:</Label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Ingrese la descripción de la observación"
                rows={4}
                className={`${inputStyle} resize-y`}
              />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-4 border-t border-[#173156] bg-[#071321] px-6 py-4">
          <button onClick={onClose} className="rounded-xl bg-red-500 px-6 py-2 font-medium text-white shadow-[0_10px_30px_rgba(255,0,0,0.25)] hover:bg-red-400">Cancelar</button>
          <button onClick={handleSubmit} className="rounded-xl bg-blue-500 px-6 py-2 font-medium text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] hover:bg-blue-400">Guardar</button>
        </div>
      </div>

      <AlertModal isOpen={alertModal.isOpen} onClose={() => setAlertModal({ ...alertModal, isOpen: false })} title={alertModal.title} message={alertModal.message} type={alertModal.type} />
    </div>
  );
};

export default function Observaciones() {
  const [observaciones, setObservaciones] = useState<Observacion[]>(observacionesMock);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingObservacion, setEditingObservacion] = useState<Observacion | null>(null);
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "success" as "success" | "error" | "warning" });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: () => {}, observacionId: "", observacionTitulo: "" });

  const showAlert = (title: string, message: string, type: "success" | "error" | "warning") => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModal({ isOpen: true, title, message, onConfirm, observacionId: "", observacionTitulo: "" });
  };

  const handleSaveObservacion = (observacion: Observacion) => {
    const existingIndex = observaciones.findIndex(o => o.id === observacion.id);
    if (existingIndex !== -1) {
      const updatedObservaciones = [...observaciones];
      updatedObservaciones[existingIndex] = observacion;
      setObservaciones(updatedObservaciones);
      showAlert("Éxito", "Observación actualizada correctamente", "success");
    } else {
      setObservaciones([...observaciones, observacion]);
      showAlert("Éxito", "Observación agregada correctamente", "success");
    }
    setIsModalOpen(false);
    setEditingObservacion(null);
  };

  const handleEditObservacion = (observacion: Observacion) => {
    setEditingObservacion(observacion);
    setIsModalOpen(true);
  };

  const handleDeleteObservacion = (id: string, titulo: string) => {
    showConfirm("Confirmar eliminación", `¿Estás seguro de eliminar la observación "${titulo}"?`, () => {
      setObservaciones(observaciones.filter(o => o.id !== id));
      showAlert("Eliminado", `La observación "${titulo}" ha sido eliminada`, "success");
      setConfirmModal({ ...confirmModal, isOpen: false });
    });
  };

  const handleSetDefault = (id: string, titulo: string) => {
    showConfirm("Establecer como predeterminada", `¿Desea poner esta observación "${titulo}" como predeterminada?`, () => {
      setObservaciones(observaciones.map(o => ({
        ...o,
        isDefault: o.id === id
      })));
      showAlert("Actualizado", `La observación "${titulo}" ha sido establecida como predeterminada`, "success");
      setConfirmModal({ ...confirmModal, isOpen: false });
    });
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#071321] text-white">
        <main className="mx-auto max-w-[1400px]">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-white">Observaciones</h1>
              <p className="mt-2 text-slate-400">Administra las observaciones para tus facturas y documentos.</p>
            </div>
            <button
              onClick={() => { setEditingObservacion(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] hover:bg-blue-400"
            >
              <Plus className="h-5 w-5" />Agregar Observación
            </button>
          </div>

          <div className="rounded-2xl border-2 border-[#16304f] bg-[#09172b] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#16253e]">
                  <tr className="text-left text-sm uppercase tracking-wide text-slate-400">
                    <th className="px-6 py-4 w-16">Default</th>
                    <th className="px-6 py-4">Título</th>
                    <th className="px-6 py-4">Descripción</th>
                    <th className="px-6 py-4 w-24">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {observaciones.map((observacion) => (
                    <tr key={observacion.id} className="border-t border-[#16304f] hover:bg-[#0d1b35]">
                      <td className="px-6 py-4">
                        <input
                          type="radio"
                          name="defaultObservation"
                          checked={observacion.isDefault || false}
                          onChange={() => handleSetDefault(observacion.id, observacion.titulo)}
                          className="h-5 w-5 text-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 font-bold">{observacion.titulo}</td>
                      <td className="px-6 py-4 text-slate-300">{observacion.descripcion}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => handleEditObservacion(observacion)} className="text-blue-400 hover:text-blue-300 transition-colors" title="Editar">
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleDeleteObservacion(observacion.id, observacion.titulo)} className="text-red-400 hover:text-red-300 transition-colors" title="Eliminar">
                            <Trash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {observaciones.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center text-slate-400">
                        No hay observaciones registradas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <ObservacionModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingObservacion(null); }}
        onSave={handleSaveObservacion}
        editingObservacion={editingObservacion}
      />
      <AlertModal isOpen={alertModal.isOpen} onClose={() => setAlertModal({ ...alertModal, isOpen: false })} title={alertModal.title} message={alertModal.message} type={alertModal.type} />
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />
    </AppLayout>
  );
}