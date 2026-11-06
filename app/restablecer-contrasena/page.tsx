import type { Metadata } from "next";
import ResetPasswordScreen from "./ResetPasswordScreen";

/**
 * Fase 6.32 (D2): el enlace del correo trae el token después de `#`, que no
 * llega a ningún servidor. La página lo lee y lo borra de la barra de
 * direcciones; no envía Referer (aquí y en next.config.ts) ni carga scripts
 * de terceros.
 */
export const metadata: Metadata = {
  title: "Restablecer contraseña · FacturaPro",
  referrer: "no-referrer",
  robots: { index: false, follow: false },
};

export default function RestablecerContrasenaPage() {
  return <ResetPasswordScreen />;
}
