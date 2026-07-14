"use client";

import { Pencil, ShieldCheck, Trash, UserRoundX } from "lucide-react";
import UserAvatar from "@/app/components/users/UserAvatar";
import {
  ROLE_LABELS,
  STATUS_BADGE_CLASS,
  STATUS_LABELS,
  type User,
} from "@/src/types/user";

type UsersTableProps = {
  users: User[];
  isLoading: boolean;
  hasFilters: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onSecurity: (user: User) => void;
  onCreateClick: () => void;
};

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function SkeletonRow() {
  return (
    <tr className="border-t border-[#F1F5F9]">
      <td className="p-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
          <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
        </div>
      </td>
      <td className="p-3"><div className="h-3 w-40 animate-pulse rounded bg-slate-200" /></td>
      <td className="p-3"><div className="h-3 w-20 animate-pulse rounded bg-slate-200" /></td>
      <td className="p-3"><div className="h-3 w-20 animate-pulse rounded bg-slate-200" /></td>
      <td className="p-3"><div className="h-5 w-16 animate-pulse rounded-full bg-slate-200" /></td>
      <td className="p-3"><div className="h-3 w-20 animate-pulse rounded bg-slate-200" /></td>
      <td className="p-3"><div className="h-4 w-14 animate-pulse rounded bg-slate-200" /></td>
    </tr>
  );
}

export default function UsersTable({
  users,
  isLoading,
  hasFilters,
  onEdit,
  onDelete,
  onSecurity,
  onCreateClick,
}: UsersTableProps) {
  return (
    <div className="app-table-wrap">
      <table className="app-table w-full text-sm">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Sucursal</th>
            <th>Estado</th>
            <th>Fecha de creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-12">
                <div className="flex flex-col items-center justify-center gap-3 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                    <UserRoundX className="h-8 w-8 text-blue-400" />
                  </div>
                  <p className="font-semibold text-[#0F172A]">
                    {hasFilters
                      ? "No se encontraron usuarios con esos filtros"
                      : "No hay usuarios registrados"}
                  </p>
                  {!hasFilters && (
                    <button onClick={onCreateClick} className="app-button-primary mt-2">
                      Crear usuario
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <UserAvatar name={user.name} avatar={user.avatar} size="sm" />
                    <span className="font-semibold text-[#0F172A]">{user.name}</span>
                  </div>
                </td>
                <td className="text-[#475569]">{user.email}</td>
                <td className="text-[#475569]">{ROLE_LABELS[user.role]}</td>
                <td className="text-[#475569]">{user.branch || "—"}</td>
                <td>
                  <span className={STATUS_BADGE_CLASS[user.status]}>
                    {STATUS_LABELS[user.status]}
                  </span>
                </td>
                <td className="text-[#475569]">{formatDate(user.created_at)}</td>
                <td>
                  <div className="flex gap-3">
                    <button
                      onClick={() => onEdit(user)}
                      className="text-[#94A3B8] hover:text-blue-600 transition-colors"
                      title="Editar usuario"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onSecurity(user)}
                      className="text-[#94A3B8] hover:text-blue-600 transition-colors"
                      title="Seguridad"
                    >
                      <ShieldCheck className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      className="text-[#94A3B8] hover:text-red-500 transition-colors"
                      title="Desactivar usuario"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
