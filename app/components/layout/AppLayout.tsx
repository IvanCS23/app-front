"use client";

import React, { useState } from "react";
import Navbar from "@/app/components/layout/Navbar";
import Sidebar from "@/app/components/layout/Sidebar";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const [activeItem, setActiveItem] = useState<string>("dashboard");
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#06111f] text-white">
      <Sidebar
        isOpenMobile={isSidebarOpenMobile}
        isCollapsed={isSidebarCollapsed}
        activeItem={activeItem}
        onCloseMobile={() => setIsSidebarOpenMobile(false)}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
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