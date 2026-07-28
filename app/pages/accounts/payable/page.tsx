"use client";

import React, { useState } from "react";
import AppLayout from "@/app/components/layout/AppLayout";
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

type FacturaPorPagar = {
  id: string;
  fecha: string;
  folio: string;
  proveedor: string;
  tipoProveedor: "fisica" | "moral";
  moneda: string;
  subtotal: number;
  impuestos: number;
  total: number;
  estadoPago: "sin_pagar" | "desconocida" | "pagada";
  fechaVencimiento: string;
  articulos: Articulo[];
};

// Datos simulados
const facturasPorPagarMock: FacturaPorPagar[] = [
  {
    id: "1",
    fecha: "2024-02-01",
    folio: "PRO-001",
    proveedor: "Tecnología del Bajío SA de CV",
    tipoProveedor: "moral",
    moneda: "MXN",
    subtotal: 32500.00,
    impuestos: 5200.00,
    total: 37700.00,
    estadoPago: "sin_pagar",
    fechaVencimiento: "2024-03-01",
    articulos: [
      {
        id: "a1",
        nombre: "Servidores Dell",
        descripcion: "Servidor PowerEdge R740",
        cantidad: 2,
        precio: 16250.00,
        descuento: 0,
        subtotal: 32500.00,
        impuestos: 5200.00,
        total: 37700.00,
      },
    ],
  },
  {
    id: "2",
    fecha: "2024-02-10",
    folio: "PRO-002",
    proveedor: "Papelería y Oficina del Norte",
    tipoProveedor: "moral",
    moneda: "MXN",
    subtotal: 8450.00,
    impuestos: 1352.00,
    total: 9802.00,
    estadoPago: "sin_pagar",
    fechaVencimiento: "2024-03-10",
    articulos: [
      {
        id: "a2",
        nombre: "Papel bond",
        descripcion: "Resma de papel bond 500 hojas",
        cantidad: 50,
        precio: 89.00,
        descuento: 0,
        subtotal: 4450.00,
        impuestos: 712.00,
        total: 5162.00,
      },
      {
        id: "a3",
        nombre: "Toner HP",
        descripcion: "Cartucho de tinta negra",
        cantidad: 8,
        precio: 500.00,
        descuento: 0,
        subtotal: 4000.00,
        impuestos: 640.00,
        total: 4640.00,
      },
    ],
  },
  {
    id: "3",
    fecha: "2024-02-15",
    folio: "PRO-003",
    proveedor: "Mantenimiento Industrial Gutiérrez",
    tipoProveedor: "fisica",
    moneda: "MXN",
    subtotal: 12500.00,
    impuestos: 2000.00,
    total: 14500.00,
    estadoPago: "desconocida",
    fechaVencimiento: "2024-03-15",
    articulos: [
      {
        id: "a4",
        nombre: "Mantenimiento preventivo",
        descripcion: "Servicio de mantenimiento a maquinaria",
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
    id: "4",
    fecha: "2024-01-20",
    folio: "PRO-004",
    proveedor: "Software Solutions MX",
    tipoProveedor: "moral",
    moneda: "USD",
    subtotal: 3500.00,
    impuestos: 560.00,
    total: 4060.00,
    estadoPago: "pagada",
    fechaVencimiento: "2024-02-20",
    articulos: [
      {
        id: "a5",
        nombre: "Licencia Office 365",
        descripcion: "Licencia anual para 5 usuarios",
        cantidad: 1,
        precio: 3500.00,
        descuento: 0,
        subtotal: 3500.00,
        impuestos: 560.00,
        total: 4060.00,
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
const ConfirmPagoModal = ({ isOpen, onClose, onConfirm, folio, proveedor, monto }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; folio: string; proveedor: string; monto: number }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-w-md w-full rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">Confirmar pago a proveedor</h2>
          <p className="text-[#64748B] mb-2">
            ¿Desea marcar como <span className="text-emerald-600 font-bold">PAGADA</span> la siguiente factura?
          </p>
          <div className="bg-[#F8FAFC] rounded-lg p-3 mb-4 text-left">
            <p className="text-sm"><span className="text-[#64748B]">Folio:</span> <span className="text-[#0F172A] font-mono">{folio}</span></p>
            <p className="text-sm"><span className="text-[#64748B]">Proveedor:</span> <span className="text-[#0F172A]">{proveedor}</span></p>
            <p className="text-sm"><span className="text-[#64748B]">Monto:</span> <span className="text-[#0F172A] font-bold">${monto.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
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

// Modal para visualizar detalle de factura
const DetalleModal = ({ isOpen, onClose, factura }: { isOpen: boolean; onClose: () => void; factura: FacturaPorPagar | null }) => {
  if (!isOpen || !factura) return null;

  const totalGeneral = factura.articulos.reduce((sum, art) => sum + art.total, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
          <h2 className="text-xl font-bold text-[#0F172A]">Detalle de Factura - Folio: {factura.folio}</h2>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-6">
          {/* Información general */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div><p className="text-xs text-[#64748B]">Fecha</p><p className="text-[#0F172A] font-medium">{factura.fecha}</p></div>
            <div><p className="text-xs text-[#64748B]">Proveedor</p><p className="text-[#0F172A] font-medium">{factura.proveedor}</p></div>
            <div><p className="text-xs text-[#64748B]">Moneda</p><p className="text-[#0F172A] font-medium">{factura.moneda}</p></div>
            <div><p className="text-xs text-[#64748B]">Vencimiento</p><p className="text-[#0F172A] font-medium">{factura.fechaVencimiento}</p></div>
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
                {factura.articulos.map((art, idx) => (
                  <tr key={art.id} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]">
                    <td className="px-4 py-3 font-medium">{art.nombre}</td>
                    <td className="px-4 py-3 text-[#64748B]">{art.descripcion}</td>
                    <td className="px-4 py-3 text-center">{art.cantidad}</td>
                    <td className="px-4 py-3 text-right">${art.precio.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right">${art.descuento.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right">${art.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right">${art.impuestos.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right font-bold text-red-600">${art.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#F8FAFC]">
                <tr className="border-t border-[#E2E8F0]">
                  <td colSpan={7} className="px-4 py-3 text-right font-bold text-[#0F172A]">Total Final:</td>
                  <td className="px-4 py-3 text-right font-bold text-red-600 text-lg">${totalGeneral.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
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
  const [searchText, setSearchText] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todas");
  const [facturas, setFacturas] = useState<FacturaPorPagar[]>(facturasPorPagarMock);
  const [selectedFactura, setSelectedFactura] = useState<FacturaPorPagar | null>(null);
  const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingPagoId, setPendingPagoId] = useState<string | null>(null);
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "success" as "success" | "error" | "warning" });

  const showAlert = (title: string, message: string, type: "success" | "error" | "warning") => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  // Filtrar facturas
  const getFilteredFacturas = () => {
    let filtered = [...facturas];

    // Filtrar por estado
    if (estadoFiltro === "por_pagar") {
      filtered = filtered.filter(item => item.estadoPago !== "pagada");
    } else if (estadoFiltro === "pagadas") {
      filtered = filtered.filter(item => item.estadoPago === "pagada");
    }

    // Filtrar por texto de búsqueda
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(item =>
        item.proveedor.toLowerCase().includes(searchLower) ||
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

  const handleCambiarEstadoPago = (id: string, folio: string, proveedor: string, monto: number) => {
    setPendingPagoId(id);
    setIsConfirmModalOpen(true);
  };

  const confirmarPago = () => {
    if (pendingPagoId) {
      setFacturas(facturas.map(f =>
        f.id === pendingPagoId ? { ...f, estadoPago: "pagada" as const } : f
      ));
      showAlert("Pago registrado", "La factura ha sido marcada como pagada", "success");
      setIsConfirmModalOpen(false);
      setPendingPagoId(null);
    }
  };

  const handleVerDetalle = (factura: FacturaPorPagar) => {
    setSelectedFactura(factura);
    setIsDetalleModalOpen(true);
  };

  const handleDescargarExcel = () => {
    showAlert("Descarga iniciada", "El archivo Excel se está generando", "success");
  };

  const handleDescargarPDF = () => {
    showAlert("Descarga iniciada", "El archivo PDF se está generando", "success");
  };

  const filteredFacturas = getFilteredFacturas();
  const totalPorPagar = filteredFacturas
    .filter(f => f.estadoPago !== "pagada")
    .reduce((sum, f) => sum + f.total, 0);

  return (
    <AppLayout>
      <div className="min-h-screen rounded-lg bg-[#F8FAFC]">
        <main className="mx-auto max-w-[1400px]">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#0F172A]">Cuentas por Pagar</h1>
            <p className="mt-2 text-[#64748B]">Administra y gestiona las facturas pendientes de pago a tus proveedores.</p>
          </div>

          {/* Tarjeta de resumen */}
          <div className="rounded-2xl border-2 border-[#E2E8F0] bg-gradient-to-r from-red-50 to-orange-50 p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-[#64748B]">Total por pagar</p>
                <p className="text-3xl font-bold text-[#0F172A]">${totalPorPagar.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
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

          {/* Filtros */}
          <div className="rounded-2xl border-2 border-[#E2E8F0] bg-white p-6 shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label>Estado:</Label>
                <div className="relative">
                  <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)} className={`${selectStyle} appearance-none`}>
                    <option value="todas">Todas</option>
                    <option value="por_pagar">Por pagar</option>
                    <option value="pagadas">Pagadas</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div>
                <Label>Proveedor, Folio:</Label>
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
              <div className="flex items-end">
                <button className="flex items-center gap-2 rounded-xl bg-blue-500 px-10 py-3 font-medium text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] hover:bg-blue-400 transition-colors">
                  <Search className="h-4 w-4" /> Buscar
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
                    <th className="px-10 py-4">Fecha</th>
                    <th className="px-10 py-4">Folio</th>
                    <th className="px-20 py-4">Proveedor</th>
                    <th className="px-2 py-4">Moneda</th>
                    <th className="px-6 py-4 text-center">Subtotal</th>
                    <th className="px-6 py-4 text-center">Impuestos</th>
                    <th className="px-6 py-4 text-center">Total</th>
                    <th className="px-6 py-4 text-center">Vencimiento</th>
                    <th className="px-6 py-4 text-center">Estado</th>
                    <th className="px-6 py-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFacturas.map((factura) => (
                    <tr key={factura.id} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]">
                      <td className="px-6 py-4 text-left">{factura.fecha}</td>
                      <td className="px-6 py-4 font-mono font-bold text-center">{factura.folio}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {factura.tipoProveedor === "fisica" ? <User className="h-4 w-4 text-slate-500" /> : <Building2 className="h-4 w-4 text-slate-500" />}
                          <span>{factura.proveedor}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{factura.moneda}</td>
                      <td className="px-6 py-4 text-center">${factura.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4 text-center">${factura.impuestos.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4 text-center font-bold text-red-600">${factura.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4 text-center">{factura.fechaVencimiento}</td>
                      <td className="px-6 py-4">
                        {factura.estadoPago !== "pagada" ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                              {factura.estadoPago === "sin_pagar" ? "Sin pagar" : "Desconocida"}
                            </span>
                            <button
                              onClick={() => handleCambiarEstadoPago(factura.id, factura.folio, factura.proveedor, factura.total)}
                              className="text-emerald-600 hover:text-emerald-700 transition-colors"
                              title="Marcar como pagada"
                            >
                              <CheckCircle2 className="h-5 w-5" />
                            </button>
                          </div>
                        ) : (
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Pagada</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => handleVerDetalle(factura)} className="text-emerald-600 hover:text-emerald-700 transition-colors ml-3" title="Visualizar detalle">
                            <Eye className="h-5 w-5" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-700 transition-colors" title="Descargar">
                            <Download className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredFacturas.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-6 py-16 text-center text-[#64748B]">
                        No hay registros que coincidan con los filtros aplicados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <DetalleModal isOpen={isDetalleModalOpen} onClose={() => setIsDetalleModalOpen(false)} factura={selectedFactura} />
      <ConfirmPagoModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmarPago}
        folio={facturas.find(f => f.id === pendingPagoId)?.folio || ""}
        proveedor={facturas.find(f => f.id === pendingPagoId)?.proveedor || ""}
        monto={facturas.find(f => f.id === pendingPagoId)?.total || 0}
      />
      <AlertModal isOpen={alertModal.isOpen} onClose={() => setAlertModal({ ...alertModal, isOpen: false })} title={alertModal.title} message={alertModal.message} type={alertModal.type} />
    </AppLayout>
  );
}
