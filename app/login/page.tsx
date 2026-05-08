"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginRequest, saveSession } from "@/src/services/auth.services";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Headphones,
  WalletCards,
} from "lucide-react";

export default function LoginFacturaPro() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((v) => !v);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { token, user } = await loginRequest({ email, password });
      saveSession(token, user);
      router.push("/pages/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Lado izquierdo - se mantiene igual */}
        <div className="relative hidden lg:flex items-center justify-center overflow-hidden border-r border-white/5 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.22),_transparent_35%),linear-gradient(180deg,#071427_0%,#03101d_100%)]">
          {/* puntitos de fondo */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:22px_22px] opacity-20" />

          {/* brillo */}
          <div className="absolute left-[-10%] top-0 h-full w-[60%] bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 max-w-md px-10 text-left">
            <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 shadow-[0_0_30px_rgba(37,99,235,0.15)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                <WalletCards className="h-6 w-6 text-blue-400" />
              </div>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
              Potencia tu{" "}
              <span className="text-blue-500">Estrategia Financiera</span>
            </h1>

            <p className="mt-6 max-w-sm text-base leading-7 text-slate-400">
              “La eficiencia no es solo ahorrar dinero, es maximizar el valor
              de cada transacción con precisión y visión.”
            </p>

            <div className="mt-10 flex items-center gap-2">
              <div className="h-[2px] w-14 bg-blue-500" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-500">
                FacturaPro Enterprise
              </span>
              <div className="h-[2px] w-14 bg-blue-500" />
            </div>
          </div>
        </div>

        {/* Lado derecho */}
        <div className="flex items-center justify-center bg-[#06111f] px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 ring-1 ring-blue-400/20">
                <WalletCards className="h-5 w-5 text-blue-400" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Factura<span className="text-blue-500">Pro</span>
              </span>
            </div>

            {/* Encabezado */}
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                Bienvenido de nuevo
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Ingrese sus credenciales para acceder a su panel de control.
              </p>
            </div>

            {/* Formulario */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Mensaje de error */}
              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Correo electrónico corporativo
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    placeholder="nombre@empresa.com"
                    className="box box-input-icon"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-300">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    className="text-xs font-medium text-blue-400 hover:text-blue-300"
                  >
                    ¿Olvidó su contraseña?
                  </button>
                </div>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="box box-input-icon"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Checkbox */}
              <div className="flex items-center gap-3">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-700 bg-[#081423] text-blue-500 focus:ring-blue-500 focus:ring-offset-0 focus:ring-1 checked:bg-blue-500 checked:border-blue-500 transition-colors"
                  style={{ accentColor: "#3b82f6" }}
                />
                <label htmlFor="remember" className="text-sm text-slate-400">
                  Mantener sesión iniciada
                </label>
              </div>

              {/* Botón */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-500 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition hover:bg-blue-400 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                {!loading && <span className="text-base">→</span>}
              </button>
            </form>

            {/* Texto inferior */}
            <div className="mt-8 text-center text-sm text-slate-500">
              ¿No tiene una cuenta corporativa?{" "}
              <button className="font-medium text-blue-400 hover:text-blue-300">
                Contacte a ventas
              </button>
            </div>

            {/* Footer */}
            <div className="mt-5 flex items-center justify-center gap-8 border-t border-white/5 pt-6 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              <div className="flex items-center gap-2">
                <Headphones className="h-3.5 w-3.5" />
                Soporte
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5" />
                Seguridad
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}