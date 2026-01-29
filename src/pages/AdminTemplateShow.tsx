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
import { Pencil, Trash2, Crown, FileText, Loader2 } from "lucide-react";
import { getTemplateTypeLabel } from "@/types/template";
import { toast } from "sonner";
import { useTemplate } from "@/features/admin/templates/api/get-template";
import { useDeleteTemplate } from "@/features/admin/templates/api/delete-template";
import { dayjs } from "@/lib/date";
import { MinimalSEO } from "@/components/MinimalSEO";
import { buildImageUrl } from "@/lib/utils";
import { paths } from "@/config/paths";

const AdminTemplateShow = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: template, isLoading } = useTemplate({
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
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!template) {
    return (
      <DashboardLayout
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Template", href: paths.admin.templates.list.getHref() },
          { label: "Template Tidak Ditemukan" },
        ]}
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Template tidak ditemukan</p>
        </div>
      </DashboardLayout>
    );
  }

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
        {/* Preview Image */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {template.preview ? (
              <a
                href={buildImageUrl(template.preview)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={buildImageUrl(template.preview)}
                  alt={template.name}
                  className="w-full aspect-[3/4] object-cover rounded-lg border hover:opacity-80 transition-opacity"
                />
              </a>
            ) : (
              <div className="w-full aspect-[3/4] bg-muted rounded-lg border flex items-center justify-center">
                <span className="text-muted-foreground">No Preview</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Informasi Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tipe</p>
                <Badge variant="outline" className="mt-1">
                  {getTemplateTypeLabel(template.type)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bahasa</p>
                <Badge variant="outline" className="mt-1 uppercase">
                  {template.language}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status Premium</p>
                {template.is_premium ? (
                  <Badge className="mt-1 bg-amber-100 text-amber-700 hover:bg-amber-100">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="mt-1">
                    Gratis
                  </Badge>
                )}
              </div>
            </div>

            {template.path && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  File Template
                </p>
                <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30 w-fit">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <span className="text-sm">
                    {template.path.split("/").pop()}
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Dibuat</p>
                <p className="mt-1 text-sm">
                  {dayjs(template.created_at).format("D MMMM YYYY")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Diperbarui</p>
                <p className="mt-1 text-sm">
                  {dayjs(template.updated_at).format("D MMMM YYYY")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Dialog */}
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
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default AdminTemplateShow;
