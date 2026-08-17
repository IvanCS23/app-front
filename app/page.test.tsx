import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MaintenancePage from "./page";

describe("entrada al sistema", () => {
  it("muestra un enlace semántico y claro hacia el login", () => {
    render(<MaintenancePage />);

    expect(screen.getByRole("link", { name: "Iniciar sesión" })).toHaveAttribute("href", "/login");
    expect(screen.queryByRole("button", { name: "Teal to Lime" })).not.toBeInTheDocument();
  });
});
