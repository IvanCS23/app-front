import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ComingSoon, { COMING_SOON_TITLE, ComingSoonBadge, comingSoonActionProps } from "./ComingSoon";

/**
 * Fase 6.26.1: funciones parciales dentro de pantallas reales. Se ven
 * deshabilitadas como "Próximamente" y nunca ejecutan su acción.
 */
describe("ComingSoon", () => {
  it("una acción Próximamente queda deshabilitada y no ejecuta nada", () => {
    const onClick = vi.fn();
    render(
      <button {...comingSoonActionProps} onClick={onClick}>
        Importar
        <ComingSoonBadge />
      </button>,
    );

    const button = screen.getByRole("button", { name: /importar/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("title", COMING_SOON_TITLE);
    expect(within(button).getByText("Próximamente")).toBeInTheDocument();

    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("una sección Próximamente explica qué sí hace el sistema y deshabilita sus controles", () => {
    const onChange = vi.fn();
    render(
      <ComingSoon title="Otros impuestos" note="Por ahora sólo se aplica IVA.">
        <input aria-label="ISR" value="5.4" onChange={onChange} />
        <button>Agregar</button>
      </ComingSoon>,
    );

    const section = screen.getByRole("region", { name: "Otros impuestos" });
    expect(within(section).getByText("Próximamente")).toBeInTheDocument();
    expect(within(section).getByText("Por ahora sólo se aplica IVA.")).toBeInTheDocument();
    expect(within(section).getByLabelText("ISR")).toBeDisabled();
    expect(within(section).getByLabelText("ISR")).toHaveValue("5.4");
    expect(within(section).getByRole("button", { name: "Agregar" })).toBeDisabled();
  });
});
