"use client";

import { useState } from "react";
import { Loader2, UserX, X } from "lucide-react";
import type { User } from "@/src/types/user";

type DeleteUserModalProps = {
  user: User | null;
  onClose: () => void;
  onConfirm: (id: number) => Promise<void>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
};

export default function DeleteUserModal({
  user,
  onClose,
  onConfirm,
  onSuccess,
  onError,
}: DeleteUserModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!user) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(user.id);
      onSuccess(`El usuario "${user.name}" fue desactivado`);
      onClose();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Error al desactivar usuario");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative max-w-md w-full rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
          <h2 className="text-xl font-bold text-[#0F172A]">Desactivar usuario</h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50">
              <UserX className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="font-medium text-[#0F172A]">
                ¿Deseas desactivar a &ldquo;{user.name}&rdquo;?
              </p>
              <p className="mt-1 text-sm text-[#64748B]">
                El usuario no podrá iniciar sesión hasta que sea reactivado. Sus datos no se eliminarán.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl border border-[#E2E8F0] bg-white px-6 py-2 font-medium text-[#475569] transition-colors duration-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 rounded-xl bg-red-500 px-6 py-2 font-medium text-white shadow-[0_10px_30px_rgba(255,0,0,0.25)] transition-colors duration-200 hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Desactivando...
              </>
            ) : (
              "Desactivar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
