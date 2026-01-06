import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { useUpdateCV } from "@/features/cvs/api/update-cv";
import { toast } from "sonner";
import type { CV } from "@/features/cvs/api/get-cvs";

const schema = z.object({
  slug: z
    .string()
    .min(3, "Slug minimal 3 karakter")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug hanya boleh berisi huruf kecil, angka, dan strip"
    ),
  visibility: z.enum(["public", "private"]),
});

type FormValues = z.infer<typeof schema>;

interface CVVisibilityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cv: CV | null;
}

export function CVVisibilityModal({
  open,
  onOpenChange,
  cv,
}: CVVisibilityModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      slug: "",
      visibility: "private",
    },
  });

  const updateMutation = useUpdateCV({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Pengaturan visibilitas berhasil disimpan");
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error("Gagal menyimpan pengaturan: " + error.message);
      },
    },
  });

  useEffect(() => {
    if (cv) {
      reset({
        slug: cv.slug || "",
        visibility: cv.visibility || "private",
      });
    }
  }, [cv, reset]);

  const onSubmit = (data: FormValues) => {
    if (!cv) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, user_id, created_at, updated_at, template, ...restCv } = cv;

    updateMutation.mutate({
      id: cv.id,
      data: {
        ...restCv,
        slug: data.slug,
        visibility: data.visibility,
        // Ensure arrays are not null
        educations: cv.educations || [],
        certificates: cv.certificates || [],
        experiences: cv.experiences || [],
        skills: cv.skills || [],
        awards: cv.awards || [],
        social_links: cv.social_links || [],
        organizations: cv.organizations || [],
        projects: cv.projects || [],
        language: cv.language || "id",
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pengaturan Visibilitas</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel>Slug (URL) *</FieldLabel>
            <Input {...register("slug")} placeholder="slug-url-cv-anda" />
            <FieldError>{errors.slug?.message}</FieldError>
            <p className="text-xs text-muted-foreground mt-1">
              URL: {window.location.origin}/cv/{watch("slug")}
            </p>
          </Field>

          <Field>
            <FieldLabel>Visibilitas *</FieldLabel>
            <Select
              value={watch("visibility")}
              onValueChange={(val) =>
                setValue("visibility", val as "public" | "private")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih visibilitas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private (Hanya Saya)</SelectItem>
                <SelectItem value="public">Public (Semua Orang)</SelectItem>
              </SelectContent>
            </Select>
            <FieldError>{errors.visibility?.message}</FieldError>
          </Field>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
