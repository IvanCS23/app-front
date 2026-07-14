"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import UserForm, { type UserFormState } from "@/app/components/users/UserForm";
import { ValidationError } from "@/src/services/users";
import type { UpdateUserInput } from "@/src/hooks/useUsers";
import type { User } from "@/src/types/user";

const emptyValues: UserFormState = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  role: "",
  status: "active",
  phone: "",
  position: "",
  branch: "",
  must_change_password: false,
  avatar: null,
};

type EditUserModalProps = {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSubmit: (id: number, values: UpdateUserInput) => Promise<void>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
};

export default function EditUserModal({
  isOpen,
  user,
  onClose,
  onSubmit,
  onSuccess,
  onError,
}: EditUserModalProps) {
  const [values, setValues] = useState<UserFormState>(emptyValues);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setValues({
        name: user.name,
        email: user.email,
        password: "",
        password_confirmation: "",
        role: user.role,
        status: user.status,
        phone: user.phone ?? "",
        position: user.position ?? "",
        branch: user.branch ?? "",
        must_change_password: false,
        avatar: null,
      });
      setErrors({});
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handleChange = <K extends keyof UserFormState>(field: K, value: UserFormState[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const handleSubmit = async () => {
    setErrors({});

    if (!values.role) {
      setErrors({ role: ["El rol es obligatorio"] });
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit(user.id, values);
      onSuccess("Usuario actualizado correctamente");
      handleClose();
    } catch (err) {
      if (err instanceof ValidationError) {
        setErrors(err.errors);
      } else {
        onError(err instanceof Error ? err.message : "Error al actualizar usuario");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
          <h2 className="text-xl font-bold text-[#0F172A]">Editar usuario</h2>
          <button
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <UserForm
            mode="edit"
            values={values}
            errors={errors}
            disabled={isSaving}
            currentAvatarUrl={user.avatar}
            onChange={handleChange}
          />
        </div>

        <div className="sticky bottom-0 flex justify-end gap-4 border-t border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="rounded-xl bg-red-500 px-6 py-2 font-medium text-white shadow-[0_10px_30px_rgba(255,0,0,0.25)] transition-colors duration-200 hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-2 font-medium text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition-colors duration-200 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar cambios"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
