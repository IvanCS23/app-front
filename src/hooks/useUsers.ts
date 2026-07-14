"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createUser, deleteUser, getUsers, updateUser } from "@/src/services/users";
import type {
  PaginationMeta,
  User,
  UserRole,
  UserStatus,
} from "@/src/types/user";

const emptyMeta: PaginationMeta = {
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
};

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: UserRole | "";
  status: UserStatus;
  phone: string;
  position: string;
  branch: string;
  must_change_password: boolean;
  avatar: File | null;
}

export interface UpdateUserInput {
  name: string;
  email: string;
  role: UserRole | "";
  status: UserStatus;
  phone: string;
  position: string;
  branch: string;
  avatar: File | null;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(emptyMeta);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "">("");
  const [page, setPage] = useState(1);

  // Debounce search input to avoid a request per keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [roleFilter, statusFilter]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getUsers({
        search: debouncedSearch,
        role: roleFilter,
        status: statusFilter,
        page,
      });
      setUsers(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar usuarios");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, roleFilter, statusFilter, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const create = useCallback(
    async (values: CreateUserInput) => {
      setIsMutating(true);
      try {
        await createUser({ ...values, role: values.role || "" });
        await fetchUsers();
      } finally {
        setIsMutating(false);
      }
    },
    [fetchUsers]
  );

  const update = useCallback(
    async (id: number, values: UpdateUserInput) => {
      setIsMutating(true);
      try {
        await updateUser(id, { ...values, role: values.role || "" });
        await fetchUsers();
      } finally {
        setIsMutating(false);
      }
    },
    [fetchUsers]
  );

  const remove = useCallback(
    async (id: number) => {
      setIsMutating(true);
      try {
        await deleteUser(id);
        await fetchUsers();
      } finally {
        setIsMutating(false);
      }
    },
    [fetchUsers]
  );

  const hasFilters = useMemo(
    () => Boolean(debouncedSearch || roleFilter || statusFilter),
    [debouncedSearch, roleFilter, statusFilter]
  );

  const patchUser = useCallback((updated: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  }, []);

  return {
    users,
    meta,
    isLoading,
    isMutating,
    error,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    hasFilters,
    refetch: fetchUsers,
    create,
    update,
    remove,
    patchUser,
  };
}
