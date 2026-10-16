import React from "react";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const API_URL = "http://localhost:3333/users";

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface UserCreateFormProps {
  onSuccess?: (createdUser: any) => void;
  onSubmit?: (data: UserFormData) => void;
  isLoading?: boolean;
}

const INITIAL_STATE: UserFormData = {
  firstName: "",
  lastName: "",
  email: "",
  role: "DEFAULT_USER",
  isActive: true,
};

export const UserCreateForm = ({
  onSuccess,
  onSubmit,
  isLoading: externalLoading = false,
}: UserCreateFormProps) => {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<UserFormData>(INITIAL_STATE);
  const [internalLoading, setInternalLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const isLoading = externalLoading || internalLoading;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setInternalLoading(true);
      setError(null);

      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email_address: formData.email,
        account_status: formData.isActive ? 1 : 0,
        user_role: formData.role,
        created_at_utc: new Date().toISOString(),
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar usuário");
      }

      const createdUser = await response.json();
      onSubmit?.(formData);
      onSuccess?.(createdUser);
      setFormData(INITIAL_STATE);
      setOpen(false);
    } catch (err) {
      console.error("Erro ao cadastrar usuário:", err);
      setError("Falha ao cadastrar o usuário. Tente novamente.");
    } finally {
      setInternalLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-9 gap-1.5 self-start sm:self-auto">
          <Plus className="size-4" />
          Novo Usuário
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-lg p-6 sm:max-w-lg">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-lg font-bold">
            Cadastrar Novo Usuário
          </DialogTitle>
          <DialogDescription className="text-xs">
            Preencha as informações abaixo para adicionar um novo membro à
            equipe.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-md border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName" className="text-xs">
                Primeiro Nome
              </Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Ex: Ana"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lastName" className="text-xs">
                Sobrenome
              </Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Ex: Silva"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs">
              E-mail Corporativo
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="exemplo@tech.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role" className="text-xs">
              Papel / Permissão
            </Label>
            <Select
              name="role"

              value={formData.role}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Selecione um papel" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="DEFAULT_USER">
                  Usuário Padrão (DEFAULT_USER)
                </SelectItem>
                <SelectItem value="ADMIN_TI">
                  Administrador TI (ADMIN_TI)
                </SelectItem>
                <SelectItem value="FINANCE_OPERATOR">
                  Financeiro (FINANCE_OPERATOR)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={handleChange}
              className="border-input accent-primary size-4 rounded"
            />
            <Label
              htmlFor="isActive"
              className="cursor-pointer text-xs font-normal"
            >
              Conta ativa imediatamente
            </Label>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Cadastrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
