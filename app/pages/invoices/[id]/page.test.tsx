import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { formatInvoiceDate } from "@/src/lib/invoice";
import { invoiceDetailFixture } from "@/src/test-fixtures/invoice";
import * as invoices from "@/src/services/invoice.services";
import InvoiceDetailPage from "./page";

const navigation = vi.hoisted(() => ({ push: vi.fn(), id: "3" }));
const fiscal = vi.hoisted(() => ({ label: "No timbrado" }));

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: navigation.id }),
  useRouter: () => ({ push: navigation.push }),
}));
vi.mock("@/app/components/layout/AppLayout", () => ({ default: ({ children }: { children: ReactNode }) => <div>{children}</div> }));
vi.mock("@/app/components/invoices/InvoiceFiscalPanel", () => ({
  default: ({ invoiceId, embedded, onFiscalActionSettled }: { invoiceId: number; embedded?: boolean; onFiscalActionSettled?: () => void }) => (
    <div data-testid="fiscal-panel" data-invoice={invoiceId} data-embedded={embedded}>
      {fiscal.label}
      <button type="button" onClick={() => onFiscalActionSettled?.()}>Simular acción fiscal</button>
    </div>
  ),
}));
vi.mock("@/src/services/invoice.services", () => ({
  getInvoiceDetail: vi.fn(),
  updateInvoiceNotes: vi.fn(),
  markInvoiceReady: vi.fn(),
  deleteInvoice: vi.fn(),
}));

