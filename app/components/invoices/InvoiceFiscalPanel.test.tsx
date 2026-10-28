import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import type { InvoiceBilling, InvoiceSummary } from "@/src/types/invoice-billing";
import * as api from "@/src/services/invoice-billing.services";
import InvoiceFiscalPanel from "./InvoiceFiscalPanel";

vi.mock("@/app/components/layout/AppLayout", () => ({ default: ({ children }: { children: ReactNode }) => <main>{children}</main> }));
vi.mock("@/src/hooks/useAuth", () => ({ useAuth: () => ({ user: { role: "admin" } }) }));
vi.mock("@/src/services/invoice-billing.services", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/src/services/invoice-billing.services")>();
  return {
    ...original,
    getInvoiceBilling: vi.fn(), getInvoiceSummary: vi.fn(), issueInvoicePac: vi.fn(), issueInvoiceBusiness: vi.fn(),
    reconcileInvoicePac: vi.fn(), fetchInvoiceArtifacts: vi.fn(), cancelInvoicePac: vi.fn(), cancelInvoiceBusiness: vi.fn(),
    fetchCancellationReceipt: vi.fn(), downloadCfdiXml: vi.fn(), downloadCfdiPdf: vi.fn(),
    downloadCancellationReceiptXml: vi.fn(), downloadCancellationReceiptPdf: vi.fn(),
  };
});

const summary: InvoiceSummary = { id: 3, folio: "FAC-00000003", total: "1160.00", currency: "MXN", client_name: "Cliente de prueba" };

function fixture(kind: "valid" | "unstamped" | "canceled" | "reconcile" = "valid"): InvoiceBilling {
  const base: InvoiceBilling = {
    id: 3, folio: "FAC-00000003", status: "issued",
    actions: { can_issue: false, can_cancel: true, can_reconcile: false, can_fetch_artifacts: false, can_fetch_cancellation_receipt: false, cancellation_mode: "pac" },
    pac: { mode: "test", provider: "facturapi", status: "valid", cancellation_status: null, issue_status: "succeeded", reconciliation_required: false, last_sync_at: "2026-08-13T12:00:00Z", organization_status: "current", organization_archived_at: null },
    cfdi: { uuid: "96013e83-154b-4153-8e61-c38b8966e560", stamped_at: "2026-08-13T12:00:00Z", artifacts: { status: "stored", xml_available: true, pdf_available: true, downloaded_at: "2026-08-13T12:01:00Z" } },
    cancellation_receipt: { status: null, available: false, downloaded_at: null, error_code: null },
    timeline: [
      { id: 1, type: "draft_created", occurred_at: "2026-08-13T11:58:00Z", pac_status: null, cancellation_status: null, issue_status: null, pac_code: null, context: {} },
      { id: 2, type: "stamp_succeeded", occurred_at: "2026-08-13T12:00:00Z", pac_status: "valid", cancellation_status: null, issue_status: "succeeded", pac_code: null, context: {} },
      { id: 3, type: "future_event", occurred_at: "2026-08-13T12:01:00Z", pac_status: "valid", cancellation_status: null, issue_status: "succeeded", pac_code: null, context: {} },
    ],
  };
  if (kind === "unstamped") return { ...base, status: "ready", actions: { can_issue: true, can_cancel: true, can_reconcile: false, can_fetch_artifacts: false, can_fetch_cancellation_receipt: false, cancellation_mode: "erp_only" }, pac: { ...base.pac, status: null, issue_status: null }, cfdi: { uuid: null, stamped_at: null, artifacts: { status: null, xml_available: false, pdf_available: false, downloaded_at: null } }, timeline: [] };
  if (kind === "canceled") return { ...base, status: "cancelled", actions: { can_issue: false, can_cancel: false, can_reconcile: false, can_fetch_artifacts: false, can_fetch_cancellation_receipt: false, cancellation_mode: null }, pac: { ...base.pac, status: "canceled", cancellation_status: "accepted" }, cancellation_receipt: { status: "stored", available: true, downloaded_at: "2026-08-13T13:00:00Z", error_code: null } };
  if (kind === "reconcile") return { ...base, actions: { can_issue: false, can_cancel: false, can_reconcile: true, can_fetch_artifacts: false, can_fetch_cancellation_receipt: false, cancellation_mode: null }, pac: { ...base.pac, status: "pending", issue_status: "reconciliation_required", reconciliation_required: true }, cfdi: { ...base.cfdi, uuid: null, artifacts: { status: null, xml_available: false, pdf_available: false, downloaded_at: null } } };
  return base;
}

function arrange(value = fixture("valid")) {
  vi.mocked(api.getInvoiceBilling).mockResolvedValue(value);
  vi.mocked(api.getInvoiceSummary).mockResolvedValue(summary);
  return render(<InvoiceFiscalPanel invoiceId={3} />);
}

describe("panel fiscal de factura", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: vi.fn().mockResolvedValue(undefined) } });
  });

  it("muestra loading inicial y luego el contrato visual válido con timeline", async () => {
    arrange();
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(await screen.findByText("CFDI válido")).toBeInTheDocument();
    expect(screen.getByText("FAC-00000003")).toBeInTheDocument();
    expect(screen.getByText("$1,160.00")).toBeInTheDocument();
    expect(screen.getByText("CFDI timbrado")).toBeInTheDocument();
    expect(screen.getByText("Actividad fiscal actualizada")).toBeInTheDocument();
  });

  it("muestra UUID completo, copia con feedback y ofrece descargas autenticadas", async () => {
    const user = userEvent.setup();
    arrange();
    expect(await screen.findByText("96013e83-154b-4153-8e61-c38b8966e560")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Copiar UUID" }));
    expect(screen.getByText("UUID copiado")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Descargar XML$/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Descargar PDF$/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Emitir factura" })).not.toBeInTheDocument();
  });

  it("factura no timbrada abre modal accesible y emite una sola vez", async () => {
    const user = userEvent.setup();
    const unstamped = fixture("unstamped");
    vi.mocked(api.issueInvoiceBusiness).mockResolvedValue(fixture("valid"));
    arrange(unstamped);
    await user.click(await screen.findByRole("button", { name: "Emitir factura" }));
    const dialog = screen.getByRole("dialog", { name: "Emitir factura" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText(/enviará la factura al proveedor fiscal/)).toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "Emitir factura" }));
    await waitFor(() => expect(api.issueInvoiceBusiness).toHaveBeenCalledTimes(1));
    expect(await screen.findByText("Factura emitida y CFDI confirmado correctamente")).toBeInTheDocument();
  });

  it("deshabilita confirmación durante una emisión pendiente para evitar doble click", async () => {
    const user = userEvent.setup();
    let resolveIssue!: (value: InvoiceBilling) => void;
    vi.mocked(api.issueInvoiceBusiness).mockReturnValue(new Promise((resolve) => { resolveIssue = resolve; }));
    arrange(fixture("unstamped"));
    await user.click(await screen.findByRole("button", { name: "Emitir factura" }));
    const confirm = within(screen.getByRole("dialog", { name: "Emitir factura" })).getByRole("button", { name: "Emitir factura" });
    await user.dblClick(confirm);
    expect(api.issueInvoiceBusiness).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Emitiendo factura..." })).toBeDisabled();
    resolveIssue(fixture("valid"));
  });

  it("muestra error fiscal sanitizado y conserva la pantalla", async () => {
    const user = userEvent.setup();
    vi.mocked(api.issueInvoiceBusiness).mockRejectedValue(new api.InvoiceApiError("raw omitido", 503, "PAC_UNAVAILABLE"));
    arrange(fixture("unstamped"));
    await user.click(await screen.findByRole("button", { name: "Emitir factura" }));
    await user.click(within(screen.getByRole("dialog", { name: "Emitir factura" })).getByRole("button", { name: "Emitir factura" }));
    expect(await screen.findByText(/proveedor fiscal no está disponible/)).toBeInTheDocument();
    expect(screen.queryByText("raw omitido")).not.toBeInTheDocument();
  });

  it.each([
    ["PAC_AUTHENTICATION_FAILED", 503, "El proveedor fiscal rechazó las credenciales configuradas. Pide a un administrador que revise la llave del PAC."],
    ["PAC_CONFIGURATION_INVALID", 503, "La conexión con el proveedor fiscal no está configurada para operar. Pide a un administrador que revise la configuración."],
    ["PAC_OPERATION_IN_PROGRESS", 409, "El proveedor fiscal todavía procesa otra operación sobre este comprobante. Actualiza el estado antes de volver a intentar."],
    ["PAC_INVOICE_NOT_FOUND", 409, "El comprobante no existe en el proveedor fiscal con la configuración actual."],
    ["PAC_ORGANIZATION_MISMATCH", 409, "La factura pertenece a otra organización de Facturapi y esta empresa no tiene acceso a ella. No se contactó al proveedor fiscal."],
  ])("muestra un mensaje específico para %s, sin texto crudo ni 'temporalmente'", async (code, status, message) => {
    const user = userEvent.setup();
    vi.mocked(api.issueInvoiceBusiness).mockRejectedValue(new api.InvoiceApiError("raw omitido temporalmente", status, code));
    arrange(fixture("unstamped"));
    await user.click(await screen.findByRole("button", { name: "Emitir factura" }));
    await user.click(within(screen.getByRole("dialog", { name: "Emitir factura" })).getByRole("button", { name: "Emitir factura" }));
    expect(await screen.findByText(message)).toBeInTheDocument();
    expect(screen.queryByText(/temporalmente/)).not.toBeInTheDocument();
  });

  it("reconcilia de forma prominente y usa la respuesta sin GET redundante en éxito", async () => {
    const user = userEvent.setup();
    vi.mocked(api.reconcileInvoicePac).mockResolvedValue(fixture("valid"));
    arrange(fixture("reconcile"));
    await user.click(await screen.findByRole("button", { name: /Reconciliar con PAC/ }));
    await waitFor(() => expect(api.reconcileInvoicePac).toHaveBeenCalledWith(3));
    expect(api.getInvoiceBilling).toHaveBeenCalledTimes(1);
  });

  it("recupera artifacts sólo cuando faltan y actualiza desde response", async () => {
    const user = userEvent.setup();
    const missing = fixture("valid");
    missing.cfdi.artifacts = { status: null, xml_available: false, pdf_available: false, downloaded_at: null };
    missing.actions = { ...missing.actions, can_fetch_artifacts: true };
    vi.mocked(api.fetchInvoiceArtifacts).mockResolvedValue(fixture("valid"));
    arrange(missing);
    await user.click(await screen.findByRole("button", { name: "Obtener XML/PDF" }));
    expect(api.fetchInvoiceArtifacts).toHaveBeenCalledWith(3);
    expect(await screen.findByRole("button", { name: /Descargar XML$/ })).toBeInTheDocument();
  });

  it("ofrece obtener XML/PDF de un CFDI cancelado cuando Laravel lo permite", async () => {
    const user = userEvent.setup();
    const canceled = fixture("canceled");
    canceled.cfdi.artifacts = { status: null, xml_available: false, pdf_available: false, downloaded_at: null };
    canceled.actions = { ...canceled.actions, can_fetch_artifacts: true };
    vi.mocked(api.fetchInvoiceArtifacts).mockResolvedValue(fixture("canceled"));
    arrange(canceled);
    await user.click(await screen.findByRole("button", { name: "Obtener XML/PDF" }));
    expect(api.fetchInvoiceArtifacts).toHaveBeenCalledWith(3);
  });

  it("no muestra Obtener XML/PDF sin can_fetch_artifacts aunque falten los archivos (p. ej. descarga en curso)", async () => {
    const pending = fixture("valid");
    pending.cfdi.artifacts = { status: "pending", xml_available: false, pdf_available: false, downloaded_at: null };
    arrange(pending);
    expect(await screen.findByRole("button", { name: "Cancelar factura" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Obtener XML/PDF" })).not.toBeInTheDocument();
  });

  it("modal de cancelación contiene motivos SAT y exige UUID para motivo 01", async () => {
    const user = userEvent.setup();
    arrange();
    await user.click(await screen.findByRole("button", { name: "Cancelar factura" }));
    expect(screen.getByText(/Se solicitará la cancelación fiscal/)).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Motivo SAT"), "01");
    expect(screen.getByLabelText("UUID CFDI sustituto")).toBeInTheDocument();
    const dialog = screen.getByRole("dialog", { name: "Cancelar factura" });
    expect(within(dialog).getByRole("button", { name: "Cancelar factura" })).toBeDisabled();
    await user.type(screen.getByLabelText("UUID CFDI sustituto"), "96013e83-154b-4153-8e61-c38b8966e560");
    await waitFor(() => expect(within(dialog).getByRole("button", { name: "Cancelar factura" })).toBeEnabled());
  });

  it("confirma cancelación con payload mínimo y confirm=true", async () => {
    const user = userEvent.setup();
    const canceled = fixture("canceled");
    canceled.cancellation_receipt.available = false;
    vi.mocked(api.cancelInvoiceBusiness).mockResolvedValue(canceled);
    arrange();
    await user.click(await screen.findByRole("button", { name: "Cancelar factura" }));
    await user.click(within(screen.getByRole("dialog", { name: "Cancelar factura" })).getByRole("button", { name: "Cancelar factura" }));
    expect(api.cancelInvoiceBusiness).toHaveBeenCalledWith(3, { motive: "02", confirm: true });
  });

  it("muestra mensaje sanitizado cuando la cancelación ya está en curso (409)", async () => {
    const user = userEvent.setup();
    vi.mocked(api.cancelInvoiceBusiness).mockRejectedValue(new api.InvoiceApiError("raw omitido", 409, "PAC_CANCELLATION_IN_PROGRESS"));
    arrange();
    await user.click(await screen.findByRole("button", { name: "Cancelar factura" }));
    await user.click(within(screen.getByRole("dialog", { name: "Cancelar factura" })).getByRole("button", { name: "Cancelar factura" }));
    expect(await screen.findByText("La cancelación ya está en proceso. Actualiza el estado antes de volver a intentar.")).toBeInTheDocument();
    expect(screen.queryByText("raw omitido")).not.toBeInTheDocument();
  });

  it.each([
    ["409", new api.InvoiceApiError("raw omitido", 409, "PAC_RECONCILIATION_REQUIRED")],
    ["503", new api.InvoiceApiError("raw omitido", 503, "PAC_UNAVAILABLE")],
  ])("tras un error %s al emitir recarga el estado fiscal y avisa al padre", async (_status, error) => {
    const user = userEvent.setup();
    const onSettled = vi.fn();
    vi.mocked(api.getInvoiceBilling).mockResolvedValue(fixture("unstamped"));
    vi.mocked(api.getInvoiceSummary).mockResolvedValue(summary);
    vi.mocked(api.issueInvoiceBusiness).mockRejectedValue(error);
    render(<InvoiceFiscalPanel invoiceId={3} onFiscalActionSettled={onSettled} />);

    await user.click(await screen.findByRole("button", { name: "Emitir factura" }));
    await user.click(within(screen.getByRole("dialog", { name: "Emitir factura" })).getByRole("button", { name: "Emitir factura" }));

    await waitFor(() => expect(onSettled).toHaveBeenCalledTimes(1));
    expect(api.getInvoiceBilling).toHaveBeenCalledTimes(2);
  });

  it("cancelación sin CFDI explica ERP-only, omite motivo SAT y avisa al padre para recargar la factura", async () => {
    const user = userEvent.setup();
    const onSettled = vi.fn();
    vi.mocked(api.getInvoiceBilling).mockResolvedValue(fixture("unstamped"));
    vi.mocked(api.getInvoiceSummary).mockResolvedValue(summary);
    vi.mocked(api.cancelInvoiceBusiness).mockResolvedValue(fixture("canceled"));
    render(<InvoiceFiscalPanel invoiceId={3} onFiscalActionSettled={onSettled} />);

    await user.click(await screen.findByRole("button", { name: "Cancelar factura" }));
    const dialog = screen.getByRole("dialog", { name: "Cancelar factura" });
    expect(within(dialog).getByText(/únicamente el documento ERP/)).toBeInTheDocument();
    expect(within(dialog).queryByLabelText("Motivo SAT")).not.toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "Cancelar factura" }));

    expect(api.cancelInvoiceBusiness).toHaveBeenCalledWith(3, { confirm: true });
    await waitFor(() => expect(onSettled).toHaveBeenCalledTimes(1));
  });

  it("factura cancelada oculta cancelar y ofrece ambos archivos del acuse", async () => {
    arrange(fixture("canceled"));
    expect(await screen.findByText("CFDI cancelado")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Cancelar factura" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Descargar XML acuse" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Descargar PDF acuse" })).toBeInTheDocument();
  });

  it("en live bloquea el mismatch por seguridad y permite reintentar mientras Laravel lo ofrece", async () => {
    const mismatch = fixture("canceled");
    mismatch.pac = { ...mismatch.pac, mode: "live" };
    mismatch.actions = { ...mismatch.actions, can_fetch_cancellation_receipt: true };
    mismatch.cancellation_receipt = { status: "reconciliation_required", available: false, downloaded_at: null, error_code: "CANCELLATION_RECEIPT_UUID_MISMATCH" };
    arrange(mismatch);
    expect(await screen.findByText("Acuse bloqueado por seguridad")).toBeInTheDocument();
    expect(screen.getByText(/El archivo fue bloqueado por seguridad/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Descargar .* acuse/ })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reintentar acuse" })).toBeInTheDocument();
  });

  it("en test explica que el acuse de prueba no corresponde y no ofrece reintentos inútiles", async () => {
    const mismatch = fixture("canceled");
    mismatch.cancellation_receipt = { status: "reconciliation_required", available: false, downloaded_at: null, error_code: "CANCELLATION_RECEIPT_UUID_MISMATCH" };
    arrange(mismatch);
    expect(await screen.findByText("Acuse de prueba no corresponde al CFDI")).toBeInTheDocument();
    expect(screen.getByText(/En el entorno de pruebas, Facturapi entrega un acuse/)).toBeInTheDocument();
    expect(screen.queryByText("Acuse bloqueado por seguridad")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /acuse/i })).not.toBeInTheDocument();
  });

  it.each([
    ["other", "Factura de otra organización fiscal", /no se puede consultar, cancelar ni descargar/],
    ["archived", "Factura archivada", /Se conserva como registro/],
  ] as const)("Fase 6.27: una factura de organización %s explica por qué no hay acciones fiscales", async (organization_status, title, description) => {
    const blocked = fixture("valid");
    blocked.pac = { ...blocked.pac, organization_status };
    blocked.actions = { can_issue: false, can_cancel: false, can_reconcile: false, can_fetch_artifacts: false, can_fetch_cancellation_receipt: false, cancellation_mode: null };
    arrange(blocked);
    const alert = await screen.findByRole("alert");
    expect(within(alert).getByText(title)).toBeInTheDocument();
    expect(within(alert).getByText(description)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Cancelar factura|Reconciliar|Obtener XML/i })).not.toBeInTheDocument();
  });

  it("Fase 6.27: con la organización de la empresa no muestra aviso de organización", async () => {
    arrange(fixture("valid"));
    expect(await screen.findByText("CFDI válido")).toBeInTheDocument();
    expect(screen.queryByText(/organización fiscal/)).not.toBeInTheDocument();
  });

  it("sin can_fetch_cancellation_receipt no ofrece obtener el acuse aunque falte", async () => {
    const missing = fixture("canceled");
    missing.cancellation_receipt = { status: null, available: false, downloaded_at: null, error_code: null };
    arrange(missing);
    await screen.findByText("CFDI cancelado");
    expect(screen.queryByRole("button", { name: "Obtener acuse" })).not.toBeInTheDocument();
  });

  it("reintenta acuse usando la acción Laravel y actualiza su estado", async () => {
    const user = userEvent.setup();
    const pending = fixture("canceled");
    pending.actions = { ...pending.actions, can_fetch_cancellation_receipt: true };
    pending.cancellation_receipt = { status: null, available: false, downloaded_at: null, error_code: null };
    vi.mocked(api.fetchCancellationReceipt).mockResolvedValue(fixture("canceled"));
    arrange(pending);
    await user.click(await screen.findByRole("button", { name: "Obtener acuse" }));
    expect(api.fetchCancellationReceipt).toHaveBeenCalledWith(3);
    expect(await screen.findByRole("button", { name: "Descargar XML acuse" })).toBeInTheDocument();
  });

  it("markup crítico es responsive y usa botones reales", async () => {
    const { container } = arrange();
    await screen.findByText("CFDI válido");
    expect(container.querySelector(".sm\\:flex-row")).toBeInTheDocument();
    expect(screen.getAllByRole("button").every((element) => element.tagName === "BUTTON")).toBe(true);
  });

  it("en modo embebido reutiliza el resumen comercial sin GET ni encabezado duplicado", async () => {
    vi.mocked(api.getInvoiceBilling).mockResolvedValue(fixture("valid"));
    render(<InvoiceFiscalPanel invoiceId={3} summary={summary} embedded />);

    expect(await screen.findByText("CFDI válido")).toBeInTheDocument();
    expect(api.getInvoiceSummary).not.toHaveBeenCalled();
    expect(screen.queryByRole("heading", { name: "Factura FAC-00000003" })).not.toBeInTheDocument();
    expect(api.getInvoiceBilling).toHaveBeenCalledTimes(1);
  });

  it("refresca capacidades cuando el flujo comercial cambia el estado ERP", async () => {
    const stale = fixture("unstamped");
    stale.status = "draft";
    stale.actions.can_issue = false;
    vi.mocked(api.getInvoiceBilling)
      .mockResolvedValueOnce(stale)
      .mockResolvedValue(fixture("unstamped"));

    const { rerender } = render(<InvoiceFiscalPanel invoiceId={3} summary={summary} embedded erpStatus="draft" />);
    await waitFor(() => expect(api.getInvoiceBilling).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole("button", { name: "Emitir factura" })).not.toBeInTheDocument();

    rerender(<InvoiceFiscalPanel invoiceId={3} summary={summary} embedded erpStatus="ready" />);

    await waitFor(() => expect(api.getInvoiceBilling).toHaveBeenCalledTimes(2));
    expect(await screen.findByRole("button", { name: "Emitir factura" })).toBeInTheDocument();
  });
});
