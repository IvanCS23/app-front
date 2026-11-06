"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  FileText,
  Users,
  Package,
  BarChart3,
  Shield,
  Zap,
  Cloud,
  CheckCircle,
} from "lucide-react";

/* ─── Ilustración del dashboard (lado derecho) ─── */
function DashboardIllustration() {
  const features = [
    { icon: FileText, label: "Facturación", cls: "text-blue-500 bg-blue-50" },
    { icon: Users,    label: "Clientes",    cls: "text-emerald-500 bg-emerald-50" },
    { icon: Package,  label: "Productos",   cls: "text-amber-500 bg-amber-50" },
    { icon: BarChart3, label: "Reportes",   cls: "text-violet-500 bg-violet-50" },
  ] as const;

  const pillars = [
    { icon: Shield, title: "Seguro y confiable",       desc: "Sus datos siempre protegidos" },
    { icon: Zap,    title: "Rápido y eficiente",        desc: "Optimizado para ahorrar tiempo" },
    { icon: Cloud,  title: "En la nube",                desc: "Acceda desde cualquier lugar" },
  ] as const;

  return (
    <div className="relative z-10 w-full max-w-lg">
      {/* Badge */}
      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-[#2563EB]">
        Su negocio, más eficiente
      </span>

      {/* Heading */}
      <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-[#0F172A]">
        Administre su empresa{" "}
        <span className="text-[#2563EB]">desde un solo lugar</span>
      </h1>

      <p className="mt-3 text-[15px] leading-relaxed text-[#64748B]">
        Facturación, clientes, productos, reportes y mucho más.
        <br />
        Todo lo que necesita para hacer crecer su negocio.
      </p>

      {/* Mockup card */}
      <div className="relative mt-8">
        {/* Checkmark badge */}
        <div className="absolute -right-3 -top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB] shadow-lg">
          <CheckCircle className="h-5 w-5 text-white" />
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-md">
          {/* Stats */}
          <div className="mb-4 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-[#F8FAFC] p-3">
              <p className="text-[11px] text-[#64748B]">Ingresos Totales</p>
              <p className="mt-1 text-base font-bold text-[#0F172A]">$142,500</p>
              <span className="text-[11px] font-semibold text-emerald-500">+12.4%</span>
            </div>
            <div className="rounded-xl bg-[#F8FAFC] p-3">
              <p className="text-[11px] text-[#64748B]">Facturas Pend.</p>
              <p className="mt-1 text-base font-bold text-[#0F172A]">18</p>
              <span className="text-[11px] font-semibold text-amber-500">Ver todas</span>
            </div>
            <div className="rounded-xl bg-[#F8FAFC] p-3">
              <p className="text-[11px] text-[#64748B]">Clientes Activos</p>
              <p className="mt-1 text-base font-bold text-[#0F172A]">248</p>
              <span className="text-[11px] font-semibold text-emerald-500">+8.2%</span>
            </div>
          </div>

          {/* Charts */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            {/* Line chart */}
            <div className="rounded-xl bg-[#F8FAFC] p-3">
              <p className="mb-2 text-[11px] font-semibold text-[#0F172A]">Tendencia de Ingresos</p>
              <svg viewBox="0 0 120 44" className="w-full" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 34 L15 26 L30 32 L45 17 L60 23 L75 12 L90 19 L105 9 L120 14"
                  stroke="#2563EB"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M0 34 L15 26 L30 32 L45 17 L60 23 L75 12 L90 19 L105 9 L120 14 L120 44 L0 44Z"
                  fill="url(#lg)"
                />
              </svg>
              <p className="mt-1 text-[10px] text-[#94A3B8]">Este mes</p>
            </div>

            {/* Donut chart */}
            <div className="flex flex-col rounded-xl bg-[#F8FAFC] p-3">
              <p className="text-[11px] font-semibold text-[#0F172A]">Gastos Operativos</p>
              <p className="mt-0.5 text-base font-bold text-[#0F172A]">$12,450</p>
              <span className="text-[11px] font-semibold text-emerald-500">+5.1%</span>
              <div className="mt-2 flex justify-center">
                <svg viewBox="0 0 44 44" className="h-14 w-14" aria-hidden="true">
                  <circle cx="22" cy="22" r="15" fill="none" stroke="#E2E8F0" strokeWidth="7" />
                  <circle cx="22" cy="22" r="15" fill="none" stroke="#2563EB" strokeWidth="7"
                    strokeDasharray="57 37" strokeDashoffset="15" strokeLinecap="round" />
                  <circle cx="22" cy="22" r="15" fill="none" stroke="#60A5FA" strokeWidth="7"
                    strokeDasharray="23 71" strokeDashoffset="-42" strokeLinecap="round" />
                  <circle cx="22" cy="22" r="15" fill="none" stroke="#F59E0B" strokeWidth="7"
                    strokeDasharray="14 80" strokeDashoffset="-65" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Feature icons */}
          <div className="grid grid-cols-4 gap-2">
            {features.map(({ icon: Icon, label, cls }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 rounded-xl bg-[#F8FAFC] p-2.5">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${cls}`}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <span className="text-[11px] font-medium text-[#64748B]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature pillars */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {pillars.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-xl border border-[#E2E8F0] bg-white p-3 transition hover:shadow-sm">
            <Icon className="mb-1.5 h-4 w-4 text-[#2563EB]" aria-hidden="true" />
            <p className="text-[11px] font-semibold text-[#0F172A]">{title}</p>
            <p className="mt-0.5 text-[10px] text-[#64748B]">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Página principal ─── */
export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [loading, setLoading]           = useState(false);

  const togglePasswordVisibility = () => setShowPassword((v) => !v);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const loggedIn = await login({ email, password });
      // Fase 6.32: con contraseña temporal, directo a cambiarla.
      router.push(loggedIn.must_change_password ? "/cambiar-contrasena" : "/pages/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* ── LADO IZQUIERDO: formulario ── */}
        <div className="flex flex-col justify-between px-6 py-8 sm:px-10 lg:px-16">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB]">
              <FileText className="h-4.5 w-4.5 text-white" aria-hidden="true" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#0F172A]">
              Factura<span className="text-[#2563EB]">Pro</span>
            </span>
          </div>

          {/* Card */}
          <div className="mx-auto w-full max-w-sm animate-[fadeIn_0.4s_ease]">
            <div className="rounded-2xl border border-[#E2E8F0] bg-white px-8 py-8 shadow-sm">

              {/* Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#0F172A]">Bienvenido 👋</h2>
                <p className="mt-1.5 text-sm text-[#64748B]">
                  Ingrese sus credenciales para acceder al sistema.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit} noValidate>

                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                  >
                    {error}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                  >
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
                      aria-hidden="true"
                    />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="nombre@empresa.com"
                      className="box box-input-icon rounded-xl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-[#0F172A]"
                    >
                      Contraseña
                    </label>
                    <Link
                      href="/recuperar-contrasena"
                      className="text-xs font-medium text-[#2563EB] transition-colors hover:text-[#1D4ED8]"
                    >
                      ¿Olvidó su contraseña?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
                      aria-hidden="true"
                    />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="box box-input-icon rounded-xl"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      onClick={togglePasswordVisibility}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] transition-colors hover:text-[#64748B]"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center gap-2.5">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-[#CBD5E1] focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-0"
                    style={{ accentColor: "#2563EB" }}
                  />
                  <label htmlFor="remember" className="text-sm text-[#64748B]">
                    Mantener sesión iniciada
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12" cy="12" r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar sesión →"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#E2E8F0]" />
                <span className="text-xs text-[#94A3B8]">o</span>
                <div className="h-px flex-1 bg-[#E2E8F0]" />
              </div>

              {/* Register */}
              <p className="text-center text-sm text-[#64748B]">
                ¿Aún no tienes una cuenta?{" "}
                <button className="font-semibold text-[#2563EB] transition-colors hover:text-[#1D4ED8]">
                  Regístrate aquí
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-[#94A3B8]">
            © 2026 FacturaPro &nbsp;·&nbsp; Versión 1.0.0
          </p>
        </div>

        {/* ── LADO DERECHO: ilustración ── */}
        <div className="relative hidden overflow-hidden bg-[#EFF6FF] lg:flex lg:items-center lg:justify-center lg:px-10 lg:py-12">
          {/* Decoraciones de fondo */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-200/25" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-100/40" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-3xl" />

          <DashboardIllustration />
        </div>

      </div>
    </div>
  );
}
