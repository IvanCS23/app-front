"use client";

import { useEffect, useState } from "react";
import { Check, Copy, KeyRound, Loader2, X } from "lucide-react";
import type { User } from "@/src/types/user";

type ResetPasswordModalProps = {
  user: User | null;
  onClose: () => void;
  onSubmit: (id: number, mustChangePassword: boolean) => Promise<string>;
  onError: (message: string) => void;
};

export default function ResetPasswordModal({
  user,
  onClose,
  onSubmit,
  onError,
}: ResetPasswordModalProps) {
  const [mustChangePassword, setMustChangePassword] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      setMustChangePassword(true);
      setTemporaryPassword(null);
      setCopied(false);
    }
  }, [user]);

  if (!user) return null;

  const handleClose = () => {
    setTemporaryPassword(null);
    onClose();
  };

  const handleReset = async () => {
    setIsSaving(true);
    try {
      const temp = await onSubmit(user.id, mustChangePassword);
      setTemporaryPassword(temp);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Error al restablecer la contraseña");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async () => {
    if (!temporaryPassword) return;
    await navigator.clipboard.writeText(temporaryPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
          <h2 className="text-xl font-bold text-[#0F172A]">Restablecer contraseña</h2>
          <button
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {temporaryPassword ? (
          <>
            <div className="space-y-4 p-6">
              <p className="text-sm text-[#64748B]">
                Comparte esta contraseña temporal con <strong>{user.name}</strong>. No podrás
                volver a verla después de cerrar esta ventana.
              </p>
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-[#475569]">
                  Nueva contraseña temporal
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 font-mono text-sm text-[#0F172A]">
                    {temporaryPassword}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#475569] hover:bg-[#F8FAFC] transition-colors"
                    title="Copiar"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end border-t border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
              <button
                onClick={handleClose}
                className="rounded-xl bg-blue-500 px-6 py-2 font-medium text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition-colors duration-200 hover:bg-blue-400"
              >
                Listo
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-50">
                  <KeyRound className="h-6 w-6 text-amber-500" />
                </div>
                <p className="text-sm text-[#475569]">
                  Se generará una contraseña temporal aleatoria para{" "}
                  <strong>{user.name}</strong> y se cerrará su sesión actual.
                </p>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mustChangePassword}
                  onChange={(e) => setMustChangePassword(e.target.checked)}
                  className="h-4 w-4 rounded border-[#CBD5E1] text-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="text-sm text-[#475569]">Obligar cambio al iniciar sesión</span>
              </label>
            </div>

            <div className="flex justify-end gap-4 border-t border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
              <button
                onClick={handleClose}
                disabled={isSaving}
                className="rounded-xl border border-[#E2E8F0] bg-white px-6 py-2 font-medium text-[#475569] transition-colors duration-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                onClick={handleReset}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-2 font-medium text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition-colors duration-200 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Restableciendo...
                  </>
                ) : (
                  "Restablecer"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
