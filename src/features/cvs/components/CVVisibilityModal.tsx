import { useEffect } from "react";
import { isAxiosError } from "axios";
import { useForm, useWatch } from "react-hook-form";
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
import { toast } from "sonner";
import { Copy } from "lucide-react";
import {
  cvVisibilitySchema,
  type UpdateCvVisibilityInput as FormValues,
  useUpdateCvVisibility,
} from "../api/update-cv-visibility";
import type { CV } from "@/features/cvs/api/get-cvs";

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
    control,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(cvVisibilitySchema),
    defaultValues: {
      slug: "",
      visibility: "private",
    },
  });

  const updateMutation = useUpdateCvVisibility({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Pengaturan visibilitas berhasil disimpan");
        onOpenChange(false);
      },
      onError: (error: Error) => {
        const message = isAxiosError(error) ? error.message : error.message;
        toast.error("Gagal menyimpan pengaturan: " + (message || "Unknown error"));
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

  const slugValue = useWatch({ control, name: "slug" });
  const visibilityValue = useWatch({ control, name: "visibility" });

  const onSubmit = (data: FormValues) => {
    if (!cv) return;

    updateMutation.mutate({
      id: cv.id,
      data: {
        slug: data.slug,
        visibility: data.visibility,
      },
    });
  };

  const handleCopyUrl = async () => {
    const slug = slugValue;
    if (!slug) {
      toast.error("Slug belum diisi");
      return;
    }

    const url = `${window.location.origin}/cv/${slug}`;
    if (!navigator.clipboard) {
      toast.error("Clipboard tidak didukung di browser ini");
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL CV berhasil disalin");
    } catch {
      toast.error("Gagal menyalin URL CV");
    }
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
            <div className="mt-2 flex items-center gap-2">
              <p className="text-xs text-muted-foreground break-all">
                URL: {window.location.origin}/cv/{slugValue}
              </p>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="h-7 w-7 shrink-0"
                onClick={handleCopyUrl}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Field>

          <Field>
            <FieldLabel>Visibilitas *</FieldLabel>
            <Select
              value={visibilityValue}
              onValueChange={(val) =>
                setValue("visibility", val as FormValues["visibility"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih visibilitas" />
              </SelectTrigger>
              <SelectContent className="z-[100] bg-popover">
                <SelectItem value="private">Private (Hanya Saya)</SelectItem>
                <SelectItem value="public">Public (Semua Orang)</SelectItem>
                <SelectItem value="unlisted">
                  Unlisted (Hanya yang punya link)
                </SelectItem>
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
