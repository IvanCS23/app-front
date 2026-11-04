import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ClientsPage from "./page";
import * as clientServices from "@/src/services/client.services";
import * as satServices from "@/src/services/sat.services";
import { satCatalogsFixture } from "@/src/test-fixtures/sat";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => "/" }));
vi.mock("@/app/components/layout/AppLayout", () => ({ default: ({ children }: { children: ReactNode }) => <div>{children}</div> }));
vi.mock("@/src/services/client.services", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/src/services/client.services")>()),
  getClients: vi.fn(),
  createClient: vi.fn(),
  updateClient: vi.fn(),
}));
vi.mock("@/src/services/sat.services", () => ({ getSatCatalogs: vi.fn() }));

const validClient = { id: 1, name: "Dunder Mifflin SA", email: "dm@example.com", rfc: "DMI010203AB1", codigo_postal: "85900", regimen_fiscal: "601", uso_cfdi: "G03", fiscal_issues: [] };
const invalidClient = {
  id: 2,
  name: "Cliente Antiguo",
  email: "viejo@example.com",
  rfc: "ABC123",
  codigo_postal: "85900",
  regimen_fiscal: "601",
  uso_cfdi: "G03",
  fiscal_issues: [{ code: "CLIENT_RFC_INVALID", field: "rfc", message: "El RFC no tiene un formato válido." }],
};

function optionValues(select: HTMLElement): string[] {
  return within(select).getAllByRole("option").map((option) => (option as HTMLOptionElement).value).filter(Boolean);
}

/**
 * Fase 6.26: régimen y uso desde el catálogo del SAT filtrados por tipo de
 * persona y régimen, validación espejo antes de enviar, aviso de datos
 * guardados inválidos y tarjetas en pantallas angostas.
 */
describe("Catálogo de clientes con validación SAT", () => {
  beforeEach(() => {
    vi.mocked(satServices.getSatCatalogs).mockResolvedValue(satCatalogsFixture());
    vi.mocked(clientServices.getClients).mockResolvedValue([validClient, invalidClient]);
    vi.mocked(clientServices.createClient).mockResolvedValue(validClient);
  });

  it("muestra tarjetas para pantallas angostas además de la tabla, y marca los clientes a revisar", async () => {
    render(<ClientsPage />);

    const cards = await screen.findByRole("list", { name: "Clientes" });
    expect(cards.className).toContain("md:hidden");
    expect(within(cards).getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("table").parentElement?.className.split(" ")).toEqual(expect.arrayContaining(["hidden", "md:block", "overflow-x-auto"]));
    expect(screen.getAllByText("Revisar datos SAT")).toHaveLength(2); // tarjeta y fila del cliente inválido
  });

  it("filtra el régimen por tipo de persona y el uso por régimen", async () => {
    render(<ClientsPage />);
    fireEvent.click(await screen.findByRole("button", { name: /agregar cliente/i }));

    const regime = screen.getByLabelText("Régimen fiscal");
    await waitFor(() => expect(regime).not.toBeDisabled());
    expect(optionValues(regime)).toEqual(["601", "605", "612", "616", "626"]);

    fireEvent.change(screen.getByPlaceholderText("RFC del cliente"), { target: { value: "dmi010203ab1" } });
    expect(optionValues(regime)).toEqual(["601", "626"]);

    fireEvent.change(regime, { target: { value: "601" } });
    expect(optionValues(screen.getByLabelText("Uso de la factura"))).toEqual(["G01", "G03", "S01"]);
  });

  it("no envía un cliente con RFC o código postal inválidos y lo explica bajo el campo", async () => {
    render(<ClientsPage />);
    fireEvent.click(await screen.findByRole("button", { name: /agregar cliente/i }));
    await waitFor(() => expect(screen.getByLabelText("Régimen fiscal")).not.toBeDisabled());

    fireEvent.change(screen.getByPlaceholderText("Nombre o razón social del cliente"), { target: { value: "Nuevo" } });
    fireEvent.change(screen.getByPlaceholderText("RFC del cliente"), { target: { value: "ABC123" } });
    fireEvent.change(screen.getByLabelText("Régimen fiscal"), { target: { value: "601" } });
    fireEvent.change(screen.getByLabelText("Uso de la factura"), { target: { value: "G03" } });
    fireEvent.change(screen.getAllByPlaceholderText("correo@ejemplo.com")[0], { target: { value: "n@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Código postal"), { target: { value: "123" } });
    fireEvent.click(screen.getByRole("button", { name: "Guardar Cliente" }));

    expect(await screen.findByText("El código postal debe tener 5 dígitos.")).toBeInTheDocument();
    expect(screen.getAllByText(/El RFC no tiene un formato válido/).length).toBeGreaterThan(0);
    expect(clientServices.createClient).not.toHaveBeenCalled();
  });

  it("al editar un cliente guardado con datos inválidos avisa qué corregir y conserva su valor", async () => {
    render(<ClientsPage />);
    const editButtons = await screen.findAllByTitle("Editar cliente");
    fireEvent.click(editButtons[1]); // tarjetas primero: [válido, inválido]

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Este cliente se guardó con datos que el SAT no acepta");
    expect(alert).toHaveTextContent("El RFC no tiene un formato válido.");
    expect(screen.getByPlaceholderText("RFC del cliente")).toHaveValue("ABC123");
  });

  it("si el catálogo no carga, avisa y no deja elegir régimen ni uso", async () => {
    vi.mocked(satServices.getSatCatalogs).mockRejectedValue(new Error("No fue posible cargar los catálogos del SAT."));
    render(<ClientsPage />);

    expect(await screen.findByRole("alert")).toHaveTextContent("No fue posible cargar los catálogos del SAT.");
    fireEvent.click(screen.getByRole("button", { name: /agregar cliente/i }));
    expect(screen.getByLabelText("Régimen fiscal")).toBeDisabled();
    expect(screen.getByLabelText("Uso de la factura")).toBeDisabled();
  });
});

/** Fase 6.26.1: funciones que todavía no existen se marcan, no se simulan. */
describe("Clientes sin funciones simuladas", () => {
  beforeEach(() => {
    vi.mocked(satServices.getSatCatalogs).mockResolvedValue(satCatalogsFixture());
    vi.mocked(clientServices.getClients).mockResolvedValue([validClient]);
  });

  it("Carga masiva se muestra deshabilitada como Próximamente y no abre la maqueta", async () => {
    render(<ClientsPage />);

    const bulk = await screen.findByRole("button", { name: /carga masiva/i });
    expect(bulk).toBeDisabled();
    expect(bulk).toHaveAttribute("aria-disabled", "true");
    expect(within(bulk).getByText("Próximamente")).toBeInTheDocument();

    fireEvent.click(bulk);
    expect(screen.queryByText(/Carga Masiva de Clientes/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /procesar archivos|eliminar todos/i })).not.toBeInTheDocument();
  });
});

/** Fase 6.30: los correos opcionales se guardan, se cargan al editar y se validan. */
describe("Correos opcionales del cliente", () => {
  beforeEach(() => {
    vi.mocked(satServices.getSatCatalogs).mockResolvedValue(satCatalogsFixture());
    vi.mocked(clientServices.getClients).mockResolvedValue([{ ...validClient, email_optional_1: "contador@example.com", email_optional_2: null }]);
    vi.mocked(clientServices.createClient).mockReset().mockResolvedValue(validClient);
    vi.mocked(clientServices.updateClient).mockReset().mockResolvedValue(validClient);
  });

  async function fillNewClient() {
    render(<ClientsPage />);
    fireEvent.click(await screen.findByRole("button", { name: /agregar cliente/i }));
    await waitFor(() => expect(screen.getByLabelText("Régimen fiscal")).not.toBeDisabled());
    fireEvent.change(screen.getByPlaceholderText("Nombre o razón social del cliente"), { target: { value: "Nuevo" } });
    fireEvent.change(screen.getByPlaceholderText("RFC del cliente"), { target: { value: "DMI010203AB1" } });
    fireEvent.change(screen.getByLabelText("Régimen fiscal"), { target: { value: "601" } });
    fireEvent.change(screen.getByLabelText("Uso de la factura"), { target: { value: "G03" } });
    fireEvent.change(screen.getAllByPlaceholderText("correo@ejemplo.com")[0], { target: { value: "n@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Código postal"), { target: { value: "85900" } });
  }

  it("envía los correos opcionales al crear", async () => {
    await fillNewClient();
    fireEvent.change(screen.getByLabelText("E-Mail opcional No.1"), { target: { value: " compras@example.com " } });
    fireEvent.click(screen.getByRole("button", { name: "Guardar Cliente" }));

    await waitFor(() => expect(clientServices.createClient).toHaveBeenCalledWith(expect.objectContaining({ email_optional_1: "compras@example.com", email_optional_2: "" })));
  });

  it("no envía un correo opcional con formato inválido", async () => {
    await fillNewClient();
    fireEvent.change(screen.getByLabelText("E-Mail opcional No.2"), { target: { value: "no-es-correo" } });
    fireEvent.click(screen.getByRole("button", { name: "Guardar Cliente" }));

    expect((await screen.findAllByText("El E-Mail opcional No.2 no tiene un formato válido.")).length).toBeGreaterThan(0);
    expect(clientServices.createClient).not.toHaveBeenCalled();
  });

  it("al editar carga los correos opcionales guardados", async () => {
    render(<ClientsPage />);
    fireEvent.click((await screen.findAllByTitle("Editar cliente"))[0]);

    expect(screen.getByLabelText("E-Mail opcional No.1")).toHaveValue("contador@example.com");
    expect(screen.getByLabelText("E-Mail opcional No.2")).toHaveValue("");
  });
});
