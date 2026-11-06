"use client";

import dynamic from "next/dynamic";

// El token vive sólo en el navegador (window.location.hash): el formulario no
// se prerenderiza en el servidor.
const ResetPasswordForm = dynamic(() => import("./ResetPasswordForm"), { ssr: false });

export default function ResetPasswordScreen() {
  return <ResetPasswordForm />;
}
