"use client";
import React, { useState } from "react";
import AppLayout from "@/app/components/layout/AppLayout";

export default function PerfilFiscalPage() {
  const [whatsapp, setWhatsapp] = useState("");
  const [cif, setCif] = useState(null);
  const [progreso, setProgreso] = useState(65);

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#151c24] text-white p-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-[320px] flex flex-col items-center bg-[#1a222c] rounded-2xl p-6">
          <div className="w-32 h-32 bg-[#232b36] rounded-xl flex items-center justify-center mb-6">
            <span className="text-5xl font-bold text-slate-400">W</span>
          </div>
          <span className="text-xs text-gray-400 mb-4 text-center">Sube una imagen de alta resolución (PNG o SVG) para personalizar tus documentos fiscales.</span>
          <div className="w-full bg-[#232b36] rounded-xl p-4 flex flex-col items-center mb-8">
            <span className="text-sm font-semibold mb-2 text-blue-400">Estatus de Perfil</span>
            <span className="text-xs text-gray-400 mb-2">Completado</span>
            <div className="w-full h-2 bg-[#232b36] rounded mb-2">
              <div className="h-2 bg-blue-500 rounded" style={{ width: progreso + '%' }} />
            </div>
            <span className="text-xs text-blue-400 font-bold">{progreso}%</span>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-extrabold mb-1">Información de perfil fiscal</h1>
              <p className="text-gray-400">Configura los datos legales para tu facturación y reportes.</p>
            </div>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="10 Dígitos"
                className="bg-[#232b36] px-4 py-2 rounded-lg outline-none text-white w-40 text-sm"
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold text-white text-sm">VALIDAR</button>
            </div>
          </div>

          {/* CIF Card */}
          <div className="flex items-center gap-6 mb-8">
            <div className="flex-1 bg-[#1a222c] rounded-2xl p-6 flex flex-col gap-2">
              <span className="text-blue-400 text-xs font-bold tracking-widest">Constancia de Situación Fiscal (CIF)</span>
              <span className="text-gray-300 text-sm">Para cumplir con el esquema <b>CFDI 4.0</b>, es obligatorio que tus datos coincidan exactamente con tu constancia. Nuestro sistema puede autocompletar tu perfil procesando tu archivo CIF.</span>
            </div>
            <div className="bg-[#232b36] rounded-2xl p-6 flex flex-col items-center min-w-[260px]">
              <button className="bg-[#232b36] border-2 border-dashed border-gray-500 rounded-xl w-48 h-20 flex flex-col items-center justify-center text-white hover:bg-[#1a222c]">
                <span className="font-bold text-lg mb-1">CARGA TU CIF</span>
                <span className="text-xs text-gray-400">Sube el archivo aquí</span>
              </button>
            </div>
          </div>

          {/* Datos Fiscales */}
          <div className="bg-[#1a222c] rounded-2xl p-8 mb-8">
            <span className="text-blue-400 text-xs font-bold tracking-widest mb-4 block">DATOS FISCALES</span>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">TIPO DE PERSONA</label>
                <select className="w-full bg-[#232b36] rounded-lg px-3 py-2 text-white">
                  <option>Persona Física</option>
                  <option>Persona Moral</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">GIRO U OCUPACIÓN</label>
                <select className="w-full bg-[#232b36] rounded-lg px-3 py-2 text-white">
                  <option>Servicios Profesionales</option>
                  <option>Comercio</option>
                  <option>Industrial</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">TAMAÑO DE LA EMPRESA</label>
                <select className="w-full bg-[#232b36] rounded-lg px-3 py-2 text-white">
                  <option>Micro (1-10)</option>
                  <option>Pequeña (11-50)</option>
                  <option>Mediana (51-250)</option>
                  <option>Grande (250+)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">NOMBRE FISCAL / RAZÓN SOCIAL</label>
                <input className="w-full bg-[#232b36] rounded-lg px-3 py-2 text-white" placeholder="Ej. Soluciones Tecnológicas S.A. de C.V." />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">NOMBRE COMERCIAL</label>
                <input className="w-full bg-[#232b36] rounded-lg px-3 py-2 text-white" placeholder="Ej. Sapphire Logic" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">RÉGIMEN FISCAL</label>
                <select className="w-full bg-[#232b36] rounded-lg px-3 py-2 text-white">
                  <option>601 - General de Ley Personas Morales</option>
                  <option>603 - Personas Morales con Fines no Lucrativos</option>
                  <option>605 - Sueldos y Salarios e Ingresos Asimilados a Salarios</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">E-MAIL PRINCIPAL</label>
                <input className="w-full bg-[#232b36] rounded-lg px-3 py-2 text-white" placeholder="admin@empresa.com" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">E-MAIL OPCIONAL (FACTURACIÓN)</label>
                <input className="w-full bg-[#232b36] rounded-lg px-3 py-2 text-white" placeholder="contabilidad@empresa.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">TELÉFONO</label>
                <input className="w-full bg-[#232b36] rounded-lg px-3 py-2 text-white" placeholder="+52 (55) 0000 0000" />
              </div>
            </div>
          </div>

          {/* Domicilio Fiscal */}
          <div className="bg-[#1a222c] rounded-2xl p-8 mb-8">
            <span className="text-blue-400 text-xs font-bold tracking-widest mb-4 block">DOMICILIO FISCAL</span>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">CÓDIGO POSTAL</label>
                <input className="w-full bg-[#232b36] rounded-lg px-3 py-2 text-white" placeholder="00000" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">CALLE</label>
                <input className="w-full bg-[#232b36] rounded-lg px-3 py-2 text-white" placeholder="Av. Paseo de la Reforma" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">NÚMERO EXTERIOR</label>
                <input className="w-full bg-[#232b36] rounded-lg px-3 py-2 text-white" placeholder="S/N" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">NÚMERO INTERIOR</label>
                <input className="w-full bg-[#232b36] rounded-lg px-3 py-2 text-white" placeholder="Opcional" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">COLONIA</label>
                <input className="w-full bg-[#232b36] rounded-lg px-3 py-2 text-white" placeholder="Col. Juárez" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">LOCALIDAD</label>
                <input className="w-full bg-[#232b36] rounded-lg px-3 py-2 text-white" placeholder="Ciudad de México" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">MUNICIPIO / ALCALDÍA</label>
                <input className="w-full bg-[#232b36] rounded-lg px-3 py-2 text-white" placeholder="Cuauhtémoc" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">ESTADO</label>
                <select className="w-full bg-[#232b36] rounded-lg px-3 py-2 text-white">
                  <option>CDMX</option>
                  <option>Estado de México</option>
                  <option>Jalisco</option>
                  <option>Nuevo León</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">PAÍS</label>
                <select className="w-full bg-[#232b36] rounded-lg px-3 py-2 text-white">
                  <option>México</option>
                  <option>Estados Unidos</option>
                  <option>Canadá</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 mt-8">
            <button className="bg-[#232b36] hover:bg-[#232b36]/80 px-6 py-3 rounded-lg font-semibold text-gray-300">Cancelar</button>
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold text-white">GUARDAR INFORMACIÓN</button>
          </div>
          <div className="mt-4 text-xs text-gray-500 text-center">
            Tus datos están protegidos bajo protocolos de encriptación bancaria.
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
