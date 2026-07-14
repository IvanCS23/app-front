import type { AuthCompany } from "@/src/services/auth.services";

export type UserRole = "admin" | "accountant" | "sales" | "employee";

export type UserStatus = "active" | "inactive" | "suspended";

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  role: UserRole;
  status: UserStatus;
  phone: string | null;
  position: string | null;
  branch: string | null;
  must_change_password: boolean;
  password_changed_at: string | null;
  last_login_at: string | null;
  created_at: string;
  company: AuthCompany | null;
}

export interface UserFormValues {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: UserRole | "";
  status: UserStatus;
  phone: string;
  position: string;
  branch: string;
  must_change_password: boolean;
  avatar: File | null;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedUsers {
  data: User[];
  meta: PaginationMeta;
}

export interface UserFilters {
  search: string;
  role: UserRole | "";
  status: UserStatus | "";
  page: number;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrador",
  accountant: "Contador",
  sales: "Vendedor",
  employee: "Empleado",
};

export const STATUS_LABELS: Record<UserStatus, string> = {
  active: "Activo",
  inactive: "Inactivo",
  suspended: "Suspendido",
};

export const STATUS_BADGE_CLASS: Record<UserStatus, string> = {
  active: "status-success",
  inactive: "status-neutral",
  suspended: "status-danger",
};
