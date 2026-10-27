import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SatKeySearch, { type SatKeyOption } from "./SatKeySearch";

function Harness({ search, normalize }: { search: (q: string, s: AbortSignal) => Promise<SatKeyOption[]>; normalize?: (v: string) => string }) {
  const [value, setValue] = useState("");
  return (
    <>
      <SatKeySearch label="Unidad" value={value} onChange={setValue} search={search} normalize={normalize} />
      <output data-testid="value">{value}</output>
    </>
  );
}

/** Fase 6.26: búsqueda de claves SAT mientras se escribe, con retardo. */
describe("SatKeySearch", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("busca sólo cuando el usuario deja de escribir y permite elegir una clave", async () => {
    const search = vi.fn(async () => [{ code: "H87", label: "Pieza" }]);
    render(<Harness search={search} normalize={(v) => v.toUpperCase()} />);

    fireEvent.change(screen.getByLabelText("Unidad"), { target: { value: "p" } });
    fireEvent.change(screen.getByLabelText("Unidad"), { target: { value: "pi" } });
    fireEvent.change(screen.getByLabelText("Unidad"), { target: { value: "pie" } });
    expect(screen.getByTestId("value")).toHaveTextContent("PIE");
    expect(search).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });
    expect(search).toHaveBeenCalledTimes(1);
    expect(search).toHaveBeenCalledWith("PIE", expect.any(AbortSignal));

    fireEvent.click(screen.getByRole("button", { name: /H87/ }));
    expect(screen.getByTestId("value")).toHaveTextContent("H87");
    expect(screen.getByText("H87 — Pieza")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("no busca con menos de 2 caracteres y avisa cuando no hay coincidencias", async () => {
    const search = vi.fn(async () => []);
    render(<Harness search={search} />);

    fireEvent.change(screen.getByLabelText("Unidad"), { target: { value: "x" } });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(400);
    });
    expect(search).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("Unidad"), { target: { value: "xyz" } });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });
    expect(screen.getByText("Sin coincidencias en el catálogo del SAT.")).toBeInTheDocument();
  });

  it("si la búsqueda falla lo dice, sin inventar opciones", async () => {
    const search = vi.fn(async () => {
      throw new Error("red");
    });
    render(<Harness search={search} />);

    fireEvent.change(screen.getByLabelText("Unidad"), { target: { value: "pieza" } });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });
    expect(screen.getByText("No fue posible buscar en el catálogo del SAT.")).toBeInTheDocument();
  });
});
