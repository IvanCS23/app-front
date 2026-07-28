"use client";

import React, { useState } from "react";
import AppLayout from "@/app/components/layout/AppLayout";
import {
  Save,
  CheckCircle2,
  X,
  AlertCircle,
  Plus,
  User,
  Building2,
  Mail,
  Shield,
  Eye,
  EyeOff,
  Trash,
  Pencil,
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

// Tipo para Usuario
type Usuario = {
  id: string;
  nombre: string;
  email: string;
  empresa: string;
  rol: string;
  password?: string;
  permisos: {
    crearFacturas: boolean;
    consultar: boolean;
    crearNominas: boolean;
    perfilFiscal: boolean;
    carritoCompras: boolean;
    cancelarFacturas: boolean;
    mostrarIngresosGastos: boolean;
  };
  menuLateral: {
    facturas: boolean;
    catalogos: boolean;
    cuentas: boolean;
    estadisticas: boolean;
    cotizaciones: boolean;
  };
};

// Usuarios simulados
const usuariosMock: Usuario[] = [
  {
    id: "1",
    nombre: "Admin Principal",
    email: "admin@facturapro.com",
    empresa: "FacturaPro Enterprise",
    rol: "Administrador",
    permisos: {
      crearFacturas: true,
      consultar: true,
      crearNominas: true,
      perfilFiscal: true,
      carritoCompras: true,
      cancelarFacturas: true,
      mostrarIngresosGastos: true,
    },
    menuLateral: {
      facturas: true,
      catalogos: true,
      cuentas: true,
      estadisticas: true,
      cotizaciones: true,
    },
  },
  {
    id: "2",
    nombre: "Laura Gómez",
    email: "laura.gomez@facturapro.com",
    empresa: "FacturaPro Enterprise",
    rol: "Contador",
    permisos: {
      crearFacturas: true,
      consultar: true,
      crearNominas: false,
      perfilFiscal: true,
      carritoCompras: false,
      cancelarFacturas: false,
      mostrarIngresosGastos: true,
    },
    menuLateral: {
      facturas: true,
      catalogos: false,
      cuentas: true,
      estadisticas: true,
      cotizaciones: false,
    },
  },
  {
    id: "3",
    nombre: "Carlos Méndez",
    email: "carlos.mendez@facturapro.com",
    empresa: "FacturaPro Enterprise",
    rol: "Vendedor",
    permisos: {
      crearFacturas: true,
      consultar: true,
      crearNominas: false,
      perfilFiscal: false,
      carritoCompras: true,
      cancelarFacturas: false,
      mostrarIngresosGastos: false,
    },
    menuLateral: {
      facturas: true,
      catalogos: true,
      cuentas: false,
      estadisticas: false,
      cotizaciones: true,
    },
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
            <button onClick={onConfirm} className="flex-1 rounded-xl bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-400">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal para agregar/editar usuario
const UserModal = ({ isOpen, onClose, onSave, editingUser }: { isOpen: boolean; onClose: () => void; onSave: (user: any) => void; editingUser?: Usuario | null }) => {
  const [nombre, setNombre] = useState(editingUser?.nombre || "");
  const [email, setEmail] = useState(editingUser?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Permisos
  const [crearFacturas, setCrearFacturas] = useState(editingUser?.permisos?.crearFacturas || false);
  const [consultar, setConsultar] = useState(editingUser?.permisos?.consultar || false);
  const [crearNominas, setCrearNominas] = useState(editingUser?.permisos?.crearNominas || false);
  const [perfilFiscal, setPerfilFiscal] = useState(editingUser?.permisos?.perfilFiscal || false);
  const [carritoCompras, setCarritoCompras] = useState(editingUser?.permisos?.carritoCompras || false);
  const [cancelarFacturas, setCancelarFacturas] = useState(editingUser?.permisos?.cancelarFacturas || false);
  const [mostrarIngresosGastos, setMostrarIngresosGastos] = useState(editingUser?.permisos?.mostrarIngresosGastos || false);

  // Menú lateral
  const [menuFacturas, setMenuFacturas] = useState(editingUser?.menuLateral?.facturas || false);
  const [menuCatalogos, setMenuCatalogos] = useState(editingUser?.menuLateral?.catalogos || false);
  const [menuCuentas, setMenuCuentas] = useState(editingUser?.menuLateral?.cuentas || false);
  const [menuEstadisticas, setMenuEstadisticas] = useState(editingUser?.menuLateral?.estadisticas || false);
  const [menuCotizaciones, setMenuCotizaciones] = useState(editingUser?.menuLateral?.cotizaciones || false);

  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "success" as "success" | "error" | "warning" });

  const showAlert = (title: string, message: string, type: "success" | "error" | "warning") => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  const handleSubmit = () => {
    if (!nombre) {
      showAlert("Campo requerido", "El nombre de usuario es obligatorio", "error");
      return;
    }
    if (!email) {
      showAlert("Campo requerido", "El correo electrónico es obligatorio", "error");
      return;
    }
    if (!editingUser && !password) {
      showAlert("Campo requerido", "La contraseña es obligatoria", "error");
      return;
    }
    if (password !== confirmPassword) {
      showAlert("Error de contraseña", "Las contraseñas no coinciden", "error");
      return;
    }

    const newUser = {
      id: editingUser?.id || Date.now().toString(),
      nombre,
      email,
      empresa: "FacturaPro Enterprise",
      rol: "Usuario",
      password,
      permisos: {
        crearFacturas,
        consultar,
        crearNominas,
        perfilFiscal,
        carritoCompras,
        cancelarFacturas,
        mostrarIngresosGastos,
      },
      menuLateral: {
        facturas: menuFacturas,
        catalogos: menuCatalogos,
        cuentas: menuCuentas,
        estadisticas: menuEstadisticas,
        cotizaciones: menuCotizaciones,
      },
    };

    onSave(newUser);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
          <h2 className="text-xl font-bold text-[#0F172A]">{editingUser ? "Editar Usuario" : "Datos de Usuario"}</h2>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label>Nombre de Usuario:</Label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre de usuario" className={inputStyle} />
            </div>
            <div>
              <Label>Correo electrónico:</Label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electrónico" className={inputStyle} />
            </div>
            <div>
              <Label>Contraseña:</Label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className={`${inputStyle} pr-12`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div>
              <Label>Confirmar Contraseña:</Label>
              <div className="relative">
                <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirme su contraseña" className={`${inputStyle} pr-12`} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-md font-bold text-[#0F172A] mb-4 border-b border-[#E2E8F0] pb-2">Permisos</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={crearFacturas} onChange={(e) => setCrearFacturas(e.target.checked)} className="w-4 h-4 rounded border-2 border-[#CBD5E1] text-blue-500 checked:bg-blue-500 checked:border-blue-500" />
                <span className="text-sm text-[#475569]">Crear Facturas</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={consultar} onChange={(e) => setConsultar(e.target.checked)} className="w-4 h-4 rounded border-2 border-[#CBD5E1] text-blue-500 checked:bg-blue-500 checked:border-blue-500" />
                <span className="text-sm text-[#475569]">Consultar</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={crearNominas} onChange={(e) => setCrearNominas(e.target.checked)} className="w-4 h-4 rounded border-2 border-[#CBD5E1] text-blue-500 checked:bg-blue-500 checked:border-blue-500" />
                <span className="text-sm text-[#475569]">Crear Nóminas</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={perfilFiscal} onChange={(e) => setPerfilFiscal(e.target.checked)} className="w-4 h-4 rounded border-2 border-[#CBD5E1] text-blue-500 checked:bg-blue-500 checked:border-blue-500" />
                <span className="text-sm text-[#475569]">Perfil Fiscal</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={carritoCompras} onChange={(e) => setCarritoCompras(e.target.checked)} className="w-4 h-4 rounded border-2 border-[#CBD5E1] text-blue-500 checked:bg-blue-500 checked:border-blue-500" />
                <span className="text-sm text-[#475569]">Carrito de compras</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={cancelarFacturas} onChange={(e) => setCancelarFacturas(e.target.checked)} className="w-4 h-4 rounded border-2 border-[#CBD5E1] text-blue-500 checked:bg-blue-500 checked:border-blue-500" />
                <span className="text-sm text-[#475569]">Cancelar facturas</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={mostrarIngresosGastos} onChange={(e) => setMostrarIngresosGastos(e.target.checked)} className="w-4 h-4 rounded border-2 border-[#CBD5E1] text-blue-500 checked:bg-blue-500 checked:border-blue-500" />
                <span className="text-sm text-[#475569]">Mostrar Ingresos y gastos</span>
              </label>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-md font-bold text-[#0F172A] mb-4 border-b border-[#E2E8F0] pb-2">Menú lateral</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={menuFacturas} onChange={(e) => setMenuFacturas(e.target.checked)} className="w-4 h-4 rounded border-2 border-[#CBD5E1] text-blue-500 checked:bg-blue-500 checked:border-blue-500" />
                <span className="text-sm text-[#475569]">Facturas</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={menuCatalogos} onChange={(e) => setMenuCatalogos(e.target.checked)} className="w-4 h-4 rounded border-2 border-[#CBD5E1] text-blue-500 checked:bg-blue-500 checked:border-blue-500" />
                <span className="text-sm text-[#475569]">Catálogos</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={menuCuentas} onChange={(e) => setMenuCuentas(e.target.checked)} className="w-4 h-4 rounded border-2 border-[#CBD5E1] text-blue-500 checked:bg-blue-500 checked:border-blue-500" />
                <span className="text-sm text-[#475569]">Cuentas</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={menuEstadisticas} onChange={(e) => setMenuEstadisticas(e.target.checked)} className="w-4 h-4 rounded border-2 border-[#CBD5E1] text-blue-500 checked:bg-blue-500 checked:border-blue-500" />
                <span className="text-sm text-[#475569]">Estadísticas</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={menuCotizaciones} onChange={(e) => setMenuCotizaciones(e.target.checked)} className="w-4 h-4 rounded border-2 border-[#CBD5E1] text-blue-500 checked:bg-blue-500 checked:border-blue-500" />
                <span className="text-sm text-[#475569]">Cotizaciones</span>
              </label>
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

export default function Users() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosMock);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "success" as "success" | "error" | "warning" });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: () => {}, userId: "", userName: "" });

  const showAlert = (title: string, message: string, type: "success" | "error" | "warning") => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModal({ isOpen: true, title, message, onConfirm, userId: "", userName: "" });
  };

  const handleSaveUser = (user: Usuario) => {
    const existingIndex = usuarios.findIndex(u => u.id === user.id);
    if (existingIndex !== -1) {
      const updatedUsers = [...usuarios];
      updatedUsers[existingIndex] = user;
      setUsuarios(updatedUsers);
      showAlert("Éxito", "Usuario actualizado correctamente", "success");
    } else {
      setUsuarios([...usuarios, user]);
      showAlert("Éxito", "Usuario agregado correctamente", "success");
    }
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleEditUser = (user: Usuario) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (id: string, nombre: string) => {
    showConfirm("Confirmar eliminación", `¿Estás seguro de eliminar al usuario "${nombre}"?`, () => {
      setUsuarios(usuarios.filter(u => u.id !== id));
      showAlert("Eliminado", `El usuario "${nombre}" ha sido eliminado`, "success");
      setConfirmModal({ ...confirmModal, isOpen: false });
    });
  };

  const getRolColor = (rol: string) => {
    switch (rol) {
      case "Administrador": return "bg-red-100 text-red-700";
      case "Contador": return "bg-blue-100 text-blue-700";
      case "Vendedor": return "bg-emerald-100 text-emerald-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen rounded-lg bg-[#F8FAFC]">
        <main className="mx-auto max-w-[1400px]">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-[#0F172A]">Usuarios</h1>
              <p className="mt-2 text-[#64748B]">Gestiona los usuarios y sus permisos dentro del sistema.</p>
            </div>
            <button onClick={() => { setEditingUser(null); setIsModalOpen(true); }} className="flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] hover:bg-blue-400">
              <Plus className="h-5 w-5" />Agregar Usuario
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {usuarios.map((usuario) => (
              <div key={usuario.id} className="rounded-2xl border-2 border-[#E2E8F0] bg-white p-6 shadow-sm hover:border-blue-200 ransite-all duration-300 hover:-translate-y-2 cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#0F172A]">{usuario.nombre}</h3>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getRolColor(usuario.rol)}`}>{usuario.rol}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditUser(usuario)} className="text-slate-400 hover:text-blue-600 transition-colors" title="Editar"><Pencil className="h-5 w-5" /></button>
                    <button onClick={() => handleDeleteUser(usuario.id, usuario.nombre)} className="text-slate-400 hover:text-red-500 transition-colors" title="Eliminar"><Trash className="h-5 w-5" /></button>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-slate-500" />
                    <span className="text-[#64748B]">Empresa:</span>
                    <span className="text-[#0F172A]">{usuario.empresa}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <span className="text-[#64748B]">Email:</span>
                    <span className="text-[#0F172A]">{usuario.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <UserModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingUser(null); }} onSave={handleSaveUser} editingUser={editingUser} />
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
