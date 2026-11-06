import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite HMR cuando el servidor de desarrollo se abre por Tailscale.
  // Next compara hosts (sin protocolo ni puerto) en esta lista.
  allowedDevOrigins: ["100.69.34.116"],

  // Fase 6.32 (D2): las pantallas de recuperación no envían Referer ni se
  // guardan en caché. El token del enlace va después de `#` y la página lo
  // borra de la barra de direcciones.
  async headers() {
    const accountRecovery = [
      { key: "Referrer-Policy", value: "no-referrer" },
      { key: "Cache-Control", value: "no-store" },
    ];

    return [
      { source: "/restablecer-contrasena", headers: accountRecovery },
      { source: "/recuperar-contrasena", headers: accountRecovery },
    ];
  },
};

export default nextConfig;
