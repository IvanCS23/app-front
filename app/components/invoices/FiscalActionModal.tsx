"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

interface FiscalActionModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  busyLabel: string;
  busy: boolean;
  confirmDisabled?: boolean;
  destructive?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function FiscalActionModal({
  open,
  title,
  children,
  confirmLabel,
  busyLabel,
  busy,
  confirmDisabled = false,
  destructive = false,
  onClose,
  onConfirm,
}: FiscalActionModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef(onClose);
  const busyRef = useRef(busy);

  useEffect(() => {
    closeRef.current = onClose;
    busyRef.current = busy;
  }, [busy, onClose]);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busyRef.current) closeRef.current();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="presentation">
      <button className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" aria-label="Cerrar modal" onClick={onClose} disabled={busy} />
      <section role="dialog" aria-modal="true" aria-labelledby="fiscal-modal-title" className="modal-card relative w-full max-w-lg overflow-hidden">
        <header className="modal-header flex items-center justify-between px-5 py-4 sm:px-6">
          <h2 id="fiscal-modal-title" className="text-lg font-bold text-[#0F172A]">{title}</h2>
          <button type="button" aria-label="Cerrar" onClick={onClose} disabled={busy} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50">
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="space-y-4 px-5 py-5 text-sm text-[#475569] sm:px-6">{children}</div>
        <footer className="modal-footer flex flex-col-reverse gap-3 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button ref={cancelRef} type="button" onClick={onClose} disabled={busy} className="app-button-secondary disabled:opacity-50">Cancelar</button>
          <button type="button" onClick={onConfirm} disabled={busy || confirmDisabled} className={destructive ? "inline-flex h-10 items-center justify-center rounded-[0.625rem] bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50" : "app-button-primary"}>
            {busy ? busyLabel : confirmLabel}
          </button>
        </footer>
      </section>
    </div>
  );
}
