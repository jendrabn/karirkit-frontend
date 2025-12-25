/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router";
import { dayjs } from "@/lib/date";
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Trash2,
  MoreVertical,
  Eye,
  Pencil,
  Copy,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  FileStack,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { ApplicationFilterModal } from "./ApplicationFilterModal";
import {
  ApplicationColumnToggle,
  defaultColumnVisibility,
  type ColumnVisibility,
} from "./ApplicationColumnToggle";
import { ApplicationStats } from "./ApplicationStats";
import {
  useApplications,
  type GetApplicationsParams,
} from "../api/get-applications";
import { useApplicationStats } from "../api/get-application-stats";
import { useDeleteApplication } from "../api/delete-application";
import { useDuplicateApplication } from "../api/duplicate-application";
import { useUpdateApplication } from "../api/update-application";
import { useMassDeleteApplications } from "../api/mass-delete-applications";
import { useDebounce } from "@/hooks/use-debounce";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  type Application,
  type JobType,
  type WorkSystem,
  type ApplicationStatus,
  type ResultStatus,
  JOB_TYPE_OPTIONS,
  WORK_SYSTEM_OPTIONS,
  STATUS_OPTIONS,
  RESULT_STATUS_OPTIONS,
} from "@/types/application";

// Helper functions (copied from original)
const getJobTypeBadgeVariant = (jobType: JobType) => {
  const variants: Record<
    JobType,
    "fullTime" | "partTime" | "contract" | "internship" | "freelance"
  > = {
    full_time: "fullTime",
    part_time: "partTime",
    contract: "contract",
    internship: "internship",
    freelance: "freelance",
  };
  return variants[jobType];
};

const getWorkSystemBadgeVariant = (workSystem: WorkSystem) => {
  const variants: Record<WorkSystem, "onsite" | "remote" | "hybrid"> = {
    onsite: "onsite",
    remote: "remote",
    hybrid: "hybrid",
  };
  return variants[workSystem];
};

const getResultStatusBadgeVariant = (resultStatus: ResultStatus) => {
  const variants: Record<ResultStatus, "pending" | "passed" | "failed"> = {
    pending: "pending",
    passed: "passed",
    failed: "failed",
  };
  return variants[resultStatus];
};

const getStatusBadgeVariant = (status: ApplicationStatus) => {
  const screeningStatuses = ["administration_screening", "hr_screening"];
  const testStatuses = [
    "online_test",
    "psychology_test",
    "technical_test",
    "hr_test",
  ];
  const interviewStatuses = [
    "hr_interview",
    "user_interview",
    "final_interview",
  ];

  if (status === "draft") return "draft";
  if (status === "submitted") return "submitted";
  if (screeningStatuses.includes(status)) return "screening";
  if (testStatuses.includes(status)) return "test";
  if (interviewStatuses.includes(status)) return "interview";
  if (status === "offering" || status === "mcu" || status === "onboarding")
    return "offering";
  if (status === "accepted") return "accepted";
  if (status === "rejected") return "rejected";
  return "default";
};

const formatSalaryRange = (
  min: number | undefined | null,
  max: number | undefined | null
) => {
  const formatNum = (n: number | undefined | null) => {
    if (n === undefined || n === null) return "0";
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return n.toString();
  };
  return `${formatNum(min)} - ${formatNum(max)}`;
};

