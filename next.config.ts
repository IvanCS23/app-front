import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite HMR cuando el servidor de desarrollo se abre por Tailscale.
  // Next compara hosts (sin protocolo ni puerto) en esta lista.
  allowedDevOrigins: ["100.69.34.116"],
};

export default nextConfig;
