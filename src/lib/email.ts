/**
 * Fase 6.30: validación de correos para Clientes y para el envío de facturas.
 * Ayuda de UX; el backend valida de nuevo (email:rfc).
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmailAddress(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}
