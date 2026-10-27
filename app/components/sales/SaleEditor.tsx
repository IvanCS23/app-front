"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileCheck2, Loader2, Plus, Save } from "lucide-react";
import AppLayout from "@/app/components/layout/AppLayout";
import Toast, { type ToastData } from "@/app/components/ui/Toast";
import SaleItems from "@/app/components/sales/SaleItems";
import SaleReadinessPanel from "@/app/components/sales/SaleReadinessPanel";
import { formatInvoiceMoney } from "@/src/lib/invoice";
import {
  defaultTaxRateId,
  getSaleStatusClass,
  getSaleStatusText,
  isSaleEditable,
  paymentCombinationError,
  paymentFormOptions,
  paymentMethodOptions,
} from "@/src/lib/sale";
import { getClients, type Client } from "@/src/services/client.services";
import { getProducts, type Product } from "@/src/services/product.services";
import {
  addSaleItem,
  createSale,
  deleteSaleItem,
  getSale,
  getSaleBillingReadiness,
  getTaxRates,
  invoiceSale,
  SaleApiError,
  updateSale,
  updateSaleItem,
} from "@/src/services/sale.services";
import { getSatCatalogs } from "@/src/services/sat.services";
import type { PaymentMethod, ReadinessIssue, Sale, SaleItem, TaxRate } from "@/src/types/sale";
import type { SatCatalogEntry } from "@/src/types/sat";

type HeaderForm = { clientId: string; paymentForm: string; paymentMethod: "" | PaymentMethod; notes: string };
type LineForm = { productId: string; quantity: string; unitPrice: string; taxRateId: string };

const emptyLine: LineForm = { productId: "", quantity: "1", unitPrice: "", taxRateId: "" };

function headerFromSale(sale: Sale | null): HeaderForm {
  return {
    clientId: sale?.client_id ? String(sale.client_id) : "",
    paymentForm: sale?.payment_form ?? "",
    paymentMethod: sale?.payment_method ?? "",
    notes: sale?.notes ?? "",
  };
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

/**
 * Fase 6.25: crear y editar una venta y facturarla.
 * - Sin `saleId` crea el borrador y redirige a /pages/sales/{id}.
 * - Con `saleId` edita (borrador o pendiente), muestra lo que impide
 *   facturar y "Facturar" hace una sola llamada a POST /sales/{id}/invoice;
 *   con 201 o 200 lleva a /pages/invoices/{id}, que ya emite y cancela.
 */
export default function SaleEditor({ saleId }: { saleId?: number }) {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [sale, setSale] = useState<Sale | null>(null);
  const [header, setHeader] = useState<HeaderForm>(headerFromSale(null));
  const [line, setLine] = useState<LineForm>(emptyLine);
  const [readiness, setReadiness] = useState<{ errors: ReadinessIssue[]; warnings: ReadinessIssue[] }>({ errors: [], warnings: [] });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [readinessLoading, setReadinessLoading] = useState(Boolean(saleId));
  const [busy, setBusy] = useState<"header" | "line" | "invoice" | null>(null);
  const [busyItemId, setBusyItemId] = useState<number | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [paymentForms, setPaymentForms] = useState<SatCatalogEntry[]>([]);

  // Fase 6.26: catálogo c_FormaPago completo. Aparte de la carga principal:
  // si falla, la venta se puede seguir editando con el pago de la empresa.
  useEffect(() => {
    getSatCatalogs()
      .then((catalogs) => setPaymentForms(catalogs.payment_forms))
      .catch(() => setToast({ type: "error", message: "No fue posible cargar las formas de pago del SAT." }));
  }, []);

  const refreshReadiness = useCallback(async (id: number) => {
    setReadinessLoading(true);
    try {
      const result = await getSaleBillingReadiness(id);
      setReadiness({ errors: result.errors, warnings: result.warnings });
    } catch (error) {
      setToast({ type: "error", message: errorMessage(error, "No fue posible revisar la venta.") });
    } finally {
      setReadinessLoading(false);
    }
  }, []);

  const refreshSale = useCallback(async (id: number) => {
    const fresh = await getSale(id);
    setSale(fresh);
    setHeader(headerFromSale(fresh));
    void refreshReadiness(id);
  }, [refreshReadiness]);

  useEffect(() => {
    const controller = new AbortController();

    void Promise.all([
      getClients(),
      getProducts(),
      getTaxRates(controller.signal),
      saleId ? getSale(saleId, controller.signal) : Promise.resolve(null),
    ])
      .then(([clientList, productList, rates, loaded]) => {
        setClients(clientList);
        setProducts(productList);
        setTaxRates(rates);
        setSale(loaded);
        setHeader(headerFromSale(loaded));
        if (loaded) void refreshReadiness(loaded.id);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setLoadError(errorMessage(error, "No fue posible cargar la venta."));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [saleId, refreshReadiness]);

  const editable = sale === null || isSaleEditable(sale.status);
  const canInvoice = sale !== null && sale.status !== "cancelled" && !sale.invoice && !readinessLoading && readiness.errors.length === 0;
  const paymentError = paymentCombinationError(header.paymentForm || null, header.paymentMethod || null);
  const selectedProduct = useMemo(() => products.find((product) => String(product.id) === line.productId), [products, line.productId]);

  const headerPayload = () => ({
    client_id: Number(header.clientId),
    notes: header.notes.trim() || null,
    payment_form: header.paymentForm || null,
    payment_method: header.paymentMethod || null,
  });

  const saveHeader = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy || !header.clientId || paymentError) return;
    setBusy("header");
    try {
      if (sale) {
        await updateSale(sale.id, headerPayload());
        await refreshSale(sale.id);
        setToast({ type: "success", message: "Datos de la venta guardados." });
      } else {
        const created = await createSale(headerPayload());
        router.replace(`/pages/sales/${created.id}`);
      }
    } catch (error) {
      setToast({ type: "error", message: errorMessage(error, "No fue posible guardar la venta.") });
    } finally {
      setBusy(null);
    }
  };

  const chooseProduct = (productId: string) => {
    const product = products.find((candidate) => String(candidate.id) === productId);
    const taxRateId = product ? defaultTaxRateId(product, taxRates) : null;
    setLine({
      productId,
      quantity: line.quantity || "1",
      unitPrice: product ? String(product.precio_unitario) : "",
      taxRateId: taxRateId !== null ? String(taxRateId) : "",
    });
  };

  const addLine = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!sale || busy || !line.productId || !(Number(line.quantity) > 0)) return;
    setBusy("line");
    try {
      await addSaleItem(sale.id, {
        product_id: Number(line.productId),
        quantity: Number(line.quantity),
        ...(line.unitPrice !== "" ? { unit_price: Number(line.unitPrice) } : {}),
        tax_rate_id: line.taxRateId ? Number(line.taxRateId) : null,
      });
      setLine(emptyLine);
      await refreshSale(sale.id);
    } catch (error) {
      setToast({ type: "error", message: errorMessage(error, "No fue posible agregar el concepto.") });
    } finally {
      setBusy(null);
    }
  };

  const updateQuantity = async (item: SaleItem, quantity: number) => {
    if (!sale || busyItemId !== null) return;
    setBusyItemId(item.id);
    try {
      await updateSaleItem(sale.id, item.id, { quantity });
      await refreshSale(sale.id);
    } catch (error) {
      setToast({ type: "error", message: errorMessage(error, "No fue posible actualizar el concepto.") });
    } finally {
      setBusyItemId(null);
    }
  };

  const removeLine = async (item: SaleItem) => {
    if (!sale || busyItemId !== null) return;
    setBusyItemId(item.id);
    try {
      await deleteSaleItem(sale.id, item.id);
      await refreshSale(sale.id);
    } catch (error) {
      setToast({ type: "error", message: errorMessage(error, "No fue posible quitar el concepto.") });
    } finally {
      setBusyItemId(null);
    }
  };

  const invoice = async () => {
    if (!sale || busy || !canInvoice) return;
    setBusy("invoice");
    try {
      const result = await invoiceSale(sale.id);
      router.push(`/pages/invoices/${result.invoice.id}`);
    } catch (error) {
      if (error instanceof SaleApiError && error.code === "SALE_NOT_BILLABLE") {
        setReadiness({ errors: error.issues, warnings: readiness.warnings });
      }
      setToast({ type: "error", message: errorMessage(error, "No fue posible facturar la venta.") });
      setBusy(null);
    }
  };

  if (loading) {
    return <AppLayout><div className="flex min-h-[55vh] items-center justify-center" role="status" aria-label="Cargando venta"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div></AppLayout>;
  }

  if (loadError) {
    return <AppLayout><div className="mx-auto max-w-xl py-16 text-center"><h1 className="text-xl font-bold text-[#0F172A]" role="alert">{loadError}</h1><Link href="/pages/sales" className="app-button-secondary mt-6">Volver a ventas</Link></div></AppLayout>;
  }

  return (
    <AppLayout>
      <main className="mx-auto max-w-5xl space-y-6 pb-24 pt-2 sm:pb-2">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link href="/pages/sales" className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"><ArrowLeft className="h-4 w-4" />Volver a ventas</Link>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">{sale ? "Venta" : "Nueva venta"}</p>
            <h1 className="mt-1 text-2xl font-extrabold text-[#0F172A] sm:text-3xl">{sale ? sale.folio : "Nueva venta"}</h1>
            {sale && <span className={`mt-3 ${getSaleStatusClass(sale.status)}`}>{getSaleStatusText(sale.status)}</span>}
          </div>
          {sale?.invoice && (
            <Link href={`/pages/invoices/${sale.invoice.id}`} className="app-button-primary self-start"><FileCheck2 className="h-4 w-4" />Ver factura {sale.invoice.folio}</Link>
          )}
        </header>

        <form onSubmit={saveHeader} className="app-card space-y-5 p-5 sm:p-6" aria-labelledby="sale-data-title">
          <h2 id="sale-data-title" className="font-bold text-[#0F172A]">Datos de la venta</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div id="sale-client" className="sm:col-span-2">
              <label htmlFor="sale-client-select" className="mb-2 block text-sm font-semibold text-[#0F172A]">Cliente</label>
              <select id="sale-client-select" value={header.clientId} onChange={(event) => setHeader({ ...header, clientId: event.target.value })} disabled={!editable} className="box box-input" required>
                <option value="">Selecciona un cliente</option>
                {clients.map((client) => <option key={client.id} value={client.id}>{client.name} · {client.rfc}</option>)}
              </select>
            </div>
            <div id="sale-payment">
              <label htmlFor="sale-payment-form" className="mb-2 block text-sm font-semibold text-[#0F172A]">Forma de pago</label>
              <select id="sale-payment-form" value={header.paymentForm} onChange={(event) => setHeader({ ...header, paymentForm: event.target.value })} disabled={!editable} className="box box-input">
                <option value="">Predeterminada de la empresa</option>
                {paymentFormOptions(paymentForms, header.paymentForm).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="sale-payment-method" className="mb-2 block text-sm font-semibold text-[#0F172A]">Método de pago</label>
              <select id="sale-payment-method" value={header.paymentMethod} onChange={(event) => setHeader({ ...header, paymentMethod: event.target.value as HeaderForm["paymentMethod"] })} disabled={!editable} className="box box-input">
                <option value="">Predeterminado de la empresa</option>
                {paymentMethodOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
            {paymentError && <p className="text-sm font-medium text-red-600 sm:col-span-2" role="alert">{paymentError}</p>}
            <div className="sm:col-span-2">
              <label htmlFor="sale-notes" className="mb-2 block text-sm font-semibold text-[#0F172A]">Notas</label>
              <textarea id="sale-notes" value={header.notes} onChange={(event) => setHeader({ ...header, notes: event.target.value })} disabled={!editable} maxLength={1000} rows={3} className="app-input min-h-20 resize-y" />
            </div>
          </div>
          {editable && (
            <button type="submit" disabled={busy !== null || !header.clientId || Boolean(paymentError)} className="app-button-primary w-full sm:w-auto disabled:opacity-50">
              {busy === "header" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {sale ? "Guardar datos" : "Crear venta"}
            </button>
          )}
        </form>

        {sale && (
          <section id="sale-items" className="app-card overflow-hidden" aria-labelledby="sale-items-title">
            <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 sm:px-6">
              <h2 id="sale-items-title" className="font-bold text-[#0F172A]">Conceptos</h2>
              <p className="mt-1 text-xs text-[#64748B]">Los importes los calcula el servidor.</p>
            </div>

            {editable && (
              <form onSubmit={addLine} className="grid grid-cols-1 gap-3 border-b border-[#E2E8F0] p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.4fr)_auto] lg:items-end" aria-label="Agregar concepto">
                <div>
                  <label htmlFor="line-product" className="mb-1 block text-xs font-semibold text-[#475569]">Producto</label>
                  <select id="line-product" value={line.productId} onChange={(event) => chooseProduct(event.target.value)} className="box box-input">
                    <option value="">Selecciona un producto</option>
                    {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="line-quantity" className="mb-1 block text-xs font-semibold text-[#475569]">Cantidad</label>
                  <input id="line-quantity" type="number" min="0.001" step="any" inputMode="decimal" value={line.quantity} onChange={(event) => setLine({ ...line, quantity: event.target.value })} className="app-input" />
                </div>
                <div>
                  <label htmlFor="line-price" className="mb-1 block text-xs font-semibold text-[#475569]">Precio unitario</label>
                  <input id="line-price" type="number" min="0" step="any" inputMode="decimal" value={line.unitPrice} onChange={(event) => setLine({ ...line, unitPrice: event.target.value })} placeholder={selectedProduct ? String(selectedProduct.precio_unitario) : ""} className="app-input" />
                </div>
                <div>
                  <label htmlFor="line-tax" className="mb-1 block text-xs font-semibold text-[#475569]">Impuesto</label>
                  <select id="line-tax" value={line.taxRateId} onChange={(event) => setLine({ ...line, taxRateId: event.target.value })} className="box box-input">
                    <option value="">Sin impuesto</option>
                    {taxRates.map((taxRate) => <option key={taxRate.id} value={taxRate.id}>{taxRate.name}</option>)}
                  </select>
                </div>
                <button type="submit" disabled={busy !== null || !line.productId || !(Number(line.quantity) > 0)} className="app-button-secondary disabled:opacity-50">
                  {busy === "line" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}Agregar
                </button>
              </form>
            )}

            <SaleItems
              items={sale.items ?? []}
              currency={sale.currency}
              taxRates={taxRates}
              editable={editable}
              busyItemId={busyItemId}
              onUpdateQuantity={(item, quantity) => void updateQuantity(item, quantity)}
              onRemove={(item) => void removeLine(item)}
            />

            <dl className="space-y-2 border-t border-[#E2E8F0] p-5 text-sm sm:ml-auto sm:max-w-sm sm:p-6">
              <div className="flex justify-between"><dt className="text-[#64748B]">Subtotal</dt><dd className="tabular-nums">{formatInvoiceMoney(sale.subtotal, sale.currency)}</dd></div>
              <div className="flex justify-between"><dt className="text-[#64748B]">Descuento</dt><dd className="tabular-nums">{formatInvoiceMoney(sale.discount_total, sale.currency)}</dd></div>
              <div className="flex justify-between"><dt className="text-[#64748B]">Impuestos</dt><dd className="tabular-nums">{formatInvoiceMoney(sale.tax_total, sale.currency)}</dd></div>
              <div className="flex justify-between border-t border-[#CBD5E1] pt-2 font-bold"><dt>Total</dt><dd className="tabular-nums text-emerald-600">{formatInvoiceMoney(sale.total, sale.currency)}</dd></div>
            </dl>
          </section>
        )}

        {sale && !sale.invoice && sale.status !== "cancelled" && (
          <SaleReadinessPanel errors={readiness.errors} warnings={readiness.warnings} items={sale.items ?? []} loading={readinessLoading} />
        )}

        {sale && sale.status === "cancelled" && (
          <p className="app-card p-5 text-sm text-[#64748B]">La venta está cancelada y no puede facturarse.</p>
        )}

        {sale && !sale.invoice && sale.status !== "cancelled" && (
          <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-between gap-3 border-t border-[#E2E8F0] bg-white/95 p-4 backdrop-blur sm:static sm:mx-0 sm:justify-end sm:rounded-xl sm:border sm:bg-white">
            <p className="text-sm sm:hidden"><span className="text-[#64748B]">Total </span><span className="font-bold tabular-nums">{formatInvoiceMoney(sale.total, sale.currency)}</span></p>
            <button type="button" onClick={() => void invoice()} disabled={!canInvoice || busy !== null} className="app-button-primary disabled:opacity-50">
              {busy === "invoice" ? <><Loader2 className="h-4 w-4 animate-spin" />Facturando…</> : <><FileCheck2 className="h-4 w-4" />Facturar</>}
            </button>
          </div>
        )}
      </main>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </AppLayout>
  );
}
