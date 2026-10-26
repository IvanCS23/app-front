"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { getInitials } from "@/src/lib/initials";
import { navState } from "@/src/data/screenStatus";
import ScreenBadge from "@/app/components/ui/ScreenBadge";
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  LogOut,
  Building2,
  Fingerprint,
  Plus,
  ChevronDown,
} from "lucide-react";

const NUEVA_VENTA_HREF = "/pages/sales/new";

type NavbarProps = {
  onOpenSidebar: () => void;
  isCollapsed: boolean;
};

export default function Navbar({ onOpenSidebar, isCollapsed }: NavbarProps) {
  const { user, loading, logout } = useAuth();
  const nuevaVentaState = navState(NUEVA_VENTA_HREF);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
    await logout();
  };

  const firstName = user?.name?.split(" ")[0] ?? "";
  const initials = user ? getInitials(user.name) : "";
  const planLabel = user?.company?.plan ?? "Sin plan";
  const rfcLabel = user?.company?.rfc ?? "No registrado";

  return (
    <header
      className={`sticky top-0 z-30 h-[70px] border-b border-[#E2E8F0] bg-white shadow-sm transition-all duration-300 ${
        isCollapsed ? "xl:ml-18" : "xl:ml-72"
      }`}
    >
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6">

        {/* Left: hamburger + page title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors xl:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden md:block">
            {loading ? (
              <div className="space-y-1.5">
                <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-52 animate-pulse rounded bg-slate-100" />
              </div>
            ) : (
              <>
                <h1 className="text-[15px] font-semibold leading-tight text-slate-800">
                  Bienvenido{firstName ? `, ${firstName}` : ""} 👋
                </h1>
                <p className="text-[12px] text-slate-400">
                  Aquí tienes el resumen de tu negocio
                </p>
              </>
            )}
          </div>
        </div>

        {/* Center: search */}
        <div className="hidden md:flex flex-1 max-w-sm mx-4 lg:max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar cliente, factura, producto..."
              className="h-10 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-10 pr-4 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/15 hover:border-slate-300"
            />
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">

          {/* Notifications */}
          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
            title="Notificaciones"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-500 ring-1 ring-white" />
          </button>

          {/* Help */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
            title="Ayuda"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          {/* Nueva venta CTA (Fase 6.24: según el registro de pantallas) */}
          {nuevaVentaState === "unavailable" ? (
            <span
              aria-disabled="true"
              title="Próximamente"
              className="hidden sm:flex cursor-not-allowed items-center gap-1.5 rounded-xl px-4 h-9 text-[13px] font-semibold text-slate-400 bg-slate-100"
            >
              <Plus className="h-4 w-4" />
              Nueva venta
              <ScreenBadge state={nuevaVentaState} />
            </span>
          ) : nuevaVentaState !== "hidden" && (
            <Link
              href={NUEVA_VENTA_HREF}
              className="hidden sm:flex items-center gap-1.5 rounded-xl px-4 h-9 text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Nueva venta
              <ScreenBadge state={nuevaVentaState} />
            </Link>
          )}

          {/* User dropdown */}
          {loading ? (
            <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 h-9">
              <div className="h-6 w-6 shrink-0 animate-pulse rounded-full bg-slate-200" />
              <div className="hidden sm:block h-3 w-20 animate-pulse rounded bg-slate-200" />
            </div>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 h-9 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-6 w-6 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)",
                    }}
                  >
                    {initials}
                  </div>
                )}
                <span className="hidden sm:block text-[13px] font-medium">
                  {user?.name ?? ""}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                    isProfileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-[#E2E8F0] bg-white shadow-xl z-50 overflow-hidden">

                  {/* User info header */}
                  <div className="flex items-center gap-3 border-b border-[#E2E8F0] bg-[#F8FAFC] p-4">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-11 w-11 shrink-0 rounded-full object-cover shadow-sm"
                      />
                    ) : (
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-bold text-white shadow-sm"
                        style={{
                          background: "linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)",
                        }}
                      >
                        {initials}
                      </div>
                    )}
                    <div>
                      <p className="text-[14px] font-semibold text-slate-800">
                        {user?.name ?? ""}
                      </p>
                      <p className="text-[11px] text-slate-500">{planLabel}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2.5 p-4">
                    <div className="flex items-center gap-3">
                      <Fingerprint className="h-4 w-4 shrink-0 text-slate-400" />
                      <span className="text-[12px] text-slate-500">RFC:</span>
                      <span className="font-mono text-[11px] text-slate-700">
                        {rfcLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
                      <span className="text-[12px] text-slate-500">Plan:</span>
                      <span className="text-[12px] text-slate-700">{planLabel}</span>
                    </div>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-[#E2E8F0] p-3">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-red-500 transition-colors hover:bg-red-100 hover:text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-[13px] font-medium">Cerrar sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
