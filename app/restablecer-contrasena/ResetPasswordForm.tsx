"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import AuthCard from "@/app/components/auth/AuthCard";
import PasswordField from "@/app/components/auth/PasswordField";
import { PASSWORD_HINT } from "@/app/components/auth/ChangePasswordForm";
import { AccountFormError, clearSession, resetPasswordRequest } from "@/src/services/auth.services";

export const INCOMPLETE_LINK_MESSAGE = "El enlace no es válido o está incompleto. Solicita uno nuevo.";

export interface ResetLink {
  token: string;
  email: string;
}

/** Fase 6.32 (D2): `#token=…&email=…`, tal como lo arma Laravel. */
export function readResetLink(hash: string): ResetLink | null {
  const params = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
  const token = params.get("token")?.trim() ?? "";
  const email = params.get("email")?.trim() ?? "";

  return token !== "" && email !== "" ? { token, email } : null;
}

/** Quita el `#…` de la barra de direcciones y del historial, sin recargar. */
export function clearLinkFromAddressBar(): void {
  if (window.location.hash === "") return;
  window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
}

type FieldErrors = Partial<Record<"password" | "password_confirmation", string>>;

export default function ResetPasswordForm() {
  // Se lee una sola vez al montar; el efecto borra el token de la URL.
  const [link] = useState<ResetLink | null>(() => readResetLink(window.location.hash));
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [linkError, setLinkError] = useState<string | null>(link ? null : INCOMPLETE_LINK_MESSAGE);
  const [error, setError] = useState<string | null>(null);
  const [doneMessage, setDoneMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    clearLinkFromAddressBar();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!link) return;

    setError(null);
    setFieldErrors({});

    if (password !== confirmation) {
      setFieldErrors({ password_confirmation: "La confirmación no coincide con la contraseña nueva." });
      return;
    }

    setSaving(true);

    try {
      const message = await resetPasswordRequest({ ...link, password, password_confirmation: confirmation });
      // El token del API de este navegador (si había uno) ya no sirve.
      clearSession();
      setPassword("");
      setConfirmation("");
      setDoneMessage(message);
    } catch (caught: unknown) {
      if (caught instanceof AccountFormError && (caught.errors.password || caught.errors.password_confirmation)) {
        setFieldErrors({ password: caught.errors.password?.[0], password_confirmation: caught.errors.password_confirmation?.[0] });
      } else if (caught instanceof AccountFormError && caught.status === 422) {
        // Enlace vencido, ya usado, ajeno o de una cuenta inactiva.
        setLinkError(caught.message);
      } else {
        setError(caught instanceof Error ? caught.message : "No se pudo restablecer la contraseña.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (doneMessage) {
    return (
      <AuthCard title="Contraseña restablecida">
        <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {doneMessage}
        </div>
        <Link
          href="/login"
          className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-[#2563EB] text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8]"
        >
          Ir a iniciar sesión
        </Link>
      </AuthCard>
    );
  }

  if (linkError || !link) {
    return (
      <AuthCard title="Restablecer contraseña">
        <div role="alert" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {linkError ?? INCOMPLETE_LINK_MESSAGE}
        </div>
        <Link
          href="/recuperar-contrasena"
          className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-[#2563EB] text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8]"
        >
          Solicitar un enlace nuevo
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Restablecer contraseña"
      description={<>Elige una contraseña nueva para <span className="font-medium text-[#0F172A]">{link.email}</span>.</>}
      footer={
        <Link href="/login" className="font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
          Volver a iniciar sesión
        </Link>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {error && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
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
          disabled={saving || password === "" || confirmation === ""}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-[#2563EB] text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Guardando…" : "Restablecer contraseña"}
        </button>
      </form>
    </AuthCard>
  );
}
