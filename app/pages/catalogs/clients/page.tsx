"use client";
import React, { useState } from "react";
import { SquarePen, Trash, Eye } from "lucide-react";
import AppLayout from "@/app/components/layout/AppLayout";

const clientesMock = [
  {
    iniciales: "AD",
    nombre: "AARON DIAZ FLORES",
    rfc: "DIFA806512XYZ",
    email: "aaron.diaz@example.com",
    cp: "06700",
  },
  {
    iniciales: "AP",
    nombre: "AUTOS PREMIER GK",
    rfc: "APG120304HJK",
    email: "contacto@autospremier.mx",
    cp: "64000",
  },
  {
    iniciales: "BC",
    nombre: "BERNARDO CARRILLO",
    rfc: "CABB50101789",
    email: "b.carrillo@provider.net",
    cp: "45010",
  },
  {
    iniciales: "CI",
    nombre: "CONSTRUCTORA INTEGRAL",
    rfc: "CIN506812S34",
    email: "pagos@constructora-int.com",
    cp: "72000",
  },
];

export default function CatalogoClientes() {
  const [search, setSearch] = useState("");

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#151c24] text-white p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Catálogo de Clientes</h1>
            <p className="text-gray-400">
              Gestiona la base de datos de tus socios comerciales, consulta sus datos fiscales y realiza cargas masivas de información.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="text-blue-400 hover:underline">Carga masiva de clientes</button>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold shadow text-white">
              + Agregar Cliente
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <input
            className="flex-1 bg-[#232b36] px-4 py-2 rounded-lg outline-none text-white"
            placeholder="Filtrar por nombre, RFC o correo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <span className="text-gray-400">MOSTRAR</span>
            <select className="bg-[#232b36] px-3 py-2 rounded text-white">
              <option>25 registros</option>
              <option>50 registros</option>
              <option>100 registros</option>
            </select>
          </div>
        </div>

        <div className="bg-[#232b36] rounded-xl overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead className="bg-[#1a222c] text-gray-400">
              <tr>
                <th className="p-3 text-left">ACCIONES</th>
                <th className="p-3 text-left">NOMBRE / RAZÓN SOCIAL</th>
                <th className="p-3 text-left">RFC</th>
                <th className="p-3 text-left">EMAIL</th>
                <th className="p-3 text-left">CÓDIGO POSTAL</th>
              </tr>
            </thead>
            <tbody>
              {clientesMock.map((c, i) => (
                <tr key={i} className="border-t border-[#232b36] hover:bg-[#1a222c]">
                  <td className="p-3 flex gap-2">
                    <button className="text-gray-400 hover:text-blue-400"><SquarePen className="h-4 w-4" /></button>
                    <button className="text-gray-400 hover:text-red-400"><Trash className="h-4 w-4" /></button>
                    <button className="text-gray-400 hover:text-white"><Eye className="h-4 w-4" /></button>
                  </td>
                  <td className="p-3 flex items-center gap-3 font-bold">
                    <span className={`rounded-lg px-2 py-1 text-xs font-bold ${i === 1 ? 'bg-yellow-600 text-yellow-200' : 'bg-blue-900 text-blue-200'}`}>{c.iniciales}</span>
                    {c.nombre}
                  </td>
                  <td className="p-3">
                    <span className="bg-[#1e293b] text-blue-300 px-2 py-1 rounded text-xs font-mono cursor-pointer hover:underline">
                      {c.rfc}
                    </span>
                  </td>
                  <td className="p-3 text-gray-300">{c.email}</td>
                  <td className="p-3">{c.cp}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center p-4 border-t border-[#232b36] text-gray-400 text-sm">
            <span>Mostrando 1 a 4 de 45 registros</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-[#1a222c] rounded">Anterior</button>
              <button className="px-3 py-1 bg-blue-600 rounded text-white">1</button>
              <button className="px-3 py-1 bg-[#1a222c] rounded">2</button>
              <button className="px-3 py-1 bg-[#1a222c] rounded">3</button>
              <button className="px-3 py-1 bg-[#1a222c] rounded">Siguiente</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-[#1a222c] rounded-xl p-6 flex flex-col items-start">
            <span className="text-base font-bold mb-2">Resumen de Actividad</span>
            <span className="text-gray-300 mb-2">Has agregado 12 clientes nuevos este mes. Tu base de datos ha crecido un 8% respecto al periodo anterior.</span>
            <a href="#" className="text-blue-400 hover:underline text-sm">Ver reporte detallado</a>
          </div>
          <div className="bg-[#1a222c] rounded-xl p-6 flex flex-col items-start">
            <span className="text-base font-bold mb-2">PRÓXIMO VENCIMIENTO</span>
            <span className="text-3xl font-extrabold mb-2">15 Clientes</span>
            <span className="text-gray-300 mb-2">Requieren actualización de constancia fiscal.</span>
            <div className="flex gap-1 mt-2">
              <span className="bg-blue-800 text-white rounded-full px-2 py-1 text-xs font-bold">JD</span>
              <span className="bg-blue-800 text-white rounded-full px-2 py-1 text-xs font-bold">ML</span>
              <span className="bg-yellow-700 text-white rounded-full px-2 py-1 text-xs font-bold">RC</span>
              <span className="bg-gray-700 text-white rounded-full px-2 py-1 text-xs font-bold">+12</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
