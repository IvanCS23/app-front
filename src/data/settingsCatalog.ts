import {
  Building2,
  CreditCard,
  Database,
  FileBadge,
  FileKey,
  FolderCog,
  KeyRound,
  Lock,
  Mail,
  MapPinned,
  Plug,
  Receipt,
  Server,
  Settings as SettingsIcon,
  Shield,
  User,
  Users,
  Webhook,
} from "lucide-react";
import type { SettingCategory, SettingItem } from "@/src/types/settings";
import { navState, showDemoScreens } from "@/src/data/screenStatus";

export const settingsCatalog: SettingCategory[] = [
  {
    id: "empresa",
    label: "Empresa",
    items: [
      {
        id: "datos-fiscales",
        title: "Datos fiscales",
        description: "Razón social, régimen fiscal y datos generales de tu empresa.",
        icon: Building2,
        href: "/pages/settings/fiscal",
        status: "available",
      },
      {
        id: "sellos-digitales",
        title: "Sellos Digitales",
        description: "Carga tus certificados .cer y .key vigentes para el timbrado oficial.",
        icon: FileKey,
        href: "/pages/settings/sellos",
        status: "available",
      },
      {
        id: "lugar-expedicion",
        title: "Lugar de Expedición",
        description: "Configura sucursales, domicilios y códigos postales de emisión.",
        icon: MapPinned,
        href: "/pages/settings/expedition",
        status: "available",
      },
      {
        id: "cuentas-banco",
        title: "Cuentas de Banco",
        description: "Registra CLABES interbancarias para cobro en tus facturas.",
        icon: CreditCard,
        href: "/pages/settings/bankAccount",
        status: "available",
      },
      {
        id: "ajustes-generales",
        title: "Ajustes Generales",
        description: "Notificaciones por correo, idioma del sistema y temas visuales.",
        icon: SettingsIcon,
        href: "/pages/settings/generalSettings",
        status: "available",
      },
    ],
  },
  {
    id: "facturacion",
    label: "Facturación",
    items: [
      {
        id: "series-folios",
        title: "Series y Folios",
        description: "Configura folios y series para facturas, notas y recibos.",
        icon: FileBadge,
        href: "/pages/settings/InvoiceType",
        status: "available",
      },
      {
        id: "cfdi",
        title: "CFDI",
        description: "Preferencias de timbrado y uso de comprobantes fiscales digitales.",
        icon: Receipt,
        href: "/pages/settings/cfdi",
        status: "coming-soon",
      },
      {
        id: "addendas",
        title: "Addendas",
        description: "Campos extra requeridos por clientes comerciales específicos.",
        icon: FolderCog,
        href: "/pages/settings/addenda",
        status: "available",
      },
      {
        id: "observaciones",
        title: "Observaciones",
        description: "Textos predeterminados para términos y condiciones en tus PDF.",
        icon: Mail,
        href: "/pages/settings/observations",
        status: "available",
      },
    ],
  },
  {
    id: "impuestos",
    label: "Impuestos",
    items: [
      {
        id: "impuestos",
        title: "Impuestos",
        description: "Tasas y regímenes de impuestos aplicables a tus productos.",
        icon: Database,
        href: "/pages/catalogs/impuestos",
        status: "available",
      },
    ],
  },
  {
    id: "usuarios",
    label: "Usuarios",
    items: [
      {
        id: "mi-perfil",
        title: "Mi Perfil",
        description: "Gestiona tus datos personales y preferencias de la cuenta.",
        icon: User,
        href: "/pages/profile",
        status: "available",
      },
      {
        id: "usuarios",
        title: "Usuarios",
        description: "Administra los usuarios y accesos de tu empresa.",
        icon: Users,
        href: "/pages/catalogs/usuarios",
        status: "available",
      },
      {
        id: "roles",
        title: "Roles",
        description: "Define roles personalizados para tu equipo de trabajo.",
        icon: Shield,
        href: "/pages/settings/roles",
        status: "coming-soon",
      },
      {
        id: "permisos",
        title: "Permisos",
        description: "Controla qué puede ver y hacer cada rol dentro del sistema.",
        icon: Lock,
        href: "/pages/settings/permisos",
        status: "coming-soon",
      },
    ],
  },
  {
    id: "integraciones",
    label: "Integraciones",
    items: [
      {
        id: "api",
        title: "API",
        description: "Genera llaves de acceso para integrar tus propios sistemas.",
        icon: Plug,
        href: "/pages/settings/api",
        status: "coming-soon",
      },
      {
        id: "webhooks",
        title: "Webhooks",
        description: "Recibe notificaciones en tiempo real de eventos del sistema.",
        icon: Webhook,
        href: "/pages/settings/webhooks",
        status: "coming-soon",
      },
      {
        id: "correo",
        title: "Correo",
        description: "Envío automático de las facturas timbradas a tus clientes.",
        icon: Mail,
        href: "/pages/settings/correo",
        status: "available",
      },
      {
        id: "sat",
        title: "SAT",
        description: "Estado de la conexión con los servicios del SAT.",
        icon: Server,
        href: "/pages/settings/sat",
        status: "coming-soon",
      },
    ],
  },
  {
    id: "seguridad",
    label: "Seguridad",
    items: [
      {
        id: "contrasena",
        title: "Contraseña",
        description: "Actualiza la contraseña de acceso a tu cuenta.",
        icon: KeyRound,
        href: "/pages/settings/seguridad/password",
        status: "available",
      },
      {
        id: "autenticacion",
        title: "Autenticación",
        description: "Activa la verificación en dos pasos para tu cuenta.",
        icon: Shield,
        href: "/pages/settings/seguridad/autenticacion",
        status: "coming-soon",
      },
      {
        id: "sesiones",
        title: "Sesiones",
        description: "Consulta y cierra las sesiones activas de tu cuenta.",
        icon: Server,
        href: "/pages/settings/seguridad/sesiones",
        status: "coming-soon",
      },
    ],
  },
];

/**
 * Fase 6.24: catálogo según el registro de pantallas. Un "coming-soon"
 * explícito se respeta (p. ej. "Datos fiscales" no es la pantalla de
 * generalSettings); si no, manda el registro: real → disponible,
 * demo → "demo" sólo con NEXT_PUBLIC_SHOW_DEMO_SCREENS=true (si no, se
 * oculta), sin página → "coming-soon".
 */
export function visibleSettingsCatalog(showDemo: boolean = showDemoScreens()): SettingCategory[] {
  return settingsCatalog
    .map((category) => ({
      ...category,
      items: category.items.flatMap((item): SettingItem[] => {
        if (item.status === "coming-soon") return [item];

        const state = navState(item.href, showDemo);

        if (state === "hidden") return [];

        return [{ ...item, status: state === "real" ? "available" : state === "demo" ? "demo" : "coming-soon" }];
      }),
    }))
    .filter((category) => category.items.length > 0);
}
