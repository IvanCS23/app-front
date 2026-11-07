/**
 * Fase 6.32: texto de ayuda de toda contraseña nueva (cambio propio,
 * recuperación, contraseña temporal al crear un usuario y cambio por el
 * Admin). Describe las reglas de producción de Laravel
 * (Password::defaults() en AppServiceProvider): 12 caracteres, mayúsculas y
 * minúsculas, números, símbolos y que no aparezca en filtraciones.
 * Si cambian allá, cambia aquí; la prueba de cada lado lo fija.
 */
export const PASSWORD_MIN_LENGTH = 12;

export const PASSWORD_HINT =
  "Al menos 12 caracteres, con mayúsculas, minúsculas, números y símbolos. No debe aparecer en filtraciones de datos conocidas.";

export const PASSWORD_PLACEHOLDER = "Al menos 12 caracteres";
