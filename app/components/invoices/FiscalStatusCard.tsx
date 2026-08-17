"use client";

import { Check, Clipboard, FileCheck2, ShieldAlert } from "lucide-react";
import { formatFiscalDate, getCancellationStatus, getFiscalStatus, type FiscalTone } from "@/src/lib/invoice-billing";
import type { InvoiceBilling } from "@/src/types/invoice-billing";

const toneClasses: Record<FiscalTone, string> = {
  success: "status-success",
  warning: "status-warning",
  danger: "status-danger",
  neutral: "status-neutral",
};

interface FiscalStatusCardProps {
  billing: InvoiceBilling;
  copied: boolean;
  onCopyUuid: () => void;
}

export default function FiscalStatusCard({ billing, copied, onCopyUuid }: FiscalStatusCardProps) {
  const fiscal = getFiscalStatus(billing);
  const cancellation = getCancellationStatus(billing.pac.cancellation_status);

  return (
    <section className="app-card overflow-hidden" aria-labelledby="fiscal-status-title">
      <div className="flex items-center gap-3 border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 sm:px-6">
        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600"><FileCheck2 className="h-5 w-5" /></div>
        <div>
          <h2 id="fiscal-status-title" className="font-bold text-[#0F172A]">Estado fiscal</h2>
          <p className="text-xs text-[#64748B]">Información confirmada por el backend fiscal</p>
        </div>
      </div>
      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className={toneClasses[fiscal.tone]}>{fiscal.label}</span>
            <p className="mt-2 text-sm text-[#64748B]">{fiscal.description}</p>
          </div>
          {billing.pac.reconciliation_required && <ShieldAlert className="h-6 w-6 text-amber-600" aria-label="Requiere reconciliación" />}
        </div>
        <dl className="grid grid-cols-1 gap-4 border-t border-[#E2E8F0] pt-5 sm:grid-cols-2">
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Proveedor</dt><dd className="mt-1 font-medium text-[#0F172A]">{billing.pac.provider ?? "Sin asignar"}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Emisión</dt><dd className="mt-1 font-medium text-[#0F172A]">{billing.pac.issue_status === "succeeded" ? "Completada" : billing.pac.issue_status === "pending" ? "En proceso" : billing.pac.issue_status === "failed" ? "No completada" : "Sin iniciar"}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Timbrado</dt><dd className="mt-1 font-medium text-[#0F172A]">{formatFiscalDate(billing.cfdi.stamped_at)}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Cancelación</dt><dd className="mt-1"><span className={toneClasses[cancellation.tone]}>{cancellation.label}</span></dd></div>
        </dl>
        {billing.cfdi.uuid && (
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">UUID fiscal</p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <code className="break-all text-sm font-semibold text-[#0F172A]">{billing.cfdi.uuid}</code>
              <button type="button" onClick={onCopyUuid} className="app-button-secondary shrink-0" aria-label="Copiar UUID">
                {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}{copied ? "UUID copiado" : "Copiar UUID"}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
