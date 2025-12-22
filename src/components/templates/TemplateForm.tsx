import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, FileText } from "lucide-react";
import {
  Template,
  TEMPLATE_TYPE_OPTIONS,
  TemplateType,
} from "@/types/template";
import { toast } from "sonner";

interface TemplateFormProps {
  initialData?: Template;
  onSubmit: (data: Partial<Template>) => void;
}

export function TemplateForm({ initialData, onSubmit }: TemplateFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: initialData?.type || ("cv" as TemplateType),
    name: initialData?.name || "",
    description: initialData?.description || "",
    file: initialData?.file || "",
    preview_image: initialData?.preview_image || "",
    is_premium: initialData?.is_premium || false,
    is_active: initialData?.is_active ?? true,
  });
  const [previewImageFile, setPreviewImageFile] = useState<File | null>(null);
  const [docxFile, setDocxFile] = useState<File | null>(null);

  const handlePreviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("File harus berupa gambar");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB");
        return;
      }
      setPreviewImageFile(file);
      // Simulate upload to /uploads and get path
      const simulatedPath = `uploads/previews/${file.name}`;
      setFormData({ ...formData, preview_image: simulatedPath });
    }
  };

  const handleDocxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".docx")) {
        toast.error("File harus berformat .docx");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 10MB");
        return;
      }
      setDocxFile(file);
      // Simulate upload to /uploads and get path
      const simulatedPath = `uploads/templates/${file.name}`;
      setFormData({ ...formData, file: simulatedPath });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Nama template wajib diisi");
      return;
    }
    if (!formData.type) {
      toast.error("Tipe template wajib dipilih");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informasi Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipe Template *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: TemplateType) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATE_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nama Template *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Contoh: Simple Professional CV"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Deskripsi singkat tentang template ini..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label>Premium</Label>
                <p className="text-sm text-muted-foreground">
                  Template ini hanya untuk pengguna premium
                </p>
              </div>
              <Switch
                checked={formData.is_premium}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_premium: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label>Aktif</Label>
                <p className="text-sm text-muted-foreground">
                  Template dapat digunakan oleh pengguna
                </p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>File Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Preview Image Upload */}
          <div className="space-y-2">
            <Label>Preview Image</Label>
            <div className="flex items-start gap-4">
              {(previewImageFile || formData.preview_image) && (
                <div className="relative">
                  <img
                    src={
                      previewImageFile
                        ? URL.createObjectURL(previewImageFile)
                        : formData.preview_image
                    }
                    alt="Preview"
                    className="w-32 h-40 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={() => {
                      setPreviewImageFile(null);
                      setFormData({ ...formData, preview_image: "" });
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <label className="flex flex-col items-center justify-center w-32 h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground text-center">
                  Upload Preview
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePreviewImageChange}
                />
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Format: JPG, PNG. Maks 5MB
            </p>
          </div>

          {/* DOCX File Upload */}
          <div className="space-y-2">
            <Label>File Template (.docx)</Label>
            <div className="flex items-center gap-4">
              {(docxFile || formData.file) && (
                <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {docxFile?.name || formData.file?.split("/").pop()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {docxFile
                        ? `${(docxFile.size / 1024).toFixed(1)} KB`
                        : "Uploaded"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setDocxFile(null);
                      setFormData({ ...formData, file: "" });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <label className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="h-4 w-4" />
                <span className="text-sm">Upload File</span>
                <input
                  type="file"
                  accept=".docx"
                  className="hidden"
                  onChange={handleDocxChange}
                />
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Format: DOCX. Maks 10MB
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/templates")}
        >
          Batal
        </Button>
        <Button type="submit">
          {initialData ? "Simpan Perubahan" : "Buat Template"}
        </Button>
      </div>
    </form>
  );
}
