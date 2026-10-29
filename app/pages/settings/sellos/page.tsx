"use client";

import React, { useEffect, useRef, useState } from "react";
import { AlertTriangle, Eye, EyeOff, FileKey, Loader2, ShieldCheck, Upload } from "lucide-react";
import AppLayout from "@/app/components/layout/AppLayout";
import ComingSoon from "@/app/components/ui/ComingSoon";
import Toast, { type ToastData } from "@/app/components/ui/Toast";
import { CompanyApiError, getCompanyFiscal, uploadCompanyCsd } from "@/src/services/company.services";
import type { CompanyFiscal } from "@/src/types/company";

/**
 * Fase 6.27b — Certificado de Sello Digital (CSD) real. El .cer, la .key y
 * la contraseña se envían una sola vez a Facturapi y no se guardan (por eso
 * no hay descargas). La contraseña se borra del formulario al enviar, con
 * éxito o con error. La e.firma (FIEL) todavía no está disponible.
 */
const MAX_FILE_BYTES = 64 * 1024;

type FileField = "cer" | "key";

function formatDate(value: string | null): string {
  return value ? new Date(value).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" }) : "—";
}

export default function SellosPage() {
  const [data, setData] = useState<CompanyFiscal | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [files, setFiles] = useState<Record<FileField, File | null>>({ cer: null, key: null });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FileField | "csd_password", string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    getCompanyFiscal()
      .then(setData)
      .catch((error: unknown) => setLoadError(error instanceof Error ? error.message : "No fue posible cargar el estado del CSD."));
  }, []);

  const organization = data?.organization ?? null;
  const certificate = organization?.certificate ?? null;
  const canUpload = Boolean(data?.can_edit) && organization !== null;
  const daysLeft = certificate?.days_left ?? null;

  const pickFile = (field: FileField, extension: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    let error: string | undefined;

    if (file && !file.name.toLowerCase().endsWith(extension)) {
      error = `Selecciona un archivo ${extension}.`;
    } else if (file && file.size > MAX_FILE_BYTES) {
      error = `El archivo ${extension} no puede pesar más de 64 KB.`;
    }

    setFiles((current) => ({ ...current, [field]: error ? null : file }));
    setErrors((current) => ({ ...current, [field]: error }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canUpload) return;

    const missing: typeof errors = {};
    if (!files.cer) missing.cer = errors.cer ?? "Selecciona el archivo .cer del CSD.";
    if (!files.key) missing.key = errors.key ?? "Selecciona el archivo .key del CSD.";
    if (password === "") missing.csd_password = "Escribe la contraseña de la llave privada.";
    setErrors(missing);
    setSubmitError(null);
    if (Object.keys(missing).length > 0 || !files.cer || !files.key) return;

    const secret = password;
    // La contraseña sale del estado en cuanto se envía, pase lo que pase.
    setPassword("");
    setShowPassword(false);
    setUploading(true);

    try {
      const saved = await uploadCompanyCsd(files.cer, files.key, secret);
      setData(saved);
      setFiles({ cer: null, key: null });
      formRef.current?.reset();
      setToast({ message: "CSD cargado en Facturapi.", type: "success" });
    } catch (error: unknown) {
      if (error instanceof CompanyApiError && error.issues.length > 0) {
        setErrors(Object.fromEntries(error.issues.map((issue) => [issue.field, issue.message])));
      }
      setSubmitError(error instanceof Error ? error.message : "No fue posible subir el CSD.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen rounded-lg bg-[#F8FAFC] p-3 text-[#0F172A]">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold sm:text-3xl">Certificados y Sellos Digitales</h1>
          <p className="text-[#64748B]">
            El Certificado de Sello Digital (CSD) del SAT con el que Facturapi sella las facturas de la empresa.
          </p>
        </div>

        {loadError && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {loadError}
          </div>
        )}

        {!loadError && !data && (
          <div className="flex items-center gap-2 text-[#64748B]">
            <Loader2 className="h-4 w-4 animate-spin" /> Cargando el estado del CSD…
          </div>
        )}

        {data && (
          <div className="grid gap-6 lg:grid-cols-2">
            <section aria-label="CSD actual" className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
                <ShieldCheck className="h-5 w-5 text-emerald-500" /> CSD actual
              </h2>
              {organization === null ? (
                <p className="text-sm text-[#64748B]">La empresa todavía no tiene organización de Facturapi. La crea o la vincula el operador del sistema.</p>
              ) : certificate?.has_certificate ? (
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="font-semibold text-[#475569]">Número de certificado</dt>
                    <dd>{certificate.serial_number ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[#475569]">Vigente hasta</dt>
                    <dd>{formatDate(certificate.expires_at)}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[#475569]">RFC del certificado</dt>
                    <dd>{organization.legal_tax_id ?? "—"}</dd>
                  </div>
                  {daysLeft !== null && daysLeft < 30 && (
                    <p role="alert" className="flex gap-2 rounded-lg bg-amber-50 p-2 text-amber-900">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      {daysLeft < 0 ? "El CSD está vencido: carga uno vigente." : `El CSD vence en ${daysLeft} días: tramita uno nuevo en el SAT.`}
                    </p>
                  )}
                  {organization.rfc_matches === false && (
                    <p role="alert" className="flex gap-2 rounded-lg bg-amber-50 p-2 text-amber-900">
                      <AlertTriangle className="h-4 w-4 shrink-0" /> El RFC del certificado no coincide con el de la empresa.
                    </p>
                  )}
                </dl>
              ) : (
                <p className="text-sm text-[#64748B]">La organización no tiene CSD cargado.</p>
              )}
              <p className="mt-4 text-xs text-[#64748B]">
                El sistema no guarda los archivos del CSD ni su contraseña, por eso no se pueden descargar desde aquí.
              </p>
            </section>

            <section aria-label="Cargar CSD" className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
                <FileKey className="h-5 w-5 text-blue-500" /> {certificate?.has_certificate ? "Reemplazar CSD" : "Cargar CSD"}
              </h2>

              {!data.can_edit ? (
                <p role="note" className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
                  Solo un administrador puede cargar el CSD.
                </p>
              ) : (
                <form ref={formRef} onSubmit={submit} noValidate className="space-y-4" aria-label="Cargar CSD">
                  <p className="text-sm text-[#64748B]">
                    El RFC del certificado debe ser el de la empresa ({data.rfc ?? "sin RFC"}). Si no lo es, corrígelo primero en Datos fiscales.
                  </p>
                  <fieldset disabled={!canUpload || uploading} className="space-y-4">
                    <div>
                      <label htmlFor="csd-cer" className="mb-2 block text-sm font-bold uppercase tracking-wide text-[#475569]">Certificado (.cer)</label>
                      <input id="csd-cer" type="file" accept=".cer" onChange={pickFile("cer", ".cer")} className="block w-full text-sm" />
                      {errors.cer && <p className="mt-1 text-sm text-red-600">{errors.cer}</p>}
                    </div>
                    <div>
                      <label htmlFor="csd-key" className="mb-2 block text-sm font-bold uppercase tracking-wide text-[#475569]">Llave privada (.key)</label>
                      <input id="csd-key" type="file" accept=".key" onChange={pickFile("key", ".key")} className="block w-full text-sm" />
                      {errors.key && <p className="mt-1 text-sm text-red-600">{errors.key}</p>}
                    </div>
                    <div>
                      <label htmlFor="csd-password" className="mb-2 block text-sm font-bold uppercase tracking-wide text-[#475569]">Contraseña de la llave privada</label>
                      <div className="flex gap-2">
                        <input
                          id="csd-password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="off"
                          className="box box-input w-full"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((current) => !current)}
                          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          className="rounded-lg border border-[#E2E8F0] px-3"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.csd_password && <p className="mt-1 text-sm text-red-600">{errors.csd_password}</p>}
                    </div>
                  </fieldset>

                  {submitError && (
                    <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                      {submitError}
                    </p>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!canUpload || uploading}
                      className="flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-2 font-semibold text-white shadow-lg shadow-blue-500/30 transition-colors hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      {uploading ? "Enviando a Facturapi…" : "Subir CSD"}
                    </button>
                  </div>
                </form>
              )}
            </section>

            <div className="lg:col-span-2">
              <ComingSoon
                title="e.firma (FIEL)"
                note="Todavía no se carga la e.firma: el timbrado sólo necesita el CSD. Los archivos de la FIEL no se piden ni se guardan."
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  <input type="file" aria-label="Certificado de la FIEL" className="text-sm" />
                  <input type="file" aria-label="Llave de la FIEL" className="text-sm" />
                  <input type="password" aria-label="Contraseña de la FIEL" className="box box-input" />
                </div>
              </ComingSoon>
            </div>
          </div>
        )}

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </AppLayout>
  );
}
