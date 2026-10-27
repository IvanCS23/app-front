import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductsPage from "./page";
import * as productServices from "@/src/services/product.services";
import * as saleServices from "@/src/services/sale.services";
import * as satServices from "@/src/services/sat.services";
import { satCatalogsFixture } from "@/src/test-fixtures/sat";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => "/" }));
vi.mock("@/app/components/layout/AppLayout", () => ({ default: ({ children }: { children: ReactNode }) => <div>{children}</div> }));
vi.mock("@/src/services/product.services", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/src/services/product.services")>()),
  getProducts: vi.fn(),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
}));
vi.mock("@/src/services/sale.services", () => ({ getTaxRates: vi.fn() }));
vi.mock("@/src/services/sat.services", () => ({ getSatCatalogs: vi.fn(), searchProductKeys: vi.fn(), searchUnitKeys: vi.fn() }));

const taxRates = [
  { id: 1, code: "002", name: "IVA 16%", rate: "0.160000", tax_type: "traslado", factor_type: "tasa" },
  { id: 2, code: "002", name: "IVA 0%", rate: "0.000000", tax_type: "traslado", factor_type: "tasa" },
  { id: 3, code: "002", name: "IVA Exento", rate: "0.000000", tax_type: "traslado", factor_type: "exento" },
];

const savedInvalid = {
  id: 9,
  name: "Producto viejo",
  descripcion: "Capturado antes de la validación",
  precio_unitario: 100,
  clave_producto: "dasdsada",
  clave_unidad: "888",
  objeto_imp: "01",
  tax_rate_id: 1,
  impuesto_local: "",
  fiscal_issues: [{ code: "PRODUCT_SAT_KEY_INVALID", field: "clave_producto", message: "La clave de producto SAT debe tener 8 dígitos." }],
};

async function openNewProduct() {
  render(<ProductsPage />);
  await waitFor(() => expect(saleServices.getTaxRates).toHaveBeenCalled());
  fireEvent.click(await screen.findByRole("button", { name: /nuevo producto|agregar producto/i }));
}

function fillRequired() {
  fireEvent.change(screen.getByPlaceholderText("Nombre Interno"), { target: { value: "Licencia" } });
  fireEvent.change(screen.getByPlaceholderText("Descripción"), { target: { value: "Licencia anual" } });
  fireEvent.change(screen.getByPlaceholderText("Precio"), { target: { value: "100" } });
  fireEvent.change(screen.getByLabelText("Clave de Producto o Servicio"), { target: { value: "43232408" } });
  fireEvent.change(screen.getByLabelText("Unidad"), { target: { value: "e48" } });
}

/**
 * Fase 6.26: el producto captura su IVA como tasa (16 %, 0 % o exento),
 * objeto de impuesto 02 por omisión y coherencia antes de enviar.
 */
describe("Catálogo de productos con validación SAT", () => {
  beforeEach(() => {
    vi.mocked(productServices.getProducts).mockResolvedValue([savedInvalid]);
    vi.mocked(productServices.createProduct).mockResolvedValue(savedInvalid);
    vi.mocked(saleServices.getTaxRates).mockResolvedValue(taxRates as never);
    vi.mocked(satServices.getSatCatalogs).mockResolvedValue(satCatalogsFixture());
    vi.mocked(satServices.searchProductKeys).mockResolvedValue([{ code: "43232408", description: "Software de desarrollo de plataformas web" }]);
    vi.mocked(satServices.searchUnitKeys).mockResolvedValue([{ code: "E48", name: "Unidad de servicio", symbol: null }]);
  });

  it("un producto nuevo arranca con objeto 02 e IVA 16 %", async () => {
    await openNewProduct();

    await waitFor(() => expect(screen.getByLabelText("Objeto de impuesto")).toHaveValue("02"));
    expect(screen.getByLabelText("IVA")).toHaveValue("1");
    // Sólo tasas reales de tax_rates: el 8 % de la lista anterior no existe ahí.
    expect(within(screen.getByLabelText("IVA")).getAllByRole("option").map((option) => option.textContent)).toEqual(["Sin IVA", "IVA 16%", "IVA 0%", "IVA Exento"]);
  });

  it("exento se envía como su tasa (tax_rate_id), nunca como un iva numérico", async () => {
    await openNewProduct();
    fillRequired();
    fireEvent.change(screen.getByLabelText("IVA"), { target: { value: "3" } });
    fireEvent.click(screen.getByRole("button", { name: /guardar/i }));

    await waitFor(() => expect(productServices.createProduct).toHaveBeenCalledTimes(1));
    const payload = vi.mocked(productServices.createProduct).mock.calls[0][0];
    expect(payload).toMatchObject({ clave_producto: "43232408", clave_unidad: "E48", objeto_imp: "02", tax_rate_id: 3 });
    expect(payload).not.toHaveProperty("iva");
  });

  it("no envía un objeto 02 sin IVA ni una clave que no tiene 8 dígitos", async () => {
    await openNewProduct();
    fillRequired();
    fireEvent.change(screen.getByLabelText("IVA"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: /guardar/i }));

    expect(await screen.findAllByText(/Con objeto de impuesto 02 el producto debe tener IVA/)).not.toHaveLength(0);

    fireEvent.change(screen.getByLabelText("IVA"), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText("Clave de Producto o Servicio"), { target: { value: "4323" } });
    fireEvent.click(screen.getByRole("button", { name: /guardar/i }));

    expect(await screen.findAllByText("La clave de producto SAT debe tener 8 dígitos.")).not.toHaveLength(0);
    expect(productServices.createProduct).not.toHaveBeenCalled();
  });

  it("marca en el listado y avisa al editar un producto guardado con datos inválidos", async () => {
    render(<ProductsPage />);

    expect(await screen.findByText("Revisar datos SAT")).toBeInTheDocument();
    fireEvent.click(screen.getByTitle("Editar producto"));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Este producto se guardó con datos que el SAT no acepta");
    expect(screen.getByLabelText("Clave de Producto o Servicio")).toHaveValue("dasdsada");
    expect(screen.getByLabelText("IVA")).toHaveValue("1");
  });
});
