"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/app/components/layout/AppLayout";
import ScreenBadge from "@/app/components/ui/ScreenBadge";
import { navState } from "@/src/data/screenStatus";
import {
  Receipt,
  FileText,
  Calendar,
  Plus,
  TrendingUp,
  ClipboardList,
  CheckCircle2,
  MoreVertical,
  UserPlus,
  Upload,
  FlaskConical,
} from "lucide-react";

// Fase 6.25: los accesos del Dashboard llevan al flujo real de ventas.
const NEW_SALE_HREF = "/pages/sales/new";

type StatCardProps = {
  title: string;
  value: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
  iconBg: string;
};

const StatCard = ({ title, value, badge, badgeColor, icon, iconBg }: StatCardProps) => (
  <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="mb-5 flex items-start justify-between">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
        {icon}
      </div>
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeColor}`}>
        {badge}
      </span>
    </div>

    <p className="text-[14px] text-[#64748B]">{title}</p>
    <h3 className="mt-1.5 text-2xl font-bold text-[#0F172A]">{value}</h3>
  </div>
);

// Fase 6.24: el destino decide si la acción se muestra, se marca como demo
// o queda deshabilitada como "Próximamente" (ver src/data/screenStatus.ts).
const QuickAction = ({
  icon,
  title,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
}) => {
  const router = useRouter();
  const state = navState(href);

  if (state === "hidden") return null;

  const unavailable = state === "unavailable";

  return (
    <button
      onClick={unavailable ? undefined : () => router.push(href)}
      disabled={unavailable}
      title={unavailable ? "Próximamente" : undefined}
      className={`flex h-32 flex-col items-center justify-center gap-1 rounded-2xl border border-[#E2E8F0] bg-white text-center transition ${
        unavailable ? "cursor-not-allowed opacity-60" : "hover:border-blue-200 hover:bg-[#EFF6FF] hover:shadow-sm"
      }`}
    >
      <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>
      <span className="max-w-[110px] text-[13px] font-semibold text-[#334155]">
        {title}
      </span>
      <ScreenBadge state={state} />
    </button>
  );
};

const TopClient = ({
  initials,
  name,
  subtitle,
  amount,
}: {
  initials: string;
  name: string;
  subtitle: string;
  amount: string;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-[13px] font-bold text-blue-700">
        {initials}
      </div>
      <div>
        <p className="text-[13px] font-semibold text-[#0F172A]">{name}</p>
        <p className="text-[12px] text-[#64748B]">{subtitle}</p>
      </div>
    </div>
    <p className="text-[13px] font-bold text-[#0F172A]">{amount}</p>
  </div>
);

const LineChartMock = () => {
  return (
    <div className="relative h-[320px] w-full overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-[#0F172A]">Tendencia de Ingresos</h3>
        <div className="flex items-center gap-4 text-[13px]">
          <div className="flex items-center gap-2 text-[#64748B]">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            Ingresos
          </div>
          <div className="flex items-center gap-2 text-[#94A3B8]">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            Gastos
          </div>
        </div>
      </div>

      <div className="relative h-[230px] w-full">
        <svg viewBox="0 0 900 260" className="h-full w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[65, 130, 195].map((y) => (
            <line key={y} x1="0" y1={y} x2="900" y2={y} stroke="#F1F5F9" strokeWidth="1" />
          ))}

          <path
            d="M0,210
               C55,180 85,220 130,195
               C175,170 205,60 265,95
               C320,130 345,250 405,170
               C460,85 490,0 545,90
               C595,175 620,250 680,120
               C730,10 770,20 820,135
               C855,215 875,245 900,30"
            fill="none"
            stroke="#2563EB"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <path
            d="M0,210
               C55,180 85,220 130,195
               C175,170 205,60 265,95
               C320,130 345,250 405,170
               C460,85 490,0 545,90
               C595,175 620,250 680,120
               C730,10 770,20 820,135
               C855,215 875,245 900,30
               L900,260 L0,260 Z"
            fill="url(#fillIncome)"
          />
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-8 text-[12px] text-[#94A3B8]">
        {["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago"].map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
};

const RecentTable = () => {
  const rows = [
    {
      initials: "TE",
      client: "Tech Solutions S.A.",
      date: "Hace 2 horas",
      amount: "$1,200.00",
      status: "Pagada",
      statusClass: "bg-[#DCFCE7] text-[#15803D]",
    },
    {
      initials: "GH",
      client: "Global Hotels Ltd.",
      date: "Hace 5 horas",
      amount: "$4,550.00",
      status: "Pendiente",
      statusClass: "bg-[#FEF3C7] text-[#B45309]",
    },
    {
      initials: "AM",
      client: "Agencia MKT",
      date: "Ayer",
      amount: "$890.00",
      status: "Pagada",
      statusClass: "bg-[#DCFCE7] text-[#15803D]",
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
        <h3 className="text-[17px] font-bold text-[#0F172A]">Actividad Reciente</h3>
        <button className="text-[13px] font-semibold text-blue-600 hover:text-blue-700">
          Ver todo
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-[#F1F5F9] text-left text-[11px] uppercase tracking-[0.08em] text-[#475569]">
            <tr>
              <th className="px-6 py-3.5 font-semibold">Cliente</th>
              <th className="px-6 py-3.5 font-semibold">Fecha</th>
              <th className="px-6 py-3.5 font-semibold">Monto</th>
              <th className="px-6 py-3.5 font-semibold">Estado</th>
              <th className="px-6 py-3.5 font-semibold">Acción</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.client}
                className="border-t border-[#F1F5F9] text-[13px] hover:bg-[#F8FAFC] transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[12px] font-bold text-blue-600">
                      {row.initials}
                    </div>
                    <span className="font-semibold text-[#0F172A]">
                      {row.client}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[#64748B]">{row.date}</td>
                <td className="px-6 py-4 font-semibold text-[#0F172A]">{row.amount}</td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold ${row.statusClass}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-[#94A3B8] hover:text-[#475569] transition-colors">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function DashboardFacturaPro() {
  const router = useRouter();
  const newSaleState = navState(NEW_SALE_HREF);

  return (
    <AppLayout>
      {/* Fase 6.24: los indicadores todavía no se calculan con datos reales. */}
      <div role="note" aria-label="Datos de ejemplo" className="mb-5 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        <FlaskConical className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <p>
          <span className="font-bold">Datos de ejemplo.</span> Los indicadores, las gráficas y la actividad reciente de este panel todavía no se calculan con tus facturas.
        </p>
      </div>

      {/* Page header */}
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight text-[#0F172A]">
            Panel Principal
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Resumen financiero consolidado al {new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 text-[13px] font-medium text-[#475569] hover:bg-[#F8FAFC] transition-colors shadow-sm">
            <Calendar className="h-4 w-4" />
            Últimos 30 días
          </button>
          {newSaleState !== "hidden" && (
            <button
              onClick={() => router.push(NEW_SALE_HREF)}
              className="flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-[13px] font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Nueva venta
              <ScreenBadge state={newSaleState} />
            </button>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Ingresos Totales"
          value="$142,500.00"
          badge="+12.4%"
          badgeColor="bg-[#DCFCE7] text-[#15803D]"
          icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Facturas Pendientes"
          value="$34,210.00"
          badge="18 Facturas"
          badgeColor="bg-[#FEF3C7] text-[#B45309]"
          icon={<ClipboardList className="h-6 w-6 text-amber-500" />}
          iconBg="bg-amber-50"
        />
        <StatCard
          title="Pagos Recibidos"
          value="$108,290.00"
          badge="92% Éxito"
          badgeColor="bg-[#DCFCE7] text-[#15803D]"
          icon={<CheckCircle2 className="h-6 w-6 text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Gasto Operativo"
          value="$12,450.00"
          badge="+5.1%"
          badgeColor="bg-[#FEE2E2] text-[#B91C1C]"
          icon={<Receipt className="h-6 w-6 text-red-500" />}
          iconBg="bg-red-50"
        />
      </section>

      {/* Charts + side panels */}
      <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1.7fr_0.85fr]">
        <div className="space-y-5">
          <LineChartMock />
          <RecentTable />
        </div>

        <div className="space-y-5">
          {/* Quick actions */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-[16px] font-bold text-[#0F172A]">
              Acciones Rápidas
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <QuickAction
                icon={<Plus className="h-5 w-5" />}
                title="Nueva venta"
                href={NEW_SALE_HREF}
              />
              <QuickAction
                icon={<FileText className="h-5 w-5" />}
                title="Nueva Cotización"
                href="/pages/quotes/new"
              />
              <QuickAction
                icon={<UserPlus className="h-5 w-5" />}
                title="Añadir Clientes"
                href="/pages/catalogs/clients"
              />
              <QuickAction
                icon={<Upload className="h-5 w-5" />}
                title="Importar Datos"
                href="/pages/import"
              />
            </div>
          </div>

          {/* Top clients */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-[16px] font-bold text-[#0F172A]">
              Clientes Top
            </h3>

            <div className="space-y-4">
              <TopClient
                initials="IC"
                name="Innova Corp"
                subtitle="12 facturas este mes"
                amount="$24,500"
              />
              <TopClient
                initials="S5"
                name="Studio 54"
                subtitle="8 facturas este mes"
                amount="$18,200"
              />
              <TopClient
                initials="NS"
                name="Nexus S.A."
                subtitle="5 facturas este mes"
                amount="$12,400"
              />
            </div>

            <button className="mt-5 h-10 w-full rounded-xl bg-blue-600 text-[13px] font-semibold text-white hover:bg-blue-700 transition-colors">
              Analizar cartera
            </button>
          </div>

          {/* Help CTA */}
          <div className="relative overflow-hidden rounded-2xl bg-blue-600 p-5 text-white shadow-md">
            <div className="absolute right-[-20px] top-[-10px] h-32 w-32 rounded-full border-[10px] border-white/10" />
            <div className="absolute right-6 top-6 h-20 w-20 rounded-full border-[8px] border-white/10" />

            <h3 className="text-[16px] font-bold">¿Necesitas ayuda?</h3>
            <p className="mt-2 max-w-[240px] text-[13px] text-white/85">
              Consulta a nuestro experto financiero disponible 24/7 vía chat.
            </p>

            <button className="mt-4 rounded-xl bg-white px-4 py-2 text-[13px] font-semibold text-blue-600 transition hover:bg-slate-100">
              Iniciar Chat
            </button>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
