import { fireEvent, render, renderHook, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Toast from "@/app/components/ui/Toast";
import ClientsPage from "./catalogs/clients/page";
import ProductsPage from "./catalogs/products/page";
import DashboardFacturaPro from "./dashboard/page";
import { useSettingsStats } from "@/src/hooks/useSettingsStats";
import * as invoiceServices from "@/src/services/invoice.services";
import * as userServices from "@/src/services/users";
import * as clientServices from "@/src/services/client.services";
import * as productServices from "@/src/services/product.services";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => "/" }));
vi.mock("@/app/components/layout/AppLayout", () => ({ default: ({ children }: { children: ReactNode }) => <div>{children}</div> }));
vi.mock("@/src/services/invoice.services", () => ({ getInvoices: vi.fn() }));
vi.mock("@/src/services/users", () => ({ getUsers: vi.fn() }));
vi.mock("@/src/services/client.services", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/src/services/client.services")>()),
  getClients: vi.fn(),
}));
vi.mock("@/src/services/product.services", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/src/services/product.services")>()),
  getProducts: vi.fn(),
}));

/**
 * Fase 6.24: las pantallas reales no afirman lo que no saben. Contador de
 * facturas reales, aviso de datos de ejemplo en el Dashboard, "Ver cliente"
 * informativo y sin columna "Unidad" duplicada en Productos.
 */
beforeEach(() => {
  vi.mocked(userServices.getUsers).mockResolvedValue({ data: [], meta: { total: 4 } } as unknown as Awaited<ReturnType<typeof userServices.getUsers>>);
  vi.mocked(invoiceServices.getInvoices).mockResolvedValue({ data: [], meta: { total: 7 } } as unknown as Awaited<ReturnType<typeof invoiceServices.getInvoices>>);
});

describe("datos honestos en pantallas reales", () => {
  it("Configuración cuenta facturas reales emitidas (meta.total), no las legacy", async () => {
    const { result } = renderHook(() => useSettingsStats());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(invoiceServices.getInvoices).toHaveBeenCalledWith({ status: "issued", per_page: 10 });
    expect(result.current.invoicesCount).toBe(7);
    expect(result.current.usersCount).toBe(4);
  });

  it("Toast admite un aviso informativo que no se ve como éxito", () => {
    render(<Toast message="Vista de detalles en desarrollo" type="info" onClose={vi.fn()} />);

    const toast = screen.getByRole("status");
    expect(toast).toHaveTextContent("Vista de detalles en desarrollo");
    expect(toast.className).toContain("bg-blue-600");
    expect(toast.className).not.toContain("bg-emerald-500");
  });

  it("Clientes: 'Ver detalles' muestra un aviso informativo, no un éxito", async () => {
    vi.mocked(clientServices.getClients).mockResolvedValue([
      { id: 1, name: "Dunder Mifflin", email: "dm@example.com", rfc: "ABC101010111", codigo_postal: "85900", regimen_fiscal: "601", uso_cfdi: "G01" },
    ]);
    render(<ClientsPage />);

    fireEvent.click(await screen.findByTitle("Ver detalles"));

    const toast = screen.getByRole("status");
    expect(toast).toHaveTextContent("Vista de detalles en desarrollo");
    expect(toast.className).toContain("bg-blue-600");
  });

  it("Productos: la tabla no repite la clave de unidad en una columna 'Unidad'", async () => {
    vi.mocked(productServices.getProducts).mockResolvedValue([
      { id: 1, name: "Producto", descripcion: "Producto de prueba", precio_unitario: 100, clave_producto: "60131324", clave_unidad: "H87", impuesto_local: "" },
    ]);
    render(<ProductsPage />);

    const cell = await screen.findByText("Producto de prueba");
    const row = cell.closest("tr") as HTMLElement;
    const headers = within(row.closest("table") as HTMLElement).getAllByRole("columnheader").map((th) => th.textContent?.trim());

    expect(headers).toContain("Clave Unidad");
    expect(headers).not.toContain("Unidad");
    expect(within(row).getAllByText("H87")).toHaveLength(1);
  });

  it("Dashboard: avisa que sus indicadores son datos de ejemplo", () => {
    render(<DashboardFacturaPro />);

    expect(screen.getByRole("note", { name: "Datos de ejemplo" })).toHaveTextContent("todavía no se calculan con tus facturas");
  });
});
