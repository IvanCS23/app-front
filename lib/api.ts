
// ESTE ARCHIVO FUE EL PRIMERO DE MUESTRA YA NO SE USA PERO LO DEJO POR SI LLEGA A ROMPER EL OTRO

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export async function loginRequest(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const err = data as ApiError | null;
    const firstError =
      err?.errors?.email?.[0] ??
      err?.errors?.password?.[0] ??
      err?.message ??
      "Error al iniciar sesión.";
    throw new Error(firstError);
  }

  return data as LoginResponse;
}

export async function logoutRequest(token: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const message =
      (data as ApiError)?.message ?? "No se pudo cerrar sesión.";
    throw new Error(message);
  }
}

export function saveSession(token: string, user: AuthUser): void {
  localStorage.setItem("api_token", token);
  localStorage.setItem("auth_user", JSON.stringify(user));
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("api_token");
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("auth_user");
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

export function clearSession(): void {
  localStorage.removeItem("api_token");
  localStorage.removeItem("auth_user");
}




                     // ESTA PARTE ES DEL CLIENTE

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
