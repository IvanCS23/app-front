import { FlaskConical } from "lucide-react";

export const DEMO_ACTION_TITLE = "Vista de demostración: esta acción todavía no está disponible";

/**
 * Fase 6.24: propiedades para las acciones finales de una maqueta. Nunca
 * deben simular un resultado (guardado, envío, timbrado, cancelación).
 */
export const demoActionProps = {
  disabled: true,
  "aria-disabled": true,
  title: DEMO_ACTION_TITLE,
} as const;

/** Clases para que una acción deshabilitada se vea como tal. */
export const DEMO_ACTION_CLASS = "disabled:cursor-not-allowed disabled:opacity-50";

/** Aviso fijo en las pantallas de demostración (src/data/screenStatus.ts). */
export default function DemoNotice() {
  return (
    <div role="note" aria-label="Vista de demostración" className="mb-4 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
      <FlaskConical className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div>
        <p className="font-bold">Vista de demostración</p>
        <p className="mt-1">
          Esta pantalla todavía no guarda ni envía información. Los datos que se muestran son de ejemplo y las acciones finales están deshabilitadas.
        </p>
      </div>
    </div>
  );
}
