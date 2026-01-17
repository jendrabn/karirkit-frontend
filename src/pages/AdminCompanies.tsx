import { useState } from "react";
import { Search, Plus, Trash2, Filter } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Company } from "@/types/company";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useUrlParams } from "@/hooks/use-url-params";
import { useCompanies } from "@/features/admin/companies/api/get-companies";
import { useCreateCompany } from "@/features/admin/companies/api/create-company";
import { useUpdateCompany } from "@/features/admin/companies/api/update-company";
import { useDeleteCompany } from "@/features/admin/companies/api/delete-company";
import { useMassDeleteCompanies } from "@/features/admin/companies/api/mass-delete-companies";
import { CompaniesList } from "@/features/admin/companies/components/CompaniesList";
import { CompanyFormModal } from "@/features/admin/companies/components/CompanyFormModal";
import { CompanyDeleteDialog } from "@/features/admin/companies/components/CompanyDeleteDialog";
import { CompanyBulkDeleteDialog } from "@/features/admin/companies/components/CompanyBulkDeleteDialog";
import { CompanyDetailModal } from "@/features/admin/companies/components/CompanyDetailModal";
import { CompanyFilterModal } from "@/features/admin/companies/components/CompanyFilterModal";
import {
  CompanyColumnToggle,
  type ColumnVisibility,
  defaultColumnVisibility,
} from "@/features/admin/companies/components/CompanyColumnToggle";
import { paths } from "@/config/paths";

export default function AdminCompanies() {
  const queryClient = useQueryClient();

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
    sort_by: "created_at" as
      | "created_at"
      | "updated_at"
      | "name"
      | "employee_size"
      | "job_count",
    sort_order: "desc" as "asc" | "desc",
    employee_size: "",
    business_sector: "",
    job_count_from: "",
    job_count_to: "",
    created_at_from: "",
    created_at_to: "",
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [columnVisibility, setColumnVisibility] =
    useLocalStorage<ColumnVisibility>(
      "companies-table-columns",
      defaultColumnVisibility
    );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [viewingCompanyId, setViewingCompanyId] = useState<string | null>(null);

  const { data: companiesData, isLoading } = useCompanies({
    params: {
      page: params.page,
      per_page: params.per_page,
      q: params.q || undefined,
      sort_by: params.sort_by,
      sort_order: params.sort_order,
      employee_size: (params.employee_size as any) || undefined,
      business_sector: params.business_sector || undefined,
      job_count_from: params.job_count_from
        ? Number(params.job_count_from)
        : undefined,
      job_count_to: params.job_count_to ? Number(params.job_count_to) : undefined,
      created_at_from: params.created_at_from || undefined,
      created_at_to: params.created_at_to || undefined,
    },
  });

  const createCompanyMutation = useCreateCompany();
  const updateCompanyMutation = useUpdateCompany();
  const deleteCompanyMutation = useDeleteCompany();
  const massDeleteMutation = useMassDeleteCompanies();

  const handleCreate = (data: any) => {
    createCompanyMutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["companies"] });
        setModalOpen(false);
        toast.success("Perusahaan berhasil ditambahkan");
      },
    });
  };

  const handleUpdate = (data: any) => {
    if (!editingCompany) return;
    updateCompanyMutation.mutate(
      { id: editingCompany.id, data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["companies"] });
          setModalOpen(false);
          setEditingCompany(null);
          toast.success("Perusahaan berhasil diperbarui");
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    setCompanyToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (companyToDelete) {
      deleteCompanyMutation.mutate(companyToDelete, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["companies"] });
          setDeleteDialogOpen(false);
          setCompanyToDelete(null);
          toast.success("Perusahaan berhasil dihapus");
        },
      });
    }
  };

  const confirmBulkDelete = () => {
    massDeleteMutation.mutate(selectedIds, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["companies"] });
        setSelectedIds([]);
        setBulkDeleteDialogOpen(false);
        toast.success("Perusahaan berhasil dihapus");
      },
    });
  };

  const handleSelectAll = () => {
    if (!companiesData) return;
    setSelectedIds(
      selectedIds.length === companiesData.items.length
        ? []
        : companiesData.items.map((c) => c.id)
    );
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleView = (company: Company) => {
    setViewingCompanyId(company.id);
    setDetailModalOpen(true);
  };

  const companies = companiesData?.items || [];
  const pagination = companiesData?.pagination;
  const totalPages = pagination?.total_pages || 1;

  const handleSort = (
    field:
      | "created_at"
      | "updated_at"
      | "name"
      | "employee_size"
      | "job_count"
  ) => {
    if (params.sort_by === field) {
      setParam(
        "sort_order",
        params.sort_order === "asc" ? "desc" : "asc",
        false
      );
    } else {
      setParams({ sort_by: field, sort_order: "asc" }, false);
    }
  };

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Lowongan Kerja", href: paths.admin.jobs.list.getHref() },
        { label: "Perusahaan" },
      ]}
    >
      <PageHeader
        title="Manajemen Perusahaan"
        subtitle="Kelola semua perusahaan."
      />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto md:min-w-[300px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, slug, sektor, website..."
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterModalOpen(true)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <CompanyColumnToggle
            visibility={columnVisibility}
            onVisibilityChange={setColumnVisibility}
          />
          <Button
            size="sm"
            onClick={() => {
              setEditingCompany(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Perusahaan
          </Button>
        </div>
      </div>

      <CompaniesList
        companies={companies}
        isLoading={isLoading}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
        onEdit={(company) => {
          setEditingCompany(company);
          setModalOpen(true);
        }}
        onView={handleView}
        onDelete={handleDelete}
        sortField={params.sort_by}
        sortOrder={params.sort_order}
        onSort={handleSort}
        currentPage={params.page}
        perPage={params.per_page}
        totalPages={totalPages}
        totalItems={pagination?.total_items || 0}
        onPageChange={(page) => setParam("page", page, false)}
        onPerPageChange={(perPage) => setParam("per_page", perPage, true)}
        columnVisibility={columnVisibility}
      />

      <CompanyFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        filters={{
          employee_size: (params.employee_size as any) || undefined,
          business_sector: params.business_sector || "",
          job_count_from: params.job_count_from || "",
          job_count_to: params.job_count_to || "",
          created_at_from: params.created_at_from || "",
          created_at_to: params.created_at_to || "",
        }}
        onApply={(newFilters) => {
          setParams(
            {
              employee_size: newFilters.employee_size || "",
              business_sector: newFilters.business_sector || "",
              job_count_from: newFilters.job_count_from || "",
              job_count_to: newFilters.job_count_to || "",
              created_at_from: newFilters.created_at_from || "",
              created_at_to: newFilters.created_at_to || "",
            },
            true
          );
          setFilterModalOpen(false);
        }}
      />

      <CompanyFormModal
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        editingCompany={editingCompany}
        onSubmit={editingCompany ? handleUpdate : handleCreate}
        onCancel={() => {
          setModalOpen(false);
          setEditingCompany(null);
        }}
        isLoading={
          createCompanyMutation.isPending || updateCompanyMutation.isPending
        }
      />

      <CompanyDetailModal
        companyId={viewingCompanyId}
        isOpen={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />

      <CompanyDeleteDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        isLoading={deleteCompanyMutation.isPending}
      />

      <CompanyBulkDeleteDialog
        isOpen={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        onConfirm={confirmBulkDelete}
        isLoading={massDeleteMutation.isPending}
        count={selectedIds.length}
      />
    </DashboardLayout>
  );
}
