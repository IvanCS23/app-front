"use client";

import { useState, type FormEvent } from "react";
import PasswordField from "@/app/components/auth/PasswordField";
import { useAuth } from "@/src/hooks/useAuth";
import { AccountFormError } from "@/src/services/auth.services";
import { PASSWORD_HINT } from "@/src/lib/passwordRules";

export const PASSWORD_CHANGED_MESSAGE = "Tu contraseña se actualizó. Se cerraron las demás sesiones abiertas con tu cuenta.";

type FieldErrors = Partial<Record<"current_password" | "password" | "password_confirmation", string>>;

type ChangePasswordFormProps = {
  /** Se llama después de guardar (el token nuevo ya quedó guardado). */
  onChanged?: () => void;
};

/**
 * Fase 6.32: cambiar la propia contraseña con la actual (PUT
 * /api/me/password). Cualquier rol. Los errores por campo vienen de Laravel.
 */
export default function ChangePasswordForm({ onChanged }: ChangePasswordFormProps) {
  const { changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setSuccess(false);

    if (password !== confirmation) {
      setFieldErrors({ password_confirmation: "La confirmación no coincide con la contraseña nueva." });
      return;
    }

    setSaving(true);

    try {
      await changePassword({ current_password: currentPassword, password, password_confirmation: confirmation });
      setCurrentPassword("");
      setPassword("");
      setConfirmation("");
      setSuccess(true);
      onChanged?.();
    } catch (caught: unknown) {
      if (caught instanceof AccountFormError && caught.status === 422 && Object.keys(caught.errors).length > 0) {
        setFieldErrors({
          current_password: caught.errors.current_password?.[0],
          password: caught.errors.password?.[0],
          password_confirmation: caught.errors.password_confirmation?.[0],
        });
      } else {
        setError(caught instanceof Error ? caught.message : "No se pudo cambiar la contraseña.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {success && (
        <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {PASSWORD_CHANGED_MESSAGE}
        </div>
      )}

      <PasswordField
        id="current_password"
        label="Contraseña actual"
        value={currentPassword}
        onChange={setCurrentPassword}
        autoComplete="current-password"
        error={fieldErrors.current_password}
        disabled={saving}
      />
      <PasswordField
        id="password"
        label="Contraseña nueva"
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        error={fieldErrors.password}
        hint={PASSWORD_HINT}
        disabled={saving}
      />
      <PasswordField
        id="password_confirmation"
        label="Confirmar contraseña nueva"
        value={confirmation}
        onChange={setConfirmation}
        autoComplete="new-password"
        error={fieldErrors.password_confirmation}
        disabled={saving}
      />

      <button
        type="submit"
        disabled={saving || currentPassword === "" || password === "" || confirmation === ""}
        className="flex h-12 w-full items-center justify-center rounded-xl bg-[#2563EB] text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Guardando…" : "Cambiar contraseña"}
      </button>
    </form>
  );
}
