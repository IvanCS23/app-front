import type { ReactNode } from "react";
import ScreenBadge from "@/app/components/ui/ScreenBadge";

export const COMING_SOON_TITLE = "Próximamente: esta función todavía no está disponible";

/**
 * Fase 6.26.1: propiedades para una acción de una pantalla real que todavía
 * no existe. Mismo criterio que las maquetas de la 6.24: la acción se ve
 * deshabilitada y nunca abre una maqueta ni simula un resultado.
 */
export const comingSoonActionProps = {
  type: "button",
  disabled: true,
  "aria-disabled": true,
  title: COMING_SOON_TITLE,
} as const;

/** Clases para que una acción "Próximamente" se vea deshabilitada. */
export const COMING_SOON_ACTION_CLASS = "cursor-not-allowed opacity-60";

/** Etiqueta "Próximamente", la misma de la navegación (ScreenBadge). */
export function ComingSoonBadge() {
  return <ScreenBadge state="unavailable" />;
}

/**
 * Sección parcial dentro de una pantalla real: sus controles quedan
 * deshabilitados (<fieldset disabled>) y sólo muestran lo ya guardado.
 * `note` explica qué sí hace el sistema mientras tanto.
 */
export default function ComingSoon({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="rounded-xl border border-dashed border-slate-300 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-md font-bold text-[#0F172A]">{title}</h3>
        <ComingSoonBadge />
      </div>
      <p className="mt-1 text-sm text-[#64748B]">{note}</p>
      <fieldset disabled className="mt-4 min-w-0">
        {children}
      </fieldset>
    </section>
  );
}
