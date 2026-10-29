import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { visibleMenuGroups } from "@/app/components/layout/MenuItems";
import { visibleSettingsCatalog } from "@/src/data/settingsCatalog";
import { navState, SCREEN_STATUS, screenStatus, showDemoScreens } from "./screenStatus";

const root = path.resolve(import.meta.dirname, "../..");

function pageRoutes(dir = path.join(root, "app/pages")): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return pageRoutes(full);
    if (entry !== "page.tsx") return [];
    return ["/" + path.relative(path.join(root, "app"), path.dirname(full)).split(path.sep).join("/")];
  });
}

function pageExists(route: string): boolean {
  return existsSync(path.join(root, "app", ...route.split("/").filter(Boolean), "page.tsx"));
}

const navigationSources = [
  "app/components/layout/MenuItems.tsx",
  "app/components/layout/Navbar.tsx",
  "app/pages/dashboard/page.tsx",
  "src/data/settingsCatalog.ts",
];

afterEach(() => vi.unstubAllEnvs());

describe("registro de pantallas", () => {
  it("clasifica cada página de app/pages como real o demo", () => {
    for (const route of pageRoutes()) {
      expect(SCREEN_STATUS[route], route).toMatch(/^(real|demo)$/);
    }
  });

  it("las rutas real/demo existen y las no disponibles no tienen página", () => {
    for (const [route, status] of Object.entries(SCREEN_STATUS)) {
      expect(pageExists(route), `${route} (${status})`).toBe(status !== "unavailable");
    }
  });

  it("todo enlace del menú, Navbar, Dashboard y Configuración está en el registro", () => {
    for (const file of navigationSources) {
      const source = readFileSync(path.join(root, file), "utf8");
      const hrefs = source.match(/["'](\/(?:pages|cotizaciones)\/[^"'\s]+)["']/g) ?? [];
      for (const quoted of hrefs) {
        const href = quoted.slice(1, -1);
        expect(href in SCREEN_STATUS, `${file}: ${href}`).toBe(true);
      }
    }
  });

  it("una ruta desconocida se trata como no disponible", () => {
    expect(screenStatus("/pages/no-existe")).toBe("unavailable");
  });

  it("NEXT_PUBLIC_SHOW_DEMO_SCREENS es false por omisión y sólo 'true' la activa", () => {
    vi.stubEnv("NEXT_PUBLIC_SHOW_DEMO_SCREENS", "");
    expect(showDemoScreens()).toBe(false);
    vi.stubEnv("NEXT_PUBLIC_SHOW_DEMO_SCREENS", "1");
    expect(showDemoScreens()).toBe(false);
    vi.stubEnv("NEXT_PUBLIC_SHOW_DEMO_SCREENS", "true");
    expect(showDemoScreens()).toBe(true);
  });

  it.each([
    [false, "hidden"],
    [true, "demo"],
  ] as const)("con demos=%s una pantalla demo queda %s; real y no disponible no cambian", (showDemo, demoState) => {
    expect(navState("/pages/invoices/massive", showDemo)).toBe(demoState);
    expect(navState("/pages/invoices/consult", showDemo)).toBe("real");
    expect(navState("/pages/quotes/new", showDemo)).toBe("unavailable");
  });
});

describe("menú según el registro", () => {
  const labels = (showDemo: boolean) =>
    visibleMenuGroups(showDemo).flatMap((group) => group.items.flatMap((item) => [item.label, ...(item.subMenu ?? []).map((sub) => sub.label)]));

  it("sin demos: oculta maquetas y el grupo FINANZAS (sólo maquetas)", () => {
    const groups = visibleMenuGroups(false);

    expect(labels(false)).not.toContain("Movimientos");
    expect(labels(false)).not.toContain("Facturación masiva");
    expect(labels(false)).toContain("Consultar");
    expect(groups.map((group) => group.group)).not.toContain("FINANZAS");
  });

  it("con demos: muestra las maquetas marcadas como demo", () => {
    const items = visibleMenuGroups(true).flatMap((group) => group.items);

    expect(items.find((item) => item.label === "Movimientos")?.state).toBe("demo");
    expect(items.find((item) => item.label === "Facturas")?.subMenu?.find((sub) => sub.label === "Carga XML")?.state).toBe("demo");
  });

  it.each([false, true])("con demos=%s los destinos sin página quedan como no disponibles", (showDemo) => {
    const items = visibleMenuGroups(showDemo).flatMap((group) => group.items);

    expect(items.find((item) => item.label === "Cotizaciones")?.state).toBe("unavailable");
    // Fase 6.25: el flujo de ventas es real.
    expect(items.find((item) => item.label === "Nueva venta")?.state).toBe("real");
    expect(items.find((item) => item.label === "Ventas")?.state).toBe("real");
  });
});

describe("Configuración según el registro", () => {
  const byTitle = (showDemo: boolean) =>
    Object.fromEntries(visibleSettingsCatalog(showDemo).flatMap((category) => category.items).map((item) => [item.title, item.status]));

  it("sin demos: oculta las maquetas y conserva lo real y lo próximo", () => {
    const items = byTitle(false);

    // Fase 6.27b: Sellos Digitales es real.
    expect(items["Sellos Digitales"]).toBe("available");
    expect(items["Usuarios"]).toBe("available");
    // Fase 6.27b: Datos fiscales es una pantalla real.
    expect(items["Datos fiscales"]).toBe("available");
  });

  it("con demos: las maquetas aparecen como demo", () => {
    expect(byTitle(true)["Cuentas de Banco"]).toBe("demo");
    expect(byTitle(false)["Cuentas de Banco"]).toBeUndefined();
    expect(byTitle(true)["Sellos Digitales"]).toBe("available");
  });

  it.each([false, true])("con demos=%s un enlace sin página nunca queda disponible", (showDemo) => {
    const impuestos = visibleSettingsCatalog(showDemo)
      .flatMap((category) => category.items)
      .find((item) => item.href === "/pages/catalogs/impuestos");

    expect(impuestos?.status).toBe("coming-soon");
  });
});
