import { CheckCircle2, CircleAlert, Clock3 } from "lucide-react";
import { formatFiscalDate, getTimelineLabel } from "@/src/lib/invoice-billing";
import type { InvoicePacTimelineEvent } from "@/src/types/invoice-billing";

export default function FiscalTimeline({ events }: { events: InvoicePacTimelineEvent[] }) {
  return (
    <section className="app-card overflow-hidden" aria-labelledby="fiscal-timeline-title">
      <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 sm:px-6">
        <h2 id="fiscal-timeline-title" className="font-bold text-[#0F172A]">Timeline fiscal</h2>
        <p className="mt-1 text-xs text-[#64748B]">Historial inmutable de operaciones PAC</p>
      </div>
      <div className="p-5 sm:p-6">
        {events.length === 0 ? (
          <div className="flex items-center gap-3 rounded-xl bg-[#F8FAFC] p-4 text-sm text-[#64748B]"><Clock3 className="h-5 w-5" />Aún no hay actividad fiscal.</div>
        ) : (
          <ol className="relative space-y-0 border-l border-[#CBD5E1]">
            {events.map((event) => {
              const problematic = event.type.includes("failed") || event.type.includes("mismatch") || event.type === "reconciliation_required";
              return (
                <li key={event.id} className="relative pb-6 pl-7 last:pb-0">
                  <span className={`absolute -left-[9px] top-0 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white ${problematic ? "bg-amber-500" : "bg-emerald-500"}`}>
                    {problematic ? <CircleAlert className="h-2.5 w-2.5 text-white" /> : <CheckCircle2 className="h-2.5 w-2.5 text-white" />}
                  </span>
                  <p className="text-sm font-semibold text-[#0F172A]">{getTimelineLabel(event)}</p>
                  <time className="mt-1 block text-xs text-[#64748B]">{formatFiscalDate(event.occurred_at)}</time>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
