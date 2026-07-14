import Link from "next/link";
import { ChevronRight, LifeBuoy, Settings as SettingsIcon } from "lucide-react";

export default function SettingsHeader() {
  return (
    <div className="mb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
            <SettingsIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-[26px] font-extrabold tracking-tight text-slate-900">
              Configuración
            </h1>
            <p className="text-[14px] text-slate-500">
              Gestiona toda la configuración de tu empresa.
            </p>
          </div>
        </div>

        <button className="flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:w-auto">
          <LifeBuoy className="h-4 w-4" />
          Soporte
        </button>
      </div>

      <nav className="mt-4 flex items-center gap-1.5 text-[13px] text-slate-500">
        <Link href="/pages/dashboard" className="transition-colors hover:text-blue-600">
          Inicio
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
        <span className="font-medium text-slate-700">Configuración</span>
      </nav>
    </div>
  );
}
