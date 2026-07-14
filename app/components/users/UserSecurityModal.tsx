"use client";

import { useEffect, useState } from "react";
import { KeyRound, Loader2, LogOut, ShieldCheck, X } from "lucide-react";
import ChangePasswordModal from "@/app/components/users/ChangePasswordModal";
import ResetPasswordModal from "@/app/components/users/ResetPasswordModal";
import {
  changeUserPassword,
  resetUserPassword,
  revokeUserSessions,
  updateMustChangePassword,
} from "@/src/services/users";
import { ROLE_LABELS, STATUS_BADGE_CLASS, STATUS_LABELS, type User } from "@/src/types/user";

type UserSecurityModalProps = {
  user: User | null;
  onClose: () => void;
  onUserUpdated: (user: User) => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
};

function formatDateTime(value: string | null): string {
  if (!value) return "Nunca";
  return new Date(value).toLocaleString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function UserSecurityModal({
  user,
  onClose,
  onUserUpdated,
  onSuccess,
  onError,
}: UserSecurityModalProps) {
  const [localUser, setLocalUser] = useState<User | null>(user);
  const [isTogglingForce, setIsTogglingForce] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [isChangeOpen, setIsChangeOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  if (!localUser) return null;

  const applyUpdate = (updated: User) => {
    setLocalUser(updated);
    onUserUpdated(updated);
  };

  const handleToggleForceChange = async (checked: boolean) => {
    setIsTogglingForce(true);
    try {
      const updated = await updateMustChangePassword(localUser.id, checked);
      applyUpdate(updated);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Error al actualizar la política de contraseña");
    } finally {
      setIsTogglingForce(false);
    }
  };

  const handleRevokeSessions = async () => {
    setIsRevoking(true);
    try {
      await revokeUserSessions(localUser.id);
      onSuccess("Sesiones cerradas correctamente");
    } catch (err) {
      onError(err instanceof Error ? err.message : "Error al cerrar las sesiones");
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

        <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
            <h2 className="flex items-center gap-2 text-xl font-bold text-[#0F172A]">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              Seguridad
            </h2>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6 p-6">
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#0F172A]">
                Información
              </h3>
              <div className="space-y-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Nombre</span>
                  <span className="font-medium text-[#0F172A]">{localUser.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Correo</span>
                  <span className="font-medium text-[#0F172A]">{localUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Rol</span>
                  <span className="font-medium text-[#0F172A]">{ROLE_LABELS[localUser.role]}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#0F172A]">
                Seguridad
              </h3>
              <div className="space-y-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Último acceso</span>
                  <span className="font-medium text-[#0F172A]">
                    {formatDateTime(localUser.last_login_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Último cambio de contraseña</span>
                  <span className="font-medium text-[#0F172A]">
                    {formatDateTime(localUser.password_changed_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Estado</span>
                  <span className={STATUS_BADGE_CLASS[localUser.status]}>
                    {STATUS_LABELS[localUser.status]}
                  </span>
                </div>
              </div>

              <label className="mt-3 flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localUser.must_change_password}
                  onChange={(e) => handleToggleForceChange(e.target.checked)}
                  disabled={isTogglingForce}
                  className="h-4 w-4 rounded border-[#CBD5E1] text-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="text-sm text-[#475569]">
                  Obligar al usuario a cambiar su contraseña en el próximo inicio de sesión
                </span>
                {isTogglingForce && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />}
              </label>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={() => setIsChangeOpen(true)}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] transition-colors"
              >
                <KeyRound className="h-4 w-4" />
                Cambiar contraseña
              </button>
              <button
                onClick={() => setIsResetOpen(true)}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] transition-colors"
              >
                <KeyRound className="h-4 w-4" />
                Restablecer contraseña
              </button>
              <button
                onClick={handleRevokeSessions}
                disabled={isRevoking}
                className="sm:col-span-2 flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRevoking ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                Cerrar todas las sesiones activas
              </button>
            </div>
          </div>
        </div>
      </div>

      {isChangeOpen && (
        <ChangePasswordModal
          user={localUser}
          onClose={() => setIsChangeOpen(false)}
          onSubmit={async (id, values) => {
            const updated = await changeUserPassword(id, values);
            applyUpdate(updated);
          }}
          onSuccess={onSuccess}
          onError={onError}
        />
      )}

      {isResetOpen && (
        <ResetPasswordModal
          user={localUser}
          onClose={() => setIsResetOpen(false)}
          onSubmit={async (id, mustChangePassword) => {
            const result = await resetUserPassword(id, mustChangePassword);
            applyUpdate(result.user);
            return result.temporary_password;
          }}
          onError={onError}
        />
      )}
    </>
  );
}
