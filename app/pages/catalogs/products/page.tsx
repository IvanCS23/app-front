"use client";
import React, { useState } from "react";
import { SquarePen, Trash } from "lucide-react";
import AppLayout from "@/app/components/layout/AppLayout";

const productosMock = [
  {
    codigo: "43231501",
    nombre: "Licencia Software Pro",
    descripcion: "Suscripción anual para entorno corporativo...",
    clave: "E48",
    unidad: "Unidad de servicio",
    precio: "$12,450.00",
  },
  {
    codigo: "81111504",
    nombre: "Consultoría IT Nivel 2",
    descripcion: "Servicios profesionales de arquitectura ...",
    clave: "HUR",
    unidad: "Hora",
    precio: "$2,800.00",
  },
  {
    codigo: "43201484",
    nombre: "Servidor Rack G10",
    descripcion: "Hardware de alto rendimiento para pro...",
    clave: "H87",
    unidad: "Pieza",
    precio: "$85,200.00",
  },
  {
    codigo: "43232107",
    nombre: "Firewall Appliance X",
    descripcion: "Seguridad perimetral con filtrado avanz...",
    clave: "H87",
    unidad: "Pieza",
    precio: "$15,300.00",
  },
];

export default function CatalogoProductos() {
  const [search, setSearch] = useState("");

  return (
    <AppLayout>
      
    <div className="min-h-screen bg-[#151c24] text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold">Catálogo de Productos</h1>
          <p className="text-gray-400">
            Administra tus productos, servicios y claves SAT para facturación.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="text-blue-400 hover:underline">Carga masiva de productos</button>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold shadow text-white">
            + Agregar producto
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <input
          className="flex-1 bg-[#232b36] px-4 py-2 rounded-lg outline-none text-white"
          placeholder="status, método, uri"
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
              <th className="p-3 text-left">CÓDIGO SAT</th>
              <th className="p-3 text-left">NOMBRE</th>
              <th className="p-3 text-left">DESCRIPCIÓN</th>
              <th className="p-3 text-left">CLAVE UNIDAD</th>
              <th className="p-3 text-left">UNIDAD</th>
              <th className="p-3 text-right">PRECIO</th>
            </tr>
          </thead>
          <tbody>
            {productosMock.map((p, i) => (
              <tr key={i} className="border-t border-[#232b36] hover:bg-[#1a222c]">
                <td className="p-3 flex gap-2">
                  <button className="text-gray-400 hover:text-blue-400">
                    <SquarePen className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-red-400">
                    <Trash className="h-4 w-4" />
                  </button>
                </td>
                <td className="p-3">
                  <span className="bg-[#1e293b] text-blue-300 px-2 py-1 rounded text-xs font-mono cursor-pointer hover:underline">
                    {p.codigo}
                  </span>
                </td>
                <td className="p-3 font-bold">{p.nombre}</td>
                <td className="p-3 text-gray-400">{p.descripcion}</td>
                <td className="p-3">{p.clave}</td>
                <td className="p-3">{p.unidad}</td>
                <td className="p-3 text-right font-bold text-yellow-400">{p.precio}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center p-4 border-t border-[#232b36] text-gray-400 text-sm">
          <span>Mostrando 1 a 4 de 125 resultados</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-[#1a222c] rounded">Anterior</button>
            <button className="px-3 py-1 bg-blue-600 rounded text-white">1</button>
            <button className="px-3 py-1 bg-[#1a222c] rounded">2</button>
            <button className="px-3 py-1 bg-[#1a222c] rounded">3</button>
            <button className="px-3 py-1 bg-[#1a222c] rounded">Siguiente</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-[#1a222c] rounded-xl p-6 flex flex-col items-start">
          <span className="text-xs text-gray-400 font-bold mb-2">TOTAL PRODUCTOS</span>
          <span className="text-3xl font-extrabold mb-2">1,250</span>
          <div className="w-full h-1 bg-blue-700 rounded" />
        </div>
        <div className="bg-[#1a222c] rounded-xl p-6 flex flex-col items-start">
          <span className="text-xs text-yellow-400 font-bold mb-2">SERVICIOS SAT</span>
          <span className="text-3xl font-extrabold mb-2">84</span>
          <div className="w-full h-1 bg-yellow-400 rounded" />
        </div>
        <div className="bg-[#1a222c] rounded-xl p-6 flex flex-col items-start">
          <span className="text-xs text-gray-400 font-bold mb-2">OPTIMIZACIÓN</span>
          <span className="text-base mb-2">Claves actualizadas al catálogo 2024.</span>
        </div>
      </div>
    </div>
    </AppLayout>
  );
}