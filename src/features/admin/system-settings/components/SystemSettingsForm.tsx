import { useMemo, useState } from "react";
import { Loader2, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useSystemSettings } from "../api/get-system-settings";
import { useUpdateSystemSettings } from "../api/update-system-settings";
import type {
  SystemSetting,
  SystemSettingPrimitive,
  SystemSettingType,
  SystemSettingValue,
  UpdateSystemSettingsPayload,
} from "@/types/system-settings";

type FormValues = Record<string, SystemSettingPrimitive>;
type FieldErrors = Record<string, string>;

type ApiError = {
  response?: {
    data?: {
      errors?: Record<string, string[]>;
    };
  };
};

const NUMBER_TYPES = new Set<SystemSettingType>([
  "number",
  "integer",
  "float",
  "decimal",
]);

function toHeadline(value: string) {
  return value
    .split(/[._-]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function isNumberType(type: SystemSettingType) {
  return NUMBER_TYPES.has(type);
}

function toFormValue(
  value: SystemSettingValue,
  type: SystemSettingType,
): SystemSettingPrimitive {
  if (type === "boolean") {
    return Boolean(value);
  }

  if (isNumberType(type)) {
    if (typeof value === "number") {
      return value;
    }

    if (value === null || value === "") {
      return null;
    }

    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  if (typeof value === "string") {
    return value;
  }

  if (value === null || value === undefined) {
    return "";
  }

  return JSON.stringify(value);
}

function buildValuesMap(items: SystemSetting[]) {
  return items.reduce<FormValues>((acc, item) => {
    acc[item.key] = toFormValue(item.value, item.type);
    return acc;
  }, {});
}

function getInputDisplayValue(value: SystemSettingPrimitive) {
  if (value === null || typeof value === "boolean") {
    return "";
  }

  return String(value);
}

function toPayloadValue(
  setting: SystemSetting,
  value: SystemSettingPrimitive,
): SystemSettingValue {
  if (setting.type === "boolean") {
    return Boolean(value);
  }

  if (isNumberType(setting.type)) {
    if (value === null || value === "") {
      return null;
    }

    const parsed = Number(value);

    if (Number.isNaN(parsed)) {
      throw new Error("Invalid number value");
    }

    return parsed;
  }

  if (setting.type === "json") {
    if (!value) {
      return null;
    }

    return JSON.parse(String(value));
  }

  return value ?? "";
}

function extractFieldErrors(error: unknown) {
  const apiError = error as ApiError;
  const serverErrors = apiError.response?.data?.errors;

  if (!serverErrors) {
    return {};
  }

  return Object.entries(serverErrors).reduce<FieldErrors>((acc, [key, value]) => {
    if (key === "general") {
      return acc;
    }

    acc[key] = value[0] ?? "Nilai tidak valid.";
    return acc;
  }, {});
}

function getSettingIdentifier(setting: SystemSetting, index: number) {
  return setting.id || setting.key || `setting-${index}`;
}

export function SystemSettingsForm() {
  const { data, isLoading, isError, refetch } = useSystemSettings();
  const updateSystemSettingsMutation = useUpdateSystemSettings();

  const settings = useMemo(() => data?.items ?? [], [data?.items]);
  const baseValues = useMemo(() => buildValuesMap(settings), [settings]);
  const [draftValues, setDraftValues] = useState<FormValues>({});
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const groupedSettings = useMemo(() => {
    return settings.reduce<Array<{ group: string; items: SystemSetting[] }>>(
      (acc, setting) => {
        const existingGroup = acc.find((item) => item.group === setting.group);

        if (existingGroup) {
          existingGroup.items.push(setting);
          return acc;
        }

        acc.push({
          group: setting.group,
          items: [setting],
        });
        return acc;
      },
      [],
    );
  }, [settings]);

  const hasChanges = useMemo(() => {
    if (settings.length === 0) {
      return false;
    }

    return settings.some((setting) => {
      const currentValue =
        setting.key in draftValues
          ? draftValues[setting.key]
          : baseValues[setting.key];

      return currentValue !== baseValues[setting.key];
    });
  }, [baseValues, draftValues, settings]);

  const handleReset = () => {
    setDraftValues({});
    setFieldErrors({});
  };

  const handleBooleanChange = (key: string, checked: boolean) => {
    setDraftValues((prev) => {
      const next = { ...prev };

      if (checked === baseValues[key]) {
        delete next[key];
      } else {
        next[key] = checked;
      }

      return next;
    });

    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleInputChange = (setting: SystemSetting, rawValue: string) => {
    let nextValue: SystemSettingPrimitive = rawValue;

    if (isNumberType(setting.type)) {
      if (rawValue === "") {
        nextValue = null;
      } else {
        const parsed = Number(rawValue);
        nextValue = Number.isNaN(parsed) ? null : parsed;
      }
    }

    setDraftValues((prev) => {
      const next = { ...prev };

      if (nextValue === baseValues[setting.key]) {
        delete next[setting.key];
      } else {
        next[setting.key] = nextValue;
      }

      return next;
    });

    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[setting.key];
      return next;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextFieldErrors: FieldErrors = {};
    const payload = settings.reduce<UpdateSystemSettingsPayload>((acc, setting) => {
      if (!setting.is_editable) {
        return acc;
      }

      try {
        const currentValue =
          setting.key in draftValues
            ? draftValues[setting.key]
            : baseValues[setting.key];

        acc[setting.key] = toPayloadValue(setting, currentValue);
      } catch {
        nextFieldErrors[setting.key] = "Format nilai tidak valid.";
      }

      return acc;
    }, {});

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      toast.error("Periksa kembali pengaturan yang belum valid.");
      return;
    }

    updateSystemSettingsMutation.mutate(payload, {
      onSuccess: () => {
        setDraftValues({});
        setFieldErrors({});
        toast.success("Pengaturan sistem berhasil diperbarui");
      },
      onError: (error) => {
        const nextErrors = extractFieldErrors(error);

        if (Object.keys(nextErrors).length > 0) {
          setFieldErrors(nextErrors);
        } else {
          toast.error("Gagal menyimpan pengaturan sistem.");
        }
      },
    });
  };

  if (isLoading) {
    return (
      <Card className="border-border/70 shadow-xs">
        <CardContent className="flex min-h-72 items-center justify-center">
          <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/20 px-5 py-4 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Memuat pengaturan sistem...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-border/70 shadow-xs">
        <CardContent className="flex min-h-72 flex-col items-center justify-center gap-4 text-center">
          <div className="space-y-1">
            <p className="font-medium">Gagal memuat pengaturan sistem.</p>
            <p className="text-sm text-muted-foreground">
              Coba muat ulang data untuk mengambil konfigurasi terbaru.
            </p>
          </div>
          <Button onClick={() => refetch()}>Muat Ulang</Button>
        </CardContent>
      </Card>
    );
  }

  if (settings.length === 0) {
    return (
      <Card className="border-border/70 shadow-xs">
        <CardContent className="flex min-h-72 items-center justify-center text-sm text-muted-foreground">
          Belum ada pengaturan sistem yang tersedia.
        </CardContent>
      </Card>
    );
  }

  return (
    <form
      id="system-settings-form"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <Card className="border-border/70 shadow-xs">
        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="font-medium">
              {hasChanges
                ? "Ada perubahan yang belum disimpan."
                : "Semua pengaturan sudah sinkron."}
            </p>
            <p className="text-sm text-muted-foreground">
              Ubah nilai yang diperlukan, lalu klik simpan untuk menerapkan
              perubahan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {hasChanges && (
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={updateSystemSettingsMutation.isPending}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            )}
            <Button
              type="submit"
              disabled={!hasChanges || updateSystemSettingsMutation.isPending}
            >
              {updateSystemSettingsMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Simpan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {groupedSettings.map((group) => (
          <section key={group.group} className="space-y-3">
            <div className="px-1">
              <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                {toHeadline(group.group)}
              </h2>
            </div>

            <Card className="border-border/70 shadow-xs">
              <CardContent className="grid gap-4 p-5 lg:grid-cols-2">
                {group.items.map((setting, index) => {
                  const settingIdentifier = getSettingIdentifier(setting, index);
                  const fieldId = `system-setting-${settingIdentifier}`;
                  const label = toHeadline(setting.key.split(".").pop() || setting.key);
                  const description = setting.description?.trim();
                  const isBoolean = setting.type === "boolean";

                  if (isBoolean) {
                    return (
                      <Field
                        key={settingIdentifier}
                        orientation="horizontal"
                        className={cn(
                          "items-start justify-between rounded-xl border border-border/70 bg-background px-4 py-4",
                          !setting.is_editable && "opacity-70",
                        )}
                      >
                        <FieldContent className="pr-4">
                          <FieldLabel htmlFor={fieldId} className="text-base">
                            {label}
                          </FieldLabel>
                          {description && (
                            <FieldDescription>{description}</FieldDescription>
                          )}
                          {!setting.is_editable && (
                            <FieldDescription>
                              Pengaturan ini hanya dapat dilihat.
                            </FieldDescription>
                          )}
                          <FieldError>{fieldErrors[setting.key]}</FieldError>
                        </FieldContent>

                        <Switch
                          id={fieldId}
                          checked={Boolean(
                            setting.key in draftValues
                              ? draftValues[setting.key]
                              : baseValues[setting.key],
                          )}
                          onCheckedChange={(checked) =>
                            handleBooleanChange(setting.key, checked)
                          }
                          disabled={
                            updateSystemSettingsMutation.isPending ||
                            !setting.is_editable
                          }
                        />
                      </Field>
                    );
                  }

                  return (
                    <Field
                      key={settingIdentifier}
                      className={cn(
                        "rounded-xl border border-border/70 bg-background px-4 py-4",
                        !setting.is_editable && "opacity-70",
                      )}
                    >
                      <FieldLabel htmlFor={fieldId} className="text-base">
                        {label}
                      </FieldLabel>
                      <Input
                        id={fieldId}
                        type={isNumberType(setting.type) ? "number" : "text"}
                        inputMode={isNumberType(setting.type) ? "decimal" : "text"}
                        value={getInputDisplayValue(
                          setting.key in draftValues
                            ? draftValues[setting.key]
                            : baseValues[setting.key],
                        )}
                        onChange={(event) =>
                          handleInputChange(setting, event.target.value)
                        }
                        disabled={
                          updateSystemSettingsMutation.isPending ||
                          !setting.is_editable
                        }
                        className={cn(
                          fieldErrors[setting.key] && "border-destructive",
                        )}
                      />
                      {description && (
                        <FieldDescription>{description}</FieldDescription>
                      )}
                      {!setting.is_editable && (
                        <FieldDescription>
                          Pengaturan ini hanya dapat dilihat.
                        </FieldDescription>
                      )}
                      <FieldError>{fieldErrors[setting.key]}</FieldError>
                    </Field>
                  );
                })}
              </CardContent>
            </Card>
          </section>
        ))}
      </div>
    </form>
  );
}
