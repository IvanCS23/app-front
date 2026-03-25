import React from "react";
import AppLayout from "@/app/components/layout/AppLayout";
import {
  ReceiptText,
  Search,
  Bell,
  FileText,
  ShoppingCart,
  Info,
  Plus,
  Pencil,
  ChevronDown,
  Folder,
  Save,
  Eye,
  CheckCircle2,
} from "lucide-react";

const selectStyle =
  "w-full rounded-xl border border-[#31425c] bg-[#1c2a42] px-4 py-3 text-white outline-none transition focus:border-[#1d9bf0]";

const inputStyle =
  "w-full rounded-xl border border-[#31425c] bg-[#1c2a42] px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-[#1d9bf0]";

type LabelProps = {
  children: React.ReactNode;
  withInfo?: boolean;
};

function Label({ children, withInfo = false }: LabelProps) {
  return (
    <div className="mb-2 flex items-center gap-1">
      <label className="text-sm font-bold uppercase tracking-wide text-slate-400">
        {children}
      </label>
      {withInfo && <Info className="h-4 w-4 text-[#1d9bf0]" />}
    </div>
  );
}

type SectionTitleProps = {
  icon: React.ReactNode;
  title: React.ReactNode;
};

function SectionTitle({ icon, title }: SectionTitleProps) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="text-slate-300">{icon}</div>
      <h2 className="text-[20px] font-bold text-white">{title}</h2>
    </div>
  );
}

