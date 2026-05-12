"use client";

import React, { useState } from "react";
import AppLayout from "@/app/components/layout/AppLayout";
import {
  ChevronDown,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Users,
  Building2,
  FileSpreadsheet,
  FileText,
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

// Tipo para las opciones del dropdown
type EstadisticaOption = {
  id: string;
  label: string;
  icon: React.ReactNode;
  tipoFiltro: "anio_mes" | "anio" | "rango_fechas";
};

const estadisticasOptions: EstadisticaOption[] = [
  { id: "ingresos_diarios", label: "Comparación de Ingresos diarios", icon: <TrendingUp className="h-5 w-5" />, tipoFiltro: "anio_mes" },
  { id: "ingresos_mensuales", label: "Comparación de Ingresos mensuales", icon: <TrendingUp className="h-5 w-5" />, tipoFiltro: "anio" },
  { id: "egresos_mensuales", label: "Comparación de Egresos mensuales", icon: <TrendingDown className="h-5 w-5" />, tipoFiltro: "anio" },
  { id: "ingresos_vs_egresos_mensuales", label: "Comparación Ingresos vs Egresos mensuales", icon: <BarChart3 className="h-5 w-5" />, tipoFiltro: "anio" },
  { id: "ingresos_vs_egresos", label: "Ingresos vs Egresos", icon: <PieChart className="h-5 w-5" />, tipoFiltro: "rango_fechas" },
  { id: "clasificacion_gastos", label: "Clasificación de Gastos", icon: <PieChart className="h-5 w-5" />, tipoFiltro: "rango_fechas" },
  { id: "top_clientes", label: "Top 10 Clientes", icon: <Users className="h-5 w-5" />, tipoFiltro: "rango_fechas" },
  { id: "top_proveedores", label: "Top 10 Proveedores", icon: <Building2 className="h-5 w-5" />, tipoFiltro: "rango_fechas" },
];

// Datos simulados para las gráficas
const generarDatosIngresosDiarios = (mes: string) => {
  return {
    labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
    datasets: [
      {
        label: "Ingresos",
        data: [12500, 18900, 15200, 22100],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
      },
    ],
  };
};

const generarDatosIngresosMensuales = (anio: string) => {
  return {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    datasets: [
      {
        label: "Ingresos",
        data: [12500, 15200, 18900, 16800, 22100, 19800, 23500, 21200, 24500, 26800, 28900, 31200],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
      },
    ],
  };
};

const generarDatosEgresosMensuales = (anio: string) => {
  return {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    datasets: [
      {
        label: "Egresos",
        data: [8500, 9200, 10100, 8800, 11200, 9800, 12500, 10800, 13200, 14500, 15800, 16800],
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        borderColor: "rgb(239, 68, 68)",
      },
    ],
  };
};

const generarDatosIngresosVsEgresosMensuales = (anio: string) => {
  return {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    datasets: [
      {
        label: "Ingresos",
        data: [12500, 15200, 18900, 16800, 22100, 19800, 23500, 21200, 24500, 26800, 28900, 31200],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
      },
      {
        label: "Egresos",
        data: [8500, 9200, 10100, 8800, 11200, 9800, 12500, 10800, 13200, 14500, 15800, 16800],
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        borderColor: "rgb(239, 68, 68)",
      },
    ],
  };
};

const generarDatosIngresosVsEgresos = (fechaInicio: string, fechaFin: string) => {
  return {
    labels: ["Ingresos", "Egresos"],
    datasets: [
      {
        label: "Monto",
        data: [245800, 142500],
        backgroundColor: ["rgba(59, 130, 246, 0.5)", "rgba(239, 68, 68, 0.5)"],
        borderColor: ["rgb(59, 130, 246)", "rgb(239, 68, 68)"],
      },
    ],
  };
};

const generarDatosClasificacionGastos = (fechaInicio: string, fechaFin: string) => {
  return {
    labels: ["Servicios", "Materiales", "Nómina", "Impuestos", "Otros"],
    datasets: [
      {
        label: "Gastos",
        data: [42500, 32800, 52100, 18900, 12400],
        backgroundColor: [
          "rgba(59, 130, 246, 0.5)",
          "rgba(16, 185, 129, 0.5)",
          "rgba(245, 158, 11, 0.5)",
          "rgba(239, 68, 68, 0.5)",
          "rgba(139, 92, 246, 0.5)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
          "rgb(239, 68, 68)",
          "rgb(139, 92, 246)",
        ],
      },
    ],
  };
};

const generarDatosTopClientes = (fechaInicio: string, fechaFin: string) => {
  return {
    labels: ["Constructora Integral", "Autos Premier", "Tech Solutions", "Consultoría Fiscal", "Comercializadora del Norte"],
    datasets: [
      {
        label: "Compras",
        data: [125000, 98200, 76500, 54300, 43200],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
      },
    ],
  };
};

const generarDatosTopProveedores = (fechaInicio: string, fechaFin: string) => {
  return {
    labels: ["Tecnología del Bajío", "Papelería del Norte", "Mantenimiento Industrial", "Software Solutions", "Suministros Diversos"],
    datasets: [
      {
        label: "Compras",
        data: [156000, 87400, 65400, 49800, 37800],
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        borderColor: "rgb(16, 185, 129)",
      },
    ],
  };
};

// Componente para la gráfica (simulada)
const GraficaSimulada = ({ titulo, datos, tipo }: { titulo: string; datos: any; tipo: "bar" | "pie" | "line" }) => {
  return (
    <div className="bg-[#0a1424] rounded-xl p-6 border border-[#173156]">
      <h3 className="text-lg font-bold text-white mb-4 text-center">{titulo}</h3>
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="w-full">
          {/* Simulación de gráfica de barras */}
          {tipo !== "pie" && (
            <div className="space-y-4">
              {datos.labels.map((label: string, idx: number) => {
                const valor = datos.datasets[0].data[idx];
                const maxValor = Math.max(...datos.datasets[0].data);
                const altura = (valor / maxValor) * 100;
                const color = datos.datasets[0].backgroundColor;
                
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">{label}</span>
                      <span className="text-white font-bold">${valor.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="w-full bg-[#1e293b] rounded-full h-8 overflow-hidden">
                      <div 
                        className="h-full rounded-full flex items-center justify-end px-2 text-xs font-bold text-white"
                        style={{ width: `${altura}%`, backgroundColor: typeof color === 'string' ? color : color[idx] }}
                      >
                        {altura > 15 && `${Math.round(altura)}%`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Simulación de gráfica de pastel */}
          {tipo === "pie" && (
            <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {datos.datasets[0].data.reduce((acc: any[], valor: number, idx: number) => {
                    const total = datos.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
                    const porcentaje = (valor / total) * 100;
                    const angulo = (porcentaje / 100) * 360;
                    const inicio = acc.length ? acc[acc.length - 1].fin : 0;
                    const fin = inicio + angulo;
                    const radInicio = (inicio - 90) * Math.PI / 180;
                    const radFin = (fin - 90) * Math.PI / 180;
                    const x1 = 50 + 40 * Math.cos(radInicio);
                    const y1 = 50 + 40 * Math.sin(radInicio);
                    const x2 = 50 + 40 * Math.cos(radFin);
                    const y2 = 50 + 40 * Math.sin(radFin);
                    const largeArc = angulo > 180 ? 1 : 0;
                    
                    acc.push({ inicio, fin, porcentaje, color: datos.datasets[0].backgroundColor[idx] });
                    return acc;
                  }, []).map((segmento: any, idx: number) => (
                    <path
                      key={idx}
                      d={`M 50 50 L ${50 + 40 * Math.cos((segmento.inicio - 90) * Math.PI / 180)} ${50 + 40 * Math.sin((segmento.inicio - 90) * Math.PI / 180)} A 40 40 0 ${segmento.porcentaje > 50 ? 1 : 0} 1 ${50 + 40 * Math.cos((segmento.fin - 90) * Math.PI / 180)} ${50 + 40 * Math.sin((segmento.fin - 90) * Math.PI / 180)} Z`}
                      fill={segmento.color}
                      stroke="#0a1424"
                      strokeWidth="1"
                    />
                  ))}
                  <circle cx="50" cy="50" r="20" fill="#0a1424" />
                </svg>
              </div>
              <div className="space-y-2">
                {datos.labels.map((label: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: datos.datasets[0].backgroundColor[idx] }} />
                    <span className="text-slate-300 text-sm">{label}</span>
                    <span className="text-white font-bold ml-2">${datos.datasets[0].data[idx].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Estadisticas() {
  const [selectedEstadistica, setSelectedEstadistica] = useState(estadisticasOptions[0].id);
  const [anioMes, setAnioMes] = useState(new Date().toISOString().slice(0, 7));
  const [anio, setAnio] = useState(new Date().getFullYear().toString());
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [datosGenerados, setDatosGenerados] = useState<any>(null);

  const selectedOption = estadisticasOptions.find(opt => opt.id === selectedEstadistica);

  const handleGenerar = () => {
    switch (selectedEstadistica) {
      case "ingresos_diarios":
        setDatosGenerados(generarDatosIngresosDiarios(anioMes));
        break;
      case "ingresos_mensuales":
        setDatosGenerados(generarDatosIngresosMensuales(anio));
        break;
      case "egresos_mensuales":
        setDatosGenerados(generarDatosEgresosMensuales(anio));
        break;
      case "ingresos_vs_egresos_mensuales":
        setDatosGenerados(generarDatosIngresosVsEgresosMensuales(anio));
        break;
      case "ingresos_vs_egresos":
        setDatosGenerados(generarDatosIngresosVsEgresos(fechaInicio, fechaFin));
        break;
      case "clasificacion_gastos":
        setDatosGenerados(generarDatosClasificacionGastos(fechaInicio, fechaFin));
        break;
      case "top_clientes":
        setDatosGenerados(generarDatosTopClientes(fechaInicio, fechaFin));
        break;
      case "top_proveedores":
        setDatosGenerados(generarDatosTopProveedores(fechaInicio, fechaFin));
        break;
      default:
        break;
    }
  };

  const getTipoGrafica = () => {
    switch (selectedEstadistica) {
      case "ingresos_vs_egresos":
      case "clasificacion_gastos":
        return "pie";
      default:
        return "bar";
    }
  };

  const getTitulo = () => {
    switch (selectedEstadistica) {
      case "ingresos_diarios":
        return `Comparación de Ingresos diarios - ${anioMes}`;
      case "ingresos_mensuales":
        return `Comparación de Ingresos mensuales - ${anio}`;
      case "egresos_mensuales":
        return `Comparación de Egresos mensuales - ${anio}`;
      case "ingresos_vs_egresos_mensuales":
        return `Comparación Ingresos vs Egresos mensuales - ${anio}`;
      case "ingresos_vs_egresos":
        return `Ingresos vs Egresos (${fechaInicio} al ${fechaFin})`;
      case "clasificacion_gastos":
        return `Clasificación de Gastos (${fechaInicio} al ${fechaFin})`;
      case "top_clientes":
        return `Top 10 Clientes (${fechaInicio} al ${fechaFin})`;
      case "top_proveedores":
        return `Top 10 Proveedores (${fechaInicio} al ${fechaFin})`;
      default:
        return "Estadísticas";
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#071321] text-white">
        <main className="mx-auto max-w-[1400px]">
          <div className="mb-4">
            <h1 className="text-3xl font-extrabold text-white">Estadísticas</h1>
            <p className="mt-2 text-slate-400">Visualiza y analiza los datos financieros de tu empresa.</p>
          </div>

          {/* Contenedor de configuración */}
          <div className="rounded-2xl border-2 border-[#16304f] bg-[#09172b] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.01)] mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Dropdown de estadísticas */}
              <div>
                <Label>Tipo de estadística:</Label>
                <div className="relative">
                  <select
                    value={selectedEstadistica}
                    onChange={(e) => setSelectedEstadistica(e.target.value)}
                    className={`${selectStyle} appearance-none`}
                  >
                    {estadisticasOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* Filtros dinámicos */}
              {selectedOption?.tipoFiltro === "anio_mes" && (
                <div>
                  <Label>Año y Mes:</Label>
                  <input
                    type="month"
                    value={anioMes}
                    onChange={(e) => setAnioMes(e.target.value)}
                    className={inputStyle}
                  />
                </div>
              )}

              {selectedOption?.tipoFiltro === "anio" && (
                <div>
                  <Label>Año:</Label>
                  <input
                    type="number"
                    value={anio}
                    onChange={(e) => setAnio(e.target.value)}
                    placeholder="YYYY"
                    className={inputStyle}
                    min="2000"
                    max="2030"
                  />
                </div>
              )}

              {selectedOption?.tipoFiltro === "rango_fechas" && (
                <>
                  <div>
                    <Label>Fecha de inicio:</Label>
                    <input
                      type="date"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <Label>Fecha de fin:</Label>
                    <input
                      type="date"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                      className={inputStyle}
                    />
                  </div>
                </>
              )}

              {/* Botón Generar */}
              <div className="flex items-end">
                <button
                  onClick={handleGenerar}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-3 font-medium text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] hover:bg-blue-400 transition-colors"
                >
                  <BarChart3 className="h-4 w-4" />
                  Generar Reporte
                </button>
              </div>
            </div>
          </div>

          {/* Contenedor de la gráfica */}
          {datosGenerados && (
            <div className="rounded-2xl border-2 border-[#16304f] bg-[#09172b] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.01)]">
              <GraficaSimulada
                titulo={getTitulo()}
                datos={datosGenerados}
                tipo={getTipoGrafica()}
              />
              
              {/* Botones de descarga */}
              <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-[#173156]">
                <button className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-500 transition-colors">
                  <FileSpreadsheet className="h-4 w-4" />
                  Exportar Excel
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-500 transition-colors">
                  <FileText className="h-4 w-4" />
                  Exportar PDF
                </button>
              </div>
            </div>
          )}

          {/* Mensaje cuando no se ha generado nada */}
          {!datosGenerados && (
            <div className="rounded-2xl border-2 border-[#16304f] bg-[#09172b] p-12 text-center">
              <BarChart3 className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">Selecciona un tipo de estadística y los filtros correspondientes, luego haz clic en "Generar Reporte" para visualizar los datos.</p>
            </div>
          )}
        </main>
      </div>
    </AppLayout>
  );
}