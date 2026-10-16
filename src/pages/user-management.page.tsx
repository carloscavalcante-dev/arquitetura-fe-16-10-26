import { useCallback, useEffect, useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { UserCreateForm } from "@/components/user-create-form";

export interface User {
  id: string | number;
  first_name: string;
  last_name: string;
  email_address: string;
  account_status: string | number;
  user_role: string;
  created_at_utc: string;
}

const API_URL = "http://localhost:3333/users";

const columnHelper = createColumnHelper<User>();

export const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Erro ao buscar usuários");
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
      setError("Falha ao carregar a lista de usuários.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUserCreated = (createdUser: User) => {
    setUsers((prev) => [...prev, createdUser]);
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => `${row.first_name} ${row.last_name}`, {
        id: "fullName",
        header: "Nome Completo",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-medium text-slate-900">
              {info.getValue()}
            </span>
            <span className="text-xs text-slate-500">
              {info.row.original.email_address}
            </span>
          </div>
        ),
      }),

      columnHelper.accessor("user_role", {
        header: "Cargo / Permissão",
        cell: (info) => (
          <span className="rounded bg-slate-100 px-2 py-1 font-mono text-sm text-slate-700">
            {info.getValue()}
          </span>
        ),
      }),

      columnHelper.accessor("account_status", {
        header: "Status",
        cell: (info) => {
          const isActive = String(info.getValue()) === "1";
          return (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                isActive
                  ? "border border-emerald-200 bg-emerald-100 text-emerald-800"
                  : "border border-rose-200 bg-rose-100 text-rose-800"
              }`}
            >
              {isActive ? "Ativo" : "Inativo"}
            </span>
          );
        },
      }),

      columnHelper.accessor("created_at_utc", {
        header: "Criado em",
        cell: (info) => {
          const date = new Date(info.getValue());
          return (
            <span className="text-sm text-slate-600">
              {isNaN(date.getTime())
                ? info.getValue()
                : date.toLocaleDateString("pt-BR")}
            </span>
          );
        },
      }),
    ],
    []
  );

  return (
    <div className="w-8/10 space-y-4 p-6">
      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900">
            Gestão de Usuários
          </h1>
          <p className="text-sm text-slate-500">
            Listagem e controle de permissões de membros da equipe.
          </p>
        </div>
        <UserCreateForm onSuccess={handleUserCreated} />
      </div>

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <DataTable columns={columns} data={users} isLoading={isLoading} />
    </div>
  );
};
