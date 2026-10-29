/**
 * Fase 6.24 — Honestidad de la interfaz.
 *
 * Única fuente de verdad sobre el estado de cada pantalla:
 * - real: conectada a la API Laravel.
 * - demo: maqueta navegable que no guarda ni envía nada.
 * - unavailable: enlazada desde el menú o Configuración, pero sin página.
 *
 * Las pantallas demo sólo se ofrecen en la navegación cuando
 * NEXT_PUBLIC_SHOW_DEMO_SCREENS=true; si alguien entra por URL ve el aviso
 * de demostración. Una prueba exige que cada página de app/pages esté aquí.
 */

export type ScreenStatus = "real" | "demo" | "unavailable";

/** Estado con el que se muestra un enlace: oculto si es demo y no se exhiben. */
export type NavState = ScreenStatus | "hidden";

export const SCREEN_STATUS: Readonly<Record<string, ScreenStatus>> = {
  // Reales (API Laravel). El Dashboard es la portada tras el login: se
  // conserva como real y sus indicadores de ejemplo llevan su propio aviso.
  "/pages/dashboard": "real",
  "/pages/invoices/consult": "real",
  "/pages/invoices/[id]": "real",
  "/pages/catalogs/clients": "real",
  "/pages/catalogs/products": "real",
  "/pages/catalogs/usuarios": "real",
  "/pages/settings": "real",
  "/pages/sales": "real",
  "/pages/sales/new": "real",
  "/pages/sales/[id]": "real",

  // Maquetas: no guardan ni envían nada.
  "/pages/accounts/journal": "demo",
  "/pages/accounts/payable": "demo",
  "/pages/accounts/receivable": "demo",
  "/pages/catalogs/employee": "demo",
  "/pages/invoices/DownloadInvoices": "demo",
  "/pages/invoices/massive": "demo",
  "/pages/invoices/recovery": "demo",
  "/pages/invoices/xml": "demo",
  "/pages/profile": "demo",
  "/pages/settings/InvoiceType": "demo",
  "/pages/settings/addenda": "demo",
  "/pages/settings/bankAccount": "demo",
  "/pages/settings/expedition": "demo",
  "/pages/settings/fiscal": "real",
  "/pages/settings/generalSettings": "demo",
  "/pages/settings/observations": "demo",
  "/pages/settings/sellos": "demo",
  "/pages/statistics/charts": "demo",
  "/pages/statistics/reports": "demo",

  // Enlazadas sin página.
  "/cotizaciones/crear": "unavailable",
  "/cotizaciones/aprobadas": "unavailable",
  "/cotizaciones/mis-cotizaciones": "unavailable",
  "/pages/quotes/new": "unavailable",
  "/pages/import": "unavailable",
  "/pages/invoices/addenda": "unavailable",
  "/pages/accounts/cobranza": "unavailable",
  "/pages/catalogs/prospectos": "unavailable",
  "/pages/catalogs/proveedores": "unavailable",
  "/pages/catalogs/servicios": "unavailable",
  "/pages/catalogs/impuestos": "unavailable",
  "/pages/catalogs/nomina": "unavailable",
  "/pages/settings/cfdi": "unavailable",
  "/pages/settings/roles": "unavailable",
  "/pages/settings/permisos": "unavailable",
  "/pages/settings/api": "unavailable",
  "/pages/settings/webhooks": "unavailable",
  "/pages/settings/correo": "unavailable",
  "/pages/settings/sat": "unavailable",
  "/pages/settings/seguridad/password": "unavailable",
  "/pages/settings/seguridad/autenticacion": "unavailable",
  "/pages/settings/seguridad/sesiones": "unavailable",
};

export function showDemoScreens(): boolean {
  return process.env.NEXT_PUBLIC_SHOW_DEMO_SCREENS === "true";
}

/** Una ruta que no está en el registro se trata como no disponible. */
export function screenStatus(href: string): ScreenStatus {
  return SCREEN_STATUS[href] ?? "unavailable";
}

export function isDemoScreen(href: string): boolean {
  return screenStatus(href) === "demo";
}

export function navState(href: string, showDemo: boolean = showDemoScreens()): NavState {
  const status = screenStatus(href);

  if (status === "demo") {
    return showDemo ? "demo" : "hidden";
  }

  return status;
}
