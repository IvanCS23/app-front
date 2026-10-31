"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Building2, FileKey, Loader2, ShieldCheck } from "lucide-react";
import AppLayout from "@/app/components/layout/AppLayout";
import CompanyLogoCard from "@/app/components/settings/CompanyLogoCard";
import Toast, { type ToastData } from "@/app/components/ui/Toast";
import { CompanyApiError, getCompanyFiscal, updateCompanyFiscal } from "@/src/services/company.services";
import { getSatCatalogs } from "@/src/services/sat.services";
import { issuerFiscalErrors, regimesFor } from "@/src/lib/sat";
import type { CompanyFiscal, CompanyFiscalInput } from "@/src/types/company";
import type { SatCatalogs } from "@/src/types/sat";

/**
 * Fase 6.27b — Datos fiscales de la empresa. Al guardar, el backend los
 * envía primero a Facturapi y sólo los guarda si Facturapi los acepta. El
 * RFC lo define el CSD: si la organización ya tiene uno, debe coincidir.
 */
const inputStyle = "box box-input w-full";

const ADDRESS_FIELDS: { field: keyof CompanyFiscalInput; label: string }[] = [
  { field: "street", label: "Calle" },
  { field: "external_number", label: "Número exterior" },
  { field: "internal_number", label: "Número interior" },
  { field: "colony", label: "Colonia" },
  { field: "city", label: "Ciudad" },
  { field: "municipality", label: "Municipio o alcaldía" },
  { field: "state", label: "Estado" },
];

