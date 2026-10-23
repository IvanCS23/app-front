"use client";

import React, { useState } from "react";
import AppLayout from "@/app/components/layout/AppLayout";
import DemoNotice from "@/app/components/ui/DemoNotice";
import {
  CheckCircle2,
  X,
  AlertCircle,
  Plus,
  Trash,
  Pencil,
  ChevronDown,
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

// Bancos de México
const bancosMexico = [
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
  "BBVA Bancomer (Empresarial)",
  "Santander (Empresarial)",
];

// Tipo para Cuenta de Banco
type CuentaBanco = {
  id: string;
  titular: string;
  clabe: string;
  numeroCuenta: string;
  banco: string;
  sucursal: string;
  razonSocial: string;
  isDefault: boolean;
};

// Cuentas simuladas
const cuentasMock: CuentaBanco[] = [
  {
    id: "1",
    titular: "Juan Pérez",
    clabe: "012345678901234567",
    numeroCuenta: "1234567890",
    banco: "BBVA Bancomer",
    sucursal: "Sucursal Centro",
    razonSocial: "FacturaPro Enterprise",
    isDefault: true,
  },
  {
    id: "2",
    titular: "María García",
    clabe: "987654321098765432",
    numeroCuenta: "0987654321",
    banco: "Santander",
    sucursal: "Sucursal Norte",
    razonSocial: "FacturaPro Enterprise",
    isDefault: false,
  },
  {
    id: "3",
    titular: "Carlos López",
    clabe: "456789012345678901",
    numeroCuenta: "5678901234",
    banco: "Banorte",
    sucursal: "",
    razonSocial: "FacturaPro Enterprise",
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

// Componente Modal de Confirmación
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-w-md w-full rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/20">
            <AlertCircle className="h-10 w-10 text-yellow-500" />
          </div>
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">{title}</h2>
          <p className="text-[#64748B] mb-6">{message}</p>
          <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 rounded-xl bg-gray-600 px-4 py-2 font-medium text-white hover:bg-gray-500">Cancelar</button>
            <button onClick={onConfirm} className="flex-1 rounded-xl bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-400">Aceptar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal para agregar/editar cuenta de banco
const CuentaModal = ({ isOpen, onClose, onSave, editingCuenta }: { isOpen: boolean; onClose: () => void; onSave: (cuenta: any) => void; editingCuenta?: CuentaBanco | null }) => {
  const [titular, setTitular] = useState(editingCuenta?.titular || "");
  const [clabe, setClabe] = useState(editingCuenta?.clabe || "");
  const [numeroCuenta, setNumeroCuenta] = useState(editingCuenta?.numeroCuenta || "");
  const [banco, setBanco] = useState(editingCuenta?.banco || "");
  const [sucursal, setSucursal] = useState(editingCuenta?.sucursal || "");
  const [razonSocial, setRazonSocial] = useState(editingCuenta?.razonSocial || "FacturaPro Enterprise");

  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "success" as "success" | "error" | "warning" });

  const showAlert = (title: string, message: string, type: "success" | "error" | "warning") => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  const handleSubmit = () => {
    if (!titular) {
      showAlert("Campo requerido", "El titular de la cuenta es obligatorio", "error");
      return;
    }
    if (!numeroCuenta) {
      showAlert("Campo requerido", "El número de cuenta es obligatorio", "error");
      return;
    }
    if (!banco) {
      showAlert("Campo requerido", "El banco es obligatorio", "error");
      return;
    }

    const newCuenta = {
      id: editingCuenta?.id || Date.now().toString(),
      titular,
      clabe,
      numeroCuenta,
      banco,
      sucursal,
      razonSocial,
      isDefault: editingCuenta?.isDefault || false,
    };

    onSave(newCuenta);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
          <h2 className="text-xl font-bold text-[#0F172A]">{editingCuenta ? "Editar Cuenta" : "Agregar Banco"}</h2>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label>Titular de la cuenta:</Label>
              <input type="text" value={titular} onChange={(e) => setTitular(e.target.value)} placeholder="Titular de la cuenta" className={inputStyle} />
            </div>
            <div>
              <Label>CLABE:</Label>
              <input type="text" value={clabe} onChange={(e) => setClabe(e.target.value)} placeholder="CLABE Interbancaria (Opcional)" maxLength={18} className={inputStyle} />
            </div>
            <div>
              <Label>Número de cuenta:</Label>
              <input type="text" value={numeroCuenta} onChange={(e) => setNumeroCuenta(e.target.value)} placeholder="Número de cuenta" className={inputStyle} />
            </div>
            <div>
              <Label>Banco:</Label>
              <div className="relative">
                <select value={banco} onChange={(e) => setBanco(e.target.value)} className={`${selectStyle} appearance-none`}>
                  <option value="">Seleccione un banco</option>
                  {bancosMexico.map((bank) => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div>
              <Label>Sucursal:</Label>
              <input type="text" value={sucursal} onChange={(e) => setSucursal(e.target.value)} placeholder="Sucursal (Opcional)" className={inputStyle} />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-4 border-t border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
          <button onClick={onClose} className="rounded-xl bg-red-500 px-6 py-2 font-medium text-white shadow-[0_10px_30px_rgba(255,0,0,0.25)] hover:bg-red-400">Cancelar</button>
          <button onClick={handleSubmit} className="rounded-xl bg-blue-500 px-6 py-2 font-medium text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] hover:bg-blue-400">Guardar</button>
        </div>
      </div>

      <AlertModal isOpen={alertModal.isOpen} onClose={() => setAlertModal({ ...alertModal, isOpen: false })} title={alertModal.title} message={alertModal.message} type={alertModal.type} />
    </div>
  );
};

export default function CuentasBanco() {
  const [cuentas, setCuentas] = useState<CuentaBanco[]>(cuentasMock);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCuenta, setEditingCuenta] = useState<CuentaBanco | null>(null);
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "success" as "success" | "error" | "warning" });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: () => {}, cuentaId: "", cuentaNombre: "" });

  const showAlert = (title: string, message: string, type: "success" | "error" | "warning") => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModal({ isOpen: true, title, message, onConfirm, cuentaId: "", cuentaNombre: "" });
  };

  const handleSaveCuenta = (cuenta: CuentaBanco) => {
    const existingIndex = cuentas.findIndex(c => c.id === cuenta.id);
    if (existingIndex !== -1) {
      const updatedCuentas = [...cuentas];
      updatedCuentas[existingIndex] = cuenta;
      setCuentas(updatedCuentas);
      showAlert("Éxito", "Cuenta actualizada correctamente", "success");
    } else {
      setCuentas([...cuentas, cuenta]);
      showAlert("Éxito", "Cuenta agregada correctamente", "success");
    }
    setIsModalOpen(false);
    setEditingCuenta(null);
  };

  const handleEditCuenta = (cuenta: CuentaBanco) => {
    setEditingCuenta(cuenta);
    setIsModalOpen(true);
  };

  const handleDeleteCuenta = (id: string, titular: string) => {
    showConfirm("Confirmar eliminación", `¿Estás seguro de eliminar la cuenta de "${titular}"?`, () => {
      setCuentas(cuentas.filter(c => c.id !== id));
      showAlert("Eliminado", `La cuenta de "${titular}" ha sido eliminada`, "success");
      setConfirmModal({ ...confirmModal, isOpen: false });
    });
  };

  const handleSetDefault = (id: string, titular: string) => {
    showConfirm("Establecer como predeterminada", `¿Desea poner esta cuenta de "${titular}" como predeterminada?`, () => {
      setCuentas(cuentas.map(c => ({
        ...c,
        isDefault: c.id === id
      })));
      showAlert("Actualizado", `La cuenta de "${titular}" ha sido establecida como predeterminada`, "success");
      setConfirmModal({ ...confirmModal, isOpen: false });
    });
  };

  return (
    <AppLayout>
      <div className="min-h-screen rounded-lg bg-[#F8FAFC]">
        <main className="mx-auto max-w-[1400px]">
          <DemoNotice readOnly />
          <fieldset disabled className="contents">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-[#0F172A]">Cuentas de Banco</h1>
              <p className="mt-2 text-[#64748B]">Administra las cuentas bancarias para tus operaciones.</p>
            </div>
            <button onClick={() => { setEditingCuenta(null); setIsModalOpen(true); }} className="flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] hover:bg-blue-400">
              <Plus className="h-5 w-5" />Agregar cuenta
            </button>
          </div>

          <div className="rounded-2xl border-2 border-[#E2E8F0] bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F1F5F9]">
                  <tr className="text-left text-sm uppercase tracking-wide text-[#475569]">
                    <th className="px-6 py-4 w-16">Default</th>
                    <th className="px-6 py-4">Titular</th>
                    <th className="px-6 py-4">Número de cuenta</th>
                    <th className="px-6 py-4">Banco</th>
                    <th className="px-6 py-4">Nombre o razón social banco</th>
                    <th className="px-6 py-4 w-24">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cuentas.map((cuenta) => (
                    <tr key={cuenta.id} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]">
                      <td className="px-6 py-4">
                        <input
                          type="radio"
                          name="defaultAccount"
                          checked={cuenta.isDefault || false}
                          onChange={() => handleSetDefault(cuenta.id, cuenta.titular)}
                          className="h-5 w-5 text-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 font-bold">{cuenta.titular}</td>
                      <td className="px-6 py-4 font-mono text-[#64748B]">{cuenta.numeroCuenta}</td>
                      <td className="px-6 py-4">{cuenta.banco}</td>
                      <td className="px-6 py-4">{cuenta.razonSocial}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => handleEditCuenta(cuenta)} className="text-blue-600 hover:text-blue-700 transition-colors" title="Editar">
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleDeleteCuenta(cuenta.id, cuenta.titular)} className="text-red-500 hover:text-red-600 transition-colors" title="Eliminar">
                            <Trash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {cuentas.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center text-[#64748B]">
                        No hay cuentas bancarias registradas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          </fieldset>
        </main>
      </div>

      <CuentaModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingCuenta(null); }} onSave={handleSaveCuenta} editingCuenta={editingCuenta} />
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
