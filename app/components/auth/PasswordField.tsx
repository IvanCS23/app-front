"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: "current-password" | "new-password";
  error?: string;
  hint?: string;
  disabled?: boolean;
};

/** Fase 6.32: campo de contraseña con mostrar/ocultar y su error debajo. */
export default function PasswordField({ id, label, value, onChange, autoComplete, error, hint, disabled }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[#0F172A]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          className="box box-input rounded-xl pr-12"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          disabled={disabled}
          required
        />
        <button
          type="button"
          aria-label={visible ? `Ocultar ${label.toLowerCase()}` : `Mostrar ${label.toLowerCase()}`}
          onClick={() => setVisible((current) => !current)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] transition-colors hover:text-[#64748B]"
        >
          {visible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-[#64748B]">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
