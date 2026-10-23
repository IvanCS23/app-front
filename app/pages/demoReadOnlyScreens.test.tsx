import { render, screen } from "@testing-library/react";
import { existsSync } from "node:fs";
import path from "node:path";
import type { ComponentType, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import EmployeePage from "./catalogs/employee/page";
import JournalPage from "./accounts/journal/page";
import PayablePage from "./accounts/payable/page";
import ReceivablePage from "./accounts/receivable/page";
import ChartsPage from "./statistics/charts/page";
import GeneralSettingsPage from "./settings/generalSettings/page";
import InvoiceTypePage from "./settings/InvoiceType/page";
import AddendaPage from "./settings/addenda/page";
import BankAccountPage from "./settings/bankAccount/page";
import ExpeditionPage from "./settings/expedition/page";
import ObservationsPage from "./settings/observations/page";
import ProfilePage from "./profile/page";
import { SCREEN_STATUS } from "@/src/data/screenStatus";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => "/" }));
vi.mock("@/app/components/layout/AppLayout", () => ({ default: ({ children }: { children: ReactNode }) => <div>{children}</div> }));

/**
 * Fase 6.24: las demás maquetas son de solo lectura. Su contenido va en un
 * <fieldset disabled>, así que ningún alta, edición, baja o guardado puede
 * llegar a un "correctamente" simulado.
 */
const cases: [string, ComponentType][] = [
  ["catalogs/employee", EmployeePage],
  ["accounts/journal", JournalPage],
  ["accounts/payable", PayablePage],
  ["accounts/receivable", ReceivablePage],
  ["statistics/charts", ChartsPage],
  ["settings/generalSettings", GeneralSettingsPage],
  ["settings/InvoiceType", InvoiceTypePage],
  ["settings/addenda", AddendaPage],
  ["settings/bankAccount", BankAccountPage],
  ["settings/expedition", ExpeditionPage],
  ["settings/observations", ObservationsPage],
  ["profile", ProfilePage],
];

describe("maquetas de solo lectura", () => {
  it.each(cases)("%s: aviso de solo lectura y todos sus controles deshabilitados", (route, Page) => {
    const { container } = render(<Page />);

    expect(screen.getByRole("note", { name: "Vista de demostración" })).toHaveTextContent("solo lectura");
    expect(SCREEN_STATUS[`/pages/${route}`]).toBe("demo");

    const fieldset = container.querySelector("fieldset[disabled]");
    expect(fieldset).not.toBeNull();

    const controls = fieldset!.querySelectorAll("button, input, select, textarea");
    expect(controls.length).toBeGreaterThan(0);
    controls.forEach((control) => expect(control).toBeDisabled());
  });

  it("settings/users se eliminó: ni página ni entrada en el registro", () => {
    expect(existsSync(path.resolve(import.meta.dirname, "settings/users/page.tsx"))).toBe(false);
    expect("/pages/settings/users" in SCREEN_STATUS).toBe(false);
  });
});
