import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UsuariosPage from "./page";
import { useAuth } from "@/src/hooks/useAuth";
import type { User } from "@/src/types/user";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => "/" }));
vi.mock("@/app/components/layout/AppLayout", () => ({ default: ({ children }: { children: ReactNode }) => <div>{children}</div> }));
vi.mock("@/src/hooks/useAuth", () => ({ useAuth: vi.fn() }));

const member: User = {
  id: 7,
  name: "Ana Pérez",
  email: "ana@example.com",
  avatar: null,
  role: "employee",
  status: "active",
  phone: null,
  position: null,
  branch: null,
  must_change_password: false,
  password_changed_at: null,
  last_login_at: null,
  created_at: "2026-10-01T00:00:00Z",
  company: null,
};

vi.mock("@/src/hooks/useUsers", () => ({
  useUsers: () => ({
    users: [member],
    meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
    isLoading: false,
    search: "",
    setSearch: vi.fn(),
    roleFilter: "",
    setRoleFilter: vi.fn(),
    statusFilter: "",
    setStatusFilter: vi.fn(),
    page: 1,
    setPage: vi.fn(),
    hasFilters: false,
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    patchUser: vi.fn(),
  }),
}));

function signedInAs(role: string) {
  vi.mocked(useAuth).mockReturnValue({ user: { id: 1, name: "Sesión", email: "s@example.com", avatar: null, role, company: null } } as unknown as ReturnType<typeof useAuth>);
}

describe("Usuarios: acciones sólo para administradores (Fase 6.27b)", () => {
  beforeEach(() => vi.mocked(useAuth).mockReset());

  it("un Admin ve crear, editar, seguridad y desactivar", () => {
    signedInAs("admin");
    render(<UsuariosPage />);

    expect(screen.getByRole("button", { name: /Nuevo usuario/ })).toBeInTheDocument();
    expect(screen.getByTitle("Editar usuario")).toBeInTheDocument();
    expect(screen.getByTitle("Seguridad")).toBeInTheDocument();
    expect(screen.getByTitle("Desactivar usuario")).toBeInTheDocument();
    expect(screen.queryByText("Solo un administrador puede crear, editar o desactivar usuarios.")).not.toBeInTheDocument();
  });

  it.each(["accountant", "sales", "employee"])("%s ve la lista sin acciones de administración", (role) => {
    signedInAs(role);
    render(<UsuariosPage />);

    expect(screen.getByText("Ana Pérez")).toBeInTheDocument();
    expect(screen.getByText("Solo un administrador puede crear, editar o desactivar usuarios.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Nuevo usuario/ })).not.toBeInTheDocument();
    expect(screen.queryByTitle("Editar usuario")).not.toBeInTheDocument();
    expect(screen.queryByTitle("Seguridad")).not.toBeInTheDocument();
    expect(screen.queryByTitle("Desactivar usuario")).not.toBeInTheDocument();
    expect(screen.queryByRole("columnheader", { name: "Acciones" })).not.toBeInTheDocument();
  });
});
