import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SaleEditor from "./SaleEditor";
import * as sales from "@/src/services/sale.services";
import * as clients from "@/src/services/client.services";
import * as products from "@/src/services/product.services";
import * as sat from "@/src/services/sat.services";
import { satCatalogsFixture } from "@/src/test-fixtures/sat";
import { readinessFixture, saleFixture, saleItemFixture, taxRatesFixture } from "@/src/test-fixtures/sale";

const navigation = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn() }));

vi.mock("next/navigation", () => ({ useRouter: () => navigation, usePathname: () => "/pages/sales" }));
vi.mock("@/app/components/layout/AppLayout", () => ({ default: ({ children }: { children: ReactNode }) => <div>{children}</div> }));
vi.mock("@/src/services/client.services", () => ({ getClients: vi.fn() }));
vi.mock("@/src/services/product.services", () => ({ getProducts: vi.fn() }));
vi.mock("@/src/services/sat.services", () => ({ getSatCatalogs: vi.fn() }));
vi.mock("@/src/services/sale.services", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/src/services/sale.services")>();
  return {
    ...original,
    getSale: vi.fn(),
    createSale: vi.fn(),
    updateSale: vi.fn(),
    addSaleItem: vi.fn(),
    updateSaleItem: vi.fn(),
    deleteSaleItem: vi.fn(),
    getSaleBillingReadiness: vi.fn(),
    getTaxRates: vi.fn(),
    invoiceSale: vi.fn(),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(clients.getClients).mockResolvedValue([
    { id: 3, name: "Dunder Mifflin", email: "dm@example.com", rfc: "ABC101010111", codigo_postal: "85900", regimen_fiscal: "601", uso_cfdi: "G01" },
  ]);
  vi.mocked(products.getProducts).mockResolvedValue([
    { id: 14, name: "Producto prueba Facturapi", descripcion: "Producto", precio_unitario: 100, clave_producto: "60131324", clave_unidad: "H87", impuesto_local: "", iva: "16.00" as unknown as number },
  ]);
  vi.mocked(sales.getTaxRates).mockResolvedValue(taxRatesFixture);
  vi.mocked(sat.getSatCatalogs).mockResolvedValue(satCatalogsFixture());
  vi.mocked(sales.getSale).mockResolvedValue(saleFixture());
  vi.mocked(sales.getSaleBillingReadiness).mockResolvedValue(readinessFixture());
});

describe("nueva venta", () => {
  it("crea el borrador con cliente y pago, y redirige a la venta", async () => {
    vi.mocked(sales.createSale).mockResolvedValue(saleFixture({ id: 31 }));
    render(<SaleEditor />);

    fireEvent.change(await screen.findByLabelText("Cliente"), { target: { value: "3" } });
    fireEvent.change(screen.getByLabelText("Forma de pago"), { target: { value: "03" } });
    fireEvent.change(screen.getByLabelText("Método de pago"), { target: { value: "PUE" } });
    fireEvent.click(screen.getByRole("button", { name: /Crear venta/ }));

    await waitFor(() => expect(navigation.replace).toHaveBeenCalledWith("/pages/sales/31"));
    expect(sales.createSale).toHaveBeenCalledWith({ client_id: 3, notes: null, payment_form: "03", payment_method: "PUE" });
  });

  it("avisa antes de enviar si la forma y el método son incompatibles", async () => {
    render(<SaleEditor />);

    fireEvent.change(await screen.findByLabelText("Cliente"), { target: { value: "3" } });
    fireEvent.change(screen.getByLabelText("Forma de pago"), { target: { value: "99" } });
    fireEvent.change(screen.getByLabelText("Método de pago"), { target: { value: "PUE" } });

    expect(screen.getByRole("alert")).toHaveTextContent("Con método de pago PUE");
    expect(screen.getByRole("button", { name: /Crear venta/ })).toBeDisabled();
  });

  it("Fase 6.28: PPD aparece deshabilitado y explica que falta el complemento de pago", async () => {
    render(<SaleEditor />);

    const ppd = await screen.findByRole("option", { name: /PPD - Pago en parcialidades o diferido \(próximamente\)/ });
    expect(ppd).toBeDisabled();
    expect(screen.getByRole("option", { name: /PUE - Pago en una sola exhibición/ })).toBeEnabled();
    expect(screen.getByText(/PPD estará disponible cuando el sistema emita el complemento de pago/)).toBeInTheDocument();
  });

  it("Fase 6.28: una venta guardada con PPD muestra el aviso y no deja guardar", async () => {
    vi.mocked(sales.getSale).mockResolvedValue(saleFixture({ payment_form: "99", payment_method: "PPD" }));
    render(<SaleEditor saleId={7} />);

    expect(await screen.findByRole("alert")).toHaveTextContent("requiere el complemento de pago");
    expect(screen.getByRole("button", { name: /Guardar datos/ })).toBeDisabled();
  });
});

describe("venta existente", () => {
  it("factura con una sola llamada y lleva al detalle de la factura", async () => {
    let resolveInvoice: (value: Awaited<ReturnType<typeof sales.invoiceSale>>) => void = () => {};
    vi.mocked(sales.invoiceSale).mockReturnValue(new Promise((resolve) => { resolveInvoice = resolve; }));
    render(<SaleEditor saleId={7} />);

    const button = await screen.findByRole("button", { name: /Facturar/ });
    await waitFor(() => expect(button).toBeEnabled());
    fireEvent.click(button);
    fireEvent.click(button);

    expect(await screen.findByText("Facturando…")).toBeInTheDocument();
    expect(sales.invoiceSale).toHaveBeenCalledTimes(1);
    resolveInvoice({ created: true, invoice: { id: 12, folio: "FAC-00000011", status: "ready" } });
    await waitFor(() => expect(navigation.push).toHaveBeenCalledWith("/pages/invoices/12"));
  });

  it("si la factura ya existía (200) también redirige", async () => {
    vi.mocked(sales.invoiceSale).mockResolvedValue({ created: false, invoice: { id: 12, folio: "FAC-00000011", status: "issued" } });
    render(<SaleEditor saleId={7} />);

    const button = await screen.findByRole("button", { name: /Facturar/ });
    await waitFor(() => expect(button).toBeEnabled());
    fireEvent.click(button);

    await waitFor(() => expect(navigation.push).toHaveBeenCalledWith("/pages/invoices/12"));
  });

  it("muestra los problemas concretos con dónde corregirlos y no deja facturar", async () => {
    vi.mocked(sales.getSaleBillingReadiness).mockResolvedValue(readinessFixture({
      ready: false,
      errors: [
        { code: "CLIENT_RFC_MISSING", field: "client.rfc", message: "El cliente no tiene RFC." },
        { code: "SALE_PAYMENT_FORM_MISSING", field: "payment_form", message: "raw" },
        { code: "ITEM_PRODUCT_SAT_KEY_MISSING", field: "items.1.product.clave_producto", message: "raw" },
      ],
    }));
    render(<SaleEditor saleId={7} />);

    const panel = within(await screen.findByRole("list", { name: "Problemas para facturar" }));
    expect(panel.getByText("El cliente no tiene RFC.")).toBeInTheDocument();
    expect(panel.getByRole("link", { name: "Corregir en Clientes" })).toHaveAttribute("href", "/pages/catalogs/clients");
    expect(panel.getByRole("link", { name: "Corregir forma y método de pago" })).toHaveAttribute("href", "#sale-payment");
    expect(panel.getByText("El producto no tiene clave de producto o servicio SAT.")).toBeInTheDocument();
    expect(panel.getByText("Concepto: Producto prueba Facturapi")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Facturar/ })).toBeDisabled();
  });

  it("un 422 al facturar actualiza el panel con los problemas que devolvió el servidor", async () => {
    vi.mocked(sales.invoiceSale).mockRejectedValue(new sales.SaleApiError("La venta no está lista para facturarse.", 422, "SALE_NOT_BILLABLE", [
      { code: "SALE_PUE_FORBIDS_FORM_99", field: "payment_form", message: "raw" },
    ]));
    render(<SaleEditor saleId={7} />);

    const button = await screen.findByRole("button", { name: /Facturar/ });
    await waitFor(() => expect(button).toBeEnabled());
    fireEvent.click(button);

    expect(await screen.findByText("Con método de pago PUE la forma de pago no puede ser 99 (Por definir).")).toBeInTheDocument();
    expect(navigation.push).not.toHaveBeenCalled();
  });

  it("agrega un concepto con el precio del producto y el IVA preseleccionado", async () => {
    vi.mocked(sales.addSaleItem).mockResolvedValue(saleItemFixture({ id: 2 }));
    render(<SaleEditor saleId={7} />);

    fireEvent.change(await screen.findByLabelText("Producto"), { target: { value: "14" } });
    expect(screen.getByLabelText("Precio unitario")).toHaveValue(100);
    expect(screen.getByLabelText("Impuesto")).toHaveValue("1");
    fireEvent.change(screen.getByLabelText("Cantidad"), { target: { value: "2" } });
    fireEvent.click(screen.getByRole("button", { name: /Agregar/ }));

    await waitFor(() => expect(sales.addSaleItem).toHaveBeenCalledWith(7, { product_id: 14, quantity: 2, unit_price: 100, tax_rate_id: 1 }));
    expect(sales.getSale).toHaveBeenCalledTimes(2);
  });

  it("conceptos como tarjetas en pantallas angostas y tabla en anchas", async () => {
    render(<SaleEditor saleId={7} />);

    const card = await screen.findByTestId("sale-item-card");
    expect(card.closest("ul")).toHaveClass("sm:hidden");
    expect(screen.getByRole("table").parentElement).toHaveClass("hidden", "sm:block");
  });

  it("una venta facturada enlaza su factura y ya no ofrece facturar", async () => {
    vi.mocked(sales.getSale).mockResolvedValue(saleFixture({ status: "confirmed", invoice: { id: 12, folio: "FAC-00000011", status: "ready" } }));
    render(<SaleEditor saleId={7} />);

    expect(await screen.findByRole("link", { name: /Ver factura FAC-00000011/ })).toHaveAttribute("href", "/pages/invoices/12");
    expect(screen.queryByRole("button", { name: /Facturar/ })).not.toBeInTheDocument();
    expect(screen.getByLabelText("Cliente")).toBeDisabled();
  });

  it("la forma de pago sale del catálogo c_FormaPago completo y conserva un valor guardado fuera de él (Fase 6.26)", async () => {
    vi.mocked(sales.getSale).mockResolvedValue(saleFixture({ payment_form: "07", payment_method: "PUE" }));
    render(<SaleEditor saleId={7} />);

    const select = await screen.findByLabelText("Forma de pago");
    await waitFor(() => expect(within(select).getByRole("option", { name: "31 - Intermediario pagos" })).toBeInTheDocument());
    expect(within(select).getByRole("option", { name: "07 (no está en el catálogo del SAT)" })).toBeInTheDocument();
    expect(select).toHaveValue("07");
  });

  it("preselecciona la tasa propia del producto, también exento (Fase 6.26)", async () => {
    vi.mocked(products.getProducts).mockResolvedValue([
      { id: 15, name: "Libro", descripcion: "Libro", precio_unitario: 80, clave_producto: "55101500", clave_unidad: "H87", impuesto_local: "", iva: 0, tax_rate_id: 3 },
    ]);
    render(<SaleEditor saleId={7} />);

    fireEvent.change(await screen.findByLabelText("Producto"), { target: { value: "15" } });
    expect(screen.getByLabelText("Impuesto")).toHaveValue("3");
  });

  it("explica los códigos nuevos de datos SAT inválidos con dónde corregirlos (Fase 6.26)", async () => {
    vi.mocked(sales.getSaleBillingReadiness).mockResolvedValue(readinessFixture({
      ready: false,
      errors: [
        { code: "CLIENT_REGIME_USE_INCOMPATIBLE", field: "client.uso_cfdi", message: "raw" },
        { code: "ITEM_PRODUCT_UNIT_KEY_INVALID", field: "items.1.product.clave_unidad", message: "raw" },
        { code: "ITEM_TAX_OBJECT_MISMATCH", field: "items.1.tax_rate_id", message: "raw" },
      ],
    }));
    render(<SaleEditor saleId={7} />);

    const panel = within(await screen.findByRole("list", { name: "Problemas para facturar" }));
    expect(panel.getByText(/no es compatible con su régimen fiscal/)).toBeInTheDocument();
    expect(panel.getByText("La clave de unidad no existe en el catálogo del SAT.")).toBeInTheDocument();
    expect(panel.getByText(/no coincide con el IVA del concepto/)).toBeInTheDocument();
    expect(panel.getByRole("link", { name: "Corregir en Productos" })).toHaveAttribute("href", "/pages/catalogs/products");
  });
  it("una venta cancelada no se puede facturar ni editar", async () => {
    vi.mocked(sales.getSale).mockResolvedValue(saleFixture({ status: "cancelled" }));
    render(<SaleEditor saleId={7} />);

    expect(await screen.findByText("La venta está cancelada y no puede facturarse.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Facturar/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("form", { name: "Agregar concepto" })).not.toBeInTheDocument();
  });
});
