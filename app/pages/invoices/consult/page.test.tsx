import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ReactNode } from "react";
import { invoiceCollectionFixture, invoiceFixture } from "@/src/test-fixtures/invoice";
import * as invoiceApi from "@/src/services/invoice.services";
import ConsultaFacturas from "./page";

vi.mock("@/app/components/layout/AppLayout", () => ({ default: ({ children }: { children: ReactNode }) => <main>{children}</main> }));
vi.mock("@/src/services/invoice.services", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/src/services/invoice.services")>();
  return { ...original, getInvoices: vi.fn() };
});

const invoices = [
  invoiceFixture(),
  invoiceFixture({ id: 4, folio: "FAC-00000004", status: "draft", client_name: "Cliente Borrador", client_rfc: "BOR010101AAA", total: "580.00", issued_at: null, created_at: "2026-07-01T12:00:00Z", payment_method: "PPD" }),
];

function arrange(data = invoices, total = data.length) {
  vi.mocked(invoiceApi.getInvoices).mockResolvedValue(invoiceCollectionFixture(data, { total }));
  return render(<ConsultaFacturas />);
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => { resolve = done; });
  return { promise, resolve };
}

describe("consulta paginada de facturas", () => {
  beforeEach(() => vi.clearAllMocks());

  it("muestra loading inicial, data real, meta y selecciona la primera", async () => {
    arrange(invoices, 42);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: /FAC-00000003/ })).toBeInTheDocument();
    expect(invoiceApi.getInvoices).toHaveBeenCalledWith({ page: 1, per_page: 20, sort: "created_at", direction: "desc" }, expect.any(AbortSignal));
    expect(screen.getByText("42 resultado(s)")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver factura" })).toHaveAttribute("href", "/pages/invoices/3");
  });

  it("envía búsqueda, filtros y fechas al servidor sin filtrar la página localmente", async () => {
    const user = userEvent.setup();
    arrange();
    await screen.findByRole("button", { name: /FAC-00000003/ });
    vi.mocked(invoiceApi.getInvoices).mockResolvedValueOnce(invoiceCollectionFixture([invoices[1]]));
    await user.type(screen.getByLabelText("Búsqueda general"), "BOR010101");
    await user.selectOptions(screen.getByLabelText("Estado"), "draft");
    await user.selectOptions(screen.getByLabelText("Método de pago"), "PPD");
    fireEvent.change(screen.getByLabelText("Fecha inicial"), { target: { value: "2026-07-01" } });
    fireEvent.change(screen.getByLabelText("Fecha final"), { target: { value: "2026-07-31" } });
    await user.click(screen.getByRole("button", { name: "Buscar" }));
    expect(await screen.findByRole("button", { name: /FAC-00000004/ })).toBeInTheDocument();
    expect(invoiceApi.getInvoices).toHaveBeenLastCalledWith(expect.objectContaining({ search: "BOR010101", status: "draft", payment_method: "PPD", date_from: "2026-07-01", date_to: "2026-07-31", page: 1 }), expect.any(AbortSignal));
  });

  it.each(["19", "FAC-19", "FAC 19", "FAC19"])("Fase 6.28: busca por folio CFDI escrito como %s en el servidor", async (search) => {
    const user = userEvent.setup();
    const stamped = invoiceFixture({ id: 20, folio: "FAC-00000019", cfdi_series: "FAC", cfdi_folio_number: 19, cfdi_folio: "FAC19", cfdi_folio_matches_erp: true });
    arrange();
    await screen.findByRole("button", { name: /FAC-00000003/ });
    vi.mocked(invoiceApi.getInvoices).mockResolvedValueOnce(invoiceCollectionFixture([stamped]));

    await user.type(screen.getByLabelText("Búsqueda general"), search);
    await user.click(screen.getByRole("button", { name: "Buscar" }));

    expect(await screen.findByRole("button", { name: /FAC-00000019.*CFDI FAC19/ })).toBeInTheDocument();
    expect(invoiceApi.getInvoices).toHaveBeenLastCalledWith(expect.objectContaining({ search, page: 1 }), expect.any(AbortSignal));
  });

  it("Fase 6.28: el detalle muestra el folio CFDI y la nota de las facturas anteriores a la 6.28", async () => {
    arrange([invoiceFixture({ folio: "FAC-00000019", cfdi_series: "F", cfdi_folio_number: 10, cfdi_folio: "F10", cfdi_folio_matches_erp: false })]);

    const detail = await screen.findByRole("region", { name: "Detalle de factura" });
    expect(within(detail).getByText("Folio CFDI:")).toHaveTextContent("Folio CFDI: F10");
    expect(within(detail).getByText("Asignado por Facturapi antes de la 6.28; no coincide con el folio ERP.")).toBeInTheDocument();
    expect(screen.getByLabelText("Búsqueda general")).toHaveAttribute("placeholder", "Folio, folio CFDI (FAC20), RFC o razón social");
  });

  it("usa meta Laravel para página siguiente y per_page", async () => {
    const user = userEvent.setup();
    vi.mocked(invoiceApi.getInvoices).mockImplementation(async (query = {}) => invoiceCollectionFixture(
      query.page === 2 ? [invoices[1]] : invoices,
      { current_page: query.page ?? 1, total: 45, last_page: 3, per_page: query.per_page ?? 20 },
    ));
    render(<ConsultaFacturas />);
    await screen.findByText("Página 1 de 3");
    await user.click(screen.getByRole("button", { name: "Página siguiente" }));
    expect(await screen.findByText("Página 2 de 3")).toBeInTheDocument();
    expect(invoiceApi.getInvoices).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }), expect.any(AbortSignal));

    await user.click(screen.getByRole("button", { name: "Página anterior" }));
    expect(await screen.findByText("Página 1 de 3")).toBeInTheDocument();
    expect(invoiceApi.getInvoices).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1 }), expect.any(AbortSignal));

    await user.selectOptions(screen.getByLabelText("Resultados por página"), "50");
    expect(invoiceApi.getInvoices).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1, per_page: 50 }), expect.any(AbortSignal));
  });

  it("conserva filtros activos al paginar", async () => {
    const user = userEvent.setup();
    vi.mocked(invoiceApi.getInvoices).mockResolvedValue(invoiceCollectionFixture(invoices, { total: 25, last_page: 2 }));
    render(<ConsultaFacturas />);
    await screen.findByRole("button", { name: /FAC-00000003/ });
    await user.type(screen.getByLabelText("Búsqueda general"), "FAC");
    await user.selectOptions(screen.getByLabelText("Estado"), "issued");
    await user.click(screen.getByRole("button", { name: "Buscar" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Página siguiente" })).toBeEnabled());
    await user.click(screen.getByRole("button", { name: "Página siguiente" }));
    expect(invoiceApi.getInvoices).toHaveBeenLastCalledWith(expect.objectContaining({ search: "FAC", status: "issued", page: 2 }), expect.any(AbortSignal));
  });

  it("aborta solicitudes anteriores e ignora respuestas tardías", async () => {
    const user = userEvent.setup();
    arrange();
    await screen.findByRole("button", { name: /FAC-00000003/ });
    const oldRequest = deferred<ReturnType<typeof invoiceCollectionFixture>>();
    const newRequest = deferred<ReturnType<typeof invoiceCollectionFixture>>();
    vi.mocked(invoiceApi.getInvoices).mockImplementationOnce(() => oldRequest.promise).mockImplementationOnce(() => newRequest.promise);

    const search = screen.getByLabelText("Búsqueda general");
    await user.type(search, "vieja");
    await user.click(screen.getByRole("button", { name: "Buscar" }));
    const oldSignal = vi.mocked(invoiceApi.getInvoices).mock.calls.at(-1)?.[1];
    await user.clear(search);
    await user.type(search, "nueva");
    await user.click(screen.getByRole("button", { name: "Buscar" }));
    expect(oldSignal?.aborted).toBe(true);

    newRequest.resolve(invoiceCollectionFixture([invoiceFixture({ id: 9, folio: "FAC-NUEVA" })]));
    expect(await screen.findByRole("button", { name: /FAC-NUEVA/ })).toBeInTheDocument();
    oldRequest.resolve(invoiceCollectionFixture([invoiceFixture({ id: 8, folio: "FAC-VIEJA" })]));
    await Promise.resolve();
    expect(screen.queryByRole("button", { name: /FAC-VIEJA/ })).not.toBeInTheDocument();
  });

  it("maneja vacío, error sanitizado y reintento", async () => {
    arrange([]);
    expect(await screen.findByText("No se encontraron facturas.")).toBeInTheDocument();
    expect(screen.getByText("Selecciona una factura para ver el detalle.")).toBeInTheDocument();
    vi.clearAllMocks();
    vi.mocked(invoiceApi.getInvoices).mockRejectedValue(new Error("No fue posible cargar las facturas."));
    render(<ConsultaFacturas />);
    expect(await screen.findByRole("alert")).toHaveTextContent("No fue posible cargar las facturas.");
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeInTheDocument();
  });

  it("reintenta la misma consulta después de un error", async () => {
    const user = userEvent.setup();
    vi.mocked(invoiceApi.getInvoices).mockRejectedValueOnce(new Error("No fue posible cargar las facturas.")).mockResolvedValueOnce(invoiceCollectionFixture());
    render(<ConsultaFacturas />);
    await user.click(await screen.findByRole("button", { name: "Reintentar" }));
    expect(await screen.findByRole("button", { name: /FAC-00000003/ })).toBeInTheDocument();
    expect(invoiceApi.getInvoices).toHaveBeenCalledTimes(2);
  });

  it("selección conserva el panel real y no ofrece acciones fiscales falsas", async () => {
    const user = userEvent.setup();
    arrange();
    const row = await screen.findByRole("button", { name: /FAC-00000004/ });
    await user.click(row);
    const detail = screen.getByRole("heading", { name: "Detalle de factura" }).parentElement?.parentElement as HTMLElement;
    expect(within(detail).getByText("Cliente Borrador")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver factura" })).toHaveAttribute("href", "/pages/invoices/4");
    expect(screen.getByRole("button", { name: "Emitidas" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Recibidas" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: /Enviar|^PDF$|^XML$/ })).not.toBeInTheDocument();
  });

  it("fuente no contiene mocks, timers, Facturapi, secrets, PAC ni llamadas N+1", () => {
    const source = readFileSync(join(process.cwd(), "app/pages/invoices/consult/page.tsx"), "utf8");
    expect(source).not.toMatch(/facturasMock|setTimeout|Facturapi|sk_live|pac_response|\/billing|\/pac\//i);
  });
});
