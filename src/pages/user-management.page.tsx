import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { UserCreateForm } from "@/components/user-create-form";
import { Edit, Trash } from "lucide-react";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email_address: string;
  account_status: string;
  user_role: string;
  created_at_utc: string;
}

const MOCK_USERS: User[] = [
  {
    id: "1",
    first_name: "Ana",
    last_name: "Silva",
    email_address: "ana.silva@tech.com",
    account_status: "1",
    user_role: "ADMIN_TI",
    created_at_utc: "2026-03-12T14:20:00.000Z",
  },
  {
    id: "2",
    first_name: "Bruno",
    last_name: "Mendes",
    email_address: "bruno.mendes@tech.com",
    account_status: "0",
    user_role: "DEFAULT_USER",
    created_at_utc: "2026-08-01T09:15:30.000Z",
  },
];

const columnHelper = createColumnHelper<User>();

export const UserManagementPage = () => {
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
          const isActive = info.getValue() === "1";
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

      columnHelper.display({
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => console.log("Editar:", row.original.id)}
              className="text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              <Edit />
            </button>
            <button
              type="button"
              onClick={() => console.log("Excluir:", row.original.id)}
              className="text-xs font-medium text-rose-600 hover:text-rose-800"
            >
              <Trash />
            </button>
          </div>
        ),
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
        <UserCreateForm />
      </div>

      <DataTable columns={columns} data={MOCK_USERS} />
    </div>
  );
};
