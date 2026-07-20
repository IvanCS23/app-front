"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import AppLayout from "@/app/components/layout/AppLayout";
import Toast, { type ToastData } from "@/app/components/ui/Toast";
import CreateUserModal from "@/app/components/users/CreateUserModal";
import EditUserModal from "@/app/components/users/EditUserModal";
import DeleteUserModal from "@/app/components/users/DeleteUserModal";
import UserSecurityModal from "@/app/components/users/UserSecurityModal";
import UsersTable from "@/app/components/users/UsersTable";
import { useUsers } from "@/src/hooks/useUsers";
import { ROLE_LABELS, STATUS_LABELS, type User } from "@/src/types/user";

const selectStyle =
  "w-44 h-11 rounded-lg border-[1.5px] border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition-colors [color-scheme:light] hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 cursor-pointer";
const inputStyle =
  "w-full h-11 rounded-lg border-[1.5px] border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition-colors [color-scheme:light] placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10";

export default function UsuariosPage() {
  const {
    users,
    meta,
    isLoading,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    hasFilters,
    create,
    update,
    remove,
    patchUser,
  } = useUsers();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [securityUser, setSecurityUser] = useState<User | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);

  const showSuccess = (message: string) => setToast({ message, type: "success" });
  const showError = (message: string) => setToast({ message, type: "error" });

  return (
    <AppLayout>
      <div className="app-page p-3 rounded-lg">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-[#0F172A]">Usuarios</h1>
          <p className="text-[#64748B]">Administra los usuarios de la empresa.</p>
        </div>

        <div className="app-card p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="app-button-primary sm:w-auto w-full"
            >
              <Plus className="h-4 w-4" />
              Nuevo usuario
            </button>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar usuario..."
                  className={`${inputStyle} pl-9`}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className={selectStyle}
              >
                <option value="">Estado: Todos</option>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
                className={selectStyle}
              >
                <option value="">Rol: Todos</option>
                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <UsersTable
            users={users}
            isLoading={isLoading}
            hasFilters={hasFilters}
            onEdit={setEditingUser}
            onDelete={setDeletingUser}
            onSecurity={setSecurityUser}
            onCreateClick={() => setIsCreateOpen(true)}
          />

          {!isLoading && meta.total > 0 && (
            <div className="flex flex-col gap-3 pt-4 text-sm text-[#64748B] sm:flex-row sm:items-center sm:justify-between">
              <span>
                Mostrando {users.length} de {meta.total} usuarios
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={meta.current_page === 1}
                  className="app-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="flex items-center px-2">
                  Página {meta.current_page} de {meta.last_page}
                </span>
                <button
                  onClick={() => setPage(Math.min(meta.last_page, page + 1))}
                  disabled={meta.current_page === meta.last_page}
                  className="app-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateUserModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={create}
        onSuccess={showSuccess}
        onError={showError}
      />

      <EditUserModal
        isOpen={editingUser !== null}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSubmit={update}
        onSuccess={showSuccess}
        onError={showError}
      />

      <DeleteUserModal
        user={deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={remove}
        onSuccess={showSuccess}
        onError={showError}
      />

      <UserSecurityModal
        user={securityUser}
        onClose={() => setSecurityUser(null)}
        onUserUpdated={patchUser}
        onSuccess={showSuccess}
        onError={showError}
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </AppLayout>
  );
}
