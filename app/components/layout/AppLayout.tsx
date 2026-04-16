"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // ← Importar usePathname
import Navbar from "@/app/components/layout/Navbar";
import Sidebar from "@/app/components/layout/Sidebar";
import { menuItems } from "@/app/components/layout/MenuItems";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname(); // ← Obtener la ruta actual
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Determinar qué item está activo basado en la ruta actual
  const getActiveItemFromPath = (path: string): string => {
    // Primero, verificar submenús
    for (const item of menuItems) {
      if (item.subMenu) {
        for (const subItem of item.subMenu) {
          if (path === subItem.href) {
            return item.id;
          }
        }
      }
      // Verificar si es un item principal con href
      if (item.href && path === item.href) {
        return item.id;
      }
      // También verificar si la ruta contiene el id (para rutas anidadas)
      if (path.includes(item.id) && item.id !== "dashboard") {
        return item.id;
      }
    }
    
    // Por defecto, si es dashboard o no encuentra coincidencia
    if (path === "/pages/dashboard" || path === "/dashboard" || path === "/") {
      return "dashboard";
    }
    
    return "dashboard";
  };

  const [activeItem, setActiveItem] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return getActiveItemFromPath(pathname);
    }
    return "dashboard";
  });

  // Actualizar activeItem cuando cambie la ruta
  useEffect(() => {
    const newActiveItem = getActiveItemFromPath(pathname);
    setActiveItem(newActiveItem);
  }, [pathname]);

  // Cargar estado del sidebar
  useEffect(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    if (saved !== null) {
      setIsSidebarCollapsed(saved === "true");
    }
    setIsClient(true);
  }, []);

  const handleToggleCollapse = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", String(newState));
  };

  // Mostrar layout estático mientras carga
  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#06111f] text-white">
        <div className="fixed left-0 top-0 z-50 h-screen w-[260px] border-r border-[#173156] bg-[#05101d]" />
        <div className="xl:ml-[260px]">
          <div className="sticky top-0 z-30 h-20 border-b border-[#173156] bg-[#06111f]/95" />
          <main className="p-6">{children}</main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06111f] text-white">
      <Sidebar
        isOpenMobile={isSidebarOpenMobile}
        isCollapsed={isSidebarCollapsed}
        activeItem={activeItem}
        onCloseMobile={() => setIsSidebarOpenMobile(false)}
        onToggleCollapse={handleToggleCollapse}
        onChangeSection={setActiveItem}
      />

      <Navbar
        onOpenSidebar={() => setIsSidebarOpenMobile(true)}
        isCollapsed={isSidebarCollapsed}
      />

      <main
        className={`p-6 transition-all duration-300 ${
          isSidebarCollapsed ? "xl:ml-[92px]" : "xl:ml-[260px]"
        }`}
      >
        {children}
      </main>
    </div>
  );
}