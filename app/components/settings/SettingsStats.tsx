"use client";

import { Building2, Receipt, Server, Users } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import { useSettingsStats } from "@/src/hooks/useSettingsStats";
import type { CompanyIntegrationStatus } from "@/src/services/auth.services";

const SAT_STATUS_LABEL: Record<CompanyIntegrationStatus, string> = {
  connected: "Conectado",
  pending: "Pendiente",
  disconnected: "Desconectado",
  error: "Error",
};

const SAT_STATUS_BADGE: Record<CompanyIntegrationStatus, string> = {
  connected: "bg-[#DCFCE7] text-[#15803D]",
  pending: "bg-[#FEF3C7] text-[#B45309]",
  disconnected: "bg-slate-100 text-slate-600",
  error: "bg-[#FEE2E2] text-[#B91C1C]",
};

type StatCardProps = {
  title: string;
  value: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
  iconBg: string;
  isLoading?: boolean;
};

function StatCard({ title, value, badge, badgeColor, icon, iconBg, isLoading }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-5 flex items-start justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
          {icon}
        </div>
        {isLoading ? (
          <span className="h-5 w-14 animate-pulse rounded-full bg-slate-200" />
        ) : (
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>

      <p className="text-[14px] text-slate-500">{title}</p>
      {isLoading ? (
        <div className="mt-2 h-7 w-24 animate-pulse rounded bg-slate-200" />
      ) : (
        <h3 className="mt-1.5 truncate text-2xl font-bold text-slate-900">{value}</h3>
      )}
    </div>
  );
}

export default function SettingsStats() {
  const { user } = useAuth();
  const { usersCount, invoicesCount, isLoading } = useSettingsStats();
  const company = user?.company;
  const satStatus = company?.integration_status ?? "pending";

  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Empresa"
        value={company?.nombre ?? "—"}
        badge={company?.plan ?? "Sin plan"}
        badgeColor="bg-blue-50 text-blue-700"
        icon={<Building2 className="h-6 w-6 text-blue-600" />}
        iconBg="bg-blue-50"
      />
      <StatCard
        title="Usuarios"
        value={usersCount !== null ? String(usersCount) : "—"}
        badge="Activos"
        badgeColor="bg-[#DCFCE7] text-[#15803D]"
        icon={<Users className="h-6 w-6 text-emerald-600" />}
        iconBg="bg-emerald-50"
        isLoading={isLoading}
      />
      <StatCard
        title="Facturas emitidas"
        value={invoicesCount !== null ? String(invoicesCount) : "—"}
        badge="Total"
        badgeColor="bg-[#FEF3C7] text-[#B45309]"
        icon={<Receipt className="h-6 w-6 text-amber-500" />}
        iconBg="bg-amber-50"
        isLoading={isLoading}
      />
      <StatCard
        title="Estado del SAT"
        value={SAT_STATUS_LABEL[satStatus]}
        badge={SAT_STATUS_LABEL[satStatus]}
        badgeColor={SAT_STATUS_BADGE[satStatus]}
        icon={<Server className="h-6 w-6 text-slate-600" />}
        iconBg="bg-slate-100"
      />
    </section>
  );
}
