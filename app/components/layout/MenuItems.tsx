import React from "react";
import {
  LayoutDashboard,
  Receipt,
  FileText,
  BookImage,
  Wallet,
  BarChart3,
} from "lucide-react";

export type SubMenuItem = {
  label: string;
  href: string;
};

export type MenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  subMenu?: SubMenuItem[];
  href?: string;
};

export const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: "/pages/dashboard",
  },
  {
    id: "facturas",
    label: "Facturas",
    icon: <Receipt className="h-5 w-5" />,
    subMenu: [
      { label: "Recuperación", href: "/facturas/recuperacion" },
      { label: "Facturación masiva", href: "/facturas/masiva" },
      { label: "Descarga masiva", href: "/facturas/descarga-masiva" },
      { label: "Descarga de Facturas", href: "/facturas/descarga-facturas" },
      { label: "Carga XML", href: "/facturas/xml" },
      { label: "Agregar Addenda", href: "/facturas/addenda" },
    ],
  },
  {
    id: "cotizaciones",
    label: "Cotizaciones",
    icon: <FileText className="h-5 w-5" />,
    subMenu: [
      { label: "Crear Cotización", href: "/cotizaciones/crear" },
      { label: "Mis Cotizaciones", href: "/cotizaciones/mis-cotizaciones" },
      { label: "Cotizaciones Aprobadas", href: "/cotizaciones/aprobadas" },
    ],
  },
  {
    id: "catalogos",
    label: "Catálogos",
    icon: <BookImage className="h-5 w-5" />,
    subMenu: [
      { label: "Clientes", href: "/pages/catalogs/clients" },
      { label: "Productos", href: "/pages/catalogs/products" },
      { label: "Empleados", href: "/pages/catalogs/employee" },
    ],
  },
  {
    id: "cuentas",
    label: "Cuentas",
    icon: <Wallet className="h-5 w-5" />,
    subMenu: [
      { label: "Cuentas por Pagar", href: "/pages/accounts/payable" },
      { label: "Cuentas por cobrar", href: "/pages/accounts/receivable" },
      { label: "Libro diario", href: "/pages/accounts/journal" },
    ],
  },
  {
    id: "estadisticas",
    label: "Estadísticas",
    icon: <BarChart3 className="h-5 w-5" />,
    subMenu: [
      { label: "Mis estadísticas", href: "/pages/statistics/my-statistics" },
      { label: "Informe mensual", href: "/pages/statistics/monthly-report" },
      { label: "Informe PayPal", href: "/pages/statistics/paypal-report" },
    ],
  },
];