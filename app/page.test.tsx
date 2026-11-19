import { describe, expect, it, vi } from "vitest";
import Home from "./page";

const navigation = vi.hoisted(() => ({ redirect: vi.fn() }));

vi.mock("next/navigation", () => ({ redirect: navigation.redirect }));

describe("entrada al sistema", () => {
  // Desde 740dbe9 ("Pagina principal") la raíz ya no muestra la página de
  // mantenimiento: redirige directo al login.
  it("la raíz lleva al login", () => {
    Home();

    expect(navigation.redirect).toHaveBeenCalledWith("/login");
  });
});
