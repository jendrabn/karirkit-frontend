import { useState, type ChangeEvent } from "react";
import {
  Controller,
  useController,
  useForm,
  useWatch,
  type Control,
  type FieldErrors,
  type Resolver,
} from "react-hook-form";
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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { useServerValidation } from "@/hooks/use-server-validation";
import { displayFormErrors } from "@/lib/form-errors";
import { PhotoUpload } from "@/components/PhotoUpload";
import { USER_ROLE_OPTIONS } from "@/types/user";
import {
  DEFAULT_DOCUMENT_STORAGE_LIMIT,
  createUserInputSchema,
  type CreateUserInput,
} from "../api/create-user";
import {
  updateUserInputSchema,
  type UpdateUserInput,
} from "../api/update-user";
import type { User } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bytesToMegabytes, cn, megabytesToBytes } from "@/lib/utils";

interface UserFormProps {
  initialData?: User;
  onSubmit: (data: CreateUserInput | UpdateUserInput) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: unknown;
}

type UserFormValues = CreateUserInput | UpdateUserInput;

const StorageLimitInput = ({
  control,
  errorMessage,
}: {
  control: Control<UserFormValues>;
  errorMessage?: string;
}) => {
  const { field } = useController({ control, name: "document_storage_limit" });
  const [inputValue, setInputValue] = useState(() => {
    if (field.value == null || Number.isNaN(field.value)) {
      return "";
    }

    return String(Math.round(bytesToMegabytes(field.value)));
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;

    setInputValue(rawValue);

    if (rawValue.trim() === "") {
      field.onChange(undefined);
      return;
    }

    const parsedValue = Number(rawValue);

    if (Number.isNaN(parsedValue)) {
      field.onChange(undefined);
      return;
    }

    field.onChange(megabytesToBytes(parsedValue));
  };

  const handleBlur = () => {
    const rawValue = inputValue.trim();

    if (rawValue === "") {
      field.onChange(undefined);
      field.onBlur();
      return;
    }

    const parsedValue = Number(rawValue);

    if (Number.isNaN(parsedValue)) {
      field.onChange(undefined);
      field.onBlur();
      return;
    }

    setInputValue(String(parsedValue));
    field.onChange(megabytesToBytes(parsedValue));
    field.onBlur();
  };

  return (
    <Input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      placeholder="100"
      value={inputValue}
      onChange={(event) => {
        if (!/^\d*$/.test(event.target.value)) {
          return;
        }
        handleChange(event);
      }}
      onBlur={handleBlur}
      className={cn(errorMessage && "border-destructive")}
    />
  );
};

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
    resolver: zodResolver(schema) as Resolver<UserFormValues, unknown, UserFormValues>,
    defaultValues: {
      name: initialData?.name || "",
      username: initialData?.username || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      role: initialData?.role ?? undefined,
      avatar: initialData?.avatar || "",
      daily_download_limit: initialData?.daily_download_limit || 10,
      document_storage_limit:
        initialData?.document_storage_limit || DEFAULT_DOCUMENT_STORAGE_LIMIT,
      ...(isEdit ? {} : { password: "" }),
    },
  });

  useServerValidation(error, form);

  const nameValue = useWatch({ control: form.control, name: "name" });

  const handleSubmit = (data: UserFormValues) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit, displayFormErrors)}>
      <FieldSet disabled={isLoading} className="space-y-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? "Edit User" : "Tambah User"}</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <div className="md:col-span-2">
                    <PhotoUpload
                      value={field.value || ""}
                      onChange={field.onChange}
                      name={nameValue}
                    />
                    <FieldError className="mt-2">
                      {form.formState.errors.avatar?.message}
                    </FieldError>
                  </div>
                )}
              />
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

              {!isEdit && (
                <Field>
                  <FieldLabel>
                    Password <span className="text-destructive">*</span>
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
                  <FieldError>
                    {!isEdit
                      ? (form.formState.errors as FieldErrors<CreateUserInput>)
                          .password?.message
                      : undefined}
                  </FieldError>
                </Field>
              )}

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

              <Field>
                <FieldLabel>Batas Unduhan Harian</FieldLabel>
                <Input
                  type="number"
                  min={0}
                  max={1000}
                  placeholder="10"
                  {...form.register("daily_download_limit")}
                  className={cn(
                    form.formState.errors.daily_download_limit &&
                      "border-destructive",
                  )}
                />
                <FieldError>
                  {form.formState.errors.daily_download_limit?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>Batas Penyimpanan Dokumen</FieldLabel>
                <StorageLimitInput
                  control={form.control}
                  errorMessage={
                    form.formState.errors.document_storage_limit?.message
                  }
                />
                <FieldDescription>Nilai dalam MB.</FieldDescription>
                <FieldError>
                  {form.formState.errors.document_storage_limit?.message}
                </FieldError>
              </Field>
            </div>
          </CardContent>
        </Card>
      </FieldSet>

      <div className="flex justify-end gap-3 pt-6 border-t mt-8">
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
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
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
