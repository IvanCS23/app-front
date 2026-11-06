import type { ReactNode } from "react";
import { FileText } from "lucide-react";

type AuthCardProps = {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

/**
 * Fase 6.32: marco de las pantallas de cuenta fuera del panel (cambiar la
 * contraseña temporal, recuperarla y restablecerla), con el estilo del login.
 */
export default function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#F8FAFC] px-6 py-8 sm:px-10">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB]">
          <FileText className="h-4.5 w-4.5 text-white" aria-hidden="true" />
        </div>
        <span className="text-lg font-bold tracking-tight text-[#0F172A]">
          Factura<span className="text-[#2563EB]">Pro</span>
        </span>
      </div>

      <main className="mx-auto my-8 w-full max-w-md">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white px-8 py-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#0F172A]">{title}</h1>
            {description && <div className="mt-1.5 text-sm text-[#64748B]">{description}</div>}
          </div>
          {children}
        </div>
        {footer && <div className="mt-4 text-center text-sm text-[#64748B]">{footer}</div>}
      </main>

      <p className="text-center text-xs text-[#94A3B8]">© 2026 FacturaPro</p>
    </div>
  );
}
