"use client";

import Link from "next/link";
import { Menu, Search, Bell, Settings, BadgeDollarSign } from "lucide-react";

type NavbarProps = {
  onOpenSidebar: () => void;
  isCollapsed: boolean;
};

export default function Navbar({
  onOpenSidebar,
  isCollapsed,
}: NavbarProps) {
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
                className="h-12 w-[290px] rounded-2xl border border-[#173156] bg-[#0a1830] pl-11 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500/50"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#16233b] text-slate-300 hover:text-white">
            <Bell className="h-5 w-5" />
          </button>

          <Link
            href="/pages/settings"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#16233b] text-slate-300 hover:text-white"
          >
            <Settings className="h-5 w-5" />
          </Link>

          <div className="h-11 w-11 rounded-full border-2 border-blue-500 bg-[#efc4ab]" />
        </div>
      </div>
    </header>
  );
}