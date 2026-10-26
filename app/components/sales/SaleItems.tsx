import { useState } from "react";
import { Loader2, Save, Trash2 } from "lucide-react";
import { formatInvoiceMoney } from "@/src/lib/invoice";
import type { SaleItem, TaxRate } from "@/src/types/sale";

type ItemActions = {
  editable: boolean;
  busyItemId: number | null;
  onUpdateQuantity: (item: SaleItem, quantity: number) => void;
  onRemove: (item: SaleItem) => void;
};

function taxName(item: SaleItem, taxRates: TaxRate[]): string {
  if (item.tax_rate_id === null) return "Sin impuesto";
  return taxRates.find((taxRate) => taxRate.id === item.tax_rate_id)?.name ?? `Tasa #${item.tax_rate_id}`;
}

function QuantityEditor({ item, actions }: { item: SaleItem; actions: ItemActions }) {
  const [quantity, setQuantity] = useState(String(Number(item.quantity)));
  const changed = Number(quantity) !== Number(item.quantity);
  const valid = Number(quantity) > 0;
  const busy = actions.busyItemId === item.id;

  if (!actions.editable) return <span className="tabular-nums">{Number(item.quantity)}</span>;

  return (
    <span className="inline-flex items-center gap-1">
      <input
        aria-label={`Cantidad de ${item.description}`}
        type="number"
        min="0.001"
        step="any"
        inputMode="decimal"
        value={quantity}
        onChange={(event) => setQuantity(event.target.value)}
        className="app-input h-9 w-20 text-right tabular-nums"
        disabled={busy}
      />
      {changed && (
        <button type="button" onClick={() => actions.onUpdateQuantity(item, Number(quantity))} disabled={!valid || busy} className="app-button-secondary h-9 px-2 disabled:opacity-50" aria-label={`Guardar cantidad de ${item.description}`}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        </button>
      )}
    </span>
  );
}

function RemoveButton({ item, actions }: { item: SaleItem; actions: ItemActions }) {
  if (!actions.editable) return null;

  return (
    <button type="button" onClick={() => actions.onRemove(item)} disabled={actions.busyItemId !== null} className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-red-200 px-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50" aria-label={`Quitar ${item.description}`}>
      <Trash2 className="h-4 w-4" /><span className="sm:sr-only">Quitar</span>
    </button>
  );
}

/**
 * Fase 6.25: conceptos de la venta. Tarjetas por debajo de sm y tabla desde
 * sm, sin anchos mínimos. Los importes los calcula siempre el servidor.
 */
export default function SaleItems({ items, currency, taxRates, ...actions }: { items: SaleItem[]; currency: string; taxRates: TaxRate[] } & ItemActions) {
  if (items.length === 0) {
    return <p className="p-6 text-center text-sm text-[#64748B]">La venta todavía no tiene conceptos.</p>;
  }

  return (
    <>
      <ul className="divide-y divide-[#E2E8F0] sm:hidden" aria-label="Conceptos">
        {items.map((item) => (
          <li key={item.id} data-testid="sale-item-card" className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold text-[#0F172A]">{item.description}</p>
              <p className="shrink-0 font-bold tabular-nums">{formatInvoiceMoney(item.total, currency)}</p>
            </div>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <div><dt className="text-xs text-[#64748B]">Cantidad</dt><dd><QuantityEditor item={item} actions={actions} /></dd></div>
              <div><dt className="text-xs text-[#64748B]">Precio</dt><dd className="tabular-nums">{formatInvoiceMoney(item.unit_price, currency)}</dd></div>
              <div><dt className="text-xs text-[#64748B]">Impuesto</dt><dd>{taxName(item, taxRates)}</dd></div>
              <div><dt className="text-xs text-[#64748B]">Impuestos</dt><dd className="tabular-nums">{formatInvoiceMoney(item.tax_total, currency)}</dd></div>
            </dl>
            <RemoveButton item={item} actions={actions} />
          </li>
        ))}
      </ul>

      <div className="hidden sm:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-[#64748B]">
            <tr>
              <th scope="col" className="px-5 py-3">Concepto</th>
              <th scope="col" className="px-3 py-3 text-right">Cantidad</th>
              <th scope="col" className="px-3 py-3 text-right">Precio</th>
              <th scope="col" className="px-3 py-3">Impuesto</th>
              <th scope="col" className="px-3 py-3 text-right">Importe</th>
              {actions.editable && <th scope="col" className="px-5 py-3"><span className="sr-only">Acciones</span></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-5 py-3 font-medium text-[#0F172A]">{item.description}</td>
                <td className="px-3 py-3 text-right"><QuantityEditor item={item} actions={actions} /></td>
                <td className="px-3 py-3 text-right tabular-nums">{formatInvoiceMoney(item.unit_price, currency)}</td>
                <td className="px-3 py-3 text-[#475569]">{taxName(item, taxRates)}</td>
                <td className="px-3 py-3 text-right font-semibold tabular-nums">{formatInvoiceMoney(item.total, currency)}</td>
                {actions.editable && <td className="px-5 py-3 text-right"><RemoveButton item={item} actions={actions} /></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
