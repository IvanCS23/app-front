import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentType, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import MassivePage from "./invoices/massive/page";
import XmlPage from "./invoices/xml/page";
import DownloadPage from "./invoices/DownloadInvoices/page";
import RecoveryPage from "./invoices/recovery/page";
import ReportsPage from "./statistics/reports/page";
import SellosPage from "./settings/sellos/page";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => "/" }));
vi.mock("@/app/components/layout/AppLayout", () => ({ default: ({ children }: { children: ReactNode }) => <div>{children}</div> }));

/**
 * Fase 6.24: las maquetas fiscales muestran el aviso de demostración y sus
 * acciones finales están deshabilitadas: nunca simulan timbrado, cancelación,
 * descargas ni guardado de certificados.
 */
const FAKE_SUCCESS = /¡Factura Generada!|completada exitosamente|procesado correctamente|descargado correctamente|guardados correctamente|Recuperación iniciada|generado correctamente/i;

const cases: [string, ComponentType, RegExp][] = [
  ["invoices/massive", MassivePage, /Empezar el proceso/],
  ["invoices/DownloadInvoices", DownloadPage, /Generar/i],
  ["invoices/recovery", RecoveryPage, /Recuperar facturas/],
  ["statistics/reports", ReportsPage, /Descargar/i],
  ["settings/sellos", SellosPage, /Guardar Certificados/],
];

describe("maquetas fiscales", () => {
  it.each(cases)("%s: aviso de demostración y acción final deshabilitada", (_route, Page, actionName) => {
    render(<Page />);

    expect(screen.getByRole("note", { name: "Vista de demostración" })).toBeInTheDocument();

    const action = screen.getAllByRole("button", { name: actionName }).find((button) => button.hasAttribute("aria-disabled"));
    expect(action).toBeDefined();
    expect(action).toBeDisabled();
    expect(action).toHaveAttribute("title", expect.stringContaining("Vista de demostración"));

    fireEvent.click(action as HTMLElement);
    expect(screen.queryByText(FAKE_SUCCESS)).not.toBeInTheDocument();
  });

  it("invoices/xml: la carga de XML está deshabilitada y no simula un procesamiento", () => {
    const { container } = render(<XmlPage />);

    expect(screen.getByRole("note", { name: "Vista de demostración" })).toBeInTheDocument();
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeDisabled();
    expect(screen.queryByText(FAKE_SUCCESS)).not.toBeInTheDocument();
  });
});
