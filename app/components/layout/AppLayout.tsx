"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation"; // ← Importar usePathname
import { useAuth } from "@/src/hooks/useAuth";
import { getToken } from "@/src/services/auth.services";
import { sessionRedirect } from "@/src/services/sessionGuard";
import Navbar from "@/app/components/layout/Navbar";
import Sidebar from "@/app/components/layout/Sidebar";
import { menuItems } from "@/app/components/layout/MenuItems";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname(); // ← Obtener la ruta actual
  const router = useRouter();
  const { user, loading } = useAuth();
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

  // Fase 6.32 (D7): guardia mínima, sólo experiencia de usuario; el backend
  // sigue siendo la autoridad. Sin token, al login; con contraseña temporal,
  // a cambiarla.
  const redirectTo = isClient && !loading ? sessionRedirect(getToken(), user) : null;

  useEffect(() => {
    if (redirectTo) router.replace(redirectTo);
  }, [redirectTo, router]);

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

  // Mostrar layout estático mientras carga (sin contenido si se va a redirigir)
  if (!isClient || redirectTo) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="fixed left-0 top-0 z-50 h-screen w-72 border-r border-gray-200 bg-white" />
        <div className="xl:ml-72">
          <div className="sticky top-0 z-30 h-[70px] border-b border-[#E2E8F0] bg-white" />
          <main className="p-6">{redirectTo ? null : children}</main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
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
        className={`p-6 pt-4 transition-all duration-300 ${
          isSidebarCollapsed ? "xl:ml-18" : "xl:ml-72"
        }`}
      >
        {children}
      </main>
    </div>
  );
}