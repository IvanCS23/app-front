import { render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import DashboardFacturaPro from "@/app/pages/dashboard/page";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => "/pages/dashboard" }));
vi.mock("@/app/components/layout/AppLayout", () => ({ default: ({ children }: { children: ReactNode }) => <div>{children}</div> }));
vi.mock("@/src/hooks/useAuth", () => ({ useAuth: () => ({ user: null, loading: false, logout: vi.fn() }) }));

/**
 * Fase 6.24: NEXT_PUBLIC_SHOW_DEMO_SCREENS decide si las maquetas aparecen
 * en la navegación. Los destinos sin página nunca son enlaces.
 */
afterEach(() => vi.unstubAllEnvs());

function renderSidebar(activeItem = "facturas") {
  return render(
    <Sidebar isOpenMobile isCollapsed={false} activeItem={activeItem} onCloseMobile={vi.fn()} onToggleCollapse={vi.fn()} onChangeSection={vi.fn()} />,
  );
}

describe.each([
  ["false", false],
  ["true", true],
] as const)("NEXT_PUBLIC_SHOW_DEMO_SCREENS=%s", (value, showDemo) => {
  it("Sidebar: maquetas según la variable; lo real siempre es enlace", () => {
    vi.stubEnv("NEXT_PUBLIC_SHOW_DEMO_SCREENS", value);
    renderSidebar();

    expect(screen.getByRole("link", { name: /Consultar/ })).toHaveAttribute("href", "/pages/invoices/consult");

    if (showDemo) {
      const xml = screen.getByRole("link", { name: /Carga XML/ });
      expect(xml).toHaveAttribute("href", "/pages/invoices/xml");
      expect(within(xml).getByText("Demo")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Movimientos/ })).toBeInTheDocument();
    } else {
      expect(screen.queryByText("Carga XML")).not.toBeInTheDocument();
      expect(screen.queryByText("Movimientos")).not.toBeInTheDocument();
      expect(screen.queryByText("Demo")).not.toBeInTheDocument();
    }
  });

  it("Sidebar: un destino sin página se muestra como Próximamente y no es enlace", () => {
    vi.stubEnv("NEXT_PUBLIC_SHOW_DEMO_SCREENS", value);
    renderSidebar();

    expect(screen.queryByRole("link", { name: /Nueva venta/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Agregar Addenda/ })).not.toBeInTheDocument();
    const addenda = screen.getByText("Agregar Addenda").closest("[aria-disabled]");
    expect(addenda).toHaveAttribute("aria-disabled", "true");
    expect(within(addenda as HTMLElement).getByText("Próximamente")).toBeInTheDocument();
  });

  it("Navbar: 'Nueva venta' no enlaza a una página inexistente", () => {
    vi.stubEnv("NEXT_PUBLIC_SHOW_DEMO_SCREENS", value);
    render(<Navbar onOpenSidebar={vi.fn()} isCollapsed={false} />);

    expect(screen.queryByRole("link", { name: /Nueva venta/ })).not.toBeInTheDocument();
    expect(screen.getByText("Nueva venta").closest("[aria-disabled]")).toHaveAttribute("aria-disabled", "true");
  });

  it("Dashboard: la maqueta de factura según la variable; lo inexistente deshabilitado", () => {
    vi.stubEnv("NEXT_PUBLIC_SHOW_DEMO_SCREENS", value);
    render(<DashboardFacturaPro />);

    expect(screen.getByRole("button", { name: /Añadir Clientes/ })).toBeEnabled();
    expect(screen.getByRole("button", { name: /Nueva Cotización/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Importar Datos/ })).toBeDisabled();

    if (showDemo) {
      expect(within(screen.getByRole("button", { name: /Crear Nueva Factura/ })).getByText("Demo")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /^Nueva Factura/ })).toBeInTheDocument();
    } else {
      expect(screen.queryByRole("button", { name: /Crear Nueva Factura/ })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /^Nueva Factura/ })).not.toBeInTheDocument();
    }
  });
});
