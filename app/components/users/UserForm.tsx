"use client";

import { useEffect, useRef, useState } from "react";
import { PASSWORD_HINT, PASSWORD_PLACEHOLDER } from "@/src/lib/passwordRules";
import { Eye, EyeOff, Upload } from "lucide-react";
import UserAvatar from "@/app/components/users/UserAvatar";
import {
  ROLE_LABELS,
  STATUS_LABELS,
  type UserFormValues,
} from "@/src/types/user";

const inputStyle = "box box-input";
const selectStyle = "box box-input";

type FieldErrors = Record<string, string[]>;

export type UserFormState = UserFormValues;

type UserFormProps = {
  mode: "create" | "edit";
  values: UserFormState;
  errors: FieldErrors;
  disabled?: boolean;
  currentAvatarUrl?: string | null;
  onChange: <K extends keyof UserFormState>(field: K, value: UserFormState[K]) => void;
};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages || messages.length === 0) return null;
  return <p className="mt-1 text-xs font-medium text-red-500">{messages[0]}</p>;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-[#475569]">
      {children}
    </label>
  );
}

export default function UserForm({
  mode,
  values,
  errors,
  disabled = false,
  currentAvatarUrl,
  onChange,
}: UserFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!values.avatar) {
      setObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(values.avatar);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [values.avatar]);

  const avatarPreview = objectUrl ?? currentAvatarUrl ?? null;

  return (
    <div className="space-y-8">
      {/* Información del usuario */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="md:col-span-2 flex items-center gap-4">
          <UserAvatar name={values.name || "?"} avatar={avatarPreview} size="lg" />
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] transition-colors"
            >
              <Upload className="h-4 w-4" />
              {values.avatar || currentAvatarUrl ? "Cambiar avatar" : "Subir avatar"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => onChange("avatar", e.target.files?.[0] ?? null)}
              disabled={disabled}
            />
            <FieldError messages={errors.avatar} />
          </div>
        </div>

        <div className="md:col-span-2">
          <FieldLabel>Nombre completo *</FieldLabel>
          <input
            type="text"
            value={values.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Nombre completo del usuario"
            className={inputStyle}
            disabled={disabled}
          />
          <FieldError messages={errors.name} />
        </div>

        <div>
          <FieldLabel>Correo *</FieldLabel>
          <input
            type="email"
            value={values.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="correo@empresa.com"
            className={inputStyle}
            disabled={disabled}
          />
          <FieldError messages={errors.email} />
        </div>

        <div>
          <FieldLabel>Rol *</FieldLabel>
          <select
            value={values.role}
            onChange={(e) => onChange("role", e.target.value as UserFormState["role"])}
            className={selectStyle}
            disabled={disabled}
          >
            <option value="">Seleccione un rol</option>
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <FieldError messages={errors.role} />
        </div>

        <div>
          <FieldLabel>Sucursal</FieldLabel>
          <input
            type="text"
            value={values.branch}
            onChange={(e) => onChange("branch", e.target.value)}
            placeholder="Sucursal (opcional)"
            className={inputStyle}
            disabled={disabled}
          />
          <FieldError messages={errors.branch} />
        </div>

        <div>
          <FieldLabel>Teléfono</FieldLabel>
          <input
            type="tel"
            value={values.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="Teléfono (opcional)"
            className={inputStyle}
            disabled={disabled}
          />
          <FieldError messages={errors.phone} />
        </div>

        <div>
          <FieldLabel>Puesto</FieldLabel>
          <input
            type="text"
            value={values.position}
            onChange={(e) => onChange("position", e.target.value)}
            placeholder="Puesto (opcional)"
            className={inputStyle}
            disabled={disabled}
          />
          <FieldError messages={errors.position} />
        </div>

        <div>
          <FieldLabel>Estado</FieldLabel>
          <select
            value={values.status}
            onChange={(e) => onChange("status", e.target.value as UserFormState["status"])}
            className={selectStyle}
            disabled={disabled}
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <FieldError messages={errors.status} />
        </div>
      </div>

      {/* Seguridad: solo aplica al crear. La contraseña de un usuario existente
          se administra desde el modal de Seguridad, nunca desde este formulario. */}
      {mode === "create" && (
        <div className="border-t border-[#E2E8F0] pt-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-[#0F172A]">
            Seguridad
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <FieldLabel>Contraseña *</FieldLabel>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={(e) => onChange("password", e.target.value)}
                  placeholder={PASSWORD_PLACEHOLDER}
                  className={`${inputStyle} pr-12`}
                  disabled={disabled}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Fase 6.32: la temporal sigue las reglas de cualquier contraseña. */}
              <p className="mt-1.5 text-xs text-[#64748B]">{PASSWORD_HINT}</p>
              <FieldError messages={errors.password} />
            </div>

            <div>
              <FieldLabel>Confirmar contraseña *</FieldLabel>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={values.password_confirmation}
                  onChange={(e) => onChange("password_confirmation", e.target.value)}
                  placeholder="Repita la contraseña"
                  className={`${inputStyle} pr-12`}
                  disabled={disabled}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <FieldError messages={errors.password_confirmation} />
            </div>

            <label className="md:col-span-2 flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={values.must_change_password}
                onChange={(e) => onChange("must_change_password", e.target.checked)}
                disabled={disabled}
                className="h-4 w-4 rounded border-[#CBD5E1] text-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
              <span className="text-sm text-[#475569]">
                Debe cambiar la contraseña al iniciar sesión
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
