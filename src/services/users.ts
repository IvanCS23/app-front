import { API_URL } from "@/src/config/api";
import { getToken } from "@/src/services/auth.services";
import type {
  PaginatedUsers,
  User,
  UserFilters,
} from "@/src/types/user";

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export class ValidationError extends Error {
  errors: Record<string, string[]>;

  constructor(message: string, errors: Record<string, string[]>) {
    super(message);
    this.name = "ValidationError";
    this.errors = errors;
  }
}

async function parseErrorResponse(res: Response, fallback: string): Promise<never> {
  const data = await res.json().catch(() => null);
  const err = data as ApiError | null;

  if (res.status === 422 && err?.errors) {
    throw new ValidationError(err.message ?? fallback, err.errors);
  }

  throw new Error(err?.message ?? fallback);
}

function authHeaders(): HeadersInit {
  const token = getToken();
  if (!token) {
    throw new Error("No hay sesión activa");
  }
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
}

function jsonAuthHeaders(): HeadersInit {
  return {
    ...authHeaders(),
    "Content-Type": "application/json",
  };
}

export async function getUsers(filters: Partial<UserFilters> = {}): Promise<PaginatedUsers> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.role) params.set("role", filters.role);
  if (filters.status) params.set("status", filters.status);
  if (filters.page) params.set("page", String(filters.page));

  const res = await fetch(`${API_URL}/api/users?${params.toString()}`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) {
    await parseErrorResponse(res, "Error al obtener usuarios");
  }

  return res.json();
}

function buildUserFormData(values: {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  role: string;
  status: string;
  phone: string;
  position: string;
  branch: string;
  must_change_password?: boolean;
  avatar: File | null;
}): FormData {
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("email", values.email);
  formData.append("role", values.role);
  formData.append("status", values.status);
  if (values.password) formData.append("password", values.password);
  if (values.password_confirmation) {
    formData.append("password_confirmation", values.password_confirmation);
  }
  if (values.phone) formData.append("phone", values.phone);
  if (values.position) formData.append("position", values.position);
  if (values.branch) formData.append("branch", values.branch);
  if (values.must_change_password !== undefined) {
    formData.append("must_change_password", values.must_change_password ? "1" : "0");
  }
  if (values.avatar) formData.append("avatar", values.avatar);
  return formData;
}

export async function createUser(values: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
  status: string;
  phone: string;
  position: string;
  branch: string;
  must_change_password: boolean;
  avatar: File | null;
}): Promise<User> {
  const formData = buildUserFormData(values);

  const res = await fetch(`${API_URL}/api/users`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });

  if (!res.ok) {
    await parseErrorResponse(res, "Error al crear usuario");
  }

  const data = await res.json();
  return data.user as User;
}

export async function updateUser(
  id: number,
  values: {
    name: string;
    email: string;
    role: string;
    status: string;
    phone: string;
    position: string;
    branch: string;
    avatar: File | null;
  }
): Promise<User> {
  const formData = buildUserFormData(values);
  formData.append("_method", "PUT");

  const res = await fetch(`${API_URL}/api/users/${id}`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });

  if (!res.ok) {
    await parseErrorResponse(res, "Error al actualizar usuario");
  }

  const data = await res.json();
  return data.user as User;
}

export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    await parseErrorResponse(res, "Error al desactivar usuario");
  }
}

export async function changeUserPassword(
  id: number,
  values: { password: string; password_confirmation: string; must_change_password: boolean }
): Promise<User> {
  const res = await fetch(`${API_URL}/api/users/${id}/password`, {
    method: "PATCH",
    headers: jsonAuthHeaders(),
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    await parseErrorResponse(res, "Error al cambiar la contraseña");
  }

  const data = await res.json();
  return data.user as User;
}

export async function resetUserPassword(
  id: number,
  mustChangePassword: boolean
): Promise<{ user: User; temporary_password: string }> {
  const res = await fetch(`${API_URL}/api/users/${id}/password/reset`, {
    method: "POST",
    headers: jsonAuthHeaders(),
    body: JSON.stringify({ must_change_password: mustChangePassword }),
  });

  if (!res.ok) {
    await parseErrorResponse(res, "Error al restablecer la contraseña");
  }

  return res.json();
}

export async function revokeUserSessions(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/users/${id}/sessions/revoke`, {
    method: "POST",
    headers: authHeaders(),
  });

  if (!res.ok) {
    await parseErrorResponse(res, "Error al cerrar las sesiones");
  }
}

export async function updateMustChangePassword(id: number, value: boolean): Promise<User> {
  const res = await fetch(`${API_URL}/api/users/${id}/must-change-password`, {
    method: "PATCH",
    headers: jsonAuthHeaders(),
    body: JSON.stringify({ must_change_password: value }),
  });

  if (!res.ok) {
    await parseErrorResponse(res, "Error al actualizar la política de contraseña");
  }

  const data = await res.json();
  return data.user as User;
}
