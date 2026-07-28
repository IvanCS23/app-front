import { API_URL } from "@/src/config/api";
import { getToken } from "@/src/services/auth.services";

export async function getInvoicesCount(): Promise<number> {
  const token = getToken();
  if (!token) throw new Error("No hay sesión activa");

  const res = await fetch(`${API_URL}/api/legacy-invoices`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Error al obtener las facturas");
  }

  const data = await res.json();
  return Array.isArray(data) ? data.length : 0;
}
