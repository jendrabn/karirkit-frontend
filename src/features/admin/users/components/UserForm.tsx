import {
  Controller,
  useForm,
  type FieldErrors,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { USER_ROLE_OPTIONS } from "@/types/user";
import { useServerValidation } from "@/hooks/use-server-validation";
import { displayFormErrors } from "@/lib/form-errors";
import { cn } from "@/lib/utils";
import {
  createUserInputSchema,
  type CreateUserInput,
} from "../api/create-user";
import {
  updateUserInputSchema,
  type UpdateUserInput,
} from "../api/update-user";
import type { User } from "@/types/user";

interface UserFormProps {
  initialData?: User;
  onSubmit: (data: CreateUserInput | UpdateUserInput) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: unknown;
}

type UserFormValues = CreateUserInput | UpdateUserInput;

export function UserForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  error,
}: UserFormProps) {
  const isEdit = !!initialData;
  const schema = isEdit ? updateUserInputSchema : createUserInputSchema;

  const form = useForm<UserFormValues, unknown, UserFormValues>({
    resolver: zodResolver(schema) as Resolver<
      UserFormValues,
      unknown,
      UserFormValues
    >,
    defaultValues: {
      name: initialData?.name || "",
      username: initialData?.username || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      role: initialData?.role ?? undefined,
      password: "",
    },
  });

  useServerValidation(error, form);

  return (
    <form onSubmit={form.handleSubmit(onSubmit, displayFormErrors)}>
      <FieldSet disabled={isLoading} className="mb-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? "Edit User" : "Tambah User"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field>
                <FieldLabel>
                  Nama Lengkap <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  placeholder="Masukkan nama lengkap"
                  {...form.register("name")}
                  className={cn(
                    form.formState.errors.name && "border-destructive",
                  )}
                />
                <FieldError>{form.formState.errors.name?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel>
                  Username <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  placeholder="Masukkan username"
                  {...form.register("username")}
                  className={cn(
                    form.formState.errors.username && "border-destructive",
                  )}
                />
                <FieldError>
                  {form.formState.errors.username?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>
                  Email <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  type="email"
                  placeholder="Masukkan email"
                  {...form.register("email")}
                  className={cn(
                    form.formState.errors.email && "border-destructive",
                  )}
                />
                <FieldError>{form.formState.errors.email?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel>
                  Password{" "}
                  {isEdit ? "" : <span className="text-destructive">*</span>}
                </FieldLabel>
                <Input
                  type="password"
                  placeholder="Masukkan password"
                  {...form.register("password")}
                  className={cn(
                    (form.formState.errors as FieldErrors<CreateUserInput>)
                      .password && "border-destructive",
                  )}
                />
                {isEdit && (
                  <FieldDescription>
                    Kosongkan jika tidak ingin mengubah password
                  </FieldDescription>
                )}
                <FieldError>
                  {
                    (form.formState.errors as FieldErrors<CreateUserInput>)
                      .password?.message
                  }
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>Nomor Telepon</FieldLabel>
                <Input
                  placeholder="Masukkan nomor telepon"
                  {...form.register("phone")}
                  className={cn(
                    form.formState.errors.phone && "border-destructive",
                  )}
                />
                <FieldError>{form.formState.errors.phone?.message}</FieldError>
              </Field>

              <Controller
                control={form.control}
                name="role"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>
                      Role <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <SelectTrigger
                        className={cn(
                          form.formState.errors.role && "border-destructive",
                        )}
                      >
                        <SelectValue placeholder="Pilih Role" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {USER_ROLE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError>
                      {form.formState.errors.role?.message}
                    </FieldError>
                  </Field>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </FieldSet>

      <div className="mt-8 flex justify-end gap-3 border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel || (() => window.history.back())}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Menyimpan...
            </>
          ) : isEdit ? (
            "Simpan Perubahan"
          ) : (
            "Simpan"
          )}
        </Button>
      </div>
    </form>
  );
}
