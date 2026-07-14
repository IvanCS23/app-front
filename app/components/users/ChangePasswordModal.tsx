"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { ValidationError } from "@/src/services/users";
import type { User } from "@/src/types/user";

const inputStyle = "box box-input";

type ChangePasswordModalProps = {
  user: User | null;
  onClose: () => void;
  onSubmit: (
    id: number,
    values: { password: string; password_confirmation: string; must_change_password: boolean }
  ) => Promise<void>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
};

export default function ChangePasswordModal({
  user,
  onClose,
  onSubmit,
  onSuccess,
  onError,
}: ChangePasswordModalProps) {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(true);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setPassword("");
      setPasswordConfirmation("");
      setShowPassword(false);
      setMustChangePassword(true);
      setErrors({});
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = async () => {
    setErrors({});
    setIsSaving(true);
    try {
      await onSubmit(user.id, {
        password,
        password_confirmation: passwordConfirmation,
        must_change_password: mustChangePassword,
      });
      onSuccess("Contraseña actualizada correctamente");
      onClose();
    } catch (err) {
      if (err instanceof ValidationError) {
        setErrors(err.errors);
      } else {
        onError(err instanceof Error ? err.message : "Error al actualizar la contraseña");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
          <h2 className="text-xl font-bold text-[#0F172A]">Cambiar contraseña</h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <p className="text-sm text-[#64748B]">
            Estableciendo una nueva contraseña para <strong>{user.name}</strong>.
          </p>

          <div>
            <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-[#475569]">
              Nueva contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              className={inputStyle}
              disabled={isSaving}
            />
            {errors.password && (
              <p className="mt-1 text-xs font-medium text-red-500">{errors.password[0]}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-[#475569]">
              Confirmar contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Repita la contraseña"
              className={inputStyle}
              disabled={isSaving}
            />
            {errors.password_confirmation && (
              <p className="mt-1 text-xs font-medium text-red-500">
                {errors.password_confirmation[0]}
              </p>
            )}
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="h-4 w-4 rounded border-[#CBD5E1] text-blue-600 focus:ring-2 focus:ring-blue-500/20"
            />
            <span className="text-sm text-[#475569]">Mostrar contraseña</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={mustChangePassword}
              onChange={(e) => setMustChangePassword(e.target.checked)}
              className="h-4 w-4 rounded border-[#CBD5E1] text-blue-600 focus:ring-2 focus:ring-blue-500/20"
            />
            <span className="text-sm text-[#475569]">
              Obligar cambio de contraseña al iniciar sesión
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-4 border-t border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="rounded-xl border border-[#E2E8F0] bg-white px-6 py-2 font-medium text-[#475569] transition-colors duration-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-2 font-medium text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition-colors duration-200 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Actualizando...
              </>
            ) : (
              "Actualizar contraseña"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
