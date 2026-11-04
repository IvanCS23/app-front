"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, Loader2, Mail } from "lucide-react";
import AppLayout from "@/app/components/layout/AppLayout";
import Toast, { type ToastData } from "@/app/components/ui/Toast";
import { getCompanyEmailSettings, updateCompanyEmailSettings } from "@/src/services/company.services";
import type { CompanyEmailSettings } from "@/src/types/company";

/**
 * Fase 6.30 — Envío de facturas por correo. Facturapi envía el XML y el PDF
 * del CFDI; aquí sólo se activa el envío automático tras el timbrado (Admin)
 * y se ve el uso del límite diario. El envío manual está en cada factura.
 */
export default function EmailSettingsPage() {
  const [data, setData] = useState<CompanyEmailSettings | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => {
    getCompanyEmailSettings()
      .then(setData)
      .catch((error: unknown) => setLoadError(error instanceof Error ? error.message : "No fue posible cargar la configuración de correo."));
  }, []);

  const toggle = async () => {
    if (!data || !data.can_edit || saving) return;
    setSaving(true);
    try {
      const saved = await updateCompanyEmailSettings(!data.auto_email_invoices);
      setData(saved);
      setToast({ type: "success", message: saved.auto_email_invoices ? "Envío automático activado." : "Envío automático desactivado." });
    } catch (error: unknown) {
      setToast({ type: "error", message: error instanceof Error ? error.message : "No fue posible guardar la configuración de correo." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen rounded-lg bg-[#F8FAFC] p-3 text-[#0F172A]">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold sm:text-3xl">Correo</h1>
          <p className="text-[#64748B]">Envío de las facturas timbradas a tus clientes. Facturapi envía el XML y el PDF del CFDI.</p>
        </div>

        {loadError && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {loadError}
          </div>
        )}

        {!loadError && !data && (
          <div className="flex items-center gap-2 text-[#64748B]">
            <Loader2 className="h-4 w-4 animate-spin" /> Cargando la configuración de correo…
          </div>
        )}

        {data && (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,.7fr)]">
            <section aria-labelledby="auto-email-title" className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 id="auto-email-title" className="flex items-center gap-2 text-lg font-bold">
                    <Mail className="h-5 w-5 text-blue-500" /> Envío automático
                  </h2>
                  <p className="mt-1 text-sm text-[#475569]">
                    Al timbrarse una factura, se envía a los correos registrados del cliente (el principal y los opcionales). Si falla, la factura queda emitida igual y el historial lo indica.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={data.auto_email_invoices}
                  aria-label="Enviar las facturas automáticamente al timbrarlas"
                  onClick={() => void toggle()}
                  disabled={!data.can_edit || saving}
                  className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${data.auto_email_invoices ? "bg-blue-600" : "bg-slate-300"}`}
                >
                  <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${data.auto_email_invoices ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>

              {data.pac_mode === "test" && (
                <p role="note" className="mt-4 flex gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span><span className="font-semibold">Modo de pruebas:</span> Facturapi envía los correos de verdad. Antes de activar el envío automático, verifica que tus clientes de prueba tengan sólo correos propios o de prueba.</span>
                </p>
              )}
              {!data.can_edit && <p className="mt-4 text-sm text-[#64748B]">Sólo un administrador puede cambiar el envío automático.</p>}
            </section>

            <aside aria-label="Uso del correo" className="space-y-4">
              <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 text-sm">
                <h2 className="mb-2 text-lg font-bold">Límite diario</h2>
                <p>
                  <span className="text-2xl font-extrabold tabular-nums">{data.sent_last_24h}</span>
                  <span className="text-[#64748B]"> de {data.daily_limit} envíos en las últimas 24 horas</span>
                </p>
                <p className="mt-2 text-[#64748B]">Cuentan los envíos manuales y los automáticos. Al llegar al límite, los automáticos se omiten y quedan en el historial de la factura.</p>
              </section>
              <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 text-sm text-[#475569]">
                <h2 className="mb-2 text-lg font-bold text-[#0F172A]">Remitente y respuestas</h2>
                <p>El remitente lo pone Facturapi. El correo de contacto de Datos fiscales aparece en los PDF y correos para que tus clientes sepan a quién escribir.</p>
              </section>
            </aside>
          </div>
        )}

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </AppLayout>
  );
}
