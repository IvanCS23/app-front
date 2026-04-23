"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getToken, logoutRequest } from "@/lib/api";
import { Menu, Search, Bell, Settings, BadgeDollarSign, User, LogOut, Building2, Fingerprint } from "lucide-react";

type NavbarProps = {
  onOpenSidebar: () => void;
  isCollapsed: boolean;
};

export default function Navbar({
  onOpenSidebar,
  isCollapsed,
}: NavbarProps) {
  const router = useRouter();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Datos del usuario (simulados)
  const userData = {
    nombre: "Administrador",
    rfc: "ADMIN800101XYZ",
    plan: "Plan Empresarial",
  };

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);

    const token = getToken();
    if (token) {
      try {
        await logoutRequest(token);
      } catch (error) {
        console.error("No se pudo cerrar sesión en el backend:", error);
      }
    }

    clearSession();
    router.push("/login");
  };

  return (
    <header
      className={`
        sticky top-0 z-30 h-20 border-b border-[#173156] bg-[#06111f]/95 backdrop-blur transition-all duration-300
        ${isCollapsed ? "xl:ml-[92px]" : "xl:ml-[260px]"}
      `}
    >
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenSidebar}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#16233b] text-slate-300 hover:text-white xl:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden items-center gap-3 sm:flex xl:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white">
              <BadgeDollarSign className="h-5 w-5" />
            </div>
            <Link href="/dashboard" className="text-lg font-bold text-white">
              FacturaPro
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar facturas o clientes..."
                className="h-12 w-full rounded-xl border-2 border-slate-800 bg-[#081423] pl-11 pr-12 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 hover:border-blue-500/40"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#16233b] text-slate-300 hover:text-white"
            title="Notificaciones">
            <Bell className="h-5 w-5" />
          </button>

          <Link
            href="/pages/settings"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#16233b] text-slate-300 hover:text-white"
            title="Configuración">
            <Settings className="h-5 w-5" />
          </Link>

          {/* Botón de perfil con el mismo estilo */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#16233b] text-slate-300 hover:text-white transition-colors"
              title="Perfil">
              <User className="h-5 w-5" />
            </button>

            {/* Submenú desplegable */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-[#173156] bg-[#071321] shadow-2xl z-50 overflow-hidden">
                {/* Header del menú */}
                <div className="p-4 border-b border-[#173156] bg-[#0a1424]">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-[#16233b] flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{userData.nombre}</p>
                      <p className="text-xs text-slate-400">{userData.plan}</p>
                    </div>
                  </div>
                </div>

                {/* Información del usuario */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Fingerprint className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-400">RFC:</span>
                    <span className="text-white font-mono text-xs">{userData.rfc}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Building2 className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-400">Plan:</span>
                    <span className="text-white">{userData.plan}</span>
                  </div>
                </div>

                {/* Botón de cerrar sesión */}
                <div className="p-4 border-t border-[#173156] bg-[#0a1424]">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-2 text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
                    >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Cerrar sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}