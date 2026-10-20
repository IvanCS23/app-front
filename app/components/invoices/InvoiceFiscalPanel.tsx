"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Download,
  FileDown,
  Loader2,
  RefreshCw,
  RotateCcw,
  Send,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import AppLayout from "@/app/components/layout/AppLayout";
import Toast, { type ToastData } from "@/app/components/ui/Toast";
import { useAuth } from "@/src/hooks/useAuth";
import {
  cancellationMotives,
  formatInvoiceTotal,
  isUuid,
} from "@/src/lib/invoice-billing";
import {
  cancelInvoiceBusiness,
  downloadCancellationReceiptPdf,
  downloadCancellationReceiptXml,
  downloadCfdiPdf,
  downloadCfdiXml,
  fetchCancellationReceipt,
  fetchInvoiceArtifacts,
  getInvoiceBilling,
  getInvoiceSummary,
  InvoiceApiError,
  issueInvoiceBusiness,
  reconcileInvoicePac,
} from "@/src/services/invoice-billing.services";
import type {
  CfdiCancellationMotive,
  InvoiceBilling,
  InvoiceSummary,
} from "@/src/types/invoice-billing";
import type { InvoiceStatus } from "@/src/types/invoice";
import FiscalActionModal from "./FiscalActionModal";
import FiscalStatusCard from "./FiscalStatusCard";
import FiscalTimeline from "./FiscalTimeline";

type FiscalAction = "issue" | "reconcile" | "artifacts" | "cancel" | "receipt";
type DownloadKind = "cfdi-xml" | "cfdi-pdf" | "receipt-xml" | "receipt-pdf";

function PanelShell({ embedded, children }: { embedded: boolean; children: React.ReactNode }) {
  return embedded ? <>{children}</> : <AppLayout>{children}</AppLayout>;
}

function publicErrorMessage(error: unknown): string {
  if (!(error instanceof InvoiceApiError)) return error instanceof Error ? error.message : "No fue posible completar la operación.";
  const messages: Record<string, string> = {
    PAC_UNAVAILABLE: "El proveedor fiscal no está disponible. Intenta nuevamente más tarde.",
    PAC_AUTHENTICATION_FAILED: "El proveedor fiscal rechazó las credenciales configuradas. Pide a un administrador que revise la llave del PAC.",
    PAC_CONFIGURATION_INVALID: "La conexión con el proveedor fiscal no está configurada para operar. Pide a un administrador que revise la configuración.",
    PAC_OPERATION_IN_PROGRESS: "El proveedor fiscal todavía procesa otra operación sobre este comprobante. Actualiza el estado antes de volver a intentar.",
    PAC_INVOICE_NOT_FOUND: "El comprobante no existe en el proveedor fiscal con la configuración actual.",
    PAC_ISSUANCE_IN_PROGRESS: "La emisión ya está en proceso. Actualiza el estado antes de volver a intentar.",
    PAC_CANCELLATION_IN_PROGRESS: "La cancelación ya está en proceso. Actualiza el estado antes de volver a intentar.",
    PAC_RECONCILIATION_REQUIRED: "El estado fiscal requiere reconciliación antes de continuar.",
    PAC_DRAFT_NOT_READY: "El comprobante aún no está listo para emitirse.",
    INVOICE_LIFECYCLE_INCONSISTENT: "Los estados ERP y fiscal requieren revisión antes de continuar.",
    INVOICE_CANCELLATION_NOT_COMPLETED: "La cancelación fiscal no fue aceptada; la factura ERP permanece activa.",
    CANCELLATION_RECEIPT_UUID_MISMATCH: "El proveedor fiscal devolvió un acuse que no corresponde a este CFDI. El archivo fue bloqueado por seguridad.",
  };
  return error.code ? messages[error.code] ?? error.message : error.message;
}

export default function InvoiceFiscalPanel({
  invoiceId,
  summary: providedSummary,
  embedded = false,
  erpStatus,
  onFiscalActionSettled,
}: {
  invoiceId: number;
  summary?: InvoiceSummary;
  embedded?: boolean;
  erpStatus?: InvoiceStatus;
  /** Se invoca al terminar cada acción fiscal, con éxito o con error. */
  onFiscalActionSettled?: () => void;
}) {
  const { user } = useAuth();
  const [billing, setBilling] = useState<InvoiceBilling | null>(null);
  const [summary, setSummary] = useState<InvoiceSummary | null>(providedSummary ?? null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<FiscalAction | null>(null);
  const [activeDownload, setActiveDownload] = useState<DownloadKind | null>(null);
  const [issueOpen, setIssueOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [motive, setMotive] = useState<CfdiCancellationMotive>("02");
  const [substitutionUuid, setSubstitutionUuid] = useState("");
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canManagePac = user?.role === "admin" || user?.role === "accountant";

  const load = useCallback(async () => {
    setPageError(null);
    try {
      const [billingResult, summaryResult] = await Promise.all([
        getInvoiceBilling(invoiceId),
        providedSummary ? Promise.resolve(providedSummary) : getInvoiceSummary(invoiceId),
      ]);
      setBilling(billingResult);
      setSummary(summaryResult);
    } catch (error) {
      setPageError(publicErrorMessage(error));
    } finally {
      setInitialLoading(false);
    }
  }, [invoiceId, providedSummary]);
  const billingStatus = billing?.status;

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    if (!initialLoading && billingStatus && erpStatus && billingStatus !== erpStatus) {
      void load();
    }
  }, [billingStatus, erpStatus, initialLoading, load]);
  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current); }, []);

  const runAction = useCallback(async (action: FiscalAction, request: () => Promise<InvoiceBilling>, success: string | ((next: InvoiceBilling) => string)) => {
    if (activeAction) return;
    setActiveAction(action);
    try {
      const next = await request();
      setBilling(next);
      setToast({ type: "success", message: typeof success === "function" ? success(next) : success });
      setIssueOpen(false);
      setCancelOpen(false);
    } catch (error) {
      setToast({ type: "error", message: publicErrorMessage(error) });
      // Emitir, cancelar y reconciliar pueden cambiar el estado aunque fallen
      // (p. ej. ERP ready -> issued antes de un 503 del PAC).
      const mayHaveChangedState = action === "issue" || action === "cancel" || action === "reconcile";
      if (mayHaveChangedState || (error instanceof InvoiceApiError && error.status === 409)) await load();
    } finally {
      setActiveAction(null);
      onFiscalActionSettled?.();
    }
  }, [activeAction, load, onFiscalActionSettled]);

  const download = useCallback(async (kind: DownloadKind, request: () => Promise<void>) => {
    if (activeDownload) return;
    setActiveDownload(kind);
    try {
      await request();
    } catch (error) {
      setToast({ type: "error", message: publicErrorMessage(error) });
    } finally {
      setActiveDownload(null);
    }
  }, [activeDownload]);

  const copyUuid = useCallback(async () => {
    if (!billing?.cfdi.uuid) return;
    try {
      await navigator.clipboard.writeText(billing.cfdi.uuid);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setToast({ type: "error", message: "No fue posible copiar el UUID." });
    }
  }, [billing?.cfdi.uuid]);

  const substitutionInvalid = useMemo(() => motive === "01" && !isUuid(substitutionUuid), [motive, substitutionUuid]);

  if (initialLoading) {
    return <PanelShell embedded={embedded}><div className="flex min-h-64 items-center justify-center" role="status"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /><span className="sr-only">Cargando información fiscal</span></div></PanelShell>;
  }

  if (!billing || !summary || pageError) {
    return (
      <PanelShell embedded={embedded}><div className="app-card mx-auto max-w-xl py-12 text-center"><XCircle className="mx-auto h-10 w-10 text-red-500" /><h2 className="mt-4 text-xl font-bold text-[#0F172A]">No se pudo cargar el estado fiscal</h2><p className="mt-2 text-sm text-[#64748B]">{pageError}</p><button type="button" onClick={() => void load()} className="app-button-primary mt-6"><RefreshCw className="h-4 w-4" />Reintentar estado fiscal</button></div></PanelShell>
    );
  }

  const folio = billing.folio || summary.folio;
  const artifactsMissing = billing.pac.status === "valid" && (!billing.cfdi.artifacts.xml_available || !billing.cfdi.artifacts.pdf_available);
  const receiptMismatch = billing.cancellation_receipt.error_code === "CANCELLATION_RECEIPT_UUID_MISMATCH";
  const canRequestReceipt = billing.pac.status === "canceled" && billing.pac.cancellation_status === "accepted" && !billing.cancellation_receipt.available;
  const cancellationMode = billing.actions.cancellation_mode;
  const fiscalCancellation = cancellationMode === "pac";

  return (
    <PanelShell embedded={embedded}>
      <div className={embedded ? "space-y-6" : "mx-auto max-w-7xl space-y-6 py-2"}>
        {!embedded && <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link href="/pages/invoices/consult" className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"><ArrowLeft className="h-4 w-4" />Volver a facturas</Link>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">Factura</p>
            <h1 className="mt-1 text-2xl font-extrabold text-[#0F172A] sm:text-3xl">{folio}</h1>
          </div>
          <button type="button" onClick={() => void load()} className="app-button-secondary self-start"><RefreshCw className="h-4 w-4" />Actualizar</button>
        </header>}

        {!embedded && <section className="app-card grid grid-cols-2 gap-5 p-5 sm:grid-cols-4 sm:p-6" aria-label="Resumen de factura">
          <div><p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Estado ERP</p><p className="mt-1 font-bold capitalize text-[#0F172A]">{billing.status ?? "—"}</p></div>
          <div><p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Total</p><p className="mt-1 font-bold text-emerald-600">{formatInvoiceTotal(summary.total, summary.currency)}</p></div>
          <div className="col-span-2 sm:col-span-1"><p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Cliente</p><p className="mt-1 truncate font-bold text-[#0F172A]">{summary.client_name ?? "Sin nombre"}</p></div>
          <div><p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Moneda</p><p className="mt-1 font-bold text-[#0F172A]">{summary.currency}</p></div>
        </section>}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,.75fr)]">
          <div className="space-y-6">
            <FiscalStatusCard billing={billing} copied={copied} onCopyUuid={() => void copyUuid()} />

            {receiptMismatch && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900" role="alert">
                <div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" /><div><p className="font-bold">Acuse bloqueado por seguridad</p><p className="mt-1">El proveedor fiscal devolvió un acuse que no corresponde a este CFDI. El archivo fue bloqueado por seguridad.</p></div></div>
              </div>
            )}

            <section className="app-card overflow-hidden" aria-labelledby="fiscal-actions-title">
              <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 sm:px-6"><h2 id="fiscal-actions-title" className="font-bold text-[#0F172A]">Acciones de factura</h2><p className="mt-1 text-xs text-[#64748B]">Operaciones ERP/PAC orquestadas y validadas por Laravel</p></div>
              <div className="flex flex-col gap-3 p-5 sm:flex-row sm:flex-wrap sm:p-6">
                {canManagePac && billing.actions.can_issue && <button type="button" onClick={() => setIssueOpen(true)} disabled={activeAction !== null} className="app-button-primary"><Send className="h-4 w-4" />Emitir factura</button>}
                {canManagePac && billing.actions.can_reconcile && <button type="button" onClick={() => void runAction("reconcile", () => reconcileInvoicePac(invoiceId), "Estado fiscal reconciliado") } disabled={activeAction !== null} className="inline-flex h-10 items-center justify-center gap-2 rounded-[0.625rem] bg-amber-500 px-4 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50">{activeAction === "reconcile" ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}Reconciliar con PAC</button>}
                {canManagePac && artifactsMissing && <button type="button" onClick={() => void runAction("artifacts", () => fetchInvoiceArtifacts(invoiceId), "XML y PDF disponibles") } disabled={activeAction !== null} className="app-button-secondary">{activeAction === "artifacts" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}Obtener XML/PDF</button>}
                {billing.cfdi.artifacts.xml_available && <button type="button" onClick={() => void download("cfdi-xml", () => downloadCfdiXml(invoiceId, folio))} disabled={activeDownload !== null} className="app-button-secondary">{activeDownload === "cfdi-xml" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}Descargar XML</button>}
                {billing.cfdi.artifacts.pdf_available && <button type="button" onClick={() => void download("cfdi-pdf", () => downloadCfdiPdf(invoiceId, folio))} disabled={activeDownload !== null} className="app-button-secondary">{activeDownload === "cfdi-pdf" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}Descargar PDF</button>}
                {billing.actions.can_cancel && <button type="button" onClick={() => setCancelOpen(true)} disabled={activeAction !== null} className="inline-flex h-10 items-center justify-center gap-2 rounded-[0.625rem] border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"><XCircle className="h-4 w-4" />Cancelar factura</button>}
                {canManagePac && canRequestReceipt && <button type="button" onClick={() => void runAction("receipt", () => fetchCancellationReceipt(invoiceId), "Acuse de cancelación actualizado") } disabled={activeAction !== null} className="app-button-secondary">{activeAction === "receipt" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}{receiptMismatch ? "Reintentar acuse" : "Obtener acuse"}</button>}
                {billing.cancellation_receipt.available && <><button type="button" onClick={() => void download("receipt-xml", () => downloadCancellationReceiptXml(invoiceId, folio))} disabled={activeDownload !== null} className="app-button-secondary"><Download className="h-4 w-4" />Descargar XML acuse</button><button type="button" onClick={() => void download("receipt-pdf", () => downloadCancellationReceiptPdf(invoiceId, folio))} disabled={activeDownload !== null} className="app-button-secondary"><Download className="h-4 w-4" />Descargar PDF acuse</button></>}
                {!canManagePac && <p className="text-sm text-[#64748B]">Puedes consultar y descargar los documentos disponibles. Las acciones que contactan al PAC requieren permisos de administración o contabilidad.</p>}
                {canManagePac && billing.pac.issue_status === "succeeded" && !artifactsMissing && !billing.actions.can_cancel && !canRequestReceipt && !billing.cancellation_receipt.available && <p className="text-sm text-[#64748B]">No hay acciones fiscales pendientes.</p>}
              </div>
            </section>
          </div>
          <FiscalTimeline events={billing.timeline} />
        </div>
      </div>

      <FiscalActionModal open={issueOpen} title="Emitir factura" confirmLabel="Emitir factura" busyLabel="Emitiendo factura..." busy={activeAction === "issue"} onClose={() => setIssueOpen(false)} onConfirm={() => void runAction("issue", () => issueInvoiceBusiness(invoiceId), "Factura emitida y CFDI confirmado correctamente")}>
        <p>Laravel preparará el estado ERP y enviará la factura al proveedor fiscal para su timbrado en una sola operación.</p>
        <div className="rounded-xl bg-[#F8FAFC] p-4"><p><span className="font-semibold text-[#0F172A]">Folio:</span> {folio}</p><p className="mt-1"><span className="font-semibold text-[#0F172A]">Total:</span> {formatInvoiceTotal(summary.total, summary.currency)}</p>{summary.client_name && <p className="mt-1"><span className="font-semibold text-[#0F172A]">Cliente:</span> {summary.client_name}</p>}</div>
      </FiscalActionModal>

      <FiscalActionModal open={cancelOpen} title="Cancelar factura" confirmLabel="Cancelar factura" busyLabel="Procesando cancelación..." busy={activeAction === "cancel"} destructive confirmDisabled={fiscalCancellation && substitutionInvalid} onClose={() => setCancelOpen(false)} onConfirm={() => void runAction("cancel", () => cancelInvoiceBusiness(invoiceId, { ...(fiscalCancellation ? { motive, ...(motive === "01" ? { substitution_uuid: substitutionUuid.trim() } : {}) } : {}), confirm: true }), (next) => next.status === "cancelled" ? "Factura cancelada correctamente" : "La cancelación fiscal sigue en proceso; el ERP permanece activo") }>
        {cancellationMode === "erp_only" && <p className="font-medium text-red-700">No existe un CFDI confirmado. Se cancelará únicamente el documento ERP.</p>}
        {cancellationMode === "erp_convergence" && <p className="font-medium text-red-700">El CFDI ya está cancelado. Se actualizará el estado ERP para completar la convergencia.</p>}
        {fiscalCancellation && <><p className="font-medium text-red-700">Existe un CFDI válido. Se solicitará la cancelación fiscal y el ERP sólo se marcará cancelado cuando el PAC la confirme.</p>
        <div><label htmlFor="cancel-motive" className="mb-2 block text-sm font-semibold text-[#0F172A]">Motivo SAT</label><select id="cancel-motive" value={motive} onChange={(event) => setMotive(event.target.value as CfdiCancellationMotive)} className="box box-input">{cancellationMotives.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
        {motive === "01" && <div><label htmlFor="substitution-uuid" className="mb-2 block text-sm font-semibold text-[#0F172A]">UUID CFDI sustituto</label><input id="substitution-uuid" value={substitutionUuid} onChange={(event) => setSubstitutionUuid(event.target.value)} className="app-input font-mono" placeholder="00000000-0000-0000-0000-000000000000" aria-invalid={substitutionInvalid} />{substitutionInvalid && <p className="mt-2 text-xs text-red-600">Ingresa un UUID válido del CFDI sustituto.</p>}</div>}</>}
      </FiscalActionModal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </PanelShell>
  );
}
