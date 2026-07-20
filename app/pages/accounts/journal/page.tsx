"use client";

import React, { useState } from "react";
import AppLayout from "@/app/components/layout/AppLayout";
import {
  Search,
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Edit,
  TrendingUp,
  TrendingDown,
  Info,
  DollarSign,
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

// Tipo para transacción
type Transaccion = {
  id: string;
  fecha: string;
  concepto: string;
  moneda: string;
  ingreso: number;
  egreso: number;
  saldo: number;
  tipo: "ingreso" | "egreso";
  fiscal: boolean;
};

// Datos simulados iniciales
const transaccionesMock: Transaccion[] = [
  {
    id: "1",
    fecha: "2024-12-31",
    concepto: "Saldo de mes anterior",
    moneda: "MXN",
    ingreso: 0,
    egreso: 0,
    saldo: 50000,
    tipo: "ingreso",
    fiscal: true,
  },
  {
    id: "2",
    fecha: "2025-01-15",
    concepto: "Venta de productos",
    moneda: "MXN",
    ingreso: 15000,
    egreso: 0,
    saldo: 65000,
    tipo: "ingreso",
    fiscal: true,
  },
  {
    id: "3",
    fecha: "2025-01-20",
    concepto: "Pago de proveedores",
    moneda: "MXN",
    ingreso: 0,
    egreso: 8000,
    saldo: 57000,
    tipo: "egreso",
    fiscal: true,
  },
  {
    id: "4",
    fecha: "2025-01-31",
    concepto: "Total del mes",
    moneda: "MXN",
    ingreso: 15000,
    egreso: 8000,
    saldo: 57000,
    tipo: "ingreso",
    fiscal: true,
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

// Modal para modificar saldo inicial
const SaldoInicialModal = ({ isOpen, onClose, onSave, saldoFiscal, saldoCajaChica }: { isOpen: boolean; onClose: () => void; onSave: (saldoFiscal: number, saldoCajaChica: number) => void; saldoFiscal: number; saldoCajaChica: number }) => {
  const [fiscal, setFiscal] = useState(saldoFiscal);
  const [cajaChica, setCajaChica] = useState(saldoCajaChica);
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "success" as "success" | "error" | "warning" });

  const showAlert = (title: string, message: string, type: "success" | "error" | "warning") => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  const handleSubmit = () => {
    onSave(fiscal, cajaChica);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-w-md w-full rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
          <h2 className="text-xl font-bold text-[#0F172A]">Saldo inicial</h2>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <Label>Fiscal:</Label>
            <input type="number" value={fiscal} onChange={(e) => setFiscal(Number(e.target.value))} placeholder="0.00" className={inputStyle} />
          </div>
          <div>
            <Label>Caja Chica:</Label>
            <input type="number" value={cajaChica} onChange={(e) => setCajaChica(Number(e.target.value))} placeholder="0.00" className={inputStyle} />
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

// Modal para agregar Ingreso/Egreso
const TransaccionModal = ({ isOpen, onClose, onSave, tipo }: { isOpen: boolean; onClose: () => void; onSave: (transaccion: Omit<Transaccion, "id" | "saldo">) => void; tipo: "ingreso" | "egreso" }) => {
  const [concepto, setConcepto] = useState("");
  const [total, setTotal] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [fiscal, setFiscal] = useState(false);
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "success" as "success" | "error" | "warning" });

  const showAlert = (title: string, message: string, type: "success" | "error" | "warning") => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  const handleSubmit = () => {
    if (!concepto) {
      showAlert("Campo requerido", "El concepto es obligatorio", "error");
      return;
    }
    if (!total || Number(total) <= 0) {
      showAlert("Campo requerido", "El monto debe ser mayor a 0", "error");
      return;
    }

    const monto = Number(total);
    onSave({
      fecha,
      concepto,
      moneda: "MXN",
      ingreso: tipo === "ingreso" ? monto : 0,
      egreso: tipo === "egreso" ? monto : 0,
      tipo,
      fiscal,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-w-md w-full rounded-2xl border border-[#E2E8F0] bg-white overflow-y-auto shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
          <h2 className="text-xl font-bold text-[#0F172A]">{tipo === "ingreso" ? "Agregar Ingreso" : "Agregar Egreso"}</h2>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <Label>Concepto:</Label>
            <input type="text" value={concepto} onChange={(e) => setConcepto(e.target.value)} placeholder="Concepto" className={inputStyle} />
          </div>
          <div>
            <Label>Total:</Label>
            <input type="number" value={total} onChange={(e) => setTotal(e.target.value)} placeholder="0.00" className={inputStyle} />
          </div>
          <div>
            <Label>Fecha actual:</Label>
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputStyle} />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" checked={fiscal} onChange={(e) => setFiscal(e.target.checked)} className="w-4 h-4 rounded border-2 border-[#CBD5E1] text-blue-500 checked:bg-blue-500 checked:border-blue-500" />
            <span className="text-[#0F172A]">Fiscal</span>
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

export default function LibroDiario() {
  const [tipoConsulta, setTipoConsulta] = useState("fiscal");
  const [fechaConsulta, setFechaConsulta] = useState(new Date().toISOString().split('T')[0]);
  const [searchText, setSearchText] = useState("");
  const [saldoInicialFiscal, setSaldoInicialFiscal] = useState(50000);
  const [saldoInicialCajaChica, setSaldoInicialCajaChica] = useState(0);
  const [fechaInicial, setFechaInicial] = useState("2024-01-01");
  const [transacciones, setTransacciones] = useState<Transaccion[]>(transaccionesMock);
  const [isSaldoModalOpen, setIsSaldoModalOpen] = useState(false);
  const [isTransaccionModalOpen, setIsTransaccionModalOpen] = useState(false);
  const [transaccionTipo, setTransaccionTipo] = useState<"ingreso" | "egreso">("ingreso");
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "success" as "success" | "error" | "warning" });

  const showAlert = (title: string, message: string, type: "success" | "error" | "warning") => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  const saldoInicial = tipoConsulta === "fiscal" ? saldoInicialFiscal : saldoInicialCajaChica;
  const fechaInicialMostrada = tipoConsulta === "fiscal" ? fechaInicial : new Date().toISOString().split('T')[0];

  // Calcular saldos acumulados
  const getTransaccionesFiltradas = () => {
    let filtered = [...transacciones];

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(t =>
        t.concepto.toLowerCase().includes(searchLower)
      );
    }

    filtered = filtered.filter(t => t.fecha <= fechaConsulta);

    return filtered;
  };

  const transaccionesFiltradas = getTransaccionesFiltradas();

  // Calcular saldo actual
  let saldoAcumulado = saldoInicial;
  const transaccionesConSaldo = transaccionesFiltradas.map(t => {
    if (t.concepto === "Saldo de mes anterior") {
      return { ...t, saldo: saldoInicial };
    }
    saldoAcumulado = saldoAcumulado + t.ingreso - t.egreso;
    return { ...t, saldo: saldoAcumulado };
  });

  // Función para formatear fecha a "mes de año"
  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    return `${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
  };

  // Guardar saldo inicial
  const handleSaveSaldo = (fiscal: number, cajaChica: number) => {
    setSaldoInicialFiscal(fiscal);
    setSaldoInicialCajaChica(cajaChica);
    showAlert("Saldo actualizado", "El saldo inicial ha sido modificado correctamente", "success");
  };

  // Guardar transacción
  const handleSaveTransaccion = (nuevaTransaccion: Omit<Transaccion, "id" | "saldo">) => {
    // Calcular el saldo actual
    let saldoActual = saldoInicial;
    transaccionesFiltradas.forEach(t => {
      saldoActual = saldoActual + t.ingreso - t.egreso;
    });

    const nuevoSaldo = saldoActual + nuevaTransaccion.ingreso - nuevaTransaccion.egreso;

    const transaccion: Transaccion = {
      ...nuevaTransaccion,
      id: Date.now().toString(),
      saldo: nuevoSaldo,
    };

    // Insertar antes de "Total del mes" si existe
    const totalIndex = transacciones.findIndex(t => t.concepto === "Total del mes");
    if (totalIndex !== -1) {
      const newTransacciones = [...transacciones];
      newTransacciones.splice(totalIndex, 0, transaccion);
      setTransacciones(newTransacciones);
    } else {
      setTransacciones([...transacciones, transaccion]);
    }

    showAlert("Transacción agregada", `El ${nuevaTransaccion.tipo === "ingreso" ? "ingreso" : "egreso"} ha sido registrado correctamente`, "success");
  };

  const handleDescargarExcel = () => {
    showAlert("Descarga iniciada", "El archivo Excel se está generando", "success");
  };

  const handleDescargarPDF = () => {
    showAlert("Descarga iniciada", "El archivo PDF se está generando", "success");
  };

  const handleFiltrar = () => {
    showAlert("Filtros aplicados", "Los datos han sido filtrados correctamente", "success");
  };

  const totalIngresos = transaccionesFiltradas.reduce((sum, t) => sum + t.ingreso, 0);
  const totalEgresos = transaccionesFiltradas.reduce((sum, t) => sum + t.egreso, 0);
  const saldoFinal = saldoInicial + totalIngresos - totalEgresos;

  return (
    <AppLayout>
      <div className="min-h-screen rounded-lg bg-[#F8FAFC]">
        <main className="mx-auto max-w-[1400px]">
          <div className="mb-4">
            <h1 className="text-3xl font-extrabold text-[#0F172A]">Libro Diario</h1>
            <p className="mt-2 text-[#64748B]">Registro cronológico de todas las operaciones financieras.</p>
          </div>

          {/* Contenedores principales - 4 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Contenedor 1 - Filtros principales */}
            <div className="rounded-2xl border-2 border-[#E2E8F0] bg-white p-4 shadow-sm">
              <h3 className="text-md font-bold text-[#0F172A] mb-4 flex items-center gap-2 shrink-0"><Search className="h-5 w-5 text-blue-600" />Filtros</h3>
              <div className="space-y-4">
                <div><Label>Fecha a consultar:</Label><input type="date" value={fechaConsulta} onChange={(e) => setFechaConsulta(e.target.value)} className={inputStyle} /></div>
                <div><Label>Tipo:</Label><div className="relative"><select value={tipoConsulta} onChange={(e) => setTipoConsulta(e.target.value)} className={`${selectStyle} appearance-none`}><option value="fiscal">Fiscal</option><option value="caja_chica">Caja Chica</option></select><ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /></div></div>
                <div><Label>Nombre, RFC, Folio:</Label><input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Buscar..." className={inputStyle} /></div>
                <button onClick={handleFiltrar} className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-400 transition-colors"><Search className="h-4 w-4" />Filtrar Datos</button>
              </div>
            </div>

            {/* Contenedor 2 - Saldos */}
            <div className="rounded-2xl border-2 border-[#E2E8F0] bg-white p-4 shadow-sm">
              <h3 className="text-md font-bold text-[#0F172A] mb-4 flex items-center gap-2 shrink-0"><DollarSign className="h-5 w-5 text-emerald-600" />Saldos</h3>
              <div className="space-y-4">
                <div><Label>Saldo inicial:</Label><input type="text" value={`$${saldoInicial.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} readOnly className={`${inputStyle} bg-slate-100 cursor-not-allowed opacity-75`} /></div>
                <div><Label>Fecha inicial:</Label><input type="text" value={formatearFecha(fechaInicialMostrada)} readOnly className={`${inputStyle} bg-slate-100 cursor-not-allowed opacity-75`} /></div>
                <button onClick={() => setIsSaldoModalOpen(true)} className="w-full flex items-center justify-center gap-2 rounded-xl bg-white border-2 border-[#E2E8F0] px-4 py-2 text-[#475569] hover:bg-[#F8FAFC] transition-colors"><Edit className="h-4 w-4 text-blue-600" />Modificar Saldo inicial</button>
              </div>
            </div>

            {/* Contenedor 3 - Crear Ingreso/Egreso */}
            <div className="rounded-2xl border-2 border-[#E2E8F0] bg-white p-4 shadow-sm">
              <h3 className="text-md font-bold text-[#0F172A] mb-10 flex items-center gap-2 shrink-0"><Plus className="h-5 w-5 text-emerald-600" />Crear</h3>
              <div className="space-y-6">
                <button onClick={() => { setTransaccionTipo("ingreso"); setIsTransaccionModalOpen(true); }} className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-medium text-white hover:bg-emerald-500 transition-colors mb-12"><TrendingUp className="h-5 w-5" />Ingreso</button>
                <button onClick={() => { setTransaccionTipo("egreso"); setIsTransaccionModalOpen(true); }} className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-500 transition-colors"><TrendingDown className="h-5 w-5" />Egreso</button>
              </div>
            </div>

            {/* Contenedor 4 - Descargar */}
            <div className="rounded-2xl border-2 border-[#E2E8F0] bg-white p-4 shadow-sm">
              <h3 className="text-md font-bold text-[#0F172A] mb-10 flex items-center gap-2 shrink-0"><Download className="h-5 w-5 text-blue-600" />Descargar</h3>
              <div className="space-y-6">
                <button onClick={handleDescargarExcel} className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-medium text-white hover:bg-emerald-500 transition-colors mb-12"><FileSpreadsheet className="h-5 w-5" />Excel</button>
                <button onClick={handleDescargarPDF} className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-500 transition-colors"><FileText className="h-5 w-5" />PDF</button>
              </div>
            </div>
          </div>

          {/* Contenedor 4 - Tabla */}
          <div className="rounded-2xl border-2 border-[#E2E8F0] bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F1F5F9]">
                  <tr className="text-left text-sm uppercase tracking-wide text-[#475569]">
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4">Concepto</th>
                    <th className="px-6 py-4">Moneda</th>
                    <th className="px-6 py-4 text-right">Ingreso</th>
                    <th className="px-6 py-4 text-right">Egreso</th>
                    <th className="px-6 py-4 text-right">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {transaccionesConSaldo.map((transaccion) => (
                    <tr key={transaccion.id} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]">
                      <td className="px-6 py-4">{formatearFecha(transaccion.fecha)}</td>
                      <td className="px-6 py-4 font-bold">{transaccion.concepto}</td>
                      <td className="px-6 py-4">{transaccion.moneda}</td>
                      <td className="px-6 py-4 text-right text-emerald-600">${transaccion.ingreso.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4 text-right text-red-600">${transaccion.egreso.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4 text-right font-bold text-blue-600">${transaccion.saldo.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                  {transaccionesConSaldo.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center text-[#64748B]">No hay registros que coincidan con los filtros aplicados</td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-[#F8FAFC] border-t border-[#E2E8F0]">
                  <tr>
                    <td colSpan={3} className="px-6 py-3 text-right font-bold text-[#0F172A]">Totales:</td>
                    <td className="px-6 py-3 text-right font-bold text-emerald-600">${totalIngresos.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-6 py-3 text-right font-bold text-red-600">${totalEgresos.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-6 py-3 text-right font-bold text-blue-600">${saldoFinal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </main>
      </div>

      <SaldoInicialModal isOpen={isSaldoModalOpen} onClose={() => setIsSaldoModalOpen(false)} onSave={handleSaveSaldo} saldoFiscal={saldoInicialFiscal} saldoCajaChica={saldoInicialCajaChica} />
      <TransaccionModal isOpen={isTransaccionModalOpen} onClose={() => setIsTransaccionModalOpen(false)} onSave={handleSaveTransaccion} tipo={transaccionTipo} />
      <AlertModal isOpen={alertModal.isOpen} onClose={() => setAlertModal({ ...alertModal, isOpen: false })} title={alertModal.title} message={alertModal.message} type={alertModal.type} />
    </AppLayout>
  );
}