describe("detalle comercial de factura", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    navigation.id = "3";
    fiscal.label = "No timbrado";
    vi.mocked(invoices.getInvoiceDetail).mockResolvedValue(invoiceDetailFixture());
  });

  it("carga una vez el Resource comercial y presenta snapshot, conceptos y totales persistidos", async () => {
    const { container } = render(<InvoiceDetailPage />);

    expect(screen.getByRole("status")).toHaveAccessibleName("Cargando detalle comercial");
    expect(await screen.findByRole("heading", { name: "FAC-00000003" })).toBeInTheDocument();
    expect(screen.getByText("Comercializadora del Centro")).toBeInTheDocument();
    expect(screen.getByText("CCC010101AAA")).toBeInTheDocument();
    expect(screen.getByText("Servicio de consultoría")).toBeInTheDocument();
    expect(screen.getAllByText("$1,160.00").length).toBeGreaterThan(0);
    expect(screen.getByText(/frontend no recalcula impuestos/)).toBeInTheDocument();
    expect(container.querySelector(".overflow-x-auto table")).toBeInTheDocument();
    expect(invoices.getInvoiceDetail).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("fiscal-panel")).toHaveAttribute("data-embedded", "true");
  });

  it.each([
    ["draft", "Borrador", true, true, true],
    ["ready", "Lista para emitir", true, false, true],
    ["issued", "Emitida", false, false, false],
    ["cancelled", "Cancelada", false, false, false],
  ] as const)("estado ERP %s expone sólo sus acciones seguras", async (status, statusText, edit, ready, remove) => {
    vi.mocked(invoices.getInvoiceDetail).mockResolvedValue(invoiceDetailFixture({ status }));
    render(<InvoiceDetailPage />);

    expect(await screen.findByText(statusText)).toBeInTheDocument();
    expect(Boolean(screen.queryByRole("button", { name: "Editar notas" }))).toBe(edit);
    expect(Boolean(screen.queryByRole("button", { name: "Marcar factura como lista" }))).toBe(ready);
    expect(Boolean(screen.queryByRole("button", { name: "Eliminar" }))).toBe(remove);
    expect(screen.queryByRole("button", { name: /^Emitir factura$/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Cancelar factura$/ })).not.toBeInTheDocument();
  });

  it("Fase 6.28: muestra el folio CFDI junto al folio interno", async () => {
    vi.mocked(invoices.getInvoiceDetail).mockResolvedValue(invoiceDetailFixture({ folio: "FAC-00000019", cfdi_series: "FAC", cfdi_folio_number: 19, cfdi_folio: "FAC-19", cfdi_folio_matches_erp: true }));
    render(<InvoiceDetailPage />);

    const summary = await screen.findByRole("region", { name: "Resumen ERP" });
    expect(within(summary).getByText("Folio CFDI").nextSibling).toHaveTextContent("FAC-19");
    expect(within(summary).getByText("FAC-00000019")).toBeInTheDocument();
    expect(within(summary).queryByText(/antes de la 6.28/)).not.toBeInTheDocument();
  });

  it("Fase 6.28: una factura anterior a la 6.28 muestra su folio de Facturapi con una nota", async () => {
    vi.mocked(invoices.getInvoiceDetail).mockResolvedValue(invoiceDetailFixture({ folio: "FAC-00000019", cfdi_series: "F", cfdi_folio_number: 10, cfdi_folio: "F-10", cfdi_folio_matches_erp: false }));
    render(<InvoiceDetailPage />);

    const summary = await screen.findByRole("region", { name: "Resumen ERP" });
    expect(within(summary).getByText("F-10")).toBeInTheDocument();
    expect(within(summary).getByText("Asignado por Facturapi antes de la 6.28; no coincide con el folio ERP.")).toBeInTheDocument();
  });

  it("Fase 6.28: sin timbrar, el folio CFDI lo indica", async () => {
    vi.mocked(invoices.getInvoiceDetail).mockResolvedValue(invoiceDetailFixture({ status: "ready", cfdi_series: null, cfdi_folio_number: null, cfdi_folio: null, cfdi_folio_matches_erp: null }));
    render(<InvoiceDetailPage />);

    const summary = await screen.findByRole("region", { name: "Resumen ERP" });
    expect(within(summary).getByText("Folio CFDI").nextSibling).toHaveTextContent("Sin timbrar");
  });

  it("mantiene visibles e independientes ERP emitida y CFDI no timbrado", async () => {
    render(<InvoiceDetailPage />);
    expect(await screen.findByText("Emitida")).toBeInTheDocument();
    expect(screen.getByText("No timbrado")).toBeInTheDocument();
    expect(screen.getByText(/Estado fiscal independiente/)).toBeInTheDocument();
  });

  it("mantiene visibles e independientes ERP cancelada y CFDI válido", async () => {
    fiscal.label = "CFDI válido";
    vi.mocked(invoices.getInvoiceDetail).mockResolvedValue(invoiceDetailFixture({ status: "cancelled", cancelled_at: "2026-08-14T12:00:00Z" }));
    render(<InvoiceDetailPage />);
    expect(await screen.findByText("Cancelada")).toBeInTheDocument();
    expect(screen.getByText("CFDI válido")).toBeInTheDocument();
  });

  it("edita sólo notas y actualiza desde la respuesta sin GET redundante", async () => {
    const user = userEvent.setup();
    const draft = invoiceDetailFixture({ status: "draft", notes: "Anterior" });
    vi.mocked(invoices.getInvoiceDetail).mockResolvedValue(draft);
    vi.mocked(invoices.updateInvoiceNotes).mockResolvedValue({ ...draft, notes: "Nota segura" });
    render(<InvoiceDetailPage />);

    await user.click(await screen.findByRole("button", { name: "Editar notas" }));
    const dialog = screen.getByRole("dialog", { name: "Editar notas comerciales" });
    const textarea = within(dialog).getByLabelText("Notas");
    await user.clear(textarea);
    await user.type(textarea, "Nota segura");
    await user.click(within(dialog).getByRole("button", { name: "Guardar notas" }));

    await waitFor(() => expect(invoices.updateInvoiceNotes).toHaveBeenCalledWith(3, "Nota segura"));
    expect(await screen.findByText("Nota segura")).toBeInTheDocument();
    expect(invoices.getInvoiceDetail).toHaveBeenCalledTimes(1);
  });

  it("confirma transición Borrador a Lista y aclara que no timbra", async () => {
    const user = userEvent.setup();
    const draft = invoiceDetailFixture({ status: "draft", issued_at: null });
    vi.mocked(invoices.getInvoiceDetail).mockResolvedValue(draft);
    vi.mocked(invoices.markInvoiceReady).mockResolvedValue({ ...draft, status: "ready" });
    render(<InvoiceDetailPage />);

    await user.click(await screen.findByRole("button", { name: "Marcar factura como lista" }));
    const dialog = screen.getByRole("dialog", { name: "Marcar factura como lista" });
    expect(within(dialog).getByText(/No timbra ni envía información al PAC/)).toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "Marcar como lista" }));

    expect(await screen.findByText("Lista para emitir")).toBeInTheDocument();
    expect(invoices.markInvoiceReady).toHaveBeenCalledTimes(1);
  });

  it("deshabilita la acción pendiente y evita doble submit comercial", async () => {
    const user = userEvent.setup();
    const draft = invoiceDetailFixture({ status: "draft" });
    let resolveReady!: (value: typeof draft) => void;
    vi.mocked(invoices.getInvoiceDetail).mockResolvedValue(draft);
    vi.mocked(invoices.markInvoiceReady).mockReturnValue(new Promise((resolve) => { resolveReady = resolve; }));
    render(<InvoiceDetailPage />);

    await user.click(await screen.findByRole("button", { name: "Marcar factura como lista" }));
    const confirm = within(screen.getByRole("dialog", { name: "Marcar factura como lista" })).getByRole("button", { name: "Marcar como lista" });
    await user.dblClick(confirm);

    expect(invoices.markInvoiceReady).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Actualizando..." })).toBeDisabled();
    resolveReady({ ...draft, status: "ready" });
    expect(await screen.findByText("Lista para emitir")).toBeInTheDocument();
  });

  it("recarga la factura completa tras una acción fiscal: Emisión ERP deja de mostrar —", async () => {
    const user = userEvent.setup();
    vi.mocked(invoices.getInvoiceDetail)
      .mockResolvedValueOnce(invoiceDetailFixture({ status: "ready", issued_at: null }))
      .mockResolvedValueOnce(invoiceDetailFixture({ status: "issued", issued_at: "2026-10-20T19:52:44Z" }));
    render(<InvoiceDetailPage />);

    const issuedFact = async () => (await screen.findByText("Emisión ERP")).parentElement as HTMLElement;
    expect(await screen.findByText("Lista para emitir")).toBeInTheDocument();
    expect(within(await issuedFact()).getByText("—")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Simular acción fiscal" }));

    expect(await screen.findByText("Emitida")).toBeInTheDocument();
    expect(within(await issuedFact()).getByText(formatInvoiceDate("2026-10-20T19:52:44Z"))).toBeInTheDocument();
    expect(invoices.getInvoiceDetail).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole("status", { name: "Cargando detalle comercial" })).not.toBeInTheDocument();
  });

  it("si la recarga posterior a una acción fiscal falla, conserva el detalle y avisa", async () => {
    const user = userEvent.setup();
    vi.mocked(invoices.getInvoiceDetail)
      .mockResolvedValueOnce(invoiceDetailFixture())
      .mockRejectedValueOnce(new Error("red caída"));
    render(<InvoiceDetailPage />);

    await user.click(await screen.findByRole("button", { name: "Simular acción fiscal" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("No fue posible actualizar el resumen ERP.");
    expect(screen.getByRole("heading", { name: "FAC-00000003" })).toBeInTheDocument();
  });

  it("muestra un error de acción con aria-live y conserva el detalle", async () => {
    const user = userEvent.setup();
    const draft = invoiceDetailFixture({ status: "draft", notes: "Nota original" });
    vi.mocked(invoices.getInvoiceDetail).mockResolvedValue(draft);
    vi.mocked(invoices.updateInvoiceNotes).mockRejectedValue(new Error("No fue posible guardar las notas."));
    render(<InvoiceDetailPage />);

    await user.click(await screen.findByRole("button", { name: "Editar notas" }));
    await user.click(within(screen.getByRole("dialog", { name: "Editar notas comerciales" })).getByRole("button", { name: "Guardar notas" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("No fue posible guardar las notas.");
    expect(screen.getAllByText("Nota original")).not.toHaveLength(0);
  });

  it("elimina sólo después de confirmar y regresa al listado", async () => {
    const user = userEvent.setup();
    vi.mocked(invoices.getInvoiceDetail).mockResolvedValue(invoiceDetailFixture({ status: "ready" }));
    vi.mocked(invoices.deleteInvoice).mockResolvedValue(undefined);
    render(<InvoiceDetailPage />);

    await user.click(await screen.findByRole("button", { name: "Eliminar" }));
    expect(invoices.deleteInvoice).not.toHaveBeenCalled();
    const dialog = screen.getByRole("dialog", { name: "Eliminar factura" });
    await user.click(within(dialog).getByRole("button", { name: "Eliminar factura" }));

    await waitFor(() => expect(invoices.deleteInvoice).toHaveBeenCalledWith(3));
    expect(navigation.push).toHaveBeenCalledWith("/pages/invoices/consult");
  });

  it.each([[403, "No tienes permisos para consultar esta factura."], [404, "Factura no encontrada."]])("presenta error comercial %i sin montar el panel fiscal", async (_status, message) => {
    vi.mocked(invoices.getInvoiceDetail).mockRejectedValue(new Error(message));
    render(<InvoiceDetailPage />);
    expect(await screen.findByRole("heading", { name: message })).toBeInTheDocument();
    expect(screen.queryByTestId("fiscal-panel")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeInTheDocument();
  });

  it("bloquea un id inválido sin hacer solicitudes", () => {
    navigation.id = "abc";
    render(<InvoiceDetailPage />);
    expect(screen.getByText(/identificador de factura no es válido/)).toBeInTheDocument();
    expect(invoices.getInvoiceDetail).not.toHaveBeenCalled();
  });
});
