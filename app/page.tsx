import React from "react";
import Link from "next/link";

const MaintenancePage: React.FC = () => {
  return (
    <div
      className="text-white flex items-center justify-center min-h-screen"
      style={{
        background: "radial-gradient(circle at top, #0f172a, #020617)",
      }}
    >
      <div className="text-center px-6">
        {/* LOGO */}
        <div className="mb-10 flex justify-center">
          <img
            src="/logo.jpeg"
            alt="Kluks Blu Logo"
            className="h-28 md:h-32 rounded-lg"
            style={{
              boxShadow: "0 0 30px rgba(59,130,246,0.4)",
            }}
          />
        </div>

        {/* TITULO */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Estamos trabajando en algo increíble
        </h1>

        <p className="text-gray-300 max-w-xl mx-auto mb-10">
          Nuestro sitio web está temporalmente en mantenimiento mientras
          realizamos mejoras para brindarte una mejor experiencia.
        </p>

        {/* ICONO ANIMADO */}
        <div className="flex justify-center mb-10">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-blue-400"></div>
        </div>

        {/* CONTACTO */}
        <div className="text-gray-400 text-sm">
          <p>Si necesitas información puedes contactarnos:</p>
          <p className="mt-2 text-blue-300 font-semibold">
            contacto@kluksblu.com.mx
          </p>
        </div>
          <Link href="/login" className="mt-8 inline-block">
            <button
              type="button"
              className="text-heading bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5"
            >
              Teal to Lime
            </button>
          </Link>

        {/* FOOTER */}
        <div className="mt-12 text-gray-500 text-xs">
          © 2026 Kluks Blu. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;