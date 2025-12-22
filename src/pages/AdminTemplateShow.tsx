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
  Download,
  Crown,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";
import { mockTemplates } from "@/data/mockTemplates";
import { getTemplateTypeLabel } from "@/types/template";
import { toast } from "sonner";

const AdminTemplateShow = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const template = mockTemplates.find((t) => t.id === Number(id));

  if (!template) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Template tidak ditemukan</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleDelete = () => {
    // Simulate API call
    console.log("Deleting template:", template.id);
    toast.success("Template berhasil dihapus");
    navigate("/templates");
  };

  return (
    <DashboardLayout>
      <PageHeader
        title={template.name}
        subtitle={`Detail template ${getTemplateTypeLabel(template.type)}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview Image */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {template.preview_image ? (
              <img
                src={template.preview_image}
                alt={template.name}
                className="w-full aspect-[3/4] object-cover rounded-lg border"
              />
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
              <div>
                <p className="text-sm text-muted-foreground">Status Aktif</p>
                {template.is_active ? (
                  <Badge className="mt-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Aktif
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="mt-1">
                    <XCircle className="h-3 w-3 mr-1" />
                    Nonaktif
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Slug</p>
                <p className="mt-1 font-mono text-sm">{template.slug}</p>
              </div>
            </div>

            {template.description && (
              <div>
                <p className="text-sm text-muted-foreground">Deskripsi</p>
                <p className="mt-1">{template.description}</p>
              </div>
            )}

            {template.file && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  File Template
                </p>
                <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30 w-fit">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <span className="text-sm">
                    {template.file.split("/").pop()}
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Dibuat</p>
                <p className="mt-1 text-sm">
                  {new Date(template.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Diperbarui</p>
                <p className="mt-1 text-sm">
                  {new Date(template.updated_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              <Button
                onClick={() => navigate(`/templates/${template.id}/edit`)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              {template.file && (
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download File
                </Button>
              )}
              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus
              </Button>
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
