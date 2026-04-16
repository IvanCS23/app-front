"use client";
import React, { useState } from "react";
import AppLayout from "@/app/components/layout/AppLayout";

export default function PerfilFiscalPage() {
  const [whatsapp, setWhatsapp] = useState("");
  const [cif, setCif] = useState(null);
  const [progreso, setProgreso] = useState(65);

  return (
    <AppLayout>
      <div className="min-h-screen text-white flex gap-8">
        {/* Sidebar */}
        <aside className="w-[320px] flex flex-col items-center bg-[#1a222c] border-2 border-[#173156] rounded-2xl p-6">
          <div className="w-32 h-32 bg-[#232b36] rounded-xl flex items-center justify-center mb-6 border-2 border-[#164a7a]">
            <span className="text-5xl font-bold text-slate-400">W</span>
          </div>
          <span className="text-xs text-gray-400 mb-4 text-center">Sube una imagen de alta resolución (PNG o SVG) para personalizar tus documentos fiscales.</span>
          <div className="w-full bg-[#232b36] rounded-xl p-4 flex flex-col items-center mb-8 border-2 border-[#164a7a]">
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
                className="box box-input"
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
              />
              <button className="h-12 bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg font-semibold text-white text-sm shadow-[0_10px_30px_rgba(37,99,235,0.25)]">VALIDAR</button>
            </div>
          </div>

          {/* CIF Card */}
          <div className="flex items-center gap-6 mb-8">
            <div className="flex-1 bg-[#1a222c] rounded-2xl border-2 border-[#173156] p-6 flex flex-col gap-2">
              <span className="text-blue-400 text-xs font-bold tracking-widest">Constancia de Situación Fiscal (CIF)</span>
              <span className="text-gray-300 text-sm">Para cumplir con el esquema <b>CFDI 4.0</b>, es obligatorio que tus datos coincidan exactamente con tu constancia. Nuestro sistema puede autocompletar tu perfil procesando tu archivo CIF.</span>
            </div>
            <div className="bg-[#232b36] rounded-2xl p-6 flex flex-col items-center min-w-[260px] gap-4 border-2 border-[#173156]">
              <button className="bg-[#232b36] border-2 border-dashed border-gray-500 rounded-xl w-48 h-20 flex flex-col items-center justify-center text-white hover:bg-[#1a222c]">
                <span className="font-bold text-lg mb-1">CARGA TU CIF</span>
                <span className="text-xs text-gray-400">Sube el archivo aquí</span>
              </button>
            </div>
          </div>

          {/* Datos Fiscales */}
          <div className="bg-[#1a222c] rounded-2xl p-4 mb-4 border-2 border-[#173156]">
            <span className="text-blue-400 text-xs font-bold tracking-widest mb-4 block">DATOS FISCALES</span>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1 ml-2">TIPO DE PERSONA</label>
                <select className="box box-input">
                  <option>Persona Física</option>
                  <option>Persona Moral</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1 ml-2">GIRO U OCUPACIÓN</label>
                <select className="box box-input">
                  <option>Servicios Profesionales</option>
                  <option>Comercio</option>
                  <option>Industrial</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1 ml-2">TAMAÑO DE LA EMPRESA</label>
                <select className="box box-input">
                  <option>Micro (1-10)</option>
                  <option>Pequeña (11-50)</option>
                  <option>Mediana (51-250)</option>
                  <option>Grande (250+)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1 ml-2">NOMBRE FISCAL / RAZÓN SOCIAL</label>
                <input className="box box-input" placeholder="Ej. Soluciones Tecnológicas S.A. de C.V." />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1 ml-2">NOMBRE COMERCIAL</label>
                <input className="box box-input" placeholder="Ej. Sapphire Logic" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1 ml-2">RÉGIMEN FISCAL</label>
                <select className="box box-input">
                  <option>601 - General de Ley Personas Morales</option>
                  <option>603 - Personas Morales con Fines no Lucrativos</option>
                  <option>605 - Sueldos y Salarios e Ingresos Asimilados a Salarios</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1 ml-2">E-MAIL PRINCIPAL</label>
                <input className="box box-input" placeholder="admin@empresa.com" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1 ml-2">E-MAIL OPCIONAL (FACTURACIÓN)</label>
                <input className="box box-input" placeholder="contabilidad@empresa.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1 ml-2">TELÉFONO</label>
                <input className="box box-input" placeholder="+52 (55) 0000 0000" />
              </div>
            </div>
          </div>

          {/* Domicilio Fiscal */}
          <div className="bg-[#1a222c] rounded-2xl p-4 mb-8 border-2 border-[#173156]">
            <span className="text-blue-400 text-xs font-bold tracking-widest mb-4 block">DOMICILIO FISCAL</span>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1 ml-2">CÓDIGO POSTAL</label>
                <input className="box box-input" placeholder="00000" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1 ml-2">CALLE</label>
                <input className="box box-input" placeholder="Av. Paseo de la Reforma" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1 ml-2">NÚMERO EXTERIOR</label>
                <input className="box box-input" placeholder="S/N" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1 ml-2">NÚMERO INTERIOR</label>
                <input className="box box-input" placeholder="Opcional" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1 ml-2">COLONIA</label>
                <input className="box box-input" placeholder="Col. Juárez" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1 ml-2">LOCALIDAD</label>
                <input className="box box-input" placeholder="Ciudad de México" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1 ml-2">MUNICIPIO / ALCALDÍA</label>
                <input className="box box-input" placeholder="Cuauhtémoc" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1 ml-2">ESTADO</label>
                <select className="box box-input">
                  <option>CDMX</option>
                  <option>Estado de México</option>
                  <option>Jalisco</option>
                  <option>Nuevo León</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1 ml-2">PAÍS</label>
                <select className="box box-input">
                  <option>México</option>
                  <option>Estados Unidos</option>
                  <option>Canadá</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 mt-8">
            <button className="w-32 bg-red-500 hover:bg-red-400 px-6 py-3 rounded-lg font-semibold text-gray-300 shadow-[0_10px_30px_rgba(255,0,0,0.25)]">Cancelar</button>
            <button className="w-32 bg-blue-500 hover:bg-blue-400 px-6 py-3 rounded-lg font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)]">Guardar</button>
          </div>
          <div className="mt-4 text-xs text-gray-500 text-center">
            Tus datos están protegidos bajo protocolos de encriptación bancaria.
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
