"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import AppLayout from "@/app/components/layout/AppLayout";
import SaleEditor from "@/app/components/sales/SaleEditor";

/** Fase 6.25: editar la venta (borrador o pendiente), ver su estado y facturarla. */
export default function SalePage() {
  const params = useParams<{ id: string }>();
  const saleId = Number(params.id);

  if (!Number.isInteger(saleId) || saleId <= 0) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-xl py-16 text-center">
          <h1 className="text-xl font-bold text-red-700">El identificador de venta no es válido.</h1>
          <Link href="/pages/sales" className="app-button-secondary mt-6">Volver a ventas</Link>
        </div>
      </AppLayout>
    );
  }

  return <SaleEditor key={saleId} saleId={saleId} />;
}