export default function InvoiceForm() {
  return (
    <AppLayout>
    <div className="min-h-screen bg-[#071321] text-white">
      {/* Main */}
      <main className="mx-auto max-w-[1400px] px-6 py-10">
        <SectionTitle
          icon={<FileText className="h-6 w-6" />}
          title={
            <>
              Datos de la Factura:{" "}
              <span className="text-[#1d9bf0]">CFDI 4.0</span>
            </>
          }
        />

        {/* Card formulario */}
        <section className="rounded-2xl border border-[#16304f] bg-[#09172b] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.01)]">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <Label>Nombre Emisor:</Label>
              <input type="text" value="KASHMIR" readOnly className={inputStyle} />
            </div>

            <div>
              <Label>Código Postal Emisor:</Label>
              <div className="relative">
                <input type="text" defaultValue="53689" className={inputStyle} />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1d9bf0]">
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <Label withInfo>Uso de decimales:</Label>
              <div className="relative">
                <select defaultValue="2" className={`${selectStyle} appearance-none`}>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <Label>Seleccionar Cliente:</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select defaultValue="" className={`${selectStyle} appearance-none`}>
                    <option value="">Seleccionar Cliente</option>
                    <option value="1">Cliente 1</option>
                    <option value="2">Cliente 2</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>

                <button className="flex h-[52px] w-[52px] items-center justify-center rounded-xl border border-[#31425c] bg-[#0d1a2f] text-[#1d9bf0] hover:bg-[#12233f]">
                  <Plus className="h-5 w-5" />
                </button>

                <button className="flex h-[52px] w-[52px] items-center justify-center rounded-xl border border-[#31425c] bg-[#0d1a2f] text-[#1d9bf0] hover:bg-[#12233f]">
                  <Pencil className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div>
              <Label>Tipo de factura:</Label>
              <div className="relative">
                <select defaultValue="factura" className={`${selectStyle} appearance-none`}>
                  <option value="factura">Factura</option>
                  <option value="nota-credito">Nota de crédito</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <Label>Lugar de expedición:</Label>
              <div className="relative">
                <select defaultValue="principal" className={`${selectStyle} appearance-none`}>
                  <option value="principal">Principal (53689)</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <Label>Forma de pago:</Label>
              <div className="relative">
                <select defaultValue="" className={`${selectStyle} appearance-none`}>
                  <option value="">Seleccionar Forma de pago</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <Label>Método de pago:</Label>
              <div className="relative">
                <select defaultValue="pue" className={`${selectStyle} appearance-none`}>
                  <option value="pue">PUE - Pago en una sola exhibición</option>
                  <option value="ppd">PPD - Pago en parcialidades</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="flex items-end">
              <button className="flex items-center gap-2 text-[15px] font-semibold text-[#1d9bf0] hover:opacity-90">
                <ChevronDown className="h-4 w-4" />
                Ver opciones adicionales
              </button>
            </div>
          </div>
        </section>

        {/* Productos */}
        <div className="mt-12">
          <SectionTitle
            icon={<ShoppingCart className="h-6 w-6" />}
            title="Seleccionar producto o servicio:"
          />

          <section className="overflow-hidden rounded-2xl border border-[#16304f] bg-[#09172b]">
            {/* Buscador */}
            <div className="flex items-center gap-4 border-b border-[#16304f] p-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Busca tu producto o servicio"
                  className="h-12 w-full rounded-xl border border-[#31425c] bg-[#0f1c33] pl-12 pr-4 text-white placeholder:text-slate-400 outline-none focus:border-[#1d9bf0]"
                />
              </div>

              <button className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#31425c] bg-[#0f1c33] text-[#1d9bf0] hover:bg-[#13223d]">
                <Plus className="h-5 w-5" />
              </button>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-[#16253e]">
                  <tr className="text-left text-sm uppercase tracking-wide text-slate-400">
                    <th className="px-6 py-4">Cant.</th>
                    <th className="px-6 py-4">Claves</th>
                    <th className="px-6 py-4">Descripción</th>
                    <th className="px-6 py-4">Precio</th>
                    <th className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        Subtotal
                        <Info className="h-3.5 w-3.5 text-[#1d9bf0]" />
                      </div>
                    </th>
                    <th className="px-6 py-4">Descuento</th>
                    <th className="px-6 py-4">Impuestos</th>
                    <th className="px-6 py-4">Total</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-16 text-center text-[17px] italic text-slate-400"
                    >
                      No hay productos seleccionados. Usa el buscador superior para agregar ítems.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totales y acciones */}
            <div className="flex flex-col gap-6 border-t border-[#16304f] bg-[#0d1c34] px-6 py-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex gap-10">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
                    Subtotal
                  </p>
                  <h3 className="mt-1 text-2xl font-bold text-white">$0,000.00</h3>
                </div>

                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
                    Total
                  </p>
                  <h3 className="mt-1 text-2xl font-bold text-white">$0,000.00</h3>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-5 text-[#1d9bf0]">
                  <button className="hover:opacity-80">
                    <Folder className="h-6 w-6" />
                  </button>
                  <button className="hover:opacity-80">
                    <Save className="h-6 w-6" />
                  </button>
                </div>

                <button className="flex items-center justify-center gap-2 rounded-xl border border-[#31425c] bg-[#1c2a42] px-6 py-3 font-semibold text-white hover:bg-[#243653]">
                  <Eye className="h-5 w-5" />
                  Vista previa
                </button>

                <button className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-8 py-3 font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                  Crear Factura
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Alerta */}
        <section className="mt-7 rounded-2xl border border-[#164a7a] bg-[#0b1d32] p-6">
          <div className="flex items-start gap-4">
            <div className="mt-1 text-[#1d9bf0]">
              <Info className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-[22px] font-bold text-white">
                Validación CFDI 4.0 Activa
              </h3>
              <p className="mt-1 text-[17px] text-slate-300">
                Asegúrate de que los datos del cliente coincidan exactamente con su
                Constancia de Situación Fiscal para evitar errores en el timbrado.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#16304f] px-6 py-8 text-sm text-slate-500">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p>© 2023 FacturaPro. Todos los derechos reservados.</p>

          <div className="flex gap-6">
            <a href="#" className="hover:text-white">
              Términos y condiciones
            </a>
            <a href="#" className="hover:text-white">
              Privacidad
            </a>
            <a href="#" className="hover:text-white">
              Ayuda
            </a>
          </div>
        </div>
      </footer>
    </div>
    </AppLayout>
  );
}