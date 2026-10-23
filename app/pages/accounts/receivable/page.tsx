"use client";

import React, { useState } from "react";
import AppLayout from "@/app/components/layout/AppLayout";
import DemoNotice from "@/app/components/ui/DemoNotice";
import {
  Search,
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  Eye,
  X,
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
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

// Tipos de datos
type Articulo = {
  id: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  descuento: number;
  subtotal: number;
  impuestos: number;
  total: number;
};

type Factura = {
  id: string;
  fecha: string;
  folio: string;
  cliente: string;
  tipoCliente: "fisica" | "moral";
  moneda: string;
  subtotal: number;
  impuestos: number;
  total: number;
  estadoPago: "sin_pagar" | "desconocida" | "pagada";
  articulos: Articulo[];
};

type Cotizacion = {
  id: string;
  fecha: string;
  folio: string;
  cliente: string;
  tipoCliente: "fisica" | "moral";
  moneda: string;
  subtotal: number;
  impuestos: number;
  total: number;
  estadoPago: "sin_pagar" | "desconocida" | "pagada";
  articulos: Articulo[];
};

// Datos simulados
const facturasMock: Factura[] = [
  {
    id: "1",
    fecha: "2024-01-15",
    folio: "FAC-001",
    cliente: "Juan Pérez García",
    tipoCliente: "fisica",
    moneda: "MXN",
    subtotal: 12500.00,
    impuestos: 2000.00,
    total: 14500.00,
    estadoPago: "sin_pagar",
    articulos: [
      {
        id: "a1",
        nombre: "Laptop Gamer",
        descripcion: "Laptop 15.6 pulgadas, 16GB RAM, 512GB SSD",
        cantidad: 1,
        precio: 12500.00,
        descuento: 0,
        subtotal: 12500.00,
        impuestos: 2000.00,
        total: 14500.00,
      },
    ],
  },
  {
    id: "2",
    fecha: "2024-01-20",
    folio: "FAC-002",
    cliente: "Constructora Integral SA de CV",
    tipoCliente: "moral",
    moneda: "USD",
    subtotal: 3500.00,
    impuestos: 560.00,
    total: 4060.00,
    estadoPago: "sin_pagar",
    articulos: [
      {
        id: "a2",
        nombre: "Monitor 24 pulgadas",
        descripcion: "Monitor LED Full HD",
        cantidad: 2,
        precio: 1750.00,
        descuento: 0,
        subtotal: 3500.00,
        impuestos: 560.00,
        total: 4060.00,
      },
    ],
  },
  {
    id: "3",
    fecha: "2024-01-25",
    folio: "FAC-003",
    cliente: "María López Hernández",
    tipoCliente: "fisica",
    moneda: "MXN",
    subtotal: 8900.00,
    impuestos: 1424.00,
    total: 10324.00,
    estadoPago: "desconocida",
    articulos: [
      {
        id: "a3",
        nombre: "Silla Ergonomica",
        descripcion: "Silla de oficina con soporte lumbar",
        cantidad: 2,
        precio: 2450.00,
        descuento: 0,
        subtotal: 4900.00,
        impuestos: 784.00,
        total: 5684.00,
      },
      {
        id: "a4",
        nombre: "Escritorio Ejecutivo",
        descripcion: "Escritorio de 1.50m con acabado moderno",
        cantidad: 1,
        precio: 4000.00,
        descuento: 0,
        subtotal: 4000.00,
        impuestos: 640.00,
        total: 4640.00,
      },
    ],
  },
  {
    id: "4",
    fecha: "2024-02-01",
    folio: "FAC-004",
    cliente: "Tech Solutions SA",
    tipoCliente: "moral",
    moneda: "MXN",
    subtotal: 22500.00,
    impuestos: 3600.00,
    total: 26100.00,
    estadoPago: "pagada",
    articulos: [
      {
        id: "a5",
        nombre: "Servidor Dell",
        descripcion: "Servidor PowerEdge con 64GB RAM",
        cantidad: 1,
        precio: 22500.00,
        descuento: 0,
        subtotal: 22500.00,
        impuestos: 3600.00,
        total: 26100.00,
      },
    ],
  },
];

const cotizacionesMock: Cotizacion[] = [
  {
    id: "1",
    fecha: "2024-02-10",
    folio: "COT-001",
    cliente: "Automotriz del Norte",
    tipoCliente: "moral",
    moneda: "MXN",
    subtotal: 18500.00,
    impuestos: 2960.00,
    total: 21460.00,
    estadoPago: "sin_pagar",
    articulos: [
      {
        id: "a6",
        nombre: "Software ERP",
        descripcion: "Licencia anual para 10 usuarios",
        cantidad: 1,
        precio: 18500.00,
        descuento: 0,
        subtotal: 18500.00,
        impuestos: 2960.00,
        total: 21460.00,
      },
    ],
  },
  {
    id: "2",
    fecha: "2024-02-15",
    folio: "COT-002",
    cliente: "Consultoría Fiscal SC",
    tipoCliente: "moral",
    moneda: "USD",
    subtotal: 5200.00,
    impuestos: 832.00,
    total: 6032.00,
    estadoPago: "sin_pagar",
    articulos: [
      {
        id: "a7",
        nombre: "Capacitación Fiscal",
        descripcion: "Curso especializado para el equipo",
        cantidad: 1,
        precio: 5200.00,
        descuento: 0,
        subtotal: 5200.00,
        impuestos: 832.00,
        total: 6032.00,
      },
    ],
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

// Modal de confirmación para cambiar estado a pagado
const ConfirmPagoModal = ({ isOpen, onClose, onConfirm, folio, cliente }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; folio: string; cliente: string }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-w-md w-full rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">Confirmar pago</h2>
          <p className="text-[#64748B] mb-2">
            ¿Desea marcar como <span className="text-emerald-600 font-bold">PAGADA</span> la siguiente factura?
          </p>
          <div className="bg-[#F8FAFC] rounded-lg p-3 mb-4 text-left">
            <p className="text-sm"><span className="text-[#64748B]">Folio:</span> <span className="text-[#0F172A] font-mono">{folio}</span></p>
            <p className="text-sm"><span className="text-[#64748B]">Cliente:</span> <span className="text-[#0F172A]">{cliente}</span></p>
          </div>
          <p className="text-[#64748B] text-sm mb-6">Esta acción eliminará el registro de la tabla actual.</p>
          <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 rounded-xl bg-gray-600 px-4 py-2 font-medium text-white hover:bg-gray-500">Cancelar</button>
            <button onClick={onConfirm} className="flex-1 rounded-xl bg-emerald-500 px-4 py-2 font-medium text-white hover:bg-emerald-400">Confirmar pago</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal para visualizar detalle de factura/cotización
const DetalleModal = ({ isOpen, onClose, item, tipo }: { isOpen: boolean; onClose: () => void; item: Factura | Cotizacion | null; tipo: string }) => {
  if (!isOpen || !item) return null;

  const totalGeneral = item.articulos.reduce((sum, art) => sum + art.total, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
          <h2 className="text-xl font-bold text-[#0F172A]">Detalle de {tipo} - Folio: {item.folio}</h2>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-6">
          {/* Información general */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div><p className="text-xs text-[#64748B]">Fecha</p><p className="text-[#0F172A] font-medium">{item.fecha}</p></div>
            <div><p className="text-xs text-[#64748B]">Cliente</p><p className="text-[#0F172A] font-medium">{item.cliente}</p></div>
            <div><p className="text-xs text-[#64748B]">Moneda</p><p className="text-[#0F172A] font-medium">{item.moneda}</p></div>
            <div><p className="text-xs text-[#64748B]">Estado</p><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${item.estadoPago === "pagada" ? "bg-emerald-100 text-emerald-700" : item.estadoPago === "desconocida" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{item.estadoPago === "sin_pagar" ? "Sin pagar" : item.estadoPago === "desconocida" ? "Desconocida" : "Pagada"}</span></div>
          </div>

          {/* Tabla de artículos */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F1F5F9]">
                <tr className="text-left text-sm uppercase tracking-wide text-[#475569]">
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Descripción</th>
                  <th className="px-4 py-3 text-center">Cantidad</th>
                  <th className="px-4 py-3 text-right">Precio</th>
                  <th className="px-4 py-3 text-right">Descuento</th>
                  <th className="px-4 py-3 text-right">Subtotal</th>
                  <th className="px-4 py-3 text-right">Impuestos</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {item.articulos.map((art, idx) => (
                  <tr key={art.id} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]">
                    <td className="px-4 py-3 font-medium">{art.nombre}</td>
                    <td className="px-4 py-3 text-[#64748B]">{art.descripcion}</td>
                    <td className="px-4 py-3 text-center">{art.cantidad}</td>
                    <td className="px-4 py-3 text-right">${art.precio.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right">${art.descuento.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right">${art.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right">${art.impuestos.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-600">${art.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#F8FAFC]">
                <tr className="border-t border-[#E2E8F0]">
                  <td colSpan={7} className="px-4 py-3 text-right font-bold text-[#0F172A]">Total Final:</td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-600 text-lg">${totalGeneral.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CuentasPorPagar() {
  const [tipo, setTipo] = useState("facturas");
  const [deTipo, setDeTipo] = useState("por_pagar");
  const [searchText, setSearchText] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [facturas, setFacturas] = useState<Factura[]>(facturasMock);
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>(cotizacionesMock);
  const [selectedItem, setSelectedItem] = useState<Factura | Cotizacion | null>(null);
  const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingPagoId, setPendingPagoId] = useState<string | null>(null);
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "success" as "success" | "error" | "warning" });

  const showAlert = (title: string, message: string, type: "success" | "error" | "warning") => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  // Obtener datos según el tipo seleccionado
  const getData = () => {
    const data = tipo === "facturas" ? facturas : cotizaciones;
    let filtered = [...data];

    // Filtrar por estado de pago
    if (deTipo === "por_pagar") {
      filtered = filtered.filter(item => item.estadoPago !== "pagada");
    }

    // Filtrar por texto de búsqueda
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(item =>
        item.cliente.toLowerCase().includes(searchLower) ||
        item.folio.toLowerCase().includes(searchLower)
      );
    }

    // Filtrar por fechas
    if (fechaDesde) {
      filtered = filtered.filter(item => item.fecha >= fechaDesde);
    }
    if (fechaHasta) {
      filtered = filtered.filter(item => item.fecha <= fechaHasta);
    }

    return filtered;
  };

  const handleCambiarEstadoPago = (id: string, folio: string, cliente: string) => {
    setPendingPagoId(id);
    setIsConfirmModalOpen(true);
  };

  const confirmarPago = () => {
    if (pendingPagoId) {
      if (tipo === "facturas") {
        setFacturas(facturas.filter(f => f.id !== pendingPagoId));
      } else {
        setCotizaciones(cotizaciones.filter(c => c.id !== pendingPagoId));
      }
      showAlert("Pago registrado", "El documento ha sido marcado como pagado y eliminado de la lista", "success");
      setIsConfirmModalOpen(false);
      setPendingPagoId(null);
    }
  };

  const handleVerDetalle = (item: Factura | Cotizacion) => {
    setSelectedItem(item);
    setIsDetalleModalOpen(true);
  };

  const handleDescargarExcel = () => {
    showAlert("Descarga iniciada", "El archivo Excel se está generando", "success");
  };

  const handleDescargarPDF = () => {
    showAlert("Descarga iniciada", "El archivo PDF se está generando", "success");
  };

  const data = getData();

  return (
    <AppLayout>
      <div className="min-h-screen rounded-lg bg-[#F8FAFC]">
        <main className="mx-auto max-w-[1400px]">
          <DemoNotice readOnly />
          <fieldset disabled className="contents">
          <div className="mb-4">
            <h1 className="text-3xl font-extrabold text-[#0F172A]">Cuentas por Pagar</h1>
            <p className="mt-2 text-[#64748B]">Administra y gestiona tus facturas y cotizaciones pendientes de pago.</p>
          </div>

          {/* Filtros */}
          <div className="rounded-2xl border-2 border-[#E2E8F0] bg-white p-6 shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label>Tipo:</Label>
                <div className="relative">
                  <select value={tipo} onChange={(e) => setTipo(e.target.value)} className={`${selectStyle} appearance-none`}>
                    <option value="cotizaciones">Cotizaciones</option>
                    <option value="facturas">Facturas</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div>
                <Label>De tipo:</Label>
                <div className="relative">
                  <select value={deTipo} onChange={(e) => setDeTipo(e.target.value)} className={`${selectStyle} appearance-none`}>
                    <option value="por_pagar">Por Pagar</option>
                    <option value="todas">Todas</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div>
                <Label>Nombre, RFC, Folio:</Label>
                <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Buscar..." className={inputStyle} />
              </div>
              <div>
                <Label>Desde:</Label>
                <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} className={inputStyle} />
              </div>
              <div>
                <Label>Hasta:</Label>
                <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} className={inputStyle} />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button className="flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-2 font-medium text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] hover:bg-blue-400 transition-colors">
                <Search className="h-4 w-4" /> Buscar
              </button>
            </div>
          </div>

          {/* Botones de descarga */}
          <div className="rounded-2xl border-2 border-[#E2E8F0] bg-white p-6 shadow-sm mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#0F172A]">Descargar</h3>
              <div className="flex gap-3">
                <button onClick={handleDescargarExcel} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2 font-medium text-white hover:bg-emerald-500 transition-colors" title="Descargar en formato Excel">
                  <FileSpreadsheet className="h-4 w-4" /> Excel
                </button>
                <button onClick={handleDescargarPDF} className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2 font-medium text-white hover:bg-red-500 transition-colors" title="Descargar en formato PDF">
                  <FileText className="h-4 w-4" /> PDF
                </button>
              </div>
            </div>
          </div>

          {/* Tabla */}
          <div className="rounded-2xl border-2 border-[#E2E8F0] bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F1F5F9]">
                  <tr className="text-left text-sm uppercase tracking-wide text-[#475569]">
                    <th className="px-10 py-4 text-center">Fecha</th>
                    <th className="px-10 py-4 text-center">Folio</th>
                    <th className="px-20 py-4 text-center">Cliente</th>
                    <th className="px-2 py-4 text-center">Moneda</th>
                    <th className="px-6 py-4 text-center">Subtotal</th>
                    <th className="px-6 py-4 text-center">Impuestos</th>
                    <th className="px-6 py-4 text-center">Total</th>
                    <th className="px-6 py-4 text-center">Estado de pago</th>
                    <th className="px-6 py-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.id} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]">
                      <td className="px-6 py-4 text-left">{item.fecha}</td>
                      <td className="px-6 py-4 font-mono font-bold text-center">{item.folio}</td>
                      <td className="px-6 py-4 text-left">
                        <div className="flex items-center gap-2">
                          {item.tipoCliente === "fisica" ? <User className="h-4 w-4 text-slate-500" /> : <Building2 className="h-4 w-4 text-slate-500" />}
                          <span>{item.cliente}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">{item.moneda}</td>
                      <td className="px-6 py-4 text-center">${item.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4 text-center">${item.impuestos.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4 text-center font-bold text-emerald-600">${item.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4 text-center">
                        {item.estadoPago !== "pagada" ? (
                          <select
                            value={item.estadoPago}
                            onChange={(e) => {
                              if (e.target.value === "pagada") {
                                handleCambiarEstadoPago(item.id, item.folio, item.cliente);
                              }
                            }}
                            className="bg-white border-2 border-[#E2E8F0] rounded-lg px-2 py-1 text-sm text-[#0F172A] focus:outline-none focus:border-blue-500 hover:border-blue-300 transition-colors focus:shadow-[0_0_0_2px_rgba(59,130,246,0.2)]"
                          >
                            <option value="desconocida">Desconocida</option>
                            <option value="pagada">Pagada</option>
                            <option value="sin_pagar">Sin pagar</option>
                          </select>
                        ) : (
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Pagada</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex gap-2">
                          <button onClick={() => handleVerDetalle(item)} className="text-emerald-600 hover:text-emerald-700 transition-colors ml-3" title="Visualizar detalle">
                            <Eye className="h-5 w-5" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-700 transition-colors" title="Descargar">
                            <Download className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-6 py-16 text-center text-[#64748B]">
                        No hay registros que coincidan con los filtros aplicados
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

      <DetalleModal isOpen={isDetalleModalOpen} onClose={() => setIsDetalleModalOpen(false)} item={selectedItem} tipo={tipo === "facturas" ? "Factura" : "Cotización"} />
      <ConfirmPagoModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={confirmarPago} folio={data.find(d => d.id === pendingPagoId)?.folio || ""} cliente={data.find(d => d.id === pendingPagoId)?.cliente || ""} />
      <AlertModal isOpen={alertModal.isOpen} onClose={() => setAlertModal({ ...alertModal, isOpen: false })} title={alertModal.title} message={alertModal.message} type={alertModal.type} />
    </AppLayout>
  );
}
