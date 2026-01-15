import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Plus, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useUrlParams } from "@/hooks/use-url-params";
import { useJobs } from "@/features/admin/jobs/api/get-jobs";
import { useDeleteJob } from "@/features/admin/jobs/api/delete-job";
import { useMassDeleteJobs } from "@/features/admin/jobs/api/mass-delete-jobs";
import { JobsList } from "@/features/admin/jobs/components/JobsList";
import { JobDeleteDialog } from "@/features/admin/jobs/components/JobDeleteDialog";
import { JobBulkDeleteDialog } from "@/features/admin/jobs/components/JobBulkDeleteDialog";
import {
  JobColumnToggle,
  type ColumnVisibility,
  defaultColumnVisibility,
} from "@/features/admin/jobs/components/JobColumnToggle";

type SortField = "created_at" | "salary_min" | "experience_min";
type SortOrder = "asc" | "desc";

export default function AdminJobs() {
  const navigate = useNavigate();

  // Use URL params hook
  const {
    params,
    setParam,
    setParams,
    searchInput,
    handleSearchInput,
    handleSearchSubmit,
  } = useUrlParams({
    page: 1,
    per_page: 10,
    q: "",
    sort: "created_at" as SortField,
    sort_order: "desc" as SortOrder,
  });

  const [columnVisibility, setColumnVisibility] =
    useLocalStorage<ColumnVisibility>(
      "jobs-table-columns",
      defaultColumnVisibility
    );

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const { data: jobsData, isLoading } = useJobs({
    params: {
      page: params.page,
      per_page: params.per_page,
      q: params.q || undefined,
      sort: params.sort,
      sort_order: params.sort_order,
    },
  });

  const deleteJobMutation = useDeleteJob();
  const massDeleteMutation = useMassDeleteJobs();

  const handleSort = (field: SortField) => {
    if (params.sort === field) {
      setParam(
        "sort_order",
        params.sort_order === "asc" ? "desc" : "asc",
        false
      );
    } else {
      setParams({ sort: field, sort_order: "asc" }, false);
    }
  };

  const handleDelete = (id: string) => {
    setJobToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (jobToDelete) {
      deleteJobMutation.mutate(jobToDelete, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setJobToDelete(null);
          toast.success("Lowongan berhasil dihapus");
        },
      });
    }
  };

  const confirmBulkDelete = () => {
    massDeleteMutation.mutate(selectedIds, {
      onSuccess: () => {
        setSelectedIds([]);
        setBulkDeleteDialogOpen(false);
        toast.success("Lowongan yang dipilih berhasil dihapus");
      },
    });
  };

  const handleSelectAll = () => {
    if (!jobsData) return;
    if (selectedIds.length === jobsData.items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(jobsData.items.map((job) => job.id));
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const jobs = jobsData?.items || [];
  const pagination = jobsData?.pagination;
  const totalPages = pagination?.total_pages || 1;

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Lowongan Kerja" },
      ]}
    >
      <PageHeader
        title="Manajemen Lowongan Kerja"
        subtitle="Kelola semua lowongan pekerjaan."
      />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto md:min-w-[300px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari judul, perusahaan..."
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
          <JobColumnToggle
            visibility={columnVisibility}
            onVisibilityChange={setColumnVisibility}
          />
          <Button size="sm" onClick={() => navigate("/admin/jobs/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Lowongan
          </Button>
        </div>
      </div>

      <JobsList
        jobs={jobs}
        isLoading={isLoading}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
        onDelete={handleDelete}
        currentPage={params.page}
        perPage={params.per_page}
        totalPages={totalPages}
        totalItems={pagination?.total_items || 0}
        onPageChange={(page) => setParam("page", page, false)}
        onPerPageChange={(perPage) => setParam("per_page", perPage, true)}
        sortField={params.sort}
        sortOrder={params.sort_order}
        onSort={handleSort}
        columnVisibility={columnVisibility}
      />

      <JobDeleteDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        isLoading={deleteJobMutation.isPending}
      />

      <JobBulkDeleteDialog
        isOpen={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        onConfirm={confirmBulkDelete}
        isLoading={massDeleteMutation.isPending}
        count={selectedIds.length}
      />
    </DashboardLayout>
  );
}
