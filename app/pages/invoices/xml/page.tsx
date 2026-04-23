"use client";

import React, { useState } from "react";
import AppLayout from "@/app/components/layout/AppLayout";
import {
  FileText,
  CheckCircle2,
  X,
  AlertCircle,
  Loader2,
  FileCode,
  Building2,
  User,
} from "lucide-react";

const inputStyle =
  "w-full rounded-xl border-2 border-[#1e293b] bg-[#081423] px-4 py-3 text-white outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20";

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

// Tipo para los datos del XML
type XmlData = {
  emisor: {
    nombre: string;
    rfc: string;
    regimenFiscal: string;
  };
  receptor: {
    nombre: string;
    rfc: string;
    usoCFDI: string;
  };
  factura: {
    folio: string;
    serie: string;
    fecha: string;
    moneda: string;
    tipoCambio: string;
    formaPago: string;
    metodoPago: string;
    subtotal: number;
    impuestos: number;
    total: number;
  };
  productos: Array<{
    clave: string;
    descripcion: string;
    cantidad: number;
    unidad: string;
    precio: number;
    importe: number;
  }>;
};

// Datos simulados para demostración
const xmlDataSimulado: XmlData = {
  emisor: {
    nombre: "KASHMIR ENTERPRISE SA DE CV",
    rfc: "KAS800101XYZ",
    regimenFiscal: "601 - General de Ley Personas Morales",
  },
  receptor: {
    nombre: "CONSTRUCTORA INTEGRAL SA DE CV",
    rfc: "CIN506812S34",
    usoCFDI: "G03 - Gastos en general",
  },
  factura: {
    folio: "1245",
    serie: "A",
    fecha: "2024-02-15T12:30:00",
    moneda: "MXN",
    tipoCambio: "1.00",
    formaPago: "03 - Transferencia electrónica",
    metodoPago: "PUE",
    subtotal: 24500.00,
    impuestos: 3920.00,
    total: 28420.00,
  },
  productos: [
    {
      clave: "10101504",
      descripcion: "LAPTOP 14 PULGADAS 8GB RAM 256GB SSD",
      cantidad: 2,
      unidad: "H87",
      precio: 12250.00,
      importe: 24500.00,
    },
  ],
};

