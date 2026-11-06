"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/app/components/auth/AuthCard";
import ChangePasswordForm from "@/app/components/auth/ChangePasswordForm";
import { useAuth } from "@/src/hooks/useAuth";
import { getToken } from "@/src/services/auth.services";

/**
 * Fase 6.32: cambiar la contraseña fuera del panel. Aquí llega quien inicia
 * sesión con una contraseña temporal (must_change_password): hasta cambiarla,
 * Laravel le responde 403 PASSWORD_CHANGE_REQUIRED a casi todo.
 */
export default function CambiarContrasenaPage() {
  const router = useRouter();
  const { user, loading, mustChangePassword, logout } = useAuth();
  useEffect(() => {
    if (!loading && !getToken()) router.replace("/login");
  }, [loading, router, user]);

  if (loading || !user) {
    return null;
  }

  return (
    <AuthCard
      title="Cambiar contraseña"
      description={
        mustChangePassword
          ? "Por seguridad, cambia la contraseña temporal que te dieron antes de continuar."
          : `Cuenta: ${user.email}`
      }
      footer={
        <button type="button" onClick={() => void logout()} className="font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
          Cerrar sesión
        </button>
      }
    >
      <ChangePasswordForm onChanged={() => router.replace("/pages/dashboard")} />
    </AuthCard>
  );
}
