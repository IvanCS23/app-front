"use client";

import { KeyRound } from "lucide-react";
import AppLayout from "@/app/components/layout/AppLayout";
import ChangePasswordForm from "@/app/components/auth/ChangePasswordForm";
import { useAuth } from "@/src/hooks/useAuth";

/**
 * Fase 6.32 — Configuración > Seguridad > Contraseña. Cualquier rol cambia
 * su propia contraseña con la actual. Al guardar, la sesión de este
 * navegador sigue con el token nuevo y las demás se cierran.
 */
export default function SecurityPasswordPage() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="min-h-screen rounded-lg bg-[#F8FAFC] p-3 text-[#0F172A]">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold sm:text-3xl">Contraseña</h1>
          <p className="text-[#64748B]">Cambia la contraseña con la que entras a FacturaPro.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,.6fr)]">
          <section aria-labelledby="password-title" className="max-w-xl rounded-2xl border border-[#E2E8F0] bg-white p-5">
            <h2 id="password-title" className="mb-4 flex items-center gap-2 text-lg font-bold">
              <KeyRound className="h-5 w-5 text-blue-500" aria-hidden="true" /> Cambiar contraseña
            </h2>
            {user && <p className="mb-4 text-sm text-[#475569]">Cuenta: {user.email}</p>}
            <ChangePasswordForm />
          </section>

          <aside className="h-fit rounded-2xl border border-[#E2E8F0] bg-white p-5 text-sm text-[#475569]">
            <h2 className="mb-2 font-bold text-[#0F172A]">Qué pasa al cambiarla</h2>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Sigues con la sesión abierta en este navegador.</li>
              <li>Se cierran las sesiones abiertas en otros equipos y navegadores.</li>
              <li>Los enlaces de recuperación que hayas pedido dejan de servir.</li>
            </ul>
            <p className="mt-3">¿No recuerdas la actual? Cierra sesión y usa “¿Olvidó su contraseña?” en el inicio de sesión.</p>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}
