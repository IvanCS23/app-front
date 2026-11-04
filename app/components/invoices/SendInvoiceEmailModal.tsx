"use client";

import { useState } from "react";
import { AlertTriangle, Plus, X } from "lucide-react";
import FiscalActionModal from "./FiscalActionModal";
import { isEmailAddress } from "@/src/lib/email";

/**
 * Fase 6.30 — Envío (o reenvío) del CFDI por correo. Parte de los
 * destinatarios del cliente; Admin y Contador pueden agregar o quitar,
 * Ventas sólo ve la lista. El backend vuelve a validar todo.
 */
export interface SendInvoiceEmailModalProps {
  open: boolean;
  resend: boolean;
  defaultRecipients: string[];
  maxRecipients: number;
  canEdit: boolean;
  testMode: boolean;
  canceled: boolean;
  busy: boolean;
  onClose: () => void;
  /** null = los del cliente, sin cambios (lo que puede usar Ventas). */
  onConfirm: (recipients: string[] | null) => void;
}

function sameRecipients(a: string[], b: string[]): boolean {
  const normalize = (list: string[]) => list.map((email) => email.toLowerCase()).sort().join("|");
  return normalize(a) === normalize(b);
}

export default function SendInvoiceEmailModal(props: SendInvoiceEmailModalProps) {
  // El componente se monta al abrir: la lista arranca de los destinatarios por defecto.
  if (!props.open) return null;
  return <SendInvoiceEmailModalContent {...props} />;
}

function SendInvoiceEmailModalContent({ resend, defaultRecipients, maxRecipients, canEdit, testMode, canceled, busy, onClose, onConfirm }: SendInvoiceEmailModalProps) {
  const [recipients, setRecipients] = useState<string[]>(defaultRecipients);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  const full = recipients.length >= maxRecipients;

  const add = () => {
    const email = draft.trim();
    if (!email) return;
    if (!isEmailAddress(email)) return setError("Escribe un correo válido.");
    if (recipients.some((current) => current.toLowerCase() === email.toLowerCase())) return setError("Ese correo ya está en la lista.");
    if (full) return setError(`Puedes enviar a un máximo de ${maxRecipients} destinatarios.`);
    setRecipients([...recipients, email]);
    setDraft("");
    setError(null);
  };

  const remove = (email: string) => {
    setRecipients(recipients.filter((current) => current !== email));
    setError(null);
  };

  const title = resend ? "Reenviar por correo" : "Enviar por correo";

  return (
    <FiscalActionModal
      open
      title={title}
      confirmLabel={title}
      busyLabel="Enviando correo..."
      busy={busy}
      confirmDisabled={recipients.length === 0}
      onClose={onClose}
      onConfirm={() => onConfirm(canEdit && !sameRecipients(recipients, defaultRecipients) ? recipients : null)}
    >
      <p>El proveedor fiscal enviará el XML y el PDF del CFDI a:</p>

      {testMode && (
        <p role="alert" className="flex gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span><span className="font-semibold">Modo de pruebas:</span> el correo se envía de verdad a estas direcciones. Usa sólo correos propios o de prueba.</span>
        </p>
      )}
      {canceled && <p className="rounded-lg bg-[#F8FAFC] p-3 text-[#0F172A]">Este CFDI está cancelado. El cliente recibirá el XML y el PDF del comprobante cancelado; el acuse de cancelación no se incluye.</p>}

      {recipients.length === 0 ? (
        <p className="text-[#64748B]">{canEdit ? "Agrega al menos un destinatario." : "El cliente no tiene un correo registrado. Pide a un administrador o contador que lo agregue en Clientes."}</p>
      ) : (
        <ul aria-label="Destinatarios" className="space-y-2">
          {recipients.map((email) => (
            <li key={email} className="flex items-center justify-between gap-3 rounded-lg border border-[#E2E8F0] px-3 py-2">
              <span className="break-all font-medium text-[#0F172A]">{email}</span>
              {canEdit && (
                <button type="button" onClick={() => remove(email)} disabled={busy} aria-label={`Quitar ${email}`} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-red-600 disabled:opacity-50">
                  <X className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {canEdit ? (
        <div>
          <label htmlFor="email-recipient" className="mb-2 block text-sm font-semibold text-[#0F172A]">Agregar destinatario</label>
          <div className="flex gap-2">
            <input
              id="email-recipient"
              type="email"
              value={draft}
              onChange={(event) => { setDraft(event.target.value); setError(null); }}
              onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); add(); } }}
              disabled={busy || full}
              placeholder="correo@ejemplo.com"
              className="app-input min-w-0 flex-1"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "email-recipient-error" : undefined}
            />
            <button type="button" onClick={add} disabled={busy || full || !draft.trim()} className="app-button-secondary"><Plus className="h-4 w-4" />Agregar</button>
          </div>
          {error && <p id="email-recipient-error" className="mt-2 text-xs text-red-600">{error}</p>}
          <p className="mt-2 text-xs text-[#64748B]">Máximo {maxRecipients} destinatarios. Los cambios sólo aplican a este envío; los correos del cliente se editan en Clientes.</p>
        </div>
      ) : (
        <p className="text-xs text-[#64748B]">Se usan los correos registrados del cliente. Para cambiarlos, pide a un administrador o contador que los edite en Clientes.</p>
      )}
    </FiscalActionModal>
  );
}
