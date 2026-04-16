"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/app/components/layout/AppLayout";

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
} from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
};

const StatCard = ({ title, value, badge, badgeColor, icon }: StatCardProps) => (
  <div className="rounded-2xl border-2 border-[#173156] bg-[#08152b] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.01)]">
    <div className="mb-5 flex items-start justify-between">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0c2143]">
        {icon}
      </div>
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeColor}`}>
        {badge}
      </span>
    </div>

    <p className="text-[15px] text-slate-400">{title}</p>
    <h3 className="mt-2 text-2xl font-bold text-white">{value}</h3>
  </div>
);

const QuickAction = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => (
  <button className="flex h-32 flex-col items-center justify-center rounded-2xl border-2 border-[#173156] bg-[#0c1933] text-center transition hover:border-blue-500/40 hover:bg-[#102246]">
    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#0f2347] text-blue-400">
      {icon}
    </div>
    <span className="max-w-[110px] text-sm font-semibold text-white">
      {title}
    </span>
  </button>
);

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
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-400 text-sm font-bold text-slate-900">
        {initials}
      </div>
      <div>
        <p className="font-semibold text-white">{name}</p>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>
    </div>
    <p className="font-semibold text-white">{amount}</p>
  </div>
);

const LineChartMock = () => {
  return (
    <div className="relative h-[320px] w-full overflow-hidden rounded-2xl border-2 border-[#173156] bg-[#08152b] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-[20px] font-bold text-white">Tendencia de Ingresos</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            Ingresos
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
            Gastos
          </div>
        </div>
      </div>

      <div className="relative h-[230px] w-full">
        <svg viewBox="0 0 900 260" className="h-full w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.02" />
            </linearGradient>
          </defs>

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
            stroke="#1e88ff"
            strokeWidth="4"
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

      <div className="mt-4 grid grid-cols-8 text-sm text-slate-400">
        {["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago"].map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}

const RecentTable = () => {
  const rows = [
    {
      initials: "TE",
      client: "Tech Solutions S.A.",
      date: "Hace 2 horas",
      amount: "$1,200.00",
      status: "Pagada",
      statusClass: "bg-emerald-500/15 text-emerald-400",
    },
    {
      initials: "GH",
      client: "Global Hotels Ltd.",
      date: "Hace 5 horas",
      amount: "$4,550.00",
      status: "Pendiente",
      statusClass: "bg-amber-500/15 text-amber-400",
    },
    {
      initials: "AM",
      client: "Agencia MKT",
      date: "Ayer",
      amount: "$890.00",
      status: "Pagada",
      statusClass: "bg-emerald-500/15 text-emerald-400",
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-[#173156] bg-[#08152b]">
      <div className="flex items-center justify-between border-b border-[#173156] px-6 py-5">
        <h3 className="text-[20px] font-bold text-white">Actividad Reciente</h3>
        <button className="text-sm font-semibold text-blue-400 hover:text-blue-300">
          Ver todo
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-[#101f3a] text-left text-xs uppercase tracking-[0.08em] text-slate-400">
            <tr>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Monto</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Acción</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.client}
                className="border-t border-[#173156] text-sm text-slate-300"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#13284a] font-semibold text-blue-400">
                      {row.initials}
                    </div>
                    <span className="max-w-[180px] font-semibold text-white">
                      {row.client}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-slate-400">{row.date}</td>
                <td className="px-6 py-5 font-semibold text-white">{row.amount}</td>
                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${row.statusClass}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <button className="text-slate-400 hover:text-white">
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
  return (
    <AppLayout>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Panel Principal
          </h1>
          <p className="mt-2 text-lg text-slate-400">
            Resumen financiero consolidado al 24 de Octubre, 2023
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="flex h-12 items-center justify-center gap-2 rounded-2xl border-2 border-[#173156] bg-[#16233b] px-5 font-medium text-white">
            <Calendar className="h-4 w-4" />
            Últimos 30 días
          </button>
          <button 
            onClick={() => router.push("/pages/invoices/invoice")}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-blue-500 px-5 font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] hover:bg-blue-400">
            <Plus className="h-4 w-4" />
            Nueva Factura
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Ingresos Totales"
          value="$142,500.00"
          badge="+12.4%"
          badgeColor="bg-emerald-500/15 text-emerald-400"
          icon={<TrendingUp className="h-6 w-6 text-blue-400" />}
        />
        <StatCard
          title="Facturas Pendientes"
          value="$34,210.00"
          badge="18 Facturas"
          badgeColor="bg-amber-500/15 text-amber-400"
          icon={<ClipboardList className="h-6 w-6 text-amber-400" />}
        />
        <StatCard
          title="Pagos Recibidos"
          value="$108,290.00"
          badge="92% Éxito"
          badgeColor="bg-emerald-500/15 text-emerald-400"
          icon={<CheckCircle2 className="h-6 w-6 text-emerald-400" />}
        />
        <StatCard
          title="Gasto Operativo"
          value="$12,450.00"
          badge="+5.1%"
          badgeColor="bg-pink-500/15 text-pink-400"
          icon={<Receipt className="h-6 w-6 text-pink-400" />}
        />
      </section>

      <section className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_0.85fr]">
        <div className="space-y-6">
          <LineChartMock />
          <RecentTable />
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border-2 border-[#173156] bg-[#08152b] p-6">
            <h3 className="mb-5 text-[20px] font-bold text-white">
              Acciones Rápidas
            </h3>

            <div className="grid grid-cols-2 gap-4" onClick={() => router.push("/pages/invoices/invoice")}>
              <QuickAction
                icon={<Plus className="h-5 w-5" />}
                title="Crear Nueva Factura"
              />
              <QuickAction
                icon={<FileText className="h-5 w-5" />}
                title="Nueva Cotización"
              />
              <QuickAction
                icon={<UserPlus className="h-5 w-5" />}
                title="Añadir Clientes"
              />
              <QuickAction
                icon={<Upload className="h-5 w-5" />}
                title="Importar Datos"
              />
            </div>
          </div>

          <div className="rounded-2xl border-2 border-[#173156] bg-[#08152b] p-6">
            <h3 className="mb-5 text-[20px] font-bold text-white">
              Clientes Top
            </h3>

            <div className="space-y-5">
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

            <button className="mt-6 h-11 w-full rounded-xl bg-blue-500 font-semibold text-slate-300 hover:bg-blue-400 shadow-[0_10px_30px_rgba(37,99,235,0.25)] hover:text-white">
              Analizar cartera
            </button>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-blue-500 p-6 text-white shadow-[0_10px_30px_rgba(37,99,235,0.30)]">
            <div className="absolute right-[-20px] top-[-10px] h-32 w-32 rounded-full border-[10px] border-white/10" />
            <div className="absolute right-6 top-6 h-20 w-20 rounded-full border-[8px] border-white/10" />

            <h3 className="text-[20px] font-bold">¿Necesitas ayuda?</h3>
            <p className="mt-3 max-w-[280px] text-white/90">
              Consulta a nuestro experto financiero disponible 24/7 vía chat.
            </p>

            <button className="mt-6 rounded-xl bg-white px-5 py-3 font-semibold text-blue-600 transition hover:bg-slate-100">
              Iniciar Chat
            </button>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}