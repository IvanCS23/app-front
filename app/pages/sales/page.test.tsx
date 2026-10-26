import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SalesPage from "./page";
import * as sales from "@/src/services/sale.services";
import { saleCollectionFixture, saleFixture } from "@/src/test-fixtures/sale";

vi.mock("@/app/components/layout/AppLayout", () => ({ default: ({ children }: { children: ReactNode }) => <div>{children}</div> }));
vi.mock("@/src/services/sale.services", () => ({ getSales: vi.fn() }));

describe("lista de ventas (Fase 6.25)", () => {
  beforeEach(() => {
    vi.mocked(sales.getSales).mockResolvedValue(saleCollectionFixture([
      saleFixture(),
      saleFixture({ id: 8, folio: "VTA-00000008", status: "confirmed", invoice: { id: 12, folio: "FAC-00000011", status: "ready" } }),
    ]));
  });

  it("muestra cada venta con su estado y el enlace a su factura", async () => {
    render(<SalesPage />);

    const table = within(await screen.findByRole("table"));
    expect(table.getByRole("link", { name: "VTA-00000007" })).toHaveAttribute("href", "/pages/sales/7");
    expect(table.getByText("Borrador")).toBeInTheDocument();
    expect(table.getByText("Sin factura")).toBeInTheDocument();
    expect(table.getByRole("link", { name: /FAC-00000011 · Lista para emitir/ })).toHaveAttribute("href", "/pages/invoices/12");
  });

  it("en pantallas angostas usa tarjetas y en anchas una tabla", async () => {
    render(<SalesPage />);

    const cards = await screen.findAllByTestId("sale-card");
    expect(cards).toHaveLength(2);
    expect(cards[0].closest("ul")).toHaveClass("md:hidden");
    expect(screen.getByRole("table").parentElement).toHaveClass("hidden", "md:block");
  });

  it("filtra por búsqueda y estado desde la página 1", async () => {
    render(<SalesPage />);
    await screen.findByRole("table");

    fireEvent.change(screen.getByLabelText("Buscar"), { target: { value: " Dunder " } });
    fireEvent.change(screen.getByLabelText("Estado"), { target: { value: "confirmed" } });
    fireEvent.click(screen.getByRole("button", { name: "Filtrar" }));

    await waitFor(() => expect(sales.getSales).toHaveBeenLastCalledWith({ page: 1, per_page: 20, search: "Dunder", status: "confirmed" }, expect.any(AbortSignal)));
  });

  it("ofrece crear una venta y muestra un estado vacío", async () => {
    vi.mocked(sales.getSales).mockResolvedValue(saleCollectionFixture([]));
    render(<SalesPage />);

    expect(await screen.findByText("No hay ventas con estos filtros.")).toBeInTheDocument();
    screen.getAllByRole("link", { name: /Nueva venta/ }).forEach((link) => expect(link).toHaveAttribute("href", "/pages/sales/new"));
  });

  it("muestra el error de carga", async () => {
    vi.mocked(sales.getSales).mockRejectedValue(new Error("No tienes permisos para realizar esta acción."));
    render(<SalesPage />);

    expect(await screen.findByRole("alert")).toHaveTextContent("No tienes permisos");
  });
});
