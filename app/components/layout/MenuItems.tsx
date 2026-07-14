import React from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Receipt,
  DollarSign,
  Users,
  Target,
  Building2,
  Package,
  Wrench,
  Percent,
  CreditCard,
  Landmark,
  ArrowLeftRight,
  UserCircle,
  Banknote,
  Lock,
  BarChart3,
  Settings,
} from "lucide-react";

export type SubMenuItem = {
  label: string;
  href: string;
};

export type MenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  subMenu?: SubMenuItem[];
};

export type MenuGroup = {
  group?: string;
  items: MenuItem[];
};

export const menuGroups: MenuGroup[] = [
  {
    items: [
      {
        id: "dashboard",
        label: "Inicio",
        icon: <LayoutDashboard className="h-5 w-5" />,
        href: "/pages/dashboard",
      },
    ],
  },
  {
    group: "VENTAS",
    items: [
      {
        id: "nueva-venta",
        label: "Nueva venta",
        icon: <ShoppingCart className="h-5 w-5" />,
        href: "/pages/invoices/nueva-venta",
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
        id: "cobranza",
        label: "Cobranza",
        icon: <DollarSign className="h-5 w-5" />,
        href: "/pages/accounts/cobranza",
      },
    ],
  },
  {
    group: "CONTACTOS",
    items: [
      {
        id: "clientes",
        label: "Clientes",
        icon: <Users className="h-5 w-5" />,
        href: "/pages/catalogs/clients",
      },
      {
        id: "prospectos",
        label: "Prospectos",
        icon: <Target className="h-5 w-5" />,
        href: "/pages/catalogs/prospectos",
      },
      {
        id: "proveedores",
        label: "Proveedores",
        icon: <Building2 className="h-5 w-5" />,
        href: "/pages/catalogs/proveedores",
      },
    ],
  },
  {
    group: "CATÁLOGO",
    items: [
      {
        id: "productos",
        label: "Productos",
        icon: <Package className="h-5 w-5" />,
        href: "/pages/catalogs/products",
      },
      {
        id: "servicios",
        label: "Servicios",
        icon: <Wrench className="h-5 w-5" />,
        href: "/pages/catalogs/servicios",
      },
      {
        id: "impuestos",
        label: "Impuestos",
        icon: <Percent className="h-5 w-5" />,
        href: "/pages/catalogs/impuestos",
      },
    ],
  },
  {
    group: "FINANZAS",
    items: [
      {
        id: "cuentas",
        label: "Cuentas por cobrar",
        icon: <CreditCard className="h-5 w-5" />,
        href: "/pages/accounts/receivable",
      },
      {
        id: "cuentas-pagar",
        label: "Cuentas por pagar",
        icon: <Landmark className="h-5 w-5" />,
        href: "/pages/accounts/payable",
      },
      {
        id: "movimientos",
        label: "Movimientos",
        icon: <ArrowLeftRight className="h-5 w-5" />,
        href: "/pages/accounts/journal",
      },
    ],
  },
  {
    group: "EMPRESA",
    items: [
      {
        id: "catalogos",
        label: "Empleados",
        icon: <UserCircle className="h-5 w-5" />,
        href: "/pages/catalogs/employee",
      },
      {
        id: "nomina",
        label: "Nómina",
        icon: <Banknote className="h-5 w-5" />,
        href: "/pages/catalogs/nomina",
      },
      {
        id: "usuarios",
        label: "Usuarios",
        icon: <Lock className="h-5 w-5" />,
        href: "/pages/catalogs/usuarios",
      },
    ],
  },
  {
    group: "ANÁLISIS",
    items: [
      {
        id: "estadisticas",
        label: "Reportes",
        icon: <BarChart3 className="h-5 w-5" />,
        subMenu: [
          { label: "Informe mensual", href: "/pages/statistics/reports" },
          { label: "Mis estadísticas", href: "/pages/statistics/charts" },
        ],
      },
    ],
  },
  {
    group: "SISTEMA",
    items: [
      {
        id: "configuracion",
        label: "Configuración",
        icon: <Settings className="h-5 w-5" />,
        href: "/pages/settings",
      },
    ],
  },
];

// Flat array kept for backward compatibility with AppLayout path-matching logic
export const menuItems = menuGroups.flatMap((g) => g.items);
