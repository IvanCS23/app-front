import { API_URL } from "@/src/config/api";
import type { FiscalIssue } from "@/src/types/sat";


export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("api_token");
}


export interface Client {
  id?: number;
  name: string;
  email: string;
  rfc: string;
  codigo_postal: string;
  regimen_fiscal: string;
  uso_cfdi: string;
  calle?: string;
  no_exterior?: string;
  no_interior?: string;
  colonia?: string;
  localidad?: string;
  municipio?: string;
  estado?: string;
  pais?: string;
  /** Fase 6.26: problemas SAT del cliente guardado (sólo lectura). */
  fiscal_issues?: FiscalIssue[];
}

export interface ClientListResponse {
  data: Client[];
}

/**
 * Obtener todos los clientes
 */
export async function getClients(): Promise<Client[]> {
  const token = getToken();
  
  if (!token) {
    throw new Error("No hay sesión activa");
  }

  const res = await fetch(`${API_URL}/api/clients`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const message = (data as ApiError)?.message ?? "Error al obtener clientes";
    throw new Error(message);
  }

  const response = await res.json();
  // Laravel resource collection devuelve { data: [...] }
  return Array.isArray(response) ? response : response.data;
}

/**
 * Crear un nuevo cliente
 */
export async function createClient(clientData: Client): Promise<Client> {
  const token = getToken();
  
  if (!token) {
    throw new Error("No hay sesión activa");
  }

  const res = await fetch(`${API_URL}/api/clients`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(clientData),
  });

  if (!res.ok) {
    const data = await res.json();
    const err = data as ApiError;
    const firstError = err.errors 
      ? Object.values(err.errors).flat()[0] 
      : err.message ?? "Error al crear cliente";
    throw new Error(firstError);
  }

  return res.json();
}

/**
 * Actualizar un cliente existente
 */
export async function updateClient(id: number, clientData: Partial<Client>): Promise<Client> {
  const token = getToken();
  
  if (!token) {
    throw new Error("No hay sesión activa");
  }

  const res = await fetch(`${API_URL}/api/clients/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(clientData),
  });

  if (!res.ok) {
    const data = await res.json();
    const err = data as ApiError;
    const firstError = err.errors 
      ? Object.values(err.errors).flat()[0] 
      : err.message ?? "Error al actualizar cliente";
    throw new Error(firstError);
  }

  return res.json();
}

/**
 * Eliminar un cliente
 */
export async function deleteClient(id: number): Promise<void> {
  const token = getToken();
  
  if (!token) {
    throw new Error("No hay sesión activa");
  }

  const res = await fetch(`${API_URL}/api/clients/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const message = (data as ApiError)?.message ?? "Error al eliminar cliente";
    throw new Error(message);
  }
}
