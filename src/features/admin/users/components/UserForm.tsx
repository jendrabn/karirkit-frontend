import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import { Field, FieldLabel, FieldError, FieldSet } from "@/components/ui/field";
import { useFormErrors } from "@/hooks/use-form-errors";
import { AvatarUpload } from "./AvatarUpload";
import { USER_ROLE_OPTIONS } from "@/types/user";
import {
  createUserInputSchema,
  type CreateUserInput,
} from "../api/create-user";
import {
  updateUserInputSchema,
  type UpdateUserInput,
} from "../api/update-user";
import type { User } from "../api/get-users";
import { Card } from "@/components/ui/card";

interface UserFormProps {
  initialData?: User;
  onSubmit: (data: CreateUserInput | UpdateUserInput) => void;
  isLoading?: boolean;
}

export function UserForm({ initialData, onSubmit, isLoading }: UserFormProps) {
  const isEdit = !!initialData;

  const form = useForm<CreateUserInput | UpdateUserInput>({
    resolver: zodResolver(
      isEdit ? updateUserInputSchema : createUserInputSchema
    ),
    defaultValues: {
      name: initialData?.name || "",
      username: initialData?.username || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      role: initialData?.role || "user",
      avatar: initialData?.avatar || "",
      ...(isEdit ? {} : { password: "" }),
    },
  });

  useFormErrors(form);

  const handleSubmit = (data: CreateUserInput | UpdateUserInput) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldSet disabled={isLoading} className="space-y-6 mb-6">
        <Card className="p-6">
          <Controller
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <div className="flex justify-center mb-6">
                <Field>
                  <AvatarUpload
                    value={field.value}
                    onChange={field.onChange}
                    name={form.watch("name")}
                  />
                  <FieldError>
                    {form.formState.errors.avatar?.message}
                  </FieldError>
                </Field>
              </div>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field>
              <FieldLabel>Nama Lengkap *</FieldLabel>
              <Input
                placeholder="Masukkan nama lengkap"
                {...form.register("name")}
              />
              <FieldError>{form.formState.errors.name?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Username *</FieldLabel>
              <Input
                placeholder="Masukkan username"
                {...form.register("username")}
              />
              <FieldError>{form.formState.errors.username?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Email *</FieldLabel>
              <Input
                type="email"
                placeholder="Masukkan email"
                {...form.register("email")}
              />
              <FieldError>{form.formState.errors.email?.message}</FieldError>
            </Field>

            {!isEdit && (
              <Field>
                <FieldLabel>Password *</FieldLabel>
                <Input
                  type="password"
                  placeholder="Masukkan password"
                  {...form.register("password")}
                />
                <FieldError>
                  {(form.formState.errors as any).password?.message}
                </FieldError>
              </Field>
            )}

            <Field>
              <FieldLabel>Nomor Telepon</FieldLabel>
              <Input
                placeholder="Masukkan nomor telepon"
                {...form.register("phone")}
              />
              <FieldError>{form.formState.errors.phone?.message}</FieldError>
            </Field>

            <Controller
              control={form.control}
              name="role"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Role *</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      {USER_ROLE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError>{form.formState.errors.role?.message}</FieldError>
                </Field>
              )}
            />
          </div>
        </Card>
      </FieldSet>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Batal
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : isEdit ? "Update User" : "Tambah User"}
        </Button>
      </div>
    </form>
  );
}
