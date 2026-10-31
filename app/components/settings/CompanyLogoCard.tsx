"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, ImageIcon, Loader2, Upload } from "lucide-react";
import { getCompanyLogo, LOGO_MAX_BYTES, LOGO_TYPES, uploadCompanyLogo } from "@/src/services/company.services";
import type { CompanyFiscal } from "@/src/types/company";

/**
 * Fase 6.29 — Logotipo del PDF. Facturapi lo imprime en el PDF y en los
 * correos del CFDI. La vista previa es la copia privada que guarda el
 * backend (se pide con el token, no como URL pública).
 */
export default function CompanyLogoCard({
  data,
  canEdit,
  onUploaded,
}: {
  data: CompanyFiscal;
  canEdit: boolean;
  onUploaded: (next: CompanyFiscal) => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const available = data.logo.available;
  const updatedAt = data.logo.updated_at;

  useEffect(() => {
    if (!available) {
      setPreviewUrl(null);
      return;
    }

    let objectUrl: string | null = null;
    let cancelled = false;
    getCompanyLogo()
      .then((blob) => {
        if (cancelled || !blob) return;
        objectUrl = URL.createObjectURL(blob);
        setPreviewUrl(objectUrl);
      })
      .catch(() => setPreviewUrl(null));

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [available, updatedAt]);

  const choose = (event: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = event.target.files?.[0] ?? null;
    setError(null);
    setFile(null);
    if (!chosen) return;
    if (!LOGO_TYPES.includes(chosen.type)) {
      setError("El logotipo debe ser una imagen JPG o PNG.");
      return;
    }
    if (chosen.size > LOGO_MAX_BYTES) {
      setError("El logotipo no puede pesar más de 500 KB.");
      return;
    }
    setFile(chosen);
  };

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      onUploaded(await uploadCompanyLogo(file));
      setFile(null);
    } catch (uploadError: unknown) {
      setError(uploadError instanceof Error ? uploadError.message : "No fue posible subir el logotipo.");
    } finally {
      setUploading(false);
    }
  };

  const foreignLogo = !available && data.organization?.has_logo === true;

  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5" aria-labelledby="company-logo-title">
      <h2 id="company-logo-title" className="mb-3 flex items-center gap-2 text-lg font-bold">
        <ImageIcon className="h-5 w-5 text-blue-500" /> Logotipo del PDF
      </h2>

      {previewUrl ? (
        // URL blob: de una descarga autenticada; next/image no la optimiza.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={previewUrl} alt="Logotipo actual de la empresa" className="mb-3 max-h-32 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] object-contain p-2" />
      ) : (
        <p className="mb-3 text-sm text-[#64748B]">{available ? "Cargando vista previa…" : "Sin logotipo propio."}</p>
      )}

      {foreignLogo && (
        <p role="alert" className="mb-3 flex gap-2 rounded-lg bg-amber-50 p-2 text-sm text-amber-900">
          <AlertTriangle className="h-4 w-4 shrink-0" /> Facturapi tiene un logotipo que no se subió desde aquí, y es el que aparece en el PDF. Sube el de tu empresa para reemplazarlo.
        </p>
      )}

      {canEdit ? (
        <div className="space-y-2">
          <label htmlFor="company-logo-file" className="block text-sm font-semibold text-[#475569]">
            {available ? "Reemplazar logotipo" : "Subir logotipo"}
          </label>
          <input id="company-logo-file" type="file" accept="image/png,image/jpeg" onChange={choose} disabled={uploading} className="block w-full text-sm" />
          <p className="text-xs text-[#64748B]">JPG o PNG de hasta 500 KB; se recomienda 800 × 500 px. Facturapi lo imprime en el PDF y en los correos del CFDI.</p>
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          <button
            type="button"
            onClick={() => void upload()}
            disabled={!file || uploading}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? "Subiendo a Facturapi…" : "Subir logotipo"}
          </button>
        </div>
      ) : (
        <p className="text-sm text-[#64748B]">Sólo un administrador puede cambiar el logotipo.</p>
      )}
    </section>
  );
}
