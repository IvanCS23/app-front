"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/app/components/layout/AppLayout";
import {
  Info,
  Eye,
  EyeOff,
  FileText,
  Key,
  Download,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Fingerprint,
  Save,
  X,
} from "lucide-react";

// Componente Toast
const Toast = ({ message, type, isVisible, onClose, duration = 3000 }: {
  message: string;
  type: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5" />;
      case "error":
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <CheckCircle2 className="h-5 w-5" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-emerald-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-5 fade-in duration-300">
      <div className={`flex items-center gap-3 rounded-xl ${getBackgroundColor()} text-white px-4 py-3 shadow-lg`}>
        {getIcon()}
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 rounded-lg p-0.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const inputStyle = "box box-input";

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
            <div className="absolute bottom-full left-0 mb-2 z-50 w-80 rounded-lg bg-white border border-[#E2E8F0] p-2 text-xs text-[#475569] shadow-lg">
              {infoText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

type SectionTitleProps = {
  icon: React.ReactNode;
  title: React.ReactNode;
};

function SectionTitle({ icon, title }: SectionTitleProps) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="text-[#475569]">{icon}</div>
      <h2 className="text-[20px] font-bold text-[#0F172A]">{title}</h2>
    </div>
  );
}

// Datos simulados para CSD
const csdData = {
  certificateNumber: "00001000000400000001",
  validity: "Del 10/01/2023 al 09/01/2026",
};

// Datos simulados para FIEL
const fielData = {
  certificateNumber: "00002000000500000002",
  validity: "Del 15/03/2022 al 14/03/2025",
};

export default function SellosDigitales() {
  // Estados para CSD
  const [cerFile, setCerFile] = useState<File | null>(null);
  const [keyFile, setKeyFile] = useState<File | null>(null);
  const [csdPassword, setCsdPassword] = useState("");
  const [showCsdPassword, setShowCsdPassword] = useState(false);
  const [cerFileInfo, setCerFileInfo] = useState<{ name: string; size: string } | null>(null);
  const [keyFileInfo, setKeyFileInfo] = useState<{ name: string; size: string } | null>(null);

  // Estados para FIEL
  const [fielCerFile, setFielCerFile] = useState<File | null>(null);
  const [fielKeyFile, setFielKeyFile] = useState<File | null>(null);
  const [fielPassword, setFielPassword] = useState("");
  const [showFielPassword, setShowFielPassword] = useState(false);
  const [fielCerFileInfo, setFielCerFileInfo] = useState<{ name: string; size: string } | null>(null);
  const [fielKeyFileInfo, setFielKeyFileInfo] = useState<{ name: string; size: string } | null>(null);

  // Estado para el Toast
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success" as "success" | "error" | "info"
  });

  // Función para mostrar toast
  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({
      isVisible: true,
      message,
      type
    });
  };

  // Función para cerrar toast
  const closeToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Manejar archivo .cer de CSD
  const handleCerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.name.endsWith('.cer') || file.name.endsWith('.CER'))) {
      setCerFile(file);
      setCerFileInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
      });
    } else {
      showToast("Por favor, selecciona un archivo .cer válido", "error");
    }
  };

  // Manejar archivo .key de CSD
  const handleKeyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.name.endsWith('.key') || file.name.endsWith('.KEY'))) {
      setKeyFile(file);
      setKeyFileInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
      });
    } else {
      showToast("Por favor, selecciona un archivo .key válido", "error");
    }
  };

  // Manejar archivo .cer de FIEL
  const handleFielCerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.name.endsWith('.cer') || file.name.endsWith('.CER'))) {
      setFielCerFile(file);
      setFielCerFileInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
      });
    } else {
      showToast("Por favor, selecciona un archivo .cer válido", "error");
    }
  };

  // Manejar archivo .key de FIEL
  const handleFielKeyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.name.endsWith('.key') || file.name.endsWith('.KEY'))) {
      setFielKeyFile(file);
      setFielKeyFileInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
      });
    } else {
      showToast("Por favor, selecciona un archivo .key válido", "error");
    }
  };

  // Descargar archivo .cer de CSD
  const downloadCer = () => {
    showToast("Descargando archivo .cer...", "info");
    // Aquí iría la lógica real de descarga
  };

  // Descargar archivo .key de CSD
  const downloadKey = () => {
    showToast("Descargando archivo .key...", "info");
    // Aquí iría la lógica real de descarga
  };

  // Descargar archivo .cer de FIEL
  const downloadFielCer = () => {
    showToast("Descargando archivo .cer de FIEL...", "info");
    // Aquí iría la lógica real de descarga
  };

  // Descargar archivo .key de FIEL
  const downloadFielKey = () => {
    showToast("Descargando archivo .key de FIEL...", "info");
    // Aquí iría la lógica real de descarga
  };

  // Función para guardar
  const handleSave = () => {
    // Validar que haya al menos un certificado
    if (!cerFile && !keyFile && !fielCerFile && !fielKeyFile) {
      showToast("No se han seleccionado archivos para guardar", "error");
      return;
    }

    // Validar CSD: si se subió un archivo, debe tener ambos
    if ((cerFile && !keyFile) || (!cerFile && keyFile)) {
      showToast("Para CSD debes seleccionar ambos archivos (.cer y .key)", "error");
      return;
    }

    // Validar FIEL: si se subió un archivo, debe tener ambos
    if ((fielCerFile && !fielKeyFile) || (!fielCerFile && fielKeyFile)) {
      showToast("Para FIEL debes seleccionar ambos archivos (.cer y .key)", "error");
      return;
    }

    // Validar contraseña de CSD si hay archivos CSD
    if (cerFile && keyFile && !csdPassword.trim()) {
      showToast("Debes ingresar la contraseña para los Sellos Digitales (CSD)", "error");
      return;
    }

    // Validar contraseña de FIEL si hay archivos FIEL
    if (fielCerFile && fielKeyFile && !fielPassword.trim()) {
      showToast("Debes ingresar la contraseña para la FIEL", "error");
      return;
    }

    // Aquí iría la lógica real de guardado
    console.log("Datos guardados:", {
      csd: {
        cerFile: cerFileInfo,
        keyFile: keyFileInfo,
        password: csdPassword,
      },
      fiel: {
        cerFile: fielCerFileInfo,
        keyFile: fielKeyFileInfo,
        password: fielPassword,
      },
    });

    // Mostrar toast de éxito
    showToast("Certificados guardados correctamente", "success");
  };

  return (
    <AppLayout>
      <div className="min-h-screen rounded-lg bg-[#F8FAFC]">
        <main className="mx-auto max-w-[1400px]">
          {/* Título principal */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#0F172A]">Certificados y Sellos Digitales</h1>
            <p className="mt-2 text-[#64748B]">
              Administra los archivos de certificación necesarios para la emisión de CFDI.
            </p>
          </div>

          {/* Sección CSD */}
          <section className="mb-12 rounded-2xl border-2 border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FileCheck className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-bold text-[#0F172A]">Sellos Digitales (CSD)</h2>
              </div>
              <div className="relative">
                <Info
                  className="h-5 w-5 cursor-help text-blue-600"
                  onMouseEnter={(e) => {
                    const tooltip = e.currentTarget.nextElementSibling;
                    if (tooltip) tooltip.classList.remove('hidden');
                  }}
                  onMouseLeave={(e) => {
                    const tooltip = e.currentTarget.nextElementSibling;
                    if (tooltip) tooltip.classList.add('hidden');
                  }}
                />
                <div className="hidden absolute right-0 top-full mt-2 z-50 w-80 rounded-lg bg-white border border-[#E2E8F0] p-2 text-xs text-[#475569] shadow-lg">
                  Los Sellos digitales son los archivos .cer y .key que obtuviste en el SAT.
                  Tales archivos son indispensables para poder sellar tus facturas y comprobar
                  que eres tú el emisor legal de las mismas.
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Columna izquierda - Archivos */}
              <div>
                {/* Botón .cer */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#475569] mb-2 ml-2">
                    Certificado (.cer)
                  </label>
                  <div className="relative border-2 border-dashed border-[#CBD5E1] rounded-xl p-4 hover:border-blue-500 transition-colors cursor-pointer bg-[#F8FAFC]">
                    <input
                      type="file"
                      accept=".cer,.CER"
                      onChange={handleCerFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center text-center">
                      <FileText className="h-10 w-10 text-slate-400 mb-2" />
                      <p className="text-[#64748B] text-sm">
                        {cerFileInfo ? cerFileInfo.name : "Selecciona tu archivo .cer"}
                      </p>
                      {cerFileInfo && (
                        <p className="text-xs text-slate-500 mt-1">
                          Tamaño: {cerFileInfo.size}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Botón .key */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#475569] mb-2 ml-2">
                    Llave Privada (.key)
                  </label>
                  <div className="relative border-2 border-dashed border-[#CBD5E1] rounded-xl p-4 hover:border-blue-500 transition-colors cursor-pointer bg-[#F8FAFC]">
                    <input
                      type="file"
                      accept=".key,.KEY"
                      onChange={handleKeyFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center text-center">
                      <Key className="h-10 w-10 text-slate-400 mb-2" />
                      <p className="text-[#64748B] text-sm">
                        {keyFileInfo ? keyFileInfo.name : "Selecciona tu archivo .key"}
                      </p>
                      {keyFileInfo && (
                        <p className="text-xs text-slate-500 mt-1">
                          Tamaño: {keyFileInfo.size}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contraseña */}
                <div className="mb-4">
                  <Label>Contraseña de los Sellos:</Label>
                  <div className="relative">
                    <input
                      type={showCsdPassword ? "text" : "password"}
                      value={csdPassword}
                      onChange={(e) => setCsdPassword(e.target.value)}
                      placeholder="Ingresa la contraseña de tus sellos"
                      className={`${inputStyle} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCsdPassword(!showCsdPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showCsdPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 italic">
                    *Esta contraseña será la de los Sellos Digitales según sea el caso de los archivos
                    que se cargaron previamente. En este campo no hay que definir una nueva contraseña
                    o volver a escribir la del acceso a FacturaPro.
                  </p>
                </div>

                {/* Botones de descarga */}
                <div className="flex gap-4 mt-6 justify-center">
                  <button
                    onClick={downloadCer}
                    className="flex items-center justify-center gap-2 rounded-xl bg-white border-2 border-[#E2E8F0] px-4 py-2 text-[#475569] hover:bg-[#F8FAFC] transition-colors"
                    title="Descargar archivo .cer"
                  >
                    <Download className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Descargar .cer</span>
                  </button>
                  <button
                    onClick={downloadKey}
                    className="flex items-center justify-center gap-2 rounded-xl bg-white border-2 border-[#E2E8F0] px-4 py-2 text-[#475569] hover:bg-[#F8FAFC] transition-colors"
                    title="Descargar archivo .key"
                  >
                    <Download className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Descargar .key</span>
                  </button>
                </div>
              </div>

              {/* Columna derecha - Información */}
              <div className="bg-[#F8FAFC] rounded-xl border-2 border-[#E2E8F0] p-4">
                <h3 className="text-md font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  Información de los Sellos
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-[#64748B]">Número de certificado:</p>
                    <p className="text-base font-mono text-blue-600 font-semibold">
                      {csdData.certificateNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B]">Vigencia:</p>
                    <p className="text-base font-mono text-blue-600 font-semibold">
                      {csdData.validity}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sección FIEL */}
          <section className="rounded-2xl border-2 border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Fingerprint className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-bold text-[#0F172A]">Firma Electrónica Avanzada (FIEL)</h2>
              </div>
              <div className="relative">
                <Info
                  className="h-5 w-5 cursor-help text-blue-600"
                  onMouseEnter={(e) => {
                    const tooltip = e.currentTarget.nextElementSibling;
                    if (tooltip) tooltip.classList.remove('hidden');
                  }}
                  onMouseLeave={(e) => {
                    const tooltip = e.currentTarget.nextElementSibling;
                    if (tooltip) tooltip.classList.add('hidden');
                  }}
                />
                <div className="hidden absolute right-0 top-full mt-2 z-50 w-80 rounded-lg bg-white border border-[#E2E8F0] p-2 text-xs text-[#475569] shadow-lg">
                  La FIEL (Firma Electrónica Avanzada) es el documento digital que te identifica
                  ante el SAT para trámites fiscales. Recuerda que no puede ser usada para emitir facturas.
                  Una vez subidos estos archivos serán renombrados usando tu RFC.
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Columna izquierda - Archivos */}
              <div>
                {/* Botón .cer de FIEL */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#475569] mb-2 ml-2">
                    Certificado FIEL (.cer)
                  </label>
                  <div className="relative border-2 border-dashed border-[#CBD5E1] rounded-xl p-4 hover:border-blue-500 transition-colors cursor-pointer bg-[#F8FAFC]">
                    <input
                      type="file"
                      accept=".cer,.CER"
                      onChange={handleFielCerFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center text-center">
                      <FileText className="h-10 w-10 text-slate-400 mb-2" />
                      <p className="text-[#64748B] text-sm">
                        {fielCerFileInfo ? fielCerFileInfo.name : "Selecciona tu archivo .cer"}
                      </p>
                      {fielCerFileInfo && (
                        <p className="text-xs text-slate-500 mt-1">
                          Tamaño: {fielCerFileInfo.size}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Botón .key de FIEL */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#475569] mb-2 ml-2">
                    Llave Privada FIEL (.key)
                  </label>
                  <div className="relative border-2 border-dashed border-[#CBD5E1] rounded-xl p-4 hover:border-blue-500 transition-colors cursor-pointer bg-[#F8FAFC]">
                    <input
                      type="file"
                      accept=".key,.KEY"
                      onChange={handleFielKeyFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center text-center">
                      <Key className="h-10 w-10 text-slate-400 mb-2" />
                      <p className="text-[#64748B] text-sm">
                        {fielKeyFileInfo ? fielKeyFileInfo.name : "Selecciona tu archivo .key"}
                      </p>
                      {fielKeyFileInfo && (
                        <p className="text-xs text-slate-500 mt-1">
                          Tamaño: {fielKeyFileInfo.size}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contraseña FIEL */}
                <div className="mb-4">
                  <Label>Contraseña de la FIEL:</Label>
                  <div className="relative">
                    <input
                      type={showFielPassword ? "text" : "password"}
                      value={fielPassword}
                      onChange={(e) => setFielPassword(e.target.value)}
                      placeholder="Ingresa la contraseña de tu FIEL"
                      className={`${inputStyle} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowFielPassword(!showFielPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showFielPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 italic">
                    *Esta contraseña será la de la FIEL. En este campo no hay que definir una nueva
                    contraseña o volver a escribir la del acceso a FacturaPro.
                  </p>
                </div>

                {/* Botones de descarga FIEL */}
                <div className="flex gap-4 mt-6 justify-center">
                  <button
                    onClick={downloadFielCer}
                    className="flex items-center justify-center gap-2 rounded-xl bg-white border-2 border-[#E2E8F0] px-4 py-2 text-[#475569] hover:bg-[#F8FAFC] transition-colors"
                    title="Descargar archivo .cer"
                  >
                    <Download className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Descargar .cer</span>
                  </button>
                  <button
                    onClick={downloadFielKey}
                    className="flex items-center justify-center gap-2 rounded-xl bg-white border-2 border-[#E2E8F0] px-4 py-2 text-[#475569] hover:bg-[#F8FAFC] transition-colors"
                    title="Descargar archivo .key"
                  >
                    <Download className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Descargar .key</span>
                  </button>
                </div>
              </div>

              {/* Columna derecha - Información FIEL */}
              <div className="bg-[#F8FAFC] rounded-xl border-2 border-[#E2E8F0] p-4">
                <h3 className="text-md font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  Información de la FIEL
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-[#64748B]">Número de certificado:</p>
                    <p className="text-base font-mono text-blue-600 font-semibold">
                      {fielData.certificateNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B]">Vigencia:</p>
                    <p className="text-base font-mono text-blue-600 font-semibold">
                      {fielData.validity}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Botón Guardar */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-8 py-3 font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition-all duration-200 hover:bg-blue-400"
            >
              <Save className="h-5 w-5" />
              Guardar Certificados
            </button>
          </div>
        </main>
      </div>

      {/* Componente Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
        duration={4000}
      />
    </AppLayout>
  );
}
