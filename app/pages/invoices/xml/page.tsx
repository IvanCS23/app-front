"use client";

import React, { useState } from "react";
import AppLayout from "@/app/components/layout/AppLayout";
import DemoNotice, { demoActionProps } from "@/app/components/ui/DemoNotice";
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
  "w-full rounded-xl border-2 border-[#E2E8F0] bg-white px-4 py-3 text-[#0F172A] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

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
      <div className="min-h-screen rounded-lg bg-[#F8FAFC]">
        <main className="mx-auto max-w-[1400px]">
          <DemoNotice />
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#0F172A]">Carga de XML</h1>
            <p className="mt-2 text-[#64748B]">
              Sube tu archivo XML para visualizar y validar la información del CFDI.
            </p>
          </div>

          {/* Área de carga de XML */}
          <div className="rounded-2xl border-2 border-[#E2E8F0] bg-white p-6 shadow-sm mb-8">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-[#0F172A]">Subir archivo XML</h2>
              <p className="text-sm text-[#64748B] mt-1">Selecciona el archivo XML de tu CFDI para procesarlo</p>
            </div>

            <div className="relative border-2 border-dashed border-[#CBD5E1] rounded-2xl p-8 hover:border-blue-500 transition-colors cursor-pointer bg-[#F8FAFC]">
              <input
                type="file"
                accept=".xml,.XML"
                onChange={handleFileChange}
                {...demoActionProps}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center text-center">
                {isLoading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-3" />
                    <p className="text-[#64748B]">Procesando archivo XML...</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                      <FileCode className="h-10 w-10 text-blue-600" />
                    </div>
                    <p className="text-[#64748B] text-sm mb-2">
                      {file ? file.name : "Arrastra y suelta tu archivo XML aquí o haz clic para seleccionar"}
                    </p>
                    <p className="text-slate-500 text-xs">
                      Formatos permitidos: .xml
                    </p>
                    {file && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
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
            <div className="rounded-2xl border-2 border-[#E2E8F0] bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Resultados del XML
                </h2>
                <p className="text-sm text-[#64748B] mt-1">Información extraída del comprobante fiscal</p>
              </div>

              {/* Información del Emisor */}
              <div className="mb-6 p-4 rounded-xl bg-[#F8FAFC] border-2 border-[#E2E8F0]">
                <h3 className="text-md font-bold text-[#0F172A] mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  Emisor
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div><span className="text-[#64748B]">Nombre:</span> <span className="text-[#0F172A]">{xmlData.emisor.nombre}</span></div>
                  <div><span className="text-[#64748B]">RFC:</span> <span className="text-[#0F172A] font-mono">{xmlData.emisor.rfc}</span></div>
                  <div><span className="text-[#64748B]">Régimen Fiscal:</span> <span className="text-[#0F172A]">{xmlData.emisor.regimenFiscal}</span></div>
                </div>
              </div>

              {/* Información del Receptor */}
              <div className="mb-6 p-4 rounded-xl bg-[#F8FAFC] border-2 border-[#E2E8F0]">
                <h3 className="text-md font-bold text-[#0F172A] mb-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  Receptor
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div><span className="text-[#64748B]">Nombre:</span> <span className="text-[#0F172A]">{xmlData.receptor.nombre}</span></div>
                  <div><span className="text-[#64748B]">RFC:</span> <span className="text-[#0F172A] font-mono">{xmlData.receptor.rfc}</span></div>
                  <div><span className="text-[#64748B]">Uso CFDI:</span> <span className="text-[#0F172A]">{xmlData.receptor.usoCFDI}</span></div>
                </div>
              </div>

              {/* Información de la Factura */}
              <div className="mb-6 p-4 rounded-xl bg-[#F8FAFC] border-2 border-[#E2E8F0]">
                <h3 className="text-md font-bold text-[#0F172A] mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Datos del Comprobante
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                  <div><span className="text-[#64748B]">Serie/Folio:</span> <span className="text-[#0F172A] font-mono">{xmlData.factura.serie}{xmlData.factura.folio}</span></div>
                  <div><span className="text-[#64748B]">Fecha:</span> <span className="text-[#0F172A]">{formatFecha(xmlData.factura.fecha)}</span></div>
                  <div><span className="text-[#64748B]">Moneda:</span> <span className="text-[#0F172A]">{xmlData.factura.moneda}</span></div>
                  <div><span className="text-[#64748B]">Tipo de Cambio:</span> <span className="text-[#0F172A]">{xmlData.factura.tipoCambio}</span></div>
                  <div><span className="text-[#64748B]">Forma de Pago:</span> <span className="text-[#0F172A]">{xmlData.factura.formaPago}</span></div>
                  <div><span className="text-[#64748B]">Método de Pago:</span> <span className="text-[#0F172A]">{xmlData.factura.metodoPago}</span></div>
                </div>

                {/* Productos/Servicios */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#F1F5F9]">
                      <tr className="text-left text-[#475569]">
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
                        <tr key={idx} className="border-t border-[#F1F5F9]">
                          <td className="px-3 py-2 font-mono text-xs">{producto.clave}</td>
                          <td className="px-3 py-2">{producto.descripcion}</td>
                          <td className="px-3 py-2 text-center">{producto.cantidad}</td>
                          <td className="px-3 py-2">{producto.unidad}</td>
                          <td className="px-3 py-2 text-right">${formatMoneda(producto.precio)}</td>
                          <td className="px-3 py-2 text-right">${formatMoneda(producto.importe)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-[#F8FAFC]">
                      <tr className="border-t border-[#E2E8F0]">
                        <td colSpan={5} className="px-3 py-2 text-right font-bold text-[#0F172A]">Subtotal:</td>
                        <td className="px-3 py-2 text-right font-bold text-[#0F172A]">${formatMoneda(xmlData.factura.subtotal)}</td>
                      </tr>
                      <tr>
                        <td colSpan={5} className="px-3 py-2 text-right font-bold text-[#0F172A]">Impuestos:</td>
                        <td className="px-3 py-2 text-right font-bold text-[#0F172A]">${formatMoneda(xmlData.factura.impuestos)}</td>
                      </tr>
                      <tr>
                        <td colSpan={5} className="px-3 py-2 text-right font-bold text-emerald-600">Total:</td>
                        <td className="px-3 py-2 text-right font-bold text-emerald-600 text-lg">${formatMoneda(xmlData.factura.total)}</td>
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