export default function CargaXML() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [xmlData, setXmlData] = useState<XmlData | null>(null);
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "success" as "success" | "error" | "warning" });

  const showAlert = (title: string, message: string, type: "success" | "error" | "warning") => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.xml') || selectedFile.name.endsWith('.XML')) {
        setFile(selectedFile);
        processXML(selectedFile);
      } else {
        showAlert("Error", "Por favor, selecciona un archivo XML válido", "error");
        setFile(null);
      }
    }
  };

  const processXML = async (xmlFile: File) => {
    setIsLoading(true);
    
    // Simular procesamiento del XML
    setTimeout(() => {
      setXmlData(xmlDataSimulado);
      setIsLoading(false);
      showAlert("XML procesado", "El archivo XML se ha procesado correctamente", "success");
    }, 1500);
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatMoneda = (valor: number) => {
    return valor.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#071321] text-white">
        <main className="mx-auto max-w-[1400px]">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-white">Carga de XML</h1>
            <p className="mt-2 text-slate-400">
              Sube tu archivo XML para visualizar y validar la información del CFDI.
            </p>
          </div>

          {/* Área de carga de XML */}
          <div className="rounded-2xl border-2 border-[#16304f] bg-[#09172b] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.01)] mb-8">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white">Subir archivo XML</h2>
              <p className="text-sm text-slate-400 mt-1">Selecciona el archivo XML de tu CFDI para procesarlo</p>
            </div>

            <div className="relative border-2 border-dashed border-[#2d4a6e] rounded-2xl p-8 hover:border-blue-500 transition-colors cursor-pointer bg-[#0a1424]">
              <input
                type="file"
                accept=".xml,.XML"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center text-center">
                {isLoading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 text-blue-400 animate-spin mb-3" />
                    <p className="text-slate-400">Procesando archivo XML...</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/20">
                      <FileCode className="h-10 w-10 text-blue-400" />
                    </div>
                    <p className="text-slate-400 text-sm mb-2">
                      {file ? file.name : "Arrastra y suelta tu archivo XML aquí o haz clic para seleccionar"}
                    </p>
                    <p className="text-slate-600 text-xs">
                      Formatos permitidos: .xml
                    </p>
                    {file && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{file.name} - {(file.size / 1024).toFixed(2)} KB</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Resultados */}
          {xmlData && (
            <div className="rounded-2xl border-2 border-[#16304f] bg-[#09172b] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.01)]">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  Resultados del XML
                </h2>
                <p className="text-sm text-slate-400 mt-1">Información extraída del comprobante fiscal</p>
              </div>

              {/* Información del Emisor */}
              <div className="mb-6 p-4 rounded-xl bg-[#0a1424] border-2 border-[#173156]">
                <h3 className="text-md font-bold text-white mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-400" />
                  Emisor
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div><span className="text-slate-400">Nombre:</span> <span className="text-white">{xmlData.emisor.nombre}</span></div>
                  <div><span className="text-slate-400">RFC:</span> <span className="text-white font-mono">{xmlData.emisor.rfc}</span></div>
                  <div><span className="text-slate-400">Régimen Fiscal:</span> <span className="text-white">{xmlData.emisor.regimenFiscal}</span></div>
                </div>
              </div>

              {/* Información del Receptor */}
              <div className="mb-6 p-4 rounded-xl bg-[#0a1424] border-2 border-[#173156]">
                <h3 className="text-md font-bold text-white mb-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-400" />
                  Receptor
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div><span className="text-slate-400">Nombre:</span> <span className="text-white">{xmlData.receptor.nombre}</span></div>
                  <div><span className="text-slate-400">RFC:</span> <span className="text-white font-mono">{xmlData.receptor.rfc}</span></div>
                  <div><span className="text-slate-400">Uso CFDI:</span> <span className="text-white">{xmlData.receptor.usoCFDI}</span></div>
                </div>
              </div>

              {/* Información de la Factura */}
              <div className="mb-6 p-4 rounded-xl bg-[#0a1424] border-2 border-[#173156]">
                <h3 className="text-md font-bold text-white mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-400" />
                  Datos del Comprobante
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                  <div><span className="text-slate-400">Serie/Folio:</span> <span className="text-white font-mono">{xmlData.factura.serie}{xmlData.factura.folio}</span></div>
                  <div><span className="text-slate-400">Fecha:</span> <span className="text-white">{formatFecha(xmlData.factura.fecha)}</span></div>
                  <div><span className="text-slate-400">Moneda:</span> <span className="text-white">{xmlData.factura.moneda}</span></div>
                  <div><span className="text-slate-400">Tipo de Cambio:</span> <span className="text-white">{xmlData.factura.tipoCambio}</span></div>
                  <div><span className="text-slate-400">Forma de Pago:</span> <span className="text-white">{xmlData.factura.formaPago}</span></div>
                  <div><span className="text-slate-400">Método de Pago:</span> <span className="text-white">{xmlData.factura.metodoPago}</span></div>
                </div>
                
                {/* Productos/Servicios */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#16253e]">
                      <tr className="text-left text-slate-400">
                        <th className="px-3 py-2">Clave</th>
                        <th className="px-3 py-2">Descripción</th>
                        <th className="px-3 py-2 text-center">Cantidad</th>
                        <th className="px-3 py-2">Unidad</th>
                        <th className="px-3 py-2 text-right">Precio</th>
                        <th className="px-3 py-2 text-right">Importe</th>
                      </tr>
                    </thead>
                    <tbody>
                      {xmlData.productos.map((producto, idx) => (
                        <tr key={idx} className="border-t border-[#16304f]">
                          <td className="px-3 py-2 font-mono text-xs">{producto.clave}</td>
                          <td className="px-3 py-2">{producto.descripcion}</td>
                          <td className="px-3 py-2 text-center">{producto.cantidad}</td>
                          <td className="px-3 py-2">{producto.unidad}</td>
                          <td className="px-3 py-2 text-right">${formatMoneda(producto.precio)}</td>
                          <td className="px-3 py-2 text-right">${formatMoneda(producto.importe)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-[#0a1424]">
                      <tr className="border-t border-[#173156]">
                        <td colSpan={5} className="px-3 py-2 text-right font-bold text-white">Subtotal:</td>
                        <td className="px-3 py-2 text-right font-bold text-white">${formatMoneda(xmlData.factura.subtotal)}</td>
                      </tr>
                      <tr>
                        <td colSpan={5} className="px-3 py-2 text-right font-bold text-white">Impuestos:</td>
                        <td className="px-3 py-2 text-right font-bold text-white">${formatMoneda(xmlData.factura.impuestos)}</td>
                      </tr>
                      <tr>
                        <td colSpan={5} className="px-3 py-2 text-right font-bold text-emerald-400">Total:</td>
                        <td className="px-3 py-2 text-right font-bold text-emerald-400 text-lg">${formatMoneda(xmlData.factura.total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}
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