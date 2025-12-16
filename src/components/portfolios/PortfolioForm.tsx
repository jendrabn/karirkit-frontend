import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormError } from "@/components/ui/form-error";
import { CoverUpload } from "./CoverUpload";
import { MediaUpload } from "./MediaUpload";
import { Portfolio, projectTypeLabels, ProjectType } from "@/types/portfolio";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const portfolioSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  sort_description: z.string().min(1, "Deskripsi singkat wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  role_title: z.string().min(1, "Role wajib diisi"),
  project_type: z.enum(["work", "personal", "freelance", "academic"]),
  industry: z.string().min(1, "Industri wajib diisi"),
  month: z.number().min(1).max(12),
  year: z.number().min(1900).max(2100),
  live_url: z.string().optional(),
  repo_url: z.string().optional(),
  cover: z.string().optional(),
});

type PortfolioFormData = z.infer<typeof portfolioSchema>;

interface PortfolioFormProps {
  initialData?: Portfolio;
  onSubmit: (data: PortfolioFormData & { tools: string[]; medias: { path: string; caption: string }[] }) => void;
  isLoading?: boolean;
}

const months = [
  { value: 1, label: "Januari" },
  { value: 2, label: "Februari" },
  { value: 3, label: "Maret" },
  { value: 4, label: "April" },
  { value: 5, label: "Mei" },
  { value: 6, label: "Juni" },
  { value: 7, label: "Juli" },
  { value: 8, label: "Agustus" },
  { value: 9, label: "September" },
  { value: 10, label: "Oktober" },
  { value: 11, label: "November" },
  { value: 12, label: "Desember" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

export function PortfolioForm({ initialData, onSubmit, isLoading }: PortfolioFormProps) {
  const [tools, setTools] = useState<string[]>(initialData?.tools?.map(t => t.name) || []);
  const [newTool, setNewTool] = useState("");
  const [medias, setMedias] = useState<{ path: string; caption: string }[]>(
    initialData?.medias?.map(m => ({ path: m.path, caption: m.caption })) || []
  );
  const [cover, setCover] = useState(initialData?.cover || "");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      sort_description: initialData?.sort_description || "",
      description: initialData?.description || "",
      role_title: initialData?.role_title || "",
      project_type: initialData?.project_type || "work",
      industry: initialData?.industry || "",
      month: initialData?.month || new Date().getMonth() + 1,
      year: initialData?.year || currentYear,
      live_url: initialData?.live_url || "",
      repo_url: initialData?.repo_url || "",
      cover: initialData?.cover || "",
    },
  });

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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-card rounded-lg border border-border p-6 space-y-4">
        <h3 className="text-lg font-semibold">Informasi Dasar</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Proyek</Label>
            <Input
              id="title"
              {...register("title")}
              onChange={(e) => {
                register("title").onChange(e);
                setValue("slug", generateSlug(e.target.value));
              }}
              className={errors.title ? "border-destructive" : ""}
            />
            <FormError message={errors.title?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              {...register("slug")}
              className={errors.slug ? "border-destructive" : ""}
            />
            <FormError message={errors.slug?.message} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort_description">Deskripsi Singkat</Label>
          <Input
            id="sort_description"
            {...register("sort_description")}
            className={errors.sort_description ? "border-destructive" : ""}
          />
          <FormError message={errors.sort_description?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea
            id="description"
            {...register("description")}
            rows={5}
            className={errors.description ? "border-destructive" : ""}
          />
          <FormError message={errors.description?.message} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role_title">Role / Posisi</Label>
            <Input
              id="role_title"
              {...register("role_title")}
              className={errors.role_title ? "border-destructive" : ""}
            />
            <FormError message={errors.role_title?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project_type">Tipe Proyek</Label>
            <Select
              defaultValue={watch("project_type")}
              onValueChange={(value) => setValue("project_type", value as ProjectType)}
            >
              <SelectTrigger className={errors.project_type ? "border-destructive" : ""}>
                <SelectValue placeholder="Pilih tipe proyek" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(projectTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormError message={errors.project_type?.message} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="industry">Industri</Label>
            <Input
              id="industry"
              {...register("industry")}
              className={errors.industry ? "border-destructive" : ""}
            />
            <FormError message={errors.industry?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="month">Bulan</Label>
            <Select
              defaultValue={String(watch("month"))}
              onValueChange={(value) => setValue("month", parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih bulan" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={String(month.value)}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Tahun</Label>
            <Select
              defaultValue={String(watch("year"))}
              onValueChange={(value) => setValue("year", parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih tahun" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="bg-card rounded-lg border border-border p-6 space-y-4">
        <h3 className="text-lg font-semibold">Links</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="live_url">Live URL (Opsional)</Label>
            <Input
              id="live_url"
              type="url"
              placeholder="https://example.com"
              {...register("live_url")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repo_url">Repository URL (Opsional)</Label>
            <Input
              id="repo_url"
              type="url"
              placeholder="https://github.com/..."
              {...register("repo_url")}
            />
          </div>
        </div>
      </div>

      {/* Tools */}
      <div className="bg-card rounded-lg border border-border p-6 space-y-4">
        <h3 className="text-lg font-semibold">Tools & Teknologi</h3>

        <div className="flex gap-2">
          <Input
            placeholder="Tambah tool/teknologi..."
            value={newTool}
            onChange={(e) => setNewTool(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTool();
              }
            }}
          />
          <Button type="button" onClick={handleAddTool}>
            <Plus className="h-4 w-4" />
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
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Cover */}
      <div className="bg-card rounded-lg border border-border p-6 space-y-4">
        <h3 className="text-lg font-semibold">Cover Image</h3>
        <CoverUpload value={cover} onChange={setCover} />
      </div>

      {/* Medias */}
      <div className="bg-card rounded-lg border border-border p-6 space-y-4">
        <h3 className="text-lg font-semibold">Media Gallery</h3>
        <MediaUpload value={medias} onChange={setMedias} />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Batal
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
