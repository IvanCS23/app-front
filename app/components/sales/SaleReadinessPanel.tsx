import Link from "next/link";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { readinessIssueItemId, readinessIssueView } from "@/src/lib/sale";
import type { ReadinessIssue, SaleItem } from "@/src/types/sale";

function IssueRow({ issue, items, tone, currency }: { issue: ReadinessIssue; items: SaleItem[]; tone: "error" | "warning"; currency: string }) {
  const view = readinessIssueView(issue, currency);
  const itemId = readinessIssueItemId(issue.field);
  const item = itemId !== null ? items.find((candidate) => candidate.id === itemId) : undefined;

  return (
    <li className={`flex flex-col gap-1 rounded-lg p-3 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-3 ${tone === "error" ? "bg-red-50 text-red-800" : "bg-amber-50 text-amber-900"}`} data-code={issue.code}>
      <span>
        {view.message}
        {item && <span className="block text-xs opacity-80">Concepto: {item.description}</span>}
      </span>
      {view.href && (
        view.href.startsWith("#")
          ? <a href={view.href} className="shrink-0 font-semibold underline">{view.linkLabel}</a>
          : <Link href={view.href} className="shrink-0 font-semibold underline">{view.linkLabel}</Link>
      )}
    </li>
  );
}

/**
 * Fase 6.25: lo que impide facturar la venta (GET /sales/{id}/billing-readiness
 * o el 422 SALE_NOT_BILLABLE), con un mensaje claro y dónde corregirlo.
 */
export default function SaleReadinessPanel({
  errors,
  warnings,
  items,
  loading,
  currency = "MXN",
}: {
  errors: ReadinessIssue[];
  warnings: ReadinessIssue[];
  items: SaleItem[];
  loading: boolean;
  currency?: string;
}) {
  return (
    <section className="app-card overflow-hidden" aria-labelledby="sale-readiness-title" aria-busy={loading}>
      <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 sm:px-6">
        <h2 id="sale-readiness-title" className="font-bold text-[#0F172A]">Antes de facturar</h2>
        <p className="mt-1 text-xs text-[#64748B]">Laravel revisa que la venta tenga todo lo necesario para emitir el CFDI.</p>
      </div>
      <div className="space-y-3 p-5 sm:p-6">
        {loading ? (
          <p className="text-sm text-[#64748B]" role="status">Revisando la venta…</p>
        ) : errors.length === 0 ? (
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700"><CheckCircle2 className="h-5 w-5" />La venta está lista para facturarse.</p>
        ) : (
          <>
            <p className="flex items-center gap-2 text-sm font-semibold text-red-700"><AlertTriangle className="h-5 w-5" />Corrige lo siguiente para poder facturar:</p>
            <ul className="space-y-2" aria-label="Problemas para facturar">
              {errors.map((issue, index) => <IssueRow key={`${issue.code}-${issue.field}-${index}`} issue={issue} items={items} tone="error" currency={currency} />)}
            </ul>
          </>
        )}
        {!loading && warnings.length > 0 && (
          <>
            <p className="flex items-center gap-2 pt-1 text-sm font-semibold text-amber-800"><Info className="h-4 w-4" />Avisos (no impiden facturar):</p>
            <ul className="space-y-2" aria-label="Avisos">
              {warnings.map((issue, index) => <IssueRow key={`${issue.code}-${issue.field}-${index}`} issue={issue} items={items} tone="warning" currency={currency} />)}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