function toInput(data: CompanyFiscal): CompanyFiscalInput {
  return {
    legal_name: data.legal_name ?? "",
    trade_name: data.trade_name ?? "",
    rfc: data.rfc ?? "",
    fiscal_regime: data.fiscal_regime ?? "",
    postal_code: data.postal_code ?? "",
    street: data.address.street ?? "",
    external_number: data.address.external_number ?? "",
    internal_number: data.address.internal_number ?? "",
    colony: data.address.colony ?? "",
    city: data.address.city ?? "",
    municipality: data.address.municipality ?? "",
    state: data.address.state ?? "",
  };
}

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-bold uppercase tracking-wide text-[#475569]">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-[#64748B]">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function CompanyFiscalPage() {
  const [data, setData] = useState<CompanyFiscal | null>(null);
  const [values, setValues] = useState<CompanyFiscalInput | null>(null);
  const [catalogs, setCatalogs] = useState<SatCatalogs | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<Partial<Record<keyof CompanyFiscalInput, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => {
    getCompanyFiscal()
      .then((fiscal) => {
        setData(fiscal);
        setValues(toInput(fiscal));
      })
      .catch((error: unknown) => setLoadError(error instanceof Error ? error.message : "No fue posible cargar los datos fiscales."));
    getSatCatalogs().then(setCatalogs).catch(() => setCatalogs(null));
  }, []);

  const clientErrors = useMemo(() => (values ? issuerFiscalErrors(values, catalogs) : {}), [values, catalogs]);
  const organization = data?.organization ?? null;
  const csdRfc = organization?.legal_tax_id ?? null;
  const canEdit = Boolean(data?.can_edit) && organization !== null;
  const regimes = catalogs && values ? regimesFor(catalogs, values.rfc) : [];

  const errorFor = (field: keyof CompanyFiscalInput): string | undefined =>
    serverErrors[field] ?? (touched ? clientErrors[field as keyof typeof clientErrors] : undefined);

  const change = (field: keyof CompanyFiscalInput) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = event.target.value;
    setValues((current) => (current ? { ...current, [field]: value } : current));
    setServerErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!values || !canEdit) return;
    setTouched(true);
    setSubmitError(null);

    if (Object.keys(clientErrors).length > 0) return;
    if (csdRfc && values.rfc.trim().toUpperCase() !== csdRfc) {
      setServerErrors({ rfc: `El RFC debe ser el del CSD cargado en Facturapi (${csdRfc}).` });
      return;
    }

    setSaving(true);
    try {
      const saved = await updateCompanyFiscal(values);
      setData(saved);
      setValues(toInput(saved));
      setServerErrors({});
      setTouched(false);
      setToast({ message: "Datos fiscales guardados en Facturapi y en el sistema.", type: "success" });
    } catch (error: unknown) {
      if (error instanceof CompanyApiError && error.issues.length > 0) {
        setServerErrors(Object.fromEntries(error.issues.map((issue) => [issue.field, issue.message])));
      }
      setSubmitError(error instanceof Error ? error.message : "No fue posible guardar los datos fiscales.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen rounded-lg bg-[#F8FAFC] p-3 text-[#0F172A]">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold sm:text-3xl">Datos fiscales</h1>
          <p className="text-[#64748B]">
            Razón social, RFC, régimen y domicilio fiscal con los que la empresa emite sus facturas. Se guardan primero en Facturapi.
          </p>
        </div>

        {loadError && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {loadError}
          </div>
        )}

        {!loadError && (!data || !values) && (
          <div className="flex items-center gap-2 text-[#64748B]">
            <Loader2 className="h-4 w-4 animate-spin" /> Cargando datos fiscales…
          </div>
        )}

        {data && values && (
          <div className="grid gap-6 lg:grid-cols-3">
            <form onSubmit={submit} noValidate className="space-y-5 rounded-2xl border border-[#E2E8F0] bg-white p-5 lg:col-span-2" aria-label="Datos fiscales de la empresa">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <Building2 className="h-5 w-5 text-blue-500" /> Emisor
              </h2>

              {!data.can_edit && (
                <p role="note" className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
                  Solo un administrador puede modificar los datos fiscales.
                </p>
              )}
              {data.can_edit && organization === null && (
                <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  La empresa todavía no tiene organización de Facturapi. La crea o la vincula el operador del sistema; mientras tanto no se pueden guardar los datos fiscales.
                </p>
              )}
              {data.issues.length > 0 && (
                <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  <p className="font-semibold">Con estos datos la empresa no puede emitir facturas:</p>
                  <ul className="mt-1 list-disc pl-5">
                    {data.issues.map((issue) => (
                      <li key={`${issue.code}-${issue.field}`}>{issue.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              <fieldset disabled={!canEdit || saving} className="grid gap-4 sm:grid-cols-2">
                <Field id="legal_name" label="Razón social" error={errorFor("legal_name")} hint="Sin régimen societario, como en la constancia de situación fiscal.">
                  <input id="legal_name" className={inputStyle} value={values.legal_name} onChange={change("legal_name")} aria-invalid={Boolean(errorFor("legal_name"))} />
                </Field>
                <Field id="trade_name" label="Nombre comercial" error={errorFor("trade_name")}>
                  <input id="trade_name" className={inputStyle} value={values.trade_name} onChange={change("trade_name")} />
                </Field>
                <Field id="rfc" label="RFC" error={errorFor("rfc")} hint={csdRfc ? `Debe ser el del CSD cargado en Facturapi: ${csdRfc}.` : "Facturapi lo confirmará al cargar el CSD."}>
                  <input id="rfc" className={`${inputStyle} uppercase`} value={values.rfc} onChange={change("rfc")} maxLength={13} aria-invalid={Boolean(errorFor("rfc"))} />
                </Field>
                <Field id="fiscal_regime" label="Régimen fiscal" error={errorFor("fiscal_regime")}>
                  {catalogs ? (
                    <select id="fiscal_regime" className={inputStyle} value={values.fiscal_regime} onChange={change("fiscal_regime")} aria-invalid={Boolean(errorFor("fiscal_regime"))}>
                      <option value="">Selecciona un régimen</option>
                      {regimes.map((regime) => (
                        <option key={regime.code} value={regime.code}>
                          {regime.code} — {regime.description}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input id="fiscal_regime" className={inputStyle} value={values.fiscal_regime} onChange={change("fiscal_regime")} maxLength={3} />
                  )}
                </Field>
                <Field id="postal_code" label="Código postal (lugar de expedición)" error={errorFor("postal_code")}>
                  <input id="postal_code" className={inputStyle} value={values.postal_code} onChange={change("postal_code")} inputMode="numeric" maxLength={5} aria-invalid={Boolean(errorFor("postal_code"))} />
                </Field>
                {ADDRESS_FIELDS.map(({ field, label }) => (
                  <Field key={field} id={field} label={label} error={errorFor(field)}>
                    <input id={field} className={inputStyle} value={values[field]} onChange={change(field)} />
                  </Field>
                ))}
              </fieldset>

              {submitError && (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  {submitError}
                </p>
              )}

              {data.can_edit && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!canEdit || saving}
                    className="flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-2 font-semibold text-white shadow-lg shadow-blue-500/30 transition-colors hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    {saving ? "Guardando en Facturapi…" : "Guardar datos fiscales"}
                  </button>
                </div>
              )}
            </form>

            <aside className="space-y-4" aria-label="Estado en Facturapi">
              <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
                <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" /> Facturapi
                </h2>
                {organization === null ? (
                  <p className="text-sm text-[#64748B]">Sin organización vinculada.</p>
                ) : (
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="font-semibold text-[#475569]">RFC del CSD</dt>
                      <dd>{organization.legal_tax_id ?? "Aún sin RFC (se toma del CSD)"}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[#475569]">Razón social</dt>
                      <dd>{organization.legal_name ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[#475569]">Nombre comercial en el PDF</dt>
                      <dd>{organization.trade_name ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[#475569]">Régimen y C.P.</dt>
                      <dd>
                        {organization.legal_tax_system ?? "—"} · {organization.legal_zip ?? "—"}
                      </dd>
                    </div>
                    {organization.rfc_matches === false && (
                      <p role="alert" className="flex gap-2 rounded-lg bg-amber-50 p-2 text-amber-900">
                        <AlertTriangle className="h-4 w-4 shrink-0" /> El RFC de la empresa no coincide con el del CSD.
                      </p>
                    )}
                  </dl>
                )}
              </section>
              <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
                <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
                  <FileKey className="h-5 w-5 text-blue-500" /> CSD
                </h2>
                {organization?.certificate.has_certificate ? (
                  <p className="text-sm">
                    Serie {organization.certificate.serial_number ?? "—"}, vigente hasta{" "}
                    {organization.certificate.expires_at ? new Date(organization.certificate.expires_at).toLocaleDateString("es-MX") : "—"}.
                  </p>
                ) : (
                  <p className="text-sm text-[#64748B]">Sin CSD cargado. Se administra en Sellos digitales.</p>
                )}
              </section>
              {data && organization !== null && (
                <CompanyLogoCard
                  data={data}
                  canEdit={canEdit}
                  onUploaded={(next) => {
                    setData(next);
                    setToast({ message: "Logotipo guardado en Facturapi. Se usará en los PDF nuevos.", type: "success" });
                  }}
                />
              )}
            </aside>
          </div>
        )}

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </AppLayout>
  );
}
