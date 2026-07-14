"use client";

import { useEffect, useState } from "react";
import { getUsers } from "@/src/services/users";
import { getInvoicesCount } from "@/src/services/invoices.services";

export function useSettingsStats() {
  const [usersCount, setUsersCount] = useState<number | null>(null);
  const [invoicesCount, setInvoicesCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([getUsers({ page: 1 }), getInvoicesCount()]).then(([usersRes, invoicesRes]) => {
      if (cancelled) return;
      if (usersRes.status === "fulfilled") setUsersCount(usersRes.value.meta.total);
      if (invoicesRes.status === "fulfilled") setInvoicesCount(invoicesRes.value);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { usersCount, invoicesCount, isLoading };
}
