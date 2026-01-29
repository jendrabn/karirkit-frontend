import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pencil,
  Trash2,
  FileText,
  Loader2,
  Download,
  Eye,
  Tag,
  Calendar,
  Clock,
  Info,
} from "lucide-react";
import { getTemplateTypeLabel } from "@/types/template";
import { toast } from "sonner";
import { useTemplate } from "@/features/admin/templates/api/get-template";
import { useDeleteTemplate } from "@/features/admin/templates/api/delete-template";
import { formatDateTime } from "@/lib/date";
import { MinimalSEO } from "@/components/MinimalSEO";
import {
  buildImageUrl,
  formatBytes,
  formatNumber,
  formatValue,
} from "@/lib/utils";
import { paths } from "@/config/paths";
import { Separator } from "@/components/ui/separator";
import { InfoItem, RichText } from "@/components/ui/display-info";

const AdminTemplateShow = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: template, isLoading, error } = useTemplate({
    id: id as string,
    queryConfig: {
      enabled: !!id,
    },
  });

  const deleteTemplateMutation = useDeleteTemplate({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Template berhasil dihapus");
        navigate("/admin/templates");
      },
      onError: (error) => {
        console.error("Error: ", error);
      },
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Template", href: paths.admin.templates.list.getHref() },
          { label: "Detail Template" },
        ]}
      >
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat data template...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !template) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Template", href: paths.admin.templates.list.getHref() },
          { label: "Template Tidak Ditemukan" },
        ]}
      >
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">Template tidak ditemukan</p>
          <Button onClick={() => navigate(paths.admin.templates.list.getHref())}>
            Kembali ke Daftar
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const templateMeta = template as typeof template & {
    description?: string | null;
    features?: string[] | null;
    instructions?: string | null;
    file_size?: number | null;
    file_format?: string | null;
    version?: string | null;
    usage_count?: number | null;
  };
  const downloadUrl = template.path ? buildImageUrl(template.path) : null;
  const previewUrl = template.preview ? buildImageUrl(template.preview) : null;
  const fileExtension = template.path
    ? template.path.split(".").pop()
    : null;

  const handleDelete = () => {
    if (template.id) {
      deleteTemplateMutation.mutate(template.id);
    }
  };

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Template", href: paths.admin.templates.list.getHref() },
        { label: "Detail Template" },
      ]}
    >
      <MinimalSEO
        title={template.name}
        description={`Detail template ${template.name}`}
        noIndex={true}
      />
      <PageHeader
        title={template.name}
        subtitle={`Detail template ${getTemplateTypeLabel(template.type)}`}
        backButtonUrl={paths.admin.templates.list.getHref()}
        showBackButton
      >
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/admin/templates/${template.id}/edit`)}
          >
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Hapus
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="space-y-3">
              <CardTitle className="text-lg">Informasi Template</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="gap-1.5">
                  <Tag className="h-3 w-3" />
                  {getTemplateTypeLabel(template.type)}
                </Badge>
                <Badge variant="outline" className="gap-1.5 uppercase">
                  <FileText className="h-3 w-3" />
                  {template.language}
                </Badge>
                <Badge
                  variant={template.is_premium ? "default" : "secondary"}
                  className="gap-1.5"
                >
                  <Tag className="h-3 w-3" />
                  {template.is_premium ? "Premium" : "Gratis"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoItem
                  label="Nama Template"
                  value={template.name}
                  icon={FileText}
                />
                <InfoItem
                  label="Bahasa"
                  value={template.language?.toUpperCase()}
                  icon={Tag}
                />
                <InfoItem
                  label="Versi"
                  value={formatValue(templateMeta.version)}
                  icon={Info}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview Template</CardTitle>
            </CardHeader>
            <CardContent>
              {previewUrl ? (
                <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                  <img
                    src={previewUrl}
                    alt={template.name}
                    className="w-full aspect-[3/4] object-cover rounded-lg border hover:opacity-90 transition-opacity"
                  />
                </a>
              ) : (
                <div className="w-full aspect-[3/4] bg-muted rounded-lg border flex items-center justify-center">
                  <span className="text-muted-foreground">No Preview</span>
                </div>
              )}
            </CardContent>
          </Card>

          {(templateMeta.description || templateMeta.features || templateMeta.instructions) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detail Template</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {templateMeta.description && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Deskripsi
                    </p>
                    <RichText content={templateMeta.description} />
                  </div>
                )}

                {templateMeta.features && templateMeta.features.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Fitur
                    </p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      {templateMeta.features.map((feature, index) => (
                        <li key={`${feature}-${index}`}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {templateMeta.instructions && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Cara Pakai
                    </p>
                    <RichText content={templateMeta.instructions} />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi File</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoItem
                label="Ukuran File"
                value={
                  templateMeta.file_size !== null &&
                  templateMeta.file_size !== undefined
                    ? formatBytes(templateMeta.file_size)
                    : "-"
                }
                icon={FileText}
              />
              <InfoItem
                label="Format File"
                value={formatValue(templateMeta.file_format || fileExtension)}
                icon={Tag}
              />
              <InfoItem
                label="Nama File"
                value={template.path ? template.path.split("/").pop() : "-"}
                icon={FileText}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg">Aksi</CardTitle>
                {templateMeta.usage_count !== null && (
                  <Badge variant="outline" className="gap-1 text-xs uppercase">
                    <Eye className="h-3 w-3" />
                    {formatNumber(templateMeta.usage_count)} penggunaan
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Button asChild disabled={!downloadUrl}>
                  <a
                    href={downloadUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </a>
                </Button>
                <Button variant="outline" asChild disabled={!previewUrl}>
                  <a
                    href={previewUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Lihat Preview
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Sistem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Template ID
                </p>
                <p className="text-xs font-mono bg-muted px-2 py-1.5 rounded break-all">
                  {template.id}
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <InfoItem
                  label="Dibuat"
                  value={formatDateTime(template.created_at)}
                  icon={Calendar}
                />
                <InfoItem
                  label="Diperbarui"
                  value={formatDateTime(template.updated_at)}
                  icon={Clock}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Template?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Template "{template.name}"
              akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteTemplateMutation.isPending}
            >
              {deleteTemplateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default AdminTemplateShow;
