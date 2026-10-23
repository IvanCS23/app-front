"use client";

import { useEffect, useState } from "react";
import { getUsers } from "@/src/services/users";
import { getInvoices } from "@/src/services/invoice.services";

export function useSettingsStats() {
  const [usersCount, setUsersCount] = useState<number | null>(null);
  const [invoicesCount, setInvoicesCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // Fase 6.24: "Facturas emitidas" cuenta facturas reales en ERP issued
    // (meta.total de GET /api/invoices), no el arreglo de /api/legacy-invoices.
    Promise.allSettled([getUsers({ page: 1 }), getInvoices({ status: "issued", per_page: 10 })]).then(([usersRes, invoicesRes]) => {
      if (cancelled) return;
      if (usersRes.status === "fulfilled") setUsersCount(usersRes.value.meta.total);
      if (invoicesRes.status === "fulfilled") setInvoicesCount(invoicesRes.value.meta.total);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { usersCount, invoicesCount, isLoading };
}
