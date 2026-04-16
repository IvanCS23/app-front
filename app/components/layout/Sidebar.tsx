"use client";

import Link from "next/link";
import { X, ChevronLeft, ChevronRight, BadgeDollarSign } from "lucide-react";
import { menuItems } from "@/app/components/layout/MenuItems";

type SidebarProps = {
  isOpenMobile: boolean;
  isCollapsed: boolean;
  activeItem: string;
  onCloseMobile: () => void;
  onToggleCollapse: () => void;
  onChangeSection: (id: string) => void;
};

export default function Sidebar({
  isOpenMobile,
  isCollapsed,
  activeItem,
  onCloseMobile,
  onToggleCollapse,
  onChangeSection,
}: SidebarProps) {
  
  // Manejar clic en un item del menú
  const handleItemClick = (itemId: string, hasSubMenu: boolean) => {
    // Si el sidebar está colapsado y el item tiene submenú, expandir el sidebar
    if (isCollapsed && hasSubMenu) {
      onToggleCollapse();
    }
    // Cambiar la sección activa
    onChangeSection(itemId);
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 xl:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen border-r border-[#173156] bg-[#05101d] transition-all duration-300
          ${isCollapsed ? "w-[92px]" : "w-[260px]"}
          ${isOpenMobile ? "translate-x-0" : "-translate-x-full"}
          xl:translate-x-0
        `}
      >
        {/* Header del sidebar */}
        <div className="flex h-20 items-center justify-between border-b border-[#173156] px-4">
          <div
            className={`flex items-center gap-3 overflow-hidden ${
              isCollapsed ? "w-full justify-center" : ""
            }`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white shadow-[0_10px_30px_rgba(37,99,235,0.30)]">
              <BadgeDollarSign className="h-5 w-5" />
            </div>

            {!isCollapsed && (
              <span className="whitespace-nowrap text-[28px] font-bold tracking-tight text-white">
                FacturaPro
              </span>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={onCloseMobile}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-[#0d1b35] hover:text-white xl:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Contenido del sidebar */}
        <div className="flex h-[calc(100vh-80px)] flex-col justify-between p-4">
          {/* Menú de navegación */}
          <div className="space-y-2">
            {menuItems.map((item) => {
              const isActive = activeItem === item.id;
              const hasSubMenu = !!item.subMenu && item.subMenu.length > 0;
              
              const content = (
                <span
                  className={`group flex w-full items-center rounded-2xl px-4 py-3 transition-all duration-200 ${
                    isCollapsed ? "justify-center" : "gap-3"
                  } ${
                    isActive
                      ? "bg-blue-500 text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)]"
                      : "text-slate-300 hover:bg-[#0d1b35] hover:text-white"
                  }`}
                  title={isCollapsed ? item.label : ""}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="text-[15px] font-medium">{item.label}</span>
                  )}
                </span>
              );

              return (
                <div key={item.id}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      onClick={() => {
                        handleItemClick(item.id, hasSubMenu);
                        onCloseMobile();
                      }}
                      className="w-full"
                    >
                      {content}
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        handleItemClick(item.id, hasSubMenu);
                        onCloseMobile();
                      }}
                      className="w-full text-left"
                    >
                      {content}
                    </button>
                  )}

                  {/* Submenú */}
                  {!isCollapsed && isActive && item.subMenu && (
                    <div className="ml-8 mt-2 flex flex-col gap-1">
                      {item.subMenu.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => {
                            onChangeSection(item.id);
                            onCloseMobile();
                          }}
                          className="rounded-xl px-4 py-2 text-sm text-slate-300 transition hover:bg-[#173156] hover:text-white"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Botón para colapsar/expandir */}
          <div className="space-y-3">
            <button
              onClick={onToggleCollapse}
              className={`flex h-11 w-full items-center rounded-xl border border-[#173156] bg-[#0d1830] text-slate-300 transition hover:bg-[#132241] hover:text-white ${
                isCollapsed ? "justify-center" : "justify-between px-4"
              }`}
            >
              {!isCollapsed && <span className="text-sm font-medium">Colapsar</span>}
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}