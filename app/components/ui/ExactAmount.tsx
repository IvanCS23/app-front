"use client";

import { useId, useState } from "react";
import type { ExactDetail } from "@/src/lib/amounts";

/**
 * Fase 6.34 — un importe a 2 decimales con su detalle exacto (hasta 6
 * decimales) al pasar el cursor (`title`) o al tocarlo (se despliega). Si no
 * hay detalle (líneas anteriores a la 6.34), sólo muestra el importe.
 */
export default function ExactAmount({ display, details, label, className = "" }: { display: string; details: ExactDetail[]; label: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  if (details.length === 0) return <span className={`tabular-nums ${className}`}>{display}</span>;

  const summary = details.map((detail) => `${detail.label}: ${detail.value}`).join("\n");

  return (
    <span className="relative inline-block">
      <button
        type="button"
        title={summary}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${label}: ${display}. Ver importes exactos`}
        onClick={() => setOpen((value) => !value)}
        className={`tabular-nums underline decoration-dotted decoration-slate-400 underline-offset-4 ${className}`}
      >
        {display}
      </button>
      {open && (
        <span id={panelId} role="note" className="absolute right-0 z-20 mt-1 block w-56 rounded-lg border border-[#E2E8F0] bg-white p-3 text-left text-xs font-normal text-[#334155] shadow-lg">
          <span className="mb-1 block font-semibold text-[#0F172A]">Importes exactos</span>
          {details.map((detail) => (
            <span key={`${detail.label}-${detail.value}`} className="flex justify-between gap-3">
              <span>{detail.label}</span>
              <span className="tabular-nums">{detail.value}</span>
            </span>
          ))}
        </span>
      )}
    </span>
  );
}
