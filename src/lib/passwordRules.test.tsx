import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PASSWORD_HINT, PASSWORD_MIN_LENGTH, PASSWORD_PLACEHOLDER } from "./passwordRules";
import UserForm from "@/app/components/users/UserForm";
import ChangePasswordModal from "@/app/components/users/ChangePasswordModal";
import ChangePasswordForm from "@/app/components/auth/ChangePasswordForm";
import ResetPasswordForm from "@/app/restablecer-contrasena/ResetPasswordForm";
import type { User, UserFormValues } from "@/src/types/user";

vi.mock("@/src/hooks/useAuth", () => ({ useAuth: () => ({ changePassword: vi.fn() }) }));

const emptyForm: UserFormValues = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  role: "",
  status: "active",
  phone: "",
  position: "",
  branch: "",
  must_change_password: true,
  avatar: null,
};

describe("texto de ayuda de la contraseña (Fase 6.32)", () => {
  it("describe las reglas de producción de Laravel: 12, mayúsculas, minúsculas, números, símbolos y no filtrada", () => {
    expect(PASSWORD_MIN_LENGTH).toBe(12);
    expect(PASSWORD_HINT).toContain("12 caracteres");
    for (const part of ["mayúsculas", "minúsculas", "números", "símbolos", "filtraciones"]) {
      expect(PASSWORD_HINT).toContain(part);
    }
    expect(PASSWORD_PLACEHOLDER).toContain("12");
  });

  it("aparece en los cuatro caminos y ya no queda 'Mínimo 8 caracteres'", () => {
    window.history.replaceState(null, "", "/restablecer-contrasena#token=abc&email=a%40b.c");
    const user = { id: 9, name: "Persona", email: "p@example.com" } as User;

    const views = [
      render(<ChangePasswordForm />),
      render(<ResetPasswordForm />),
      render(<UserForm mode="create" values={emptyForm} errors={{}} onChange={vi.fn()} />),
      render(<ChangePasswordModal user={user} onClose={vi.fn()} onSubmit={vi.fn()} onSuccess={vi.fn()} onError={vi.fn()} />),
    ];

    expect(screen.getAllByText(PASSWORD_HINT)).toHaveLength(4);
    expect(screen.queryByPlaceholderText(/Mínimo 8/)).not.toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(PASSWORD_PLACEHOLDER)).toHaveLength(2);
    views.forEach((view) => view.unmount());
  });
});
