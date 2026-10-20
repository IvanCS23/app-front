"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, CheckCircle2, FileText, Loader2, Pencil, RefreshCw, Trash2 } from "lucide-react";
import AppLayout from "@/app/components/layout/AppLayout";
import FiscalActionModal from "@/app/components/invoices/FiscalActionModal";
import InvoiceFiscalPanel from "@/app/components/invoices/InvoiceFiscalPanel";
import Toast, { type ToastData } from "@/app/components/ui/Toast";
import { canDeleteInvoice, canMarkInvoiceReady, formatInvoiceDate, formatInvoiceMoney, getInvoiceStatusClass, getInvoiceStatusText, isInvoiceEditable } from "@/src/lib/invoice";
import { deleteInvoice, getInvoiceDetail, markInvoiceReady, updateInvoiceNotes } from "@/src/services/invoice.services";
import type { InvoiceDetail } from "@/src/types/invoice";

type CommercialAction = "edit" | "ready" | "delete";

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return <div><dt className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">{label}</dt><dd className="mt-1 font-medium text-[#0F172A]">{value || "—"}</dd></div>;
}

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const invoiceId = Number(params.id);
  const validId = Number.isInteger(invoiceId) && invoiceId > 0;
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [commercialLoading, setCommercialLoading] = useState(validId);
  const [commercialError, setCommercialError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [activeAction, setActiveAction] = useState<CommercialAction | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [readyOpen, setReadyOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [notesDraft, setNotesDraft] = useState("");
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => {
    if (!validId) return;
    const controller = new AbortController();
    void getInvoiceDetail(invoiceId, controller.signal)
      .then((result) => {
        setInvoice(result);
        setCommercialError(null);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setInvoice(null);
        setCommercialError(error instanceof Error ? error.message : "No fue posible cargar la factura.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setCommercialLoading(false);
      });
    return () => controller.abort();
  }, [invoiceId, retryKey, validId]);

  // Memorizado por campos: recargar la factura no debe crear un resumen nuevo
  // que obligue al panel fiscal a volver a pedir su estado.
  const summaryId = invoice?.id;
  const summaryFolio = invoice?.folio;
  const summaryTotal = invoice?.total;
  const summaryCurrency = invoice?.currency;
  const summaryClient = invoice?.client_name;
  const billingSummary = useMemo(
    () => summaryId !== undefined && summaryFolio !== undefined && summaryTotal !== undefined && summaryCurrency !== undefined
      ? { id: summaryId, folio: summaryFolio, total: summaryTotal, currency: summaryCurrency, client_name: summaryClient ?? null }
      : undefined,
    [summaryId, summaryFolio, summaryTotal, summaryCurrency, summaryClient],
  );

  // Fase 6.20: tras cada acción fiscal (con éxito o error) se recarga la
  // factura completa: el ERP puede cambiar status, issued_at o cancelled_at
  // aunque el PAC falle. Sin spinner de página y conservando el detalle si
  // la recarga falla.
  const refreshController = useRef<AbortController | null>(null);
  const refreshInvoice = useCallback(() => {
    refreshController.current?.abort();
    const controller = new AbortController();
    refreshController.current = controller;
    void getInvoiceDetail(invoiceId, controller.signal)
      .then((result) => setInvoice(result))
      .catch(() => {
        if (!controller.signal.aborted) setToast({ type: "error", message: "No fue posible actualizar el resumen ERP. Recarga la página para ver el estado más reciente." });
      });
  }, [invoiceId]);
  useEffect(() => () => refreshController.current?.abort(), []);

  const address: string[] = invoice ? [
    [invoice.client_calle, invoice.client_no_exterior && `No. ${invoice.client_no_exterior}`, invoice.client_no_interior && `Int. ${invoice.client_no_interior}`].filter(Boolean).join(" "),
    invoice.client_colonia,
    [invoice.client_localidad, invoice.client_municipio].filter(Boolean).join(", "),
    [invoice.client_estado, invoice.client_pais].filter(Boolean).join(", "),
    invoice.client_codigo_postal && `C.P. ${invoice.client_codigo_postal}`,
  ].filter((line): line is string => Boolean(line)) : [];

  const retryCommercial = () => {
    setCommercialLoading(true);
    setCommercialError(null);
    setRetryKey((value) => value + 1);
  };

  const openEdit = () => {
    if (!invoice || activeAction) return;
    setNotesDraft(invoice.notes ?? "");
    setEditOpen(true);
  };

  const saveNotes = async () => {
    if (!invoice || activeAction) return;
    setActiveAction("edit");
    try {
      const updated = await updateInvoiceNotes(invoice.id, notesDraft.trim() || null);
      setInvoice(updated);
      setEditOpen(false);
      setToast({ type: "success", message: "Notas actualizadas correctamente." });
    } catch (error) {
      setToast({ type: "error", message: error instanceof Error ? error.message : "No fue posible actualizar las notas." });
    } finally {
      setActiveAction(null);
    }
  };

  const markReady = async () => {
    if (!invoice || activeAction) return;
    setActiveAction("ready");
    try {
      const updated = await markInvoiceReady(invoice.id);
      setInvoice(updated);
      setReadyOpen(false);
      setToast({ type: "success", message: "La factura quedó lista en el flujo ERP." });
    } catch (error) {
      setToast({ type: "error", message: error instanceof Error ? error.message : "No fue posible marcar la factura como lista." });
    } finally {
      setActiveAction(null);
    }
  };

  const removeInvoice = async () => {
    if (!invoice || activeAction) return;
    setActiveAction("delete");
    try {
      await deleteInvoice(invoice.id);
      router.push("/pages/invoices/consult");
    } catch (error) {
      setToast({ type: "error", message: error instanceof Error ? error.message : "No fue posible eliminar la factura." });
      setActiveAction(null);
    }
  };

  if (!validId) return <AppLayout><div className="mx-auto max-w-xl py-16 text-center"><h1 className="text-xl font-bold text-red-700">El identificador de factura no es válido.</h1><Link href="/pages/invoices/consult" className="app-button-secondary mt-6">Volver a facturas</Link></div></AppLayout>;
  if (commercialLoading) return <AppLayout><div className="flex min-h-[55vh] items-center justify-center" role="status" aria-label="Cargando detalle comercial"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div></AppLayout>;
  if (!invoice || commercialError) return <AppLayout><div className="mx-auto max-w-xl py-16 text-center"><FileText className="mx-auto h-10 w-10 text-slate-400" /><h1 className="mt-4 text-xl font-bold text-[#0F172A]">{commercialError || "Factura no encontrada."}</h1><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/pages/invoices/consult" className="app-button-secondary">Volver a facturas</Link><button type="button" onClick={retryCommercial} className="app-button-primary"><RefreshCw className="h-4 w-4" />Reintentar</button></div></div></AppLayout>;

  return (
    <AppLayout>
      <main className="mx-auto max-w-7xl space-y-6 py-2">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div><Link href="/pages/invoices/consult" className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"><ArrowLeft className="h-4 w-4" />Volver a facturas</Link><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">Detalle de factura</p><h1 className="mt-1 text-2xl font-extrabold text-[#0F172A] sm:text-3xl">{invoice.folio}</h1><div className="mt-3 flex items-center gap-2"><span className="text-sm font-semibold text-[#475569]">Estado ERP:</span><span className={getInvoiceStatusClass(invoice.status)}>{getInvoiceStatusText(invoice.status)}</span></div></div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
            {isInvoiceEditable(invoice.status) && <button type="button" onClick={openEdit} disabled={activeAction !== null} className="app-button-secondary"><Pencil className="h-4 w-4" />Editar notas</button>}
            {canMarkInvoiceReady(invoice.status) && <button type="button" onClick={() => setReadyOpen(true)} disabled={activeAction !== null} className="app-button-primary"><CheckCircle2 className="h-4 w-4" />Marcar factura como lista</button>}
            {canDeleteInvoice(invoice.status) && <button type="button" onClick={() => setDeleteOpen(true)} disabled={activeAction !== null} className="inline-flex h-10 items-center justify-center gap-2 rounded-[0.625rem] border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"><Trash2 className="h-4 w-4" />Eliminar</button>}
          </div>
        </header>

        <section className="app-card overflow-hidden" aria-labelledby="general-title"><div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 sm:px-6"><h2 id="general-title" className="font-bold text-[#0F172A]">Resumen ERP</h2><p className="mt-1 text-xs text-[#64748B]">Información comercial almacenada en la factura</p></div><dl className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4 sm:p-6"><Fact label="Folio" value={invoice.folio} /><Fact label="Moneda" value={invoice.currency} /><Fact label="Forma de pago" value={invoice.payment_form} /><Fact label="Método de pago" value={invoice.payment_method} /><Fact label="Creación" value={<span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-blue-600" />{formatInvoiceDate(invoice.created_at)}</span>} /><Fact label="Emisión ERP" value={formatInvoiceDate(invoice.issued_at)} /><Fact label="Cancelación ERP" value={formatInvoiceDate(invoice.cancelled_at)} /></dl><div className="border-t border-[#E2E8F0] px-5 py-4 sm:px-6"><p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Notas</p><p className="mt-2 whitespace-pre-wrap text-sm text-[#475569]">{invoice.notes || "Sin notas comerciales."}</p></div></section>

        <section className="app-card overflow-hidden" aria-labelledby="customer-title"><div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 sm:px-6"><h2 id="customer-title" className="font-bold text-[#0F172A]">Cliente fiscal</h2><p className="mt-1 text-xs text-[#64748B]">Snapshot conservado al crear la factura</p></div><dl className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:p-6"><Fact label="Razón social" value={invoice.client_name} /><Fact label="RFC" value={<span className="font-mono">{invoice.client_rfc}</span>} /><Fact label="Régimen fiscal" value={invoice.client_regimen_fiscal} /><Fact label="Uso CFDI" value={invoice.client_uso_cfdi} /><Fact label="Código postal" value={invoice.client_codigo_postal} />{address.length > 0 && <Fact label="Domicilio fiscal" value={<span>{address.map((line) => <span className="block" key={line}>{line}</span>)}</span>} />}</dl></section>

        <section className="app-card overflow-hidden" aria-labelledby="items-title"><div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 sm:px-6"><h2 id="items-title" className="font-bold text-[#0F172A]">Conceptos</h2><p className="mt-1 text-xs text-[#64748B]">{invoice.items.length} concepto(s) persistido(s)</p></div><div className="overflow-x-auto"><table className="min-w-[980px] w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-[#64748B]"><tr><th scope="col" className="px-5 py-3">Descripción</th><th scope="col" className="px-4 py-3">Claves SAT</th><th scope="col" className="px-4 py-3 text-right">Cantidad</th><th scope="col" className="px-4 py-3 text-right">Precio</th><th scope="col" className="px-4 py-3 text-right">Descuento</th><th scope="col" className="px-4 py-3 text-right">Impuestos</th><th scope="col" className="px-5 py-3 text-right">Importe</th></tr></thead><tbody className="divide-y divide-[#E2E8F0]">{invoice.items.map((item) => <tr key={item.id}><td className="px-5 py-4"><p className="font-semibold text-[#0F172A]">{item.description}</p>{item.product_no_identificacion && <p className="mt-1 text-xs text-[#64748B]">SKU: {item.product_no_identificacion}</p>}</td><td className="px-4 py-4 text-xs text-[#475569]"><p>Producto: {item.product_clave_producto || "—"}</p><p>Unidad: {item.product_clave_unidad || "—"}</p><p>Objeto imp.: {item.product_objeto_imp || "—"}</p></td><td className="px-4 py-4 text-right tabular-nums">{item.quantity}</td><td className="px-4 py-4 text-right tabular-nums">{formatInvoiceMoney(item.unit_price, invoice.currency)}</td><td className="px-4 py-4 text-right tabular-nums">{formatInvoiceMoney(item.discount, invoice.currency)}</td><td className="px-4 py-4 text-right tabular-nums">{formatInvoiceMoney(item.tax_total, invoice.currency)}</td><td className="px-5 py-4 text-right font-semibold tabular-nums">{formatInvoiceMoney(item.total, invoice.currency)}</td></tr>)}</tbody></table></div>{invoice.items.length === 0 && <p className="p-6 text-center text-sm text-[#64748B]">La factura no contiene conceptos.</p>}</section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]" aria-labelledby="totals-title"><div className="app-card p-5 sm:p-6"><h2 className="font-bold text-[#0F172A]">Integridad comercial</h2><p className="mt-2 text-sm text-[#64748B]">Los importes mostrados son snapshots persistidos. El frontend no recalcula impuestos, descuentos ni totales.</p></div><div className="app-card p-5 sm:p-6"><h2 id="totals-title" className="font-bold text-[#0F172A]">Totales</h2><dl className="mt-4 space-y-3"><div className="flex justify-between gap-4"><dt className="text-[#64748B]">Subtotal</dt><dd className="font-semibold">{formatInvoiceMoney(invoice.subtotal, invoice.currency)}</dd></div><div className="flex justify-between gap-4"><dt className="text-[#64748B]">Descuento</dt><dd className="font-semibold">{formatInvoiceMoney(invoice.discount_total, invoice.currency)}</dd></div><div className="flex justify-between gap-4"><dt className="text-[#64748B]">Impuestos</dt><dd className="font-semibold">{formatInvoiceMoney(invoice.tax_total, invoice.currency)}</dd></div><div className="flex justify-between gap-4 border-t border-[#CBD5E1] pt-3"><dt className="font-bold">Total</dt><dd className="text-lg font-extrabold text-emerald-600">{formatInvoiceMoney(invoice.total, invoice.currency)}</dd></div></dl></div></section>

        <section aria-labelledby="fiscal-section-title" className="space-y-4"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">Flujo PAC / CFDI</p><h2 id="fiscal-section-title" className="mt-1 text-xl font-extrabold text-[#0F172A]">Estado CFDI</h2><p className="mt-1 text-sm text-[#64748B]">Estado fiscal independiente del estado ERP mostrado arriba.</p></div><InvoiceFiscalPanel invoiceId={invoice.id} summary={billingSummary} embedded erpStatus={invoice.status} onFiscalActionSettled={refreshInvoice} /></section>
      </main>

      <FiscalActionModal open={editOpen} title="Editar notas comerciales" confirmLabel="Guardar notas" busyLabel="Guardando..." busy={activeAction === "edit"} confirmDisabled={notesDraft.length > 1000} onClose={() => setEditOpen(false)} onConfirm={() => void saveNotes()}><div><label htmlFor="invoice-notes" className="mb-2 block font-semibold text-[#0F172A]">Notas</label><textarea id="invoice-notes" value={notesDraft} onChange={(event) => setNotesDraft(event.target.value)} maxLength={1000} rows={6} className="app-input min-h-32 resize-y" autoFocus /><p className="mt-2 text-right text-xs text-[#64748B]">{notesDraft.length}/1000</p></div></FiscalActionModal>
      <FiscalActionModal open={readyOpen} title="Marcar factura como lista" confirmLabel="Marcar como lista" busyLabel="Actualizando..." busy={activeAction === "ready"} onClose={() => setReadyOpen(false)} onConfirm={() => void markReady()}><p>Esta transición sólo cambia el estado comercial ERP de Borrador a Lista para emitir.</p><p className="font-semibold text-[#0F172A]">No timbra ni envía información al PAC.</p></FiscalActionModal>
      <FiscalActionModal open={deleteOpen} title="Eliminar factura" confirmLabel="Eliminar factura" busyLabel="Eliminando..." busy={activeAction === "delete"} destructive onClose={() => setDeleteOpen(false)} onConfirm={() => void removeInvoice()}><p>La factura {invoice.folio} se eliminará del flujo comercial.</p><p className="font-semibold text-red-700">Esta acción sólo está disponible para estados editables y requiere confirmación.</p></FiscalActionModal>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </AppLayout>
  );
}
