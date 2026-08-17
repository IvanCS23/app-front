"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight, FileText, FilterX, Loader2, RefreshCw, Search } from "lucide-react";
import AppLayout from "@/app/components/layout/AppLayout";
import {
  emptyInvoiceFilters,
  formatInvoiceDate,
  formatInvoiceMoney,
  getInvoiceStatusClass,
  getInvoiceStatusText,
  invoiceDateValue,
  invoiceFiltersToQuery,
  invoiceStatusOptions,
  type InvoiceFilters,
} from "@/src/lib/invoice";
import { getInvoices } from "@/src/services/invoice.services";
import type { InvoiceListItem, InvoiceQuery, InvoiceStatus } from "@/src/types/invoice";

const initialQuery: InvoiceQuery = { page: 1, per_page: 20, sort: "created_at", direction: "desc" };

const documentTypes = [
  { label: "Emitidas", enabled: true },
  { label: "Recibidas", enabled: false },
  { label: "Nóminas", enabled: false },
  { label: "Retenciones", enabled: false },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#475569]">{label}</label>{children}</div>;
}

function statusFilterValue(value: string): "all" | InvoiceStatus {
  return value === "draft" || value === "ready" || value === "issued" || value === "cancelled" ? value : "all";
}

export default function ConsultaFacturas() {
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceListItem | null>(null);
  const [filters, setFilters] = useState<InvoiceFilters>(emptyInvoiceFilters);
  const [query, setQuery] = useState<InvoiceQuery>(initialQuery);
  const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1, perPage: 20, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const requestSequence = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    const sequence = ++requestSequence.current;

    void getInvoices(query, controller.signal)
      .then((response) => {
        if (sequence !== requestSequence.current) return;
        const data = Array.isArray(response.data) ? response.data : [];
        setInvoices(data);
        setPagination({
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          perPage: response.meta.per_page,
          total: response.meta.total,
        });
        setSelectedInvoice((current) => current && data.some((invoice) => invoice.id === current.id) ? current : data[0] ?? null);
        setHasLoaded(true);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || sequence !== requestSequence.current) return;
        setInvoices([]);
        setSelectedInvoice(null);
        setLoadError(error instanceof Error ? error.message : "No fue posible cargar las facturas.");
        setHasLoaded(true);
      })
      .finally(() => {
        if (sequence === requestSequence.current) setIsLoading(false);
      });

    return () => controller.abort();
  }, [query, refreshKey]);

  const updateFilter = <K extends keyof InvoiceFilters>(key: K, value: InvoiceFilters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const applyFilters = () => {
    setIsLoading(true);
    setLoadError(null);
    setQuery((current) => ({
      ...invoiceFiltersToQuery(filters),
      page: 1,
      per_page: current.per_page,
      sort: current.sort,
      direction: current.direction,
    }));
  };

  const resetFilters = () => {
    setFilters(emptyInvoiceFilters);
    setIsLoading(true);
    setLoadError(null);
    setQuery({ ...initialQuery, per_page: query.per_page });
  };

  const changePage = (page: number) => {
    setIsLoading(true);
    setLoadError(null);
    setQuery((current) => ({ ...current, page }));
  };

  const refresh = () => {
    setIsLoading(true);
    setLoadError(null);
    setRefreshKey((value) => value + 1);
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-6 py-2">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">Facturación</p>
            <h1 className="mt-1 text-2xl font-extrabold text-[#0F172A] sm:text-3xl">Consultar facturas</h1>
            <p className="mt-2 text-sm text-[#64748B]">Consulta paginada de las facturas registradas para tu empresa.</p>
          </div>
          <button type="button" onClick={refresh} disabled={isLoading} className="app-button-secondary self-start">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}Actualizar
          </button>
        </header>

        <section className="app-card p-5 sm:p-6" aria-labelledby="invoice-filters-title">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div><h2 id="invoice-filters-title" className="font-bold text-[#0F172A]">Filtros</h2><p className="mt-1 text-xs text-[#64748B]">La búsqueda y los filtros se procesan en el servidor.</p></div>
            <button type="button" onClick={resetFilters} className="app-button-secondary"><FilterX className="h-4 w-4" />Limpiar</button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Búsqueda general"><input aria-label="Búsqueda general" value={filters.search} onChange={(event) => updateFilter("search", event.target.value)} className="app-input" placeholder="Folio, RFC o razón social" /></Field>
            <Field label="Estado"><select aria-label="Estado" value={filters.status} onChange={(event) => updateFilter("status", statusFilterValue(event.target.value))} className="box box-input">{invoiceStatusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></Field>
            <Field label="Método de pago"><select aria-label="Método de pago" value={filters.paymentMethod} onChange={(event) => updateFilter("paymentMethod", event.target.value === "PUE" || event.target.value === "PPD" ? event.target.value : "all")} className="box box-input"><option value="all">Todos</option><option value="PUE">PUE</option><option value="PPD">PPD</option></select></Field>
            <Field label="Orden"><select aria-label="Orden" value={`${query.sort}:${query.direction}`} onChange={(event) => { const [sort, direction] = event.target.value.split(":") as [InvoiceQuery["sort"], InvoiceQuery["direction"]]; setIsLoading(true); setLoadError(null); setQuery((current) => ({ ...current, sort, direction, page: 1 })); }} className="box box-input"><option value="created_at:desc">Más recientes</option><option value="created_at:asc">Más antiguas</option><option value="folio:asc">Folio ascendente</option><option value="total:desc">Mayor total</option><option value="total:asc">Menor total</option></select></Field>
            <Field label="Fecha inicial"><input aria-label="Fecha inicial" type="date" value={filters.dateFrom} onChange={(event) => updateFilter("dateFrom", event.target.value)} className="app-input" /></Field>
            <Field label="Fecha final"><input aria-label="Fecha final" type="date" value={filters.dateTo} onChange={(event) => updateFilter("dateTo", event.target.value)} className="app-input" /></Field>
          </div>

          <div className="mt-5 flex justify-center"><button type="button" onClick={applyFilters} className="app-button-primary"><Search className="h-4 w-4" />Buscar</button></div>
        </section>

        <section className="app-card overflow-hidden" aria-label="Tipos de factura">
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {documentTypes.map((type) => <button key={type.label} type="button" disabled={!type.enabled} className={`border-b-2 px-4 py-3 text-sm font-semibold ${type.enabled ? "border-blue-600 bg-blue-50 text-blue-700" : "cursor-not-allowed border-transparent text-slate-300"}`} title={type.enabled ? undefined : "No disponible en el módulo actual"}>{type.label}</button>)}
          </div>
        </section>

        {loadError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center" role="alert"><p className="font-semibold text-red-700">{loadError}</p><button type="button" onClick={refresh} className="app-button-secondary mt-4"><RefreshCw className="h-4 w-4" />Reintentar</button></div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="app-card overflow-hidden" aria-labelledby="invoice-list-title" aria-busy={isLoading}>
            <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4"><div><h2 id="invoice-list-title" className="font-bold text-[#0F172A]">Facturas</h2><p className="mt-1 text-xs text-[#64748B]">{pagination.total} resultado(s)</p></div><FileText className="h-5 w-5 text-blue-600" /></div>
            <div className="relative min-h-64 max-h-[640px] overflow-y-auto">
              {isLoading && hasLoaded && <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70" role="status"><Loader2 className="h-7 w-7 animate-spin text-blue-600" /><span className="sr-only">Actualizando facturas</span></div>}
              {isLoading && !hasLoaded ? <div className="flex min-h-64 items-center justify-center" role="status"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /><span className="sr-only">Cargando facturas</span></div>
                : invoices.length === 0 ? <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center text-[#64748B]"><FileText className="mb-3 h-10 w-10 text-slate-300" /><p>No se encontraron facturas.</p></div>
                : <ul className="divide-y divide-[#E2E8F0]">{invoices.map((invoice) => (
                  <li key={invoice.id}><button type="button" onClick={() => setSelectedInvoice(invoice)} aria-pressed={selectedInvoice?.id === invoice.id} className={`w-full border-l-4 p-4 text-left transition-colors ${selectedInvoice?.id === invoice.id ? "border-blue-600 bg-blue-50/60" : "border-transparent hover:bg-[#F8FAFC]"}`}>
                    <div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="font-bold text-[#0F172A]">{invoice.folio}</span><span className={getInvoiceStatusClass(invoice.status)}>{getInvoiceStatusText(invoice.status)}</span></div><p className="mt-2 truncate text-sm font-medium text-[#475569]">{invoice.client_name ?? "Cliente sin nombre"}</p><p className="mt-1 text-xs text-[#64748B]">{invoice.client_rfc ?? "RFC no disponible"} · {formatInvoiceDate(invoiceDateValue(invoice))}</p></div><p className="shrink-0 font-bold text-emerald-600">{formatInvoiceMoney(invoice.total, invoice.currency)}</p></div>
                  </button></li>
                ))}</ul>}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] px-4 py-3">
              <label className="text-sm text-[#64748B]">Por página <select aria-label="Resultados por página" value={pagination.perPage} onChange={(event) => { setIsLoading(true); setLoadError(null); setQuery((current) => ({ ...current, per_page: Number(event.target.value) as 10 | 20 | 50 | 100, page: 1 })); }} className="ml-2 rounded-lg border border-slate-300 px-2 py-1"><option value="10">10</option><option value="20">20</option><option value="50">50</option><option value="100">100</option></select></label>
              <div className="flex items-center gap-2"><button type="button" aria-label="Página anterior" disabled={isLoading || pagination.currentPage <= 1} onClick={() => changePage(pagination.currentPage - 1)} className="app-button-secondary"><ChevronLeft className="h-4 w-4" /></button><span className="text-sm text-[#475569]">Página {pagination.currentPage} de {pagination.lastPage}</span><button type="button" aria-label="Página siguiente" disabled={isLoading || pagination.currentPage >= pagination.lastPage} onClick={() => changePage(pagination.currentPage + 1)} className="app-button-secondary"><ChevronRight className="h-4 w-4" /></button></div>
            </div>
          </section>

          <section className="app-card overflow-hidden" aria-labelledby="invoice-detail-title">
            <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4"><h2 id="invoice-detail-title" className="font-bold text-[#0F172A]">Detalle de factura</h2><p className="mt-1 text-xs text-[#64748B]">Resumen comercial; el estado CFDI está en el panel fiscal.</p></div>
            {selectedInvoice ? <div className="p-5 sm:p-6">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Folio</p><p className="mt-1 text-xl font-bold text-[#0F172A]">{selectedInvoice.folio}</p></div><Link href={`/pages/invoices/${selectedInvoice.id}`} className="app-button-primary">Ver factura</Link></div>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                <div><dt className="text-xs font-semibold uppercase text-[#64748B]">Fecha</dt><dd className="mt-1 flex items-center gap-2 font-medium text-[#0F172A]"><CalendarDays className="h-4 w-4 text-blue-600" />{formatInvoiceDate(invoiceDateValue(selectedInvoice))}</dd></div>
                <div><dt className="text-xs font-semibold uppercase text-[#64748B]">Estado ERP</dt><dd className="mt-1"><span className={getInvoiceStatusClass(selectedInvoice.status)}>{getInvoiceStatusText(selectedInvoice.status)}</span></dd></div>
                <div className="sm:col-span-2"><dt className="text-xs font-semibold uppercase text-[#64748B]">Cliente</dt><dd className="mt-1 font-medium text-[#0F172A]">{selectedInvoice.client_name ?? "Cliente sin nombre"}</dd></div>
                <div><dt className="text-xs font-semibold uppercase text-[#64748B]">RFC</dt><dd className="mt-1 font-mono font-medium text-[#0F172A]">{selectedInvoice.client_rfc ?? "—"}</dd></div>
                <div><dt className="text-xs font-semibold uppercase text-[#64748B]">Moneda</dt><dd className="mt-1 font-medium text-[#0F172A]">{selectedInvoice.currency}</dd></div>
                <div><dt className="text-xs font-semibold uppercase text-[#64748B]">Método de pago</dt><dd className="mt-1 font-medium text-[#0F172A]">{selectedInvoice.payment_method ?? "—"}</dd></div>
                <div><dt className="text-xs font-semibold uppercase text-[#64748B]">Forma de pago</dt><dd className="mt-1 font-medium text-[#0F172A]">{selectedInvoice.payment_form ?? "—"}</dd></div>
              </dl>
              <dl className="mt-6 space-y-3 rounded-xl bg-[#F8FAFC] p-4">
                <div className="flex justify-between gap-4 text-sm"><dt className="text-[#64748B]">Subtotal</dt><dd className="font-semibold text-[#0F172A]">{formatInvoiceMoney(selectedInvoice.subtotal, selectedInvoice.currency)}</dd></div>
                <div className="flex justify-between gap-4 text-sm"><dt className="text-[#64748B]">Descuento</dt><dd className="font-semibold text-[#0F172A]">{formatInvoiceMoney(selectedInvoice.discount_total, selectedInvoice.currency)}</dd></div>
                <div className="flex justify-between gap-4 text-sm"><dt className="text-[#64748B]">Impuestos</dt><dd className="font-semibold text-[#0F172A]">{formatInvoiceMoney(selectedInvoice.tax_total, selectedInvoice.currency)}</dd></div>
                <div className="flex justify-between gap-4 border-t border-[#CBD5E1] pt-3"><dt className="font-bold text-[#0F172A]">Total</dt><dd className="text-lg font-extrabold text-emerald-600">{formatInvoiceMoney(selectedInvoice.total, selectedInvoice.currency)}</dd></div>
              </dl>
              <p className="mt-5 text-xs text-[#64748B]">Las descargas XML/PDF y acciones fiscales están disponibles únicamente dentro del panel fiscal autenticado.</p>
            </div> : <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center text-[#64748B]"><FileText className="mb-3 h-10 w-10 text-slate-300" /><p>Selecciona una factura para ver el detalle.</p></div>}
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