export const ApplicationsList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<
    Omit<
      GetApplicationsParams,
      "page" | "per_page" | "q" | "sort_by" | "sort_order"
    >
  >({});
  const [columnVisibility, setColumnVisibility] =
    useLocalStorage<ColumnVisibility>(
      "applications-table-columns",
      defaultColumnVisibility
    );

  const [sortField, setSortField] =
    useState<GetApplicationsParams["sort_by"]>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [activeStatFilter, setActiveStatFilter] = useState<string | null>(null);

  // Combine filters
  const queryParams: GetApplicationsParams = {
    page: currentPage,
    per_page: perPage,
    q: debouncedSearch,
    sort_by: sortField,
    sort_order: sortOrder,
    ...filters,
    ...(activeStatFilter === "active" ? { result_status: "pending" } : {}),
    ...(activeStatFilter === "rejected" ? { result_status: "failed" } : {}),
    ...(activeStatFilter === "offer" ? { status: "offering" } : {}),
    ...(activeStatFilter === "interview" ? { status: "user_interview" } : {}), // Map closest
  };

  const { data: applicationsData, isLoading } = useApplications({
    params: queryParams,
  });
  const { data: statsData, isLoading: isStatsLoading } = useApplicationStats();

  const deleteApplicationMutation = useDeleteApplication({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Lamaran berhasil dihapus");
        setDeleteDialogOpen(false);
        setApplicationToDelete(null);
        setSelectedIds([]);
      },
    },
  });

  const duplicateApplicationMutation = useDuplicateApplication({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Lamaran berhasil diduplikasi");
      },
    },
  });

  const updateApplicationMutation = useUpdateApplication();

  const massDeleteApplicationMutation = useMassDeleteApplications({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Lamaran terpilih berhasil dihapus");
        setMassDeleteDialogOpen(false);
        setSelectedIds([]);
      },
    },
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [massDeleteDialogOpen, setMassDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<string | null>(
    null
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const applications = applicationsData?.items || [];
  const pagination = applicationsData?.pagination || {
    page: 1,
    per_page: 10,
    total_items: 0,
    total_pages: 0,
  };

  const handleSort = (field: GetApplicationsParams["sort_by"]) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleDelete = (id: string) => {
    setApplicationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (applicationToDelete) {
      deleteApplicationMutation.mutate({ id: applicationToDelete });
    }
  };

  const confirmMassDelete = () => {
    massDeleteApplicationMutation.mutate({ ids: selectedIds });
  };

  const handleDuplicate = (id: string) => {
    duplicateApplicationMutation.mutate({ id });
  };

  const handleStatClick = (filter: string) => {
    if (activeStatFilter === filter || filter === "total") {
      setActiveStatFilter(null);
    } else {
      setActiveStatFilter(filter);
    }
    setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(applications.map((app) => app.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const SortableHeader = ({
    field,
    children,
  }: {
    field: GetApplicationsParams["sort_by"];
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent uppercase text-xs font-medium tracking-wide text-muted-foreground hover:text-foreground"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
    </Button>
  );

  const EditableCell = ({
    app,
    field,
    type = "text",
  }: {
    app: Application;
    field: keyof Application;
    type?: "text" | "number" | "select";
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(app[field] ?? "");

    const handleBlur = () => {
      setIsEditing(false);
      if (value !== app[field]) {
        const { id, user_id, created_at, updated_at, ...data } = {
          ...app,
          [field]: value,
        };
        updateApplicationMutation.mutate({
          id: app.id,
          data: data as any,
        });
      }
    };

    const handleSelectChange = (val: string) => {
      const { id, user_id, created_at, updated_at, ...data } = {
        ...app,
        [field]: val,
      };
      updateApplicationMutation.mutate({
        id: app.id,
        data: data as any,
      });
    };

    if (type === "select") {
      let options: { value: string; label: string }[] = [];
      let getBadgeVariant: () => string = () => "default";

      if (field === "job_type") {
        options = JOB_TYPE_OPTIONS;
        getBadgeVariant = () => getJobTypeBadgeVariant(app.job_type);
      } else if (field === "work_system") {
        options = WORK_SYSTEM_OPTIONS;
        getBadgeVariant = () => getWorkSystemBadgeVariant(app.work_system);
      } else if (field === "status") {
        options = STATUS_OPTIONS;
        getBadgeVariant = () => getStatusBadgeVariant(app.status);
      } else if (field === "result_status") {
        options = RESULT_STATUS_OPTIONS;
        getBadgeVariant = () => getResultStatusBadgeVariant(app.result_status);
      }

      return (
        <Select
          value={String(app[field])}
          onValueChange={handleSelectChange}
          disabled={updateApplicationMutation.isPending}
        >
          <SelectTrigger className="h-auto w-full border-0 bg-transparent p-0 shadow-none focus:ring-0">
            <Badge
              variant={getBadgeVariant() as any}
              className="cursor-pointer w-full justify-center text-center py-1"
            >
              {options.find((opt) => opt.value === app[field])?.label ||
                app[field]}
            </Badge>
          </SelectTrigger>
          <SelectContent className="z-50 max-h-60">
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (isEditing) {
      return (
        <Input
          type={type}
          value={value as string}
          onChange={(e) =>
            setValue(
              type === "number" ? Number(e.target.value) : e.target.value
            )
          }
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === "Enter" && handleBlur()}
          autoFocus
          className="h-8 w-auto min-w-[100px]"
        />
      );
    }

    const displayValue = app[field];
    return (
      <span
        className="cursor-pointer hover:bg-muted px-2 py-1 rounded transition-colors whitespace-nowrap block min-h-[1.5rem]"
        onClick={() => setIsEditing(true)}
      >
        {displayValue === null ||
        displayValue === undefined ||
        displayValue === ""
          ? "-"
          : String(displayValue)}
      </span>
    );
  };

  return (
    <>
      {/* Stats Section */}
      <ApplicationStats
        stats={
          statsData || {
            total_applications: 0,
            active_applications: 0,
            interview: 0,
            offer: 0,
            rejected: 0,
            needs_followup: 0,
            overdue: 0,
            no_followup: 0,
          }
        }
        onStatClick={handleStatClick}
        activeFilter={activeStatFilter || undefined}
        isLoading={isStatsLoading}
      />

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto md:min-w-[300px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari perusahaan, posisi, sumber, lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setMassDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus ({selectedIds.length})
            </Button>
          )}
          {activeStatFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveStatFilter(null)}
              className="text-muted-foreground"
            >
              Reset Filter
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
          <ApplicationColumnToggle
            visibility={columnVisibility}
            onVisibilityChange={setColumnVisibility}
          />
          <Button size="sm" onClick={() => navigate("/applications/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Lamaran
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={
                      applications.length > 0 &&
                      selectedIds.length === applications.length
                    }
                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  />
                </TableHead>
                {columnVisibility.position && (
                  <TableHead>
                    <SortableHeader field="position">Posisi</SortableHeader>
                  </TableHead>
                )}
                {columnVisibility.company_name && (
                  <TableHead>
                    <SortableHeader field="company_name">
                      Perusahaan
                    </SortableHeader>
                  </TableHead>
                )}
                {columnVisibility.status && (
                  <TableHead>
                    <SortableHeader field="status">Status</SortableHeader>
                  </TableHead>
                )}
                {columnVisibility.result_status && (
                  <TableHead>
                    <SortableHeader field="result_status">Hasil</SortableHeader>
                  </TableHead>
                )}
                {columnVisibility.date && (
                  <TableHead>
                    <SortableHeader field="date">Tanggal Lamar</SortableHeader>
                  </TableHead>
                )}
                {columnVisibility.follow_up_date && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Follow Up
                  </TableHead>
                )}
                {columnVisibility.location && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Lokasi
                  </TableHead>
                )}
                {columnVisibility.job_type && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Tipe Kerja
                  </TableHead>
                )}
                {columnVisibility.work_system && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Sistem Kerja
                  </TableHead>
                )}
                {columnVisibility.job_source && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Sumber Lowongan
                  </TableHead>
                )}
                {columnVisibility.salary_range && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Rentang Gaji
                  </TableHead>
                )}
                {columnVisibility.contact_name && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Kontak HR
                  </TableHead>
                )}
                {columnVisibility.contact_email && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Email HR
                  </TableHead>
                )}
                {columnVisibility.contact_phone && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Telepon HR
                  </TableHead>
                )}
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={14} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">
                        Memuat data...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : applications.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={14}
                    className="text-center py-16 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FileStack className="h-10 w-10 text-muted-foreground/50" />
                      <p className="text-base font-medium">
                        Tidak ada data lamaran
                      </p>
                      <p className="text-sm">
                        Mulai tambahkan lamaran pertama Anda
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((app, index) => (
                  <TableRow
                    key={app.id}
                    className={cn(
                      index % 2 === 1 && "bg-muted/30",
                      selectedIds.includes(app.id) && "bg-primary/5"
                    )}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(app.id)}
                        onCheckedChange={(checked) =>
                          handleSelectOne(app.id, !!checked)
                        }
                      />
                    </TableCell>
                    {columnVisibility.position && (
                      <TableCell className="font-medium">
                        <EditableCell app={app} field="position" />
                      </TableCell>
                    )}
                    {columnVisibility.company_name && (
                      <TableCell>
                        <EditableCell app={app} field="company_name" />
                      </TableCell>
                    )}
                    {columnVisibility.status && (
                      <TableCell>
                        <EditableCell app={app} field="status" type="select" />
                      </TableCell>
                    )}
                    {columnVisibility.result_status && (
                      <TableCell>
                        <EditableCell
                          app={app}
                          field="result_status"
                          type="select"
                        />
                      </TableCell>
                    )}
                    {columnVisibility.date && (
                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        {dayjs(app.date).format("DD MMM YYYY")}
                      </TableCell>
                    )}
                    {columnVisibility.follow_up_date && (
                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        {app.follow_up_date
                          ? dayjs(app.follow_up_date).format("DD MMM YYYY")
                          : "-"}
                      </TableCell>
                    )}
                    {columnVisibility.location && (
                      <TableCell>
                        <EditableCell app={app} field="location" />
                      </TableCell>
                    )}
                    {columnVisibility.job_type && (
                      <TableCell>
                        <EditableCell
                          app={app}
                          field="job_type"
                          type="select"
                        />
                      </TableCell>
                    )}
                    {columnVisibility.work_system && (
                      <TableCell>
                        <EditableCell
                          app={app}
                          field="work_system"
                          type="select"
                        />
                      </TableCell>
                    )}
                    {columnVisibility.job_source && (
                      <TableCell>
                        <EditableCell app={app} field="job_source" />
                      </TableCell>
                    )}
                    {columnVisibility.salary_range && (
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="text-xs whitespace-nowrap"
                        >
                          {formatSalaryRange(app.salary_min, app.salary_max)}
                        </Badge>
                      </TableCell>
                    )}
                    {columnVisibility.contact_name && (
                      <TableCell>
                        <EditableCell app={app} field="contact_name" />
                      </TableCell>
                    )}
                    {columnVisibility.contact_email && (
                      <TableCell>
                        <EditableCell app={app} field="contact_email" />
                      </TableCell>
                    )}
                    {columnVisibility.contact_phone && (
                      <TableCell>
                        <EditableCell app={app} field="contact_phone" />
                      </TableCell>
                    )}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="z-50 bg-popover"
                        >
                          <DropdownMenuItem
                            onClick={() => navigate(`/applications/${app.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Lihat
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(`/applications/${app.id}/edit`)
                            }
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDuplicate(app.id)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Duplikat
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(app.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {/* Pagination */}
        {pagination.total_items > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-border/60">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Menampilkan</span>
              <Select
                value={String(perPage)}
                onValueChange={(val) => {
                  setPerPage(Number(val));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[70px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {[10, 20, 50].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>dari {pagination.total_items} data</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-3 text-sm">
                {currentPage} / {pagination.total_pages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  setCurrentPage((p) => Math.min(pagination.total_pages, p + 1))
                }
                disabled={currentPage === pagination.total_pages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(pagination.total_pages)}
                disabled={currentPage === pagination.total_pages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <ApplicationFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        filters={filters}
        onApplyFilters={setFilters}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Lamaran?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Lamaran akan dihapus secara
              permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteApplicationMutation.isPending}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={massDeleteDialogOpen}
        onOpenChange={setMassDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Hapus {selectedIds.length} Lamaran?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. {selectedIds.length} lamaran
              yang dipilih akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={massDeleteApplicationMutation.isPending}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                confirmMassDelete();
              }}
              disabled={massDeleteApplicationMutation.isPending}
            >
              {massDeleteApplicationMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
