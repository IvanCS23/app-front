"use client";

import React, { useState } from "react";
import AppLayout from "@/app/components/layout/AppLayout";
import {
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  Pencil,
  Trash,
  Eye,
  Search,
  Save,
  AlertTriangle,
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

// Componente Toast
const Toast = ({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 z-[100] flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg animate-in slide-in-from-right-5 duration-300 ${
      type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
    }`}>
      {type === "success" ? (
        <CheckCircle2 className="h-5 w-5" />
      ) : (
        <X className="h-5 w-5" />
      )}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

// Componente de Confirmación
const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "danger",
}: {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return "bg-red-500 hover:bg-red-400";
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-400";
      default:
        return "bg-blue-500 hover:bg-blue-400";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "danger":
        return "text-red-500";
      case "warning":
        return "text-yellow-500";
      default:
        return "text-blue-500";
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      
      <div className="relative max-w-md w-full rounded-2xl border border-[#173156] bg-[#071321] shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`rounded-full p-2 bg-[#0d1b35] ${getIconColor()}`}>
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>
          
          <p className="text-slate-300 mb-6">{message}</p>
          
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 rounded-xl bg-[#1e293b] px-4 py-2 font-medium text-white hover:bg-[#2d3a4b] transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 rounded-xl px-4 py-2 font-medium text-white transition-colors ${getTypeStyles()}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Estados de la República Mexicana
const mexicanStates = [
  "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas",
  "Chihuahua", "Ciudad de México", "Coahuila", "Colima", "Durango", "Guanajuato",
  "Guerrero", "Hidalgo", "Jalisco", "México", "Michoacán", "Morelos", "Nayarit",
  "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí",
  "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas",
];

// Países en orden alfabético
const countries = [
  "Afganistán", "Albania", "Alemania", "Andorra", "Angola", "Argentina",
  "Armenia", "Australia", "Austria", "Brasil", "Canadá", "Chile", "China",
  "Colombia", "Costa Rica", "Cuba", "Dinamarca", "Ecuador", "Egipto",
  "El Salvador", "España", "Estados Unidos", "Francia", "Guatemala",
  "Honduras", "Italia", "Japón", "México", "Nicaragua", "Noruega",
  "Panamá", "Paraguay", "Perú", "Portugal", "Reino Unido", "Rusia",
  "Suecia", "Suiza", "Uruguay", "Venezuela",
];

// Tipo para Serie
type Serie = {
  id: string;
  serie: string;
  uso: string;
  folioInicial: string;
};

// Tipo para Lugar de Expedición
type LugarExpedicion = {
  id: string;
  nombre: string;
  descripcion: string;
  cp: string;
  estado: string;
  calle: string;
  noExterior: string;
  noInterior: string;
  colonia: string;
  localidad: string;
  municipio: string;
  pais: string;
  isDefault: boolean;
  series: Serie[];
};

// Datos simulados iniciales con más registros
const lugaresMock: LugarExpedicion[] = [
  {
    id: "1",
    nombre: "Principal",
    descripcion: "Oficinas centrales corporativas",
    cp: "06700",
    estado: "Ciudad de México",
    calle: "Av. Insurgentes Sur",
    noExterior: "123",
    noInterior: "Piso 5",
    colonia: "Condesa",
    localidad: "Cuauhtémoc",
    municipio: "Cuauhtémoc",
    pais: "México",
    isDefault: true,
    series: [
      { id: "s1", serie: "A", uso: "Facturación general", folioInicial: "1000" },
      { id: "s2", serie: "B", uso: "Ventas especiales", folioInicial: "500" },
      { id: "s3", serie: "C", uso: "Exportaciones", folioInicial: "200" },
    ],
  },
  {
    id: "2",
    nombre: "Sucursal Norte",
    descripcion: "Planta de distribución norte",
    cp: "54180",
    estado: "Estado de México",
    calle: "Av. Real del Monte",
    noExterior: "45",
    noInterior: "2",
    colonia: "Industrial",
    localidad: "Tlalnepantla",
    municipio: "Tlalnepantla",
    pais: "México",
    isDefault: false,
    series: [
      { id: "s4", serie: "NORTE", uso: "Facturación sucursal norte", folioInicial: "1" },
      { id: "s5", serie: "NORTE-EXP", uso: "Exportaciones norte", folioInicial: "100" },
    ],
  },
  {
    id: "3",
    nombre: "Sucursal Sur",
    descripcion: "Centro de servicio al cliente sur",
    cp: "14000",
    estado: "Ciudad de México",
    calle: "Calzada de Tlalpan",
    noExterior: "1500",
    noInterior: "",
    colonia: "Portales",
    localidad: "Benito Juárez",
    municipio: "Benito Juárez",
    pais: "México",
    isDefault: false,
    series: [
      { id: "s6", serie: "SUR", uso: "Facturación sucursal sur", folioInicial: "1" },
    ],
  },
  {
    id: "4",
    nombre: "Centro Logístico",
    descripcion: "Centro de distribución y logística",
    cp: "76220",
    estado: "Querétaro",
    calle: "Av. 5 de Febrero",
    noExterior: "890",
    noInterior: "Bodega 3",
    colonia: "Industrial Querétaro",
    localidad: "Querétaro",
    municipio: "Querétaro",
    pais: "México",
    isDefault: false,
    series: [
      { id: "s7", serie: "LOG", uso: "Facturación logística", folioInicial: "1000" },
      { id: "s8", serie: "LOG-DEV", uso: "Devoluciones", folioInicial: "1" },
    ],
  },
  {
    id: "5",
    nombre: "Oficina Guadalajara",
    descripcion: "Oficinas regionales occidente",
    cp: "44100",
    estado: "Jalisco",
    calle: "Av. Vallarta",
    noExterior: "2450",
    noInterior: "",
    colonia: "Americana",
    localidad: "Guadalajara",
    municipio: "Guadalajara",
    pais: "México",
    isDefault: false,
    series: [
      { id: "s9", serie: "GDL", uso: "Facturación Guadalajara", folioInicial: "500" },
    ],
  },
  {
    id: "6",
    nombre: "Oficina Monterrey",
    descripcion: "Oficinas regionales noreste",
    cp: "64000",
    estado: "Nuevo León",
    calle: "Av. Constitución",
    noExterior: "300",
    noInterior: "Piso 10",
    colonia: "Centro",
    localidad: "Monterrey",
    municipio: "Monterrey",
    pais: "México",
    isDefault: false,
    series: [
      { id: "s10", serie: "MTY", uso: "Facturación Monterrey", folioInicial: "200" },
      { id: "s11", serie: "MTY-INT", uso: "Facturación internacional", folioInicial: "50" },
    ],
  },
];

// Props para el modal de lugar
type LugarModalProps = {
  isOpen: boolean;
  isEditing: boolean;
  onClose: () => void;
  onSave: () => void;
  nombre: string;
  setNombre: (value: string) => void;
  descripcion: string;
  setDescripcion: (value: string) => void;
  cp: string;
  setCp: (value: string) => void;
  estado: string;
  setEstado: (value: string) => void;
  calle: string;
  setCalle: (value: string) => void;
  noExterior: string;
  setNoExterior: (value: string) => void;
  noInterior: string;
  setNoInterior: (value: string) => void;
  colonia: string;
  setColonia: (value: string) => void;
  localidad: string;
  setLocalidad: (value: string) => void;
  municipio: string;
  setMunicipio: (value: string) => void;
  pais: string;
  setPais: (value: string) => void;
  showOptionalFields: boolean;
  setShowOptionalFields: (value: boolean) => void;
};

// Modal de lugar de expedición
const LugarModal = ({
  isOpen,
  isEditing,
  onClose,
  onSave,
  nombre,
  setNombre,
  descripcion,
  setDescripcion,
  cp,
  setCp,
  estado,
  setEstado,
  calle,
  setCalle,
  noExterior,
  setNoExterior,
  noInterior,
  setNoInterior,
  colonia,
  setColonia,
  localidad,
  setLocalidad,
  municipio,
  setMunicipio,
  pais,
  setPais,
  showOptionalFields,
  setShowOptionalFields,
}: LugarModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[#173156] bg-[#071321] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#173156] bg-[#071321] px-6 py-4">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? "Editar Lugar de Expedición" : "Agregar Lugar de Expedición"}
          </h2>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-[#0d1b35] hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label>Nombre:</Label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Principal, Sucursal Norte" className={inputStyle} />
            </div>
            <div>
              <Label>Descripción:</Label>
              <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción del lugar" className={inputStyle} />
            </div>
            <div>
              <Label>C.P.:</Label>
              <input type="text" value={cp} onChange={(e) => setCp(e.target.value)} placeholder="Código postal" maxLength={5} className={inputStyle} />
            </div>
            <div>
              <Label>Estado:</Label>
              <div className="relative">
                <select value={estado} onChange={(e) => setEstado(e.target.value)} className={`${selectStyle} appearance-none`}>
                  <option value="">Seleccione un estado</option>
                  {mexicanStates.map((state) => (<option key={state} value={state}>{state}</option>))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button onClick={() => setShowOptionalFields(!showOptionalFields)} className="flex items-center gap-2 text-[15px] font-semibold text-[#1d9bf0] hover:opacity-90">
              {showOptionalFields ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {showOptionalFields ? "Ocultar datos opcionales" : "Agregar datos opcionales"}
            </button>
          </div>

          {showOptionalFields && (
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div><Label>Calle:</Label><input type="text" value={calle} onChange={(e) => setCalle(e.target.value)} placeholder="Calle" className={inputStyle} /></div>
              <div><Label>No. Exterior:</Label><input type="text" value={noExterior} onChange={(e) => setNoExterior(e.target.value)} placeholder="Número exterior" className={inputStyle} /></div>
              <div><Label>No. Interior:</Label><input type="text" value={noInterior} onChange={(e) => setNoInterior(e.target.value)} placeholder="Número interior" className={inputStyle} /></div>
              <div><Label>Colonia:</Label><input type="text" value={colonia} onChange={(e) => setColonia(e.target.value)} placeholder="Colonia" className={inputStyle} /></div>
              <div><Label>Localidad:</Label><input type="text" value={localidad} onChange={(e) => setLocalidad(e.target.value)} placeholder="Localidad" className={inputStyle} /></div>
              <div><Label>Municipio:</Label><input type="text" value={municipio} onChange={(e) => setMunicipio(e.target.value)} placeholder="Municipio" className={inputStyle} /></div>
              <div><Label>País:</Label>
                <div className="relative">
                  <select value={pais} onChange={(e) => setPais(e.target.value)} className={`${selectStyle} appearance-none`}>
                    {countries.map((country) => (<option key={country} value={country}>{country}</option>))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 flex justify-end gap-4 border-t border-[#173156] bg-[#071321] px-6 py-4">
          <button onClick={onClose} className="rounded-xl bg-red-500 px-6 py-2 font-medium text-white shadow-[0_10px_30px_rgba(255,0,0,0.25)] hover:bg-red-400">Cancelar</button>
          <button onClick={onSave} className="rounded-xl bg-blue-500 px-6 py-2 font-medium text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] hover:bg-blue-400">Guardar</button>
        </div>
      </div>
    </div>
  );
};

// Props para el modal de serie
type SerieModalProps = {
  isOpen: boolean;
  editingSerieId: string | null;
  onClose: () => void;
  onSave: () => void;
  serieNombre: string;
  setSerieNombre: (value: string) => void;
  serieUso: string;
  setSerieUso: (value: string) => void;
  serieFolioInicial: string;
  setSerieFolioInicial: (value: string) => void;
};

// Modal de serie
const SerieModal = ({
  isOpen,
  editingSerieId,
  onClose,
  onSave,
  serieNombre,
  setSerieNombre,
  serieUso,
  setSerieUso,
  serieFolioInicial,
  setSerieFolioInicial,
}: SerieModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative max-w-md w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-[#173156] bg-[#071321] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#173156] bg-[#071321] px-6 py-4">
          <h2 className="text-xl font-bold text-white">{editingSerieId ? "Editar Serie" : "Agregar Serie"}</h2>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-[#0d1b35] hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          <div><Label>Serie: <span className="text-red-500">*</span></Label><input type="text" value={serieNombre} onChange={(e) => setSerieNombre(e.target.value)} placeholder="Ej: A, B, FAC" className={inputStyle} /></div>
          <div><Label>Uso de la serie: <span className="text-red-500">*</span></Label><input type="text" value={serieUso} onChange={(e) => setSerieUso(e.target.value)} placeholder="Descripción del uso" className={inputStyle} /></div>
          <div><Label>Folio inicial:</Label><input type="text" value={serieFolioInicial} onChange={(e) => setSerieFolioInicial(e.target.value)} placeholder="Ej: 1, 1000" className={inputStyle} /></div>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-4 border-t border-[#173156] bg-[#071321] px-6 py-4">
          <button onClick={onClose} className="rounded-xl bg-red-500 px-6 py-2 font-medium text-white shadow-[0_10px_30px_rgba(255,0,0,0.25)] hover:bg-red-400">Cerrar</button>
          <button onClick={onSave} className="rounded-xl bg-blue-500 px-6 py-2 font-medium text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] hover:bg-blue-400">Guardar</button>
        </div>
      </div>
    </div>
  );
};

// Props para la tabla de series
type SeriesTableProps = {
  showSeriesTable: boolean;
  selectedLugarForSeries: LugarExpedicion | null;
  onClose: () => void;
  series: Serie[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  currentPage: number;
  setCurrentPage: (value: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (value: number) => void;
  onEditSerie: (serie: Serie) => void;
  onDeleteSerie: (id: string, nombre: string) => void;
  onAddSerie: () => void;
};

// Tabla de series
const SeriesTable = ({
  showSeriesTable,
  selectedLugarForSeries,
  onClose,
  series,
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  setRowsPerPage,
  onEditSerie,
  onDeleteSerie,
  onAddSerie,
}: SeriesTableProps) => {
  if (!showSeriesTable || !selectedLugarForSeries) return null;

  // Filtrar series
  const filteredSeries = series.filter(serie =>
    serie.serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    serie.uso.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación de series
  const seriesTotalPages = Math.ceil(filteredSeries.length / rowsPerPage);
  const paginatedSeries = filteredSeries.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="mt-8 rounded-2xl border-2 border-[#16304f] bg-[#09172b] p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">Series - {selectedLugarForSeries.nombre}</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
      </div>

      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Buscar por serie o uso..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="box box-input-icon" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">MOSTRAR</span>
          <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="box box-input">
            <option value={10}>10 registros</option>
            <option value={25}>25 registros</option>
            <option value={50}>50 registros</option>
            <option value={100}>100 registros</option>
          </select>
        </div>
        <button onClick={onAddSerie} className="flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-white hover:bg-blue-400">
          <Plus className="h-4 w-4" />Agregar Serie
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#16253e]">
            <tr className="text-left text-sm uppercase tracking-wide text-slate-400">
              <th className="px-6 py-4">Serie</th>
              <th className="px-6 py-4">Siguiente Folio</th>
              <th className="px-6 py-4">Descripción</th>
              <th className="px-6 py-4">Acciones</th>
             </tr>
          </thead>
          <tbody>
            {paginatedSeries.map((serie) => (
              <tr key={serie.id} className="border-t border-[#16304f] hover:bg-[#0d1b35]">
                <td className="px-6 py-4 font-bold">{serie.serie}</td>
                <td className="px-6 py-4">{serie.folioInicial || "1"}</td>
                <td className="px-6 py-4 text-slate-300">{serie.uso}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => onEditSerie(serie)} className="text-blue-400 hover:text-blue-300"><Pencil className="h-5 w-5" /></button>
                    <button onClick={() => onDeleteSerie(serie.id, serie.serie)} className="text-red-400 hover:text-red-300"><Trash className="h-5 w-5" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedSeries.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center text-slate-400">No hay series registradas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center p-4 border-t border-[#232b36] text-gray-400 text-sm">
        <span>Mostrando {paginatedSeries.length} de {filteredSeries.length} registros</span>
        <div className="flex gap-2">
          <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-[#1a222c] rounded disabled:opacity-50">Anterior</button>
          <span className="px-3 py-1 bg-blue-600 rounded text-white">{currentPage}</span>
          <button onClick={() => setCurrentPage(Math.min(seriesTotalPages, currentPage + 1))} disabled={currentPage === seriesTotalPages} className="px-3 py-1 bg-[#1a222c] rounded disabled:opacity-50">Siguiente</button>
        </div>
      </div>
    </div>
  );
};

export default function LugaresExpedicion() {
  // Estado para el modal principal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  
  // Estado para el modal de series
  const [isSerieModalOpen, setIsSerieModalOpen] = useState(false);
  const [editingSerieId, setEditingSerieId] = useState<string | null>(null);
  
  // Estado para la tabla de series visible
  const [showSeriesTable, setShowSeriesTable] = useState(false);
  const [selectedLugarForSeries, setSelectedLugarForSeries] = useState<LugarExpedicion | null>(null);
  
  // Estado para modales de confirmación
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "danger" as "danger" | "warning" | "info",
    onConfirm: () => {},
  });
  
  // Estado para Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  // Estados para el formulario de lugar
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cp, setCp] = useState("");
  const [estado, setEstado] = useState("");
  const [calle, setCalle] = useState("");
  const [noExterior, setNoExterior] = useState("");
  const [noInterior, setNoInterior] = useState("");
  const [colonia, setColonia] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [pais, setPais] = useState("México");
  
  // Estados para el formulario de serie
  const [serieNombre, setSerieNombre] = useState("");
  const [serieUso, setSerieUso] = useState("");
  const [serieFolioInicial, setSerieFolioInicial] = useState("");
  
  // Estados para la tabla de lugares
  const [lugares, setLugares] = useState<LugarExpedicion[]>(lugaresMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Estados para la tabla de series
  const [seriesSearchTerm, setSeriesSearchTerm] = useState("");
  const [seriesCurrentPage, setSeriesCurrentPage] = useState(1);
  const [seriesRowsPerPage, setSeriesRowsPerPage] = useState(10);

  // Filtrar lugares
  const filteredLugares = lugares.filter(lugar =>
    lugar.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lugar.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lugar.cp.includes(searchTerm) ||
    lugar.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación de lugares
  const totalPages = Math.ceil(filteredLugares.length / rowsPerPage);
  const paginatedLugares = filteredLugares.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Resetear formulario de lugar
  const resetForm = () => {
    setNombre("");
    setDescripcion("");
    setCp("");
    setEstado("");
    setCalle("");
    setNoExterior("");
    setNoInterior("");
    setColonia("");
    setLocalidad("");
    setMunicipio("");
    setPais("México");
    setShowOptionalFields(false);
    setIsEditing(false);
    setEditingId(null);
  };

  // Resetear formulario de serie
  const resetSerieForm = () => {
    setSerieNombre("");
    setSerieUso("");
    setSerieFolioInicial("");
    setEditingSerieId(null);
  };

  // Guardar lugar
  const handleSaveLugar = () => {
    if (!nombre || !descripcion || !cp || !estado) {
      setToast({ message: "Por favor, completa todos los campos obligatorios", type: "error" });
      return;
    }

    const newLugar: LugarExpedicion = {
      id: editingId || Date.now().toString(),
      nombre,
      descripcion,
      cp,
      estado,
      calle,
      noExterior,
      noInterior,
      colonia,
      localidad,
      municipio,
      pais,
      isDefault: editingId ? (lugares.find(l => l.id === editingId)?.isDefault || false) : false,
      series: editingId ? (lugares.find(l => l.id === editingId)?.series || []) : [],
    };

    if (isEditing && editingId) {
      setLugares(lugares.map(l => l.id === editingId ? newLugar : l));
      setToast({ message: "Lugar actualizado correctamente", type: "success" });
    } else {
      setLugares([...lugares, newLugar]);
      setToast({ message: "Lugar agregado correctamente", type: "success" });
    }
    
    setIsModalOpen(false);
    resetForm();
  };

  // Eliminar lugar
  const handleDeleteLugar = (id: string, nombre: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Eliminar Lugar",
      message: `¿Estás seguro de eliminar "${nombre}"? Esta acción no se puede deshacer y eliminará también todas las series asociadas.`,
      type: "danger",
      onConfirm: () => {
        setLugares(lugares.filter(l => l.id !== id));
        setConfirmModal({ ...confirmModal, isOpen: false });
        setToast({ message: `Lugar "${nombre}" eliminado correctamente`, type: "success" });
      },
    });
  };

  // Editar lugar
  const handleEditLugar = (lugar: LugarExpedicion) => {
    setNombre(lugar.nombre);
    setDescripcion(lugar.descripcion);
    setCp(lugar.cp);
    setEstado(lugar.estado);
    setCalle(lugar.calle);
    setNoExterior(lugar.noExterior);
    setNoInterior(lugar.noInterior);
    setColonia(lugar.colonia);
    setLocalidad(lugar.localidad);
    setMunicipio(lugar.municipio);
    setPais(lugar.pais);
    setShowOptionalFields(!!lugar.calle || !!lugar.noExterior || !!lugar.colonia || !!lugar.municipio);
    setIsEditing(true);
    setEditingId(lugar.id);
    setIsModalOpen(true);
  };

  // Asignar default
  const handleSetDefault = (id: string, nombre: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Establecer por Default",
      message: `¿Está seguro de asignar por default "${nombre}" como lugar de expedición para facturación?`,
      type: "warning",
      onConfirm: () => {
        setLugares(lugares.map(l => ({
          ...l,
          isDefault: l.id === id
        })));
        setConfirmModal({ ...confirmModal, isOpen: false });
        setToast({ message: `"${nombre}" ahora es el lugar de expedición por default`, type: "success" });
      },
    });
  };

  // Ver series
  const handleViewSeries = (lugar: LugarExpedicion) => {
    setSelectedLugarForSeries(lugar);
    setShowSeriesTable(true);
    setSeriesSearchTerm("");
    setSeriesCurrentPage(1);
  };

  // Cerrar tabla de series
  const handleCloseSeriesTable = () => {
    setShowSeriesTable(false);
    setSelectedLugarForSeries(null);
  };

  // Guardar serie
  const handleSaveSerie = () => {
    if (!serieNombre || !serieUso) {
      setToast({ message: "Los campos Serie y Uso de la serie son obligatorios", type: "error" });
      return;
    }

    const newSerie: Serie = {
      id: editingSerieId || Date.now().toString(),
      serie: serieNombre,
      uso: serieUso,
      folioInicial: serieFolioInicial,
    };

    if (selectedLugarForSeries) {
      let updatedSeries;
      if (editingSerieId) {
        updatedSeries = selectedLugarForSeries.series.map(s => s.id === editingSerieId ? newSerie : s);
        setToast({ message: "Serie actualizada correctamente", type: "success" });
      } else {
        updatedSeries = [...selectedLugarForSeries.series, newSerie];
        setToast({ message: "Serie agregada correctamente", type: "success" });
      }
      
      setLugares(lugares.map(l => 
        l.id === selectedLugarForSeries.id 
          ? { ...l, series: updatedSeries }
          : l
      ));
      
      setSelectedLugarForSeries({
        ...selectedLugarForSeries,
        series: updatedSeries
      });
    }
    
    setIsSerieModalOpen(false);
    resetSerieForm();
  };

  // Eliminar serie
  const handleDeleteSerie = (serieId: string, serieNombre: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Eliminar Serie",
      message: `¿Estás seguro de eliminar la serie "${serieNombre}"? Esta acción no se puede deshacer.`,
      type: "danger",
      onConfirm: () => {
        if (selectedLugarForSeries) {
          const updatedSeries = selectedLugarForSeries.series.filter(s => s.id !== serieId);
          setLugares(lugares.map(l => 
            l.id === selectedLugarForSeries.id 
              ? { ...l, series: updatedSeries }
              : l
          ));
          setSelectedLugarForSeries({
            ...selectedLugarForSeries,
            series: updatedSeries
          });
        }
        setConfirmModal({ ...confirmModal, isOpen: false });
        setToast({ message: `Serie "${serieNombre}" eliminada correctamente`, type: "success" });
      },
    });
  };

  // Editar serie
  const handleEditSerie = (serie: Serie) => {
    setSerieNombre(serie.serie);
    setSerieUso(serie.uso);
    setSerieFolioInicial(serie.folioInicial);
    setEditingSerieId(serie.id);
    setIsSerieModalOpen(true);
  };

  // Abrir modal para agregar serie
  const handleAddSerie = () => {
    resetSerieForm();
    setEditingSerieId(null);
    setIsSerieModalOpen(true);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#071321] text-white">
        <main className="mx-auto max-w-[1400px]">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-white">Lugares de Expedición</h1>
              <p className="mt-2 text-slate-400">Administra los lugares desde donde emites tus facturas</p>
            </div>
            <button onClick={() => { resetForm(); setIsEditing(false); setEditingId(null); setIsModalOpen(true); }} className="flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] hover:bg-blue-400">
              <Plus className="h-5 w-5" />Agregar Lugar de Expedición
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Buscar por nombre, descripción, CP o estado..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="box box-input-icon" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">MOSTRAR</span>
              <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="box box-input">
                <option value={10}>10 registros</option>
                <option value={25}>25 registros</option>
                <option value={50}>50 registros</option>
                <option value={100}>100 registros</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-[#16304f] bg-[#09172b] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#16253e]">
                  <tr className="text-left text-sm uppercase tracking-wide text-slate-400">
                    <th className="px-6 py-4 w-16">Default</th>
                    <th className="px-6 py-4">Nombre</th>
                    <th className="px-6 py-4">Dirección</th>
                    <th className="px-6 py-4 w-32">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLugares.map((lugar) => (
                    <tr key={lugar.id} className="border-t border-[#16304f] hover:bg-[#0d1b35] transition-colors">
                      <td className="px-6 py-4">
                        <input 
                          type="radio" 
                          name="defaultLocation" 
                          checked={lugar.isDefault || false} 
                          onChange={() => handleSetDefault(lugar.id, lugar.nombre)} 
                          className="h-5 w-5 text-blue-500 cursor-pointer" 
                        />
                      </td>
                      <td className="px-6 py-4 font-bold">{lugar.nombre} <span className="text-xs text-slate-500 ml-2">{lugar.descripcion}</span></td>
                      <td className="px-6 py-4 text-slate-300">
                        {lugar.calle ? `${lugar.calle} ${lugar.noExterior}, ` : ""}
                        {lugar.colonia ? `${lugar.colonia}, ` : ""}
                        {lugar.cp ? `${lugar.cp}, ` : ""}
                        {lugar.estado}, {lugar.pais}
                       </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => handleEditLugar(lugar)} className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors">
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleDeleteLugar(lugar.id, lugar.nombre)} className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                            <Trash className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleViewSeries(lugar)} className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors">
                            <Eye className="h-5 w-5" />
                          </button>
                        </div>
                       </td>
                    </tr>
                  ))}
                  {paginatedLugares.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center text-slate-400">
                        No hay lugares de expedición registrados
                      </td>
                    </tr>
                  )}
                </tbody>
               </table>
            </div>
            <div className="flex justify-between items-center p-4 border-t border-[#232b36] text-gray-400 text-sm">
              <span>Mostrando {paginatedLugares.length} de {filteredLugares.length} registros</span>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-[#1a222c] rounded disabled:opacity-50 hover:bg-[#2a3543] transition-colors">
                  Anterior
                </button>
                <span className="px-3 py-1 bg-blue-600 rounded text-white">{currentPage}</span>
                <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-[#1a222c] rounded disabled:opacity-50 hover:bg-[#2a3543] transition-colors">
                  Siguiente
                </button>
              </div>
            </div>
          </div>

          <SeriesTable
            showSeriesTable={showSeriesTable}
            selectedLugarForSeries={selectedLugarForSeries}
            onClose={handleCloseSeriesTable}
            series={selectedLugarForSeries?.series || []}
            searchTerm={seriesSearchTerm}
            setSearchTerm={setSeriesSearchTerm}
            currentPage={seriesCurrentPage}
            setCurrentPage={setSeriesCurrentPage}
            rowsPerPage={seriesRowsPerPage}
            setRowsPerPage={setSeriesRowsPerPage}
            onEditSerie={handleEditSerie}
            onDeleteSerie={handleDeleteSerie}
            onAddSerie={handleAddSerie}
          />
        </main>
      </div>

      <LugarModal
        isOpen={isModalOpen}
        isEditing={isEditing}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        onSave={handleSaveLugar}
        nombre={nombre}
        setNombre={setNombre}
        descripcion={descripcion}
        setDescripcion={setDescripcion}
        cp={cp}
        setCp={setCp}
        estado={estado}
        setEstado={setEstado}
        calle={calle}
        setCalle={setCalle}
        noExterior={noExterior}
        setNoExterior={setNoExterior}
        noInterior={noInterior}
        setNoInterior={setNoInterior}
        colonia={colonia}
        setColonia={setColonia}
        localidad={localidad}
        setLocalidad={setLocalidad}
        municipio={municipio}
        setMunicipio={setMunicipio}
        pais={pais}
        setPais={setPais}
        showOptionalFields={showOptionalFields}
        setShowOptionalFields={setShowOptionalFields}
      />

      <SerieModal
        isOpen={isSerieModalOpen}
        editingSerieId={editingSerieId}
        onClose={() => { setIsSerieModalOpen(false); resetSerieForm(); }}
        onSave={handleSaveSerie}
        serieNombre={serieNombre}
        setSerieNombre={setSerieNombre}
        serieUso={serieUso}
        setSerieUso={setSerieUso}
        serieFolioInicial={serieFolioInicial}
        setSerieFolioInicial={setSerieFolioInicial}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        type={confirmModal.type}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AppLayout>
  );
}