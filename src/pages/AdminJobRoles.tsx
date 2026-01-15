import { useState } from "react";
import { Search, Plus, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type JobRole } from "@/types/job";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useUrlParams } from "@/hooks/use-url-params";
import { useJobRoles } from "@/features/admin/job-roles/api/get-job-roles";
import { useCreateJobRole } from "@/features/admin/job-roles/api/create-job-role";
import { useUpdateJobRole } from "@/features/admin/job-roles/api/update-job-role";
import { useDeleteJobRole } from "@/features/admin/job-roles/api/delete-job-role";
import { useMassDeleteJobRoles } from "@/features/admin/job-roles/api/mass-delete-job-roles";
import { JobRolesList } from "@/features/admin/job-roles/components/JobRolesList";
import { JobRoleFormModal } from "@/features/admin/job-roles/components/JobRoleFormModal";
import { JobRoleDeleteDialog } from "@/features/admin/job-roles/components/JobRoleDeleteDialog";
import { JobRoleBulkDeleteDialog } from "@/features/admin/job-roles/components/JobRoleBulkDeleteDialog";
import {
  JobRoleColumnToggle,
  type ColumnVisibility,
  defaultColumnVisibility,
} from "@/features/admin/job-roles/components/JobRoleColumnToggle";
import { paths } from "@/config/paths";

export default function AdminJobRoles() {
  const queryClient = useQueryClient();

  // Use URL params hook
  const {
    params,
    setParam,
    searchInput,
    handleSearchInput,
    handleSearchSubmit,
  } = useUrlParams({
    page: 1,
    per_page: 10,
    q: "",
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [columnVisibility, setColumnVisibility] =
    useLocalStorage<ColumnVisibility>(
      "job-roles-table-columns",
      defaultColumnVisibility
    );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<JobRole | null>(null);

  const { data: rolesData, isLoading } = useJobRoles({
    params: {
      page: params.page,
      per_page: params.per_page,
      q: params.q || undefined,
    },
  });

  const createRoleMutation = useCreateJobRole();
  const updateRoleMutation = useUpdateJobRole();
  const deleteRoleMutation = useDeleteJobRole();
  const massDeleteMutation = useMassDeleteJobRoles();

  const handleCreate = (data: any) => {
    createRoleMutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["job-roles"] });
        setModalOpen(false);
        toast.success("Role pekerjaan berhasil ditambahkan");
      },
    });
  };

  const handleUpdate = (data: any) => {
    if (!editingRole) return;
    updateRoleMutation.mutate(
      { id: editingRole.id, data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["job-roles"] });
          setModalOpen(false);
          setEditingRole(null);
          toast.success("Role pekerjaan berhasil diperbarui");
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    setRoleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (roleToDelete) {
      deleteRoleMutation.mutate(roleToDelete, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["job-roles"] });
          setDeleteDialogOpen(false);
          setRoleToDelete(null);
          toast.success("Role pekerjaan berhasil dihapus");
        },
      });
    }
  };

  const confirmBulkDelete = () => {
    massDeleteMutation.mutate(selectedIds, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["job-roles"] });
        setSelectedIds([]);
        setBulkDeleteDialogOpen(false);
        toast.success("Role pekerjaan berhasil dihapus");
      },
    });
  };

  const handleSelectAll = () => {
    if (!rolesData) return;
    setSelectedIds(
      selectedIds.length === rolesData.items.length
        ? []
        : rolesData.items.map((r) => r.id)
    );
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const roles = rolesData?.items || [];
  const pagination = rolesData?.pagination;
  const totalPages = pagination?.total_pages || 1;

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Lowongan Kerja", href: paths.admin.jobs.list.getHref() },
        { label: "Role Pekerjaan" },
      ]}
    >
      <PageHeader
        title="Manajemen Role Pekerjaan"
        subtitle="Kelola semua kategori role pekerjaan."
      />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto md:min-w-[300px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari role..."
            value={searchInput}
            onChange={(e) => handleSearchInput(e.target.value)}
            onKeyDown={handleSearchSubmit}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setBulkDeleteDialogOpen(true)}
              disabled={massDeleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus ({selectedIds.length})
            </Button>
          )}
          <JobRoleColumnToggle
            visibility={columnVisibility}
            onVisibilityChange={setColumnVisibility}
          />
          <Button
            size="sm"
            onClick={() => {
              setEditingRole(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Role
          </Button>
        </div>
      </div>

      <JobRolesList
        roles={roles}
        isLoading={isLoading}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
        onEdit={(role) => {
          setEditingRole(role);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
        currentPage={params.page}
        perPage={params.per_page}
        totalPages={totalPages}
        totalItems={pagination?.total_items || 0}
        onPageChange={(page) => setParam("page", page, false)}
        onPerPageChange={(perPage) => setParam("per_page", perPage, true)}
        columnVisibility={columnVisibility}
      />

      <JobRoleFormModal
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        editingRole={editingRole}
        onSubmit={editingRole ? handleUpdate : handleCreate}
        onCancel={() => {
          setModalOpen(false);
          setEditingRole(null);
        }}
        isLoading={createRoleMutation.isPending || updateRoleMutation.isPending}
      />

      <JobRoleDeleteDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        isLoading={deleteRoleMutation.isPending}
      />

      <JobRoleBulkDeleteDialog
        isOpen={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        onConfirm={confirmBulkDelete}
        isLoading={massDeleteMutation.isPending}
        count={selectedIds.length}
      />
    </DashboardLayout>
  );
}
