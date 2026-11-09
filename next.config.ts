import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fase 6.33 (mitigación): el servidor de desarrollo ya no se abre por
  // Tailscale (sin allowedDevOrigins; `npm run dev` escucha sólo en
  // 127.0.0.1) hasta actualizar Next por sus avisos de seguridad.

  // Fase 6.33: la app no usa next/image (los logotipos son <img> con URL
  // blob:). Sin optimizador, /_next/image no procesa imágenes: se cierra la
  // superficie de sus avisos (ejecución remota con AVIF/SVG, SSRF). Los
  // archivos de public/ se sirven tal cual.
  images: { unoptimized: true },

  // Fase 6.32 (D2): las pantallas de recuperación no envían Referer. El
  // token del enlace va después de `#` (nunca llega al servidor ni al HTML)
  // y la página lo borra de la barra de direcciones. Cache-Control no se
  // fija aquí: Next.js lo reescribe para las páginas.
  async headers() {
    const accountRecovery = [{ key: "Referrer-Policy", value: "no-referrer" }];

    return [
      { source: "/restablecer-contrasena", headers: accountRecovery },
      { source: "/recuperar-contrasena", headers: accountRecovery },
    ];
  },
};

export default nextConfig;
