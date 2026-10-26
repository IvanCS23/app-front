"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, FileText, FilterX, Loader2, Plus, RefreshCw, Search } from "lucide-react";
import AppLayout from "@/app/components/layout/AppLayout";
import { formatInvoiceDate, formatInvoiceMoney, getInvoiceStatusText } from "@/src/lib/invoice";
import { getSaleStatusClass, getSaleStatusText, saleStatusOptions } from "@/src/lib/sale";
import { getSales } from "@/src/services/sale.services";
import type { Sale, SaleQuery, SaleStatus } from "@/src/types/sale";

const initialQuery: SaleQuery = { page: 1, per_page: 20 };

function statusFilterValue(value: string): SaleStatus | undefined {
  return value === "draft" || value === "pending" || value === "confirmed" || value === "cancelled" ? value : undefined;
}

function InvoiceLink({ sale }: { sale: Sale }) {
  if (!sale.invoice) return <span className="text-[#94A3B8]">Sin factura</span>;

  return (
    <Link href={`/pages/invoices/${sale.invoice.id}`} className="font-semibold text-blue-600 hover:text-blue-700">
      {sale.invoice.folio} · {getInvoiceStatusText(sale.invoice.status)}
    </Link>
  );
}

/** Fase 6.25 — lista real de ventas (GET /api/sales). */
export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState<SaleQuery>(initialQuery);
  const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const requestSequence = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    const sequence = ++requestSequence.current;

    void getSales(query, controller.signal)
      .then((response) => {
        if (sequence !== requestSequence.current) return;
        setSales(Array.isArray(response.data) ? response.data : []);
        setPagination({ currentPage: response.meta.current_page, lastPage: response.meta.last_page, total: response.meta.total });
        setLoadError(null);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || sequence !== requestSequence.current) return;
        setSales([]);
        setLoadError(error instanceof Error ? error.message : "No fue posible cargar las ventas.");
      })
      .finally(() => {
        if (sequence === requestSequence.current) setIsLoading(false);
      });

    return () => controller.abort();
  }, [query, refreshKey]);

  const reload = (next: SaleQuery) => {
    setIsLoading(true);
    setLoadError(null);
    setQuery(next);
  };

  const applyFilters = (event?: React.FormEvent) => {
    event?.preventDefault();
    reload({ ...initialQuery, search: search.trim() || undefined, status: statusFilterValue(status) });
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    reload(initialQuery);
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-6 py-2">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">Ventas</p>
            <h1 className="mt-1 text-2xl font-extrabold text-[#0F172A] sm:text-3xl">Ventas</h1>
            <p className="mt-1 text-sm text-[#64748B]">Captura ventas y factúralas cuando estén listas.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={() => { setIsLoading(true); setRefreshKey((value) => value + 1); }} className="app-button-secondary"><RefreshCw className="h-4 w-4" />Actualizar</button>
            <Link href="/pages/sales/new" className="app-button-primary"><Plus className="h-4 w-4" />Nueva venta</Link>
          </div>
        </header>

        <form onSubmit={applyFilters} className="app-card grid grid-cols-1 gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_220px_auto] sm:items-end sm:p-6" aria-label="Filtros de ventas">
          <div>
            <label htmlFor="sales-search" className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#475569]">Buscar</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
              <input id="sales-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Folio, cliente o RFC" className="app-input pl-9" />
            </div>
          </div>
          <div>
            <label htmlFor="sales-status" className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#475569]">Estado</label>
            <select id="sales-status" value={status} onChange={(event) => setStatus(event.target.value)} className="box box-input">
              {saleStatusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="app-button-primary flex-1 sm:flex-none">Filtrar</button>
            <button type="button" onClick={resetFilters} className="app-button-secondary" aria-label="Limpiar filtros"><FilterX className="h-4 w-4" /></button>
          </div>
        </form>

        <section className="app-card overflow-hidden" aria-labelledby="sales-list-title" aria-busy={isLoading}>
          <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 sm:px-6">
            <h2 id="sales-list-title" className="font-bold text-[#0F172A]">Listado</h2>
            <span className="text-xs text-[#64748B]">{pagination.total} venta(s)</span>
          </div>

          {isLoading ? (
            <div className="flex min-h-48 items-center justify-center" role="status" aria-label="Cargando ventas"><Loader2 className="h-7 w-7 animate-spin text-blue-600" /></div>
          ) : loadError ? (
            <div className="p-8 text-center" role="alert"><p className="font-semibold text-red-700">{loadError}</p></div>
          ) : sales.length === 0 ? (
            <div className="flex flex-col items-center gap-3 p-10 text-center">
              <FileText className="h-9 w-9 text-slate-400" />
              <p className="font-semibold text-[#0F172A]">No hay ventas con estos filtros.</p>
              <Link href="/pages/sales/new" className="app-button-primary"><Plus className="h-4 w-4" />Nueva venta</Link>
            </div>
          ) : (
            <>
              {/* Pantallas angostas: tarjetas. */}
              <ul className="divide-y divide-[#E2E8F0] md:hidden" aria-label="Ventas">
                {sales.map((sale) => (
                  <li key={sale.id} data-testid="sale-card" className="space-y-2 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/pages/sales/${sale.id}`} className="font-bold text-blue-600">{sale.folio}</Link>
                      <span className={getSaleStatusClass(sale.status)}>{getSaleStatusText(sale.status)}</span>
                    </div>
                    <p className="text-sm font-medium text-[#0F172A]">{sale.client?.name ?? "Sin cliente"}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#64748B]">{formatInvoiceDate(sale.created_at)}</span>
                      <span className="font-semibold tabular-nums">{formatInvoiceMoney(sale.total, sale.currency)}</span>
                    </div>
                    <p className="text-sm"><InvoiceLink sale={sale} /></p>
                  </li>
                ))}
              </ul>

              {/* Desde md: tabla. */}
              <div className="hidden md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-[#64748B]">
                    <tr>
                      <th scope="col" className="px-5 py-3">Folio</th>
                      <th scope="col" className="px-4 py-3">Cliente</th>
                      <th scope="col" className="px-4 py-3">Fecha</th>
                      <th scope="col" className="px-4 py-3">Estado</th>
                      <th scope="col" className="px-4 py-3 text-right">Total</th>
                      <th scope="col" className="px-5 py-3">Factura</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {sales.map((sale) => (
                      <tr key={sale.id}>
                        <td className="px-5 py-4"><Link href={`/pages/sales/${sale.id}`} className="font-semibold text-blue-600 hover:text-blue-700">{sale.folio}</Link></td>
                        <td className="px-4 py-4"><p className="font-medium text-[#0F172A]">{sale.client?.name ?? "Sin cliente"}</p><p className="font-mono text-xs text-[#64748B]">{sale.client?.rfc}</p></td>
                        <td className="px-4 py-4 text-[#475569]">{formatInvoiceDate(sale.created_at)}</td>
                        <td className="px-4 py-4"><span className={getSaleStatusClass(sale.status)}>{getSaleStatusText(sale.status)}</span></td>
                        <td className="px-4 py-4 text-right font-semibold tabular-nums">{formatInvoiceMoney(sale.total, sale.currency)}</td>
                        <td className="px-5 py-4"><InvoiceLink sale={sale} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {!isLoading && !loadError && pagination.lastPage > 1 && (
            <nav className="flex items-center justify-between border-t border-[#E2E8F0] px-5 py-3 text-sm" aria-label="Paginación de ventas">
              <button type="button" disabled={pagination.currentPage <= 1} onClick={() => reload({ ...query, page: pagination.currentPage - 1 })} className="app-button-secondary disabled:opacity-50"><ChevronLeft className="h-4 w-4" />Anterior</button>
              <span className="text-[#64748B]">Página {pagination.currentPage} de {pagination.lastPage}</span>
              <button type="button" disabled={pagination.currentPage >= pagination.lastPage} onClick={() => reload({ ...query, page: pagination.currentPage + 1 })} className="app-button-secondary disabled:opacity-50">Siguiente<ChevronRight className="h-4 w-4" /></button>
            </nav>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
