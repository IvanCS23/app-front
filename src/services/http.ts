
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("api_token");
}
export function getAuthHeaders() {
  const token = getToken();
  if (!token) throw new Error("No hay sesión activa");

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
}