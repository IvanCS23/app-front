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
      { label: "Agregar Addenda", href: "/pages/invoices/addenda" },
      { label: "Carga XML", href: "/pages/invoices/xml" },
      { label: "Consultar", href: "/pages/invoices/consult" },
      { label: "Descarga de Facturas", href: "/pages/invoices/DownloadInvoices" },
      { label: "Facturación masiva", href: "/pages/invoices/massive" },
      { label: "Recuperación", href: "/pages/invoices/recovery" },             
    ],
  },
  {
    id: "cotizaciones",
    label: "Cotizaciones",
    icon: <FileText className="h-5 w-5" />,
    subMenu: [
      { label: "Crear Cotización", href: "/cotizaciones/crear" },
      { label: "Cotizaciones Aprobadas", href: "/cotizaciones/aprobadas" },
      { label: "Mis Cotizaciones", href: "/cotizaciones/mis-cotizaciones" },
    ],
  },
  {
    id: "catalogos",
    label: "Catálogos",
    icon: <BookImage className="h-5 w-5" />,
    subMenu: [
      { label: "Clientes", href: "/pages/catalogs/clients" },
      { label: "Empleados", href: "/pages/catalogs/employee" },
      { label: "Productos", href: "/pages/catalogs/products" },
    ],
  },
  {
    id: "cuentas",
    label: "Cuentas",
    icon: <Wallet className="h-5 w-5" />,
    subMenu: [
      { label: "Cuentas por cobrar", href: "/pages/accounts/receivable" },
      { label: "Cuentas por pagar", href: "/pages/accounts/payable" },
      { label: "Libro diario", href: "/pages/accounts/journal" },
    ],
  },
  {
    id: "estadisticas",
    label: "Estadísticas",
    icon: <BarChart3 className="h-5 w-5" />,
    subMenu: [
      { label: "Informe mensual", href: "/pages/statistics/reports" },
      { label: "Mis estadísticas", href: "/pages/statistics/charts" },
    ],
  },
];