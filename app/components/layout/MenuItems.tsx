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
import { navState, showDemoScreens, type NavState } from "@/src/data/screenStatus";

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

export type VisibleSubMenuItem = SubMenuItem & { state: Exclude<NavState, "hidden"> };

export type VisibleMenuItem = Omit<MenuItem, "subMenu"> & {
  state: Exclude<NavState, "hidden">;
  subMenu?: VisibleSubMenuItem[];
};

export type VisibleMenuGroup = { group?: string; items: VisibleMenuItem[] };

/**
 * Fase 6.24: menú según el registro de pantallas. Las demo se ocultan salvo
 * con NEXT_PUBLIC_SHOW_DEMO_SCREENS=true; las no disponibles se muestran
 * como "Próximamente" sin enlace. Un submenú sin entradas visibles y un
 * grupo vacío desaparecen.
 */
export function visibleMenuGroups(showDemo: boolean = showDemoScreens()): VisibleMenuGroup[] {
  return menuGroups
    .map((group) => ({
      group: group.group,
      items: group.items.flatMap((item): VisibleMenuItem[] => {
        if (item.subMenu) {
          const subMenu = item.subMenu.flatMap((sub): VisibleSubMenuItem[] => {
            const state = navState(sub.href, showDemo);

            return state === "hidden" ? [] : [{ ...sub, state }];
          });

          if (subMenu.length === 0) return [];

          const state = subMenu.every((sub) => sub.state === "unavailable") ? "unavailable" : "real";

          return [{ ...item, subMenu, state }];
        }

        const state = item.href ? navState(item.href, showDemo) : "real";

        return state === "hidden" ? [] : [{ ...item, subMenu: undefined, state }];
      }),
    }))
    .filter((group) => group.items.length > 0);
}
