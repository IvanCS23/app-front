"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import AuthCard from "@/app/components/auth/AuthCard";
import { AccountFormError, forgotPasswordRequest } from "@/src/services/auth.services";

/**
 * Fase 6.32: pedir un enlace para restablecer la contraseña. La respuesta es
 * la misma exista o no el correo (y para una cuenta inactiva), así que la
 * pantalla nunca dice si el correo está registrado.
 */
export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setEmailError(null);
    setSending(true);

    try {
      setSentMessage(await forgotPasswordRequest(email.trim()));
    } catch (caught: unknown) {
      if (caught instanceof AccountFormError && caught.errors.email?.[0]) {
        setEmailError(caught.errors.email[0]);
      } else {
        setError(caught instanceof Error ? caught.message : "No se pudo enviar el enlace. Intenta de nuevo más tarde.");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <AuthCard
      title="Recuperar contraseña"
      description="Escribe el correo de tu cuenta y te enviaremos un enlace para elegir una contraseña nueva. El enlace vence en 30 minutos."
      footer={
        <Link href="/login" className="font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
          Volver a iniciar sesión
        </Link>
      }
    >
      {sentMessage ? (
        <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {sentMessage}
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {error && (
            <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#0F172A]">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="nombre@empresa.com"
              className="box box-input rounded-xl"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={emailError ? true : undefined}
              aria-describedby={emailError ? "email-error" : undefined}
              disabled={sending}
              required
            />
            {emailError && (
              <p id="email-error" className="mt-1.5 text-xs text-red-600">
                {emailError}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={sending || email.trim() === ""}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-[#2563EB] text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? "Enviando…" : "Enviar enlace"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
