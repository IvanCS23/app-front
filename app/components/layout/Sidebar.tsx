"use client";

import Link from "next/link";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { menuGroups } from "@/app/components/layout/MenuItems";

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
  const handleItemClick = (itemId: string, hasSubMenu: boolean) => {
    if (isCollapsed && hasSubMenu) onToggleCollapse();
    if (activeItem === itemId && hasSubMenu) {
      onChangeSection("");
    } else {
      onChangeSection(itemId);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 xl:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen flex flex-col
          bg-white border-r border-gray-200 shadow-sm
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-[72px]" : "w-72"}
          ${isOpenMobile ? "translate-x-0" : "-translate-x-full"}
          xl:translate-x-0
        `}
      >
        {/* ── Header ───────────────────────────────────────────────── */}
        <div
          className={`flex shrink-0 items-center border-b border-gray-100
            ${isCollapsed ? "justify-center px-4 py-5" : "gap-3 px-5 py-5"}`}
        >
          {/* Logo */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-700 text-white text-xs font-bold select-none">
            SE
          </div>

          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800 truncate leading-tight">
                Sistema Empresarial
              </p>
              <p className="text-xs text-gray-400 truncate mt-0.5">
                Panel administrativo
              </p>
            </div>
          )}

          {!isCollapsed && (
            <button
              onClick={onCloseMobile}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors xl:hidden"
              aria-label="Cerrar menú"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* ── Navigation ───────────────────────────────────────────── */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3
            [&::-webkit-scrollbar]:w-0.75
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-200"
        >
          <nav>
            {menuGroups.map((group, gi) => (
              <div key={gi} className={gi > 0 ? "mt-6" : ""}>

                {/* Group label — expanded */}
                {group.group && !isCollapsed && (
                  <div className="mb-2 px-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {group.group}
                    </p>
                  </div>
                )}

                {/* Group divider — collapsed */}
                {group.group && isCollapsed && gi > 0 && (
                  <div className="mb-3 h-px bg-gray-100 mx-2" />
                )}

                {/* Menu items */}
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = activeItem === item.id;
                    const hasSubMenu = !!item.subMenu?.length;

                    const itemInner = (
                      <div
                        className={`
                          group flex items-center rounded-lg
                          transition-all duration-200 cursor-pointer
                          ${isCollapsed
                            ? "justify-center px-3 py-2.5"
                            : "gap-3 px-4 py-2.5"
                          }
                          ${isActive
                            ? "bg-blue-700 text-white shadow-sm"
                            : "text-gray-600 hover:bg-blue-500 hover:text-white"
                          }
                        `}
                        title={isCollapsed ? item.label : ""}
                      >
                        {/* Icon */}
                        <span className="w-5 h-5 shrink-0 flex items-center justify-center">
                          {item.icon}
                        </span>

                        {/* Label */}
                        {!isCollapsed && (
                          <span className="flex-1 text-sm font-medium">
                            {item.label}
                          </span>
                        )}

                        {/* Chevron */}
                        {!isCollapsed && hasSubMenu && (
                          <ChevronRight
                            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                              isActive ? "rotate-90" : ""
                            }`}
                          />
                        )}
                      </div>
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
                            className="block"
                          >
                            {itemInner}
                          </Link>
                        ) : (
                          <button
                            onClick={() => {
                              handleItemClick(item.id, hasSubMenu);
                              onCloseMobile();
                            }}
                            className="w-full text-left"
                          >
                            {itemInner}
                          </button>
                        )}

                        {/* Submenu */}
                        {!isCollapsed && isActive && item.subMenu && (
                          <div className="ml-6 mt-1 mb-1 space-y-0.5 border-l border-gray-200 pl-3">
                            {item.subMenu.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={() => {
                                  onChangeSection(item.id);
                                  onCloseMobile();
                                }}
                                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-blue-500 hover:text-white"
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
              </div>
            ))}
          </nav>
        </div>

        {/* ── Collapse toggle ───────────────────────────────────────── */}
        <div className="shrink-0 border-t border-gray-100 p-4">
          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? "Expandir menú" : ""}
            className={`flex h-9 w-full items-center gap-3 rounded-lg text-gray-500
              transition-all duration-200 hover:bg-blue-500 hover:text-white
              ${isCollapsed ? "justify-center" : "px-4"}`}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 shrink-0" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 shrink-0" />
                <span className="text-sm font-medium">Colapsar menú</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
