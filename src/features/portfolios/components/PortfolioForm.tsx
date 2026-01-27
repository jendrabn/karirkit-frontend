import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldError, FieldSet } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CoverUpload } from "./CoverUpload";
import { MediaUpload } from "./MediaUpload";
import { type Portfolio, projectTypeLabels } from "@/types/portfolio";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useServerValidation } from "@/hooks/use-server-validation";
import { cn } from "@/lib/utils";
import { months, years } from "@/lib/date-options";
import { displayFormErrors } from "@/lib/form-errors";
import {
  portfolioSchema,
  type PortfolioFormData,
} from "../api/create-portfolio";

interface PortfolioFormProps {
  initialData?: Portfolio;
  onSubmit: (
    data: PortfolioFormData & {
      tools: string[];
      medias: { path: string; caption: string }[];
    },
  ) => void;
  isLoading?: boolean;
  error?: unknown;
}

export function PortfolioForm({
  initialData,
  onSubmit,
  isLoading,
  error,
}: PortfolioFormProps) {
  const [newTool, setNewTool] = useState("");
  const [tools, setTools] = useState<string[]>(
    initialData?.tools?.map((t) => t.name) || [],
  );
  const [cover, setCover] = useState(initialData?.cover || "");
  const [medias, setMedias] = useState<{ path: string; caption: string }[]>(
    initialData?.medias?.map((m) => ({
      path: m.path,
      caption: m.caption || "",
    })) || [],
  );

  const form = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: initialData?.title || "",
      sort_description: initialData?.sort_description || "",
      description: initialData?.description || "",
      role_title: initialData?.role_title || "",
      project_type: initialData?.project_type,
      industry: initialData?.industry || "",
      month: initialData?.month,
      year: initialData?.year,
      live_url: initialData?.live_url || "",
      repo_url: initialData?.repo_url || "",
      cover: initialData?.cover || "",
    },
  });

  useServerValidation(error, form);

  const projectTypeValue = useWatch({
    control: form.control,
    name: "project_type",
  });
  const monthValue = useWatch({ control: form.control, name: "month" });
  const yearValue = useWatch({ control: form.control, name: "year" });

  const extraErrors = form.formState.errors as typeof form.formState.errors & {
    tools?: { message?: string };
    medias?: { message?: string };
  };

  const handleAddTool = () => {
    if (newTool.trim() && !tools.includes(newTool.trim())) {
      setTools([...tools, newTool.trim()]);
      setNewTool("");
    }
  };

  const handleRemoveTool = (toolToRemove: string) => {
    setTools(tools.filter((tool) => tool !== toolToRemove));
  };

  const handleFormSubmit = (data: PortfolioFormData) => {
    onSubmit({
      ...data,
      cover,
      tools,
      medias,
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit, displayFormErrors)}>
      <FieldSet disabled={isLoading} className="space-y-8 mb-6">
        {/* Base Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar</CardTitle>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Field>
                  <FieldLabel>
                    Judul Proyek <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...form.register("title")}
                    placeholder="Contoh: Sistem Manajemen Inventori Berbasis Web"
                    className={cn(
                      form.formState.errors.title && "border-destructive",
                    )}
                  />
                  <FieldError>
                    {form.formState.errors.title?.message}
                  </FieldError>
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field>
                  <FieldLabel>
                    Deskripsi Singkat{" "}
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...form.register("sort_description")}
                    placeholder="Ringkasan singkat proyek (1 kalimat)"
                    className={cn(
                      form.formState.errors.sort_description &&
                        "border-destructive",
                    )}
                  />
                  <FieldError>
                    {form.formState.errors.sort_description?.message}
                  </FieldError>
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field>
                  <FieldLabel>
                    Deskripsi <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Textarea
                    {...form.register("description")}
                    rows={5}
                    placeholder="Jelaskan tujuan proyek, peran Anda, teknologi yang digunakan, dan hasil yang dicapai"
                    className={cn(
                      form.formState.errors.description && "border-destructive",
                    )}
                  />
                  <FieldError>
                    {form.formState.errors.description?.message}
                  </FieldError>
                </Field>
              </div>

              <Field>
                <FieldLabel>
                  Role / Posisi <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...form.register("role_title")}
                  placeholder="Contoh: Frontend Developer"
                  className={cn(
                    form.formState.errors.role_title && "border-destructive",
                  )}
                />
                <FieldError>
                  {form.formState.errors.role_title?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>Tipe Proyek</FieldLabel>
                <Select
                  value={projectTypeValue ?? ""}
                  onValueChange={(value) =>
                    form.setValue(
                      "project_type",
                      value as PortfolioFormData["project_type"],
                    )
                  }
                >
                  <SelectTrigger
                    className={cn(
                      form.formState.errors.project_type &&
                        "border-destructive",
                    )}
                  >
                    <SelectValue placeholder="Pilih Tipe Proyek" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(projectTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>
                  {form.formState.errors.project_type?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>
                  Industri <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...form.register("industry")}
                  placeholder="Contoh: Teknologi Informasi, Fintech, E-commerce"
                  className={cn(
                    form.formState.errors.industry && "border-destructive",
                  )}
                />
                <FieldError>
                  {form.formState.errors.industry?.message}
                </FieldError>
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FieldLabel>
                    Bulan <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select
                    value={monthValue ? String(monthValue) : ""}
                    onValueChange={(value) =>
                      form.setValue("month", parseInt(value))
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        form.formState.errors.month && "border-destructive",
                      )}
                    >
                      <SelectValue placeholder="Pilih Bulan" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem
                          key={month.value}
                          value={String(month.value)}
                        >
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError>
                    {form.formState.errors.month?.message}
                  </FieldError>
                </div>
                <div className="space-y-2">
                  <FieldLabel>
                    Tahun <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select
                    value={yearValue ? String(yearValue) : ""}
                    onValueChange={(value) =>
                      form.setValue("year", parseInt(value))
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        form.formState.errors.year && "border-destructive",
                      )}
                    >
                      <SelectValue placeholder="Pilih Tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={String(year)}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError>{form.formState.errors.year?.message}</FieldError>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Links */}
        <Card>
          <CardHeader>
            <CardTitle>Links</CardTitle>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel>Live URL</FieldLabel>
                <Input
                  {...form.register("live_url")}
                  type="url"
                  placeholder="https://aplikasi-anda.com"
                  className={cn(
                    form.formState.errors.live_url && "border-destructive",
                  )}
                />
                <FieldError>
                  {form.formState.errors.live_url?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>Repository URL</FieldLabel>
                <Input
                  {...form.register("repo_url")}
                  type="url"
                  placeholder="https://github.com/username/nama-project"
                  className={cn(
                    form.formState.errors.repo_url && "border-destructive",
                  )}
                />
                <FieldError>
                  {form.formState.errors.repo_url?.message}
                </FieldError>
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* Tools */}
        <Card>
          <CardHeader>
            <CardTitle>Tools & Teknologi</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            <div className="flex gap-2">
              <Input
                placeholder="Contoh: React, Laravel, MySQL"
                value={newTool}
                onChange={(e) => setNewTool(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTool();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTool} size="icon">
                <Plus className="size-4" />
              </Button>
            </div>

            {tools.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <Badge key={tool} variant="secondary" className="gap-1">
                    {tool}
                    <button
                      type="button"
                      onClick={() => handleRemoveTool(tool)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <FieldError>{extraErrors.tools?.message}</FieldError>
          </CardContent>
        </Card>

        {/* Cover */}
        <Card>
          <CardHeader>
            <CardTitle>Cover Image</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <CoverUpload value={cover} onChange={setCover} />
            <FieldError>{form.formState.errors.cover?.message}</FieldError>
          </CardContent>
        </Card>

        {/* Media */}
        <Card>
          <CardHeader>
            <CardTitle>Media Gallery</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <MediaUpload value={medias} onChange={setMedias} />
            <FieldError>{extraErrors.medias?.message}</FieldError>
          </CardContent>
        </Card>
      </FieldSet>

      <div className="flex justify-end gap-3 pt-6 border-t mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isLoading}
        >
          Batal
        </Button>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Menyimpan...
            </>
          ) : initialData ? (
            "Simpan Perubahan"
          ) : (
            "Simpan"
          )}
        </Button>
      </div>
    </form>
  );
}
