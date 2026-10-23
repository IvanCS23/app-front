import type { NavState } from "@/src/data/screenStatus";

const LABELS: Partial<Record<NavState, string>> = {
  demo: "Demo",
  unavailable: "Próximamente",
};

const STYLES: Partial<Record<NavState, string>> = {
  demo: "bg-amber-100 text-amber-800",
  unavailable: "bg-slate-100 text-slate-500",
};

/** Fase 6.24: marca una entrada de navegación como demo o no disponible. */
export default function ScreenBadge({ state }: { state: NavState }) {
  const label = LABELS[state];

  if (!label) return null;

  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STYLES[state]}`}>
      {label}
    </span>
  );
}
