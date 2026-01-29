import { useState } from "react";
import { useNavigate } from "react-router";
import { paths } from "@/config/paths";
import { dayjs } from "@/lib/date";
import {
  Search,
  Filter,
  Plus,
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
import { Badge, type BadgeProps } from "@/components/ui/badge";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ApplicationFilterModal } from "./ApplicationFilterModal";
import { ApplicationColumnToggle, type ColumnVisibility } from "./ApplicationColumnToggle";
import { defaultColumnVisibility } from "../types/application-column-toggle.constants";
import { ApplicationStats } from "./ApplicationStats";
import {
  useApplications,
  type GetApplicationsParams,
} from "../api/get-applications";
import { useApplicationStats } from "../api/get-application-stats";
import { useDeleteApplication } from "../api/delete-application";
import { useDuplicateApplication } from "../api/duplicate-application";
import {
  useUpdateApplication,
  type UpdateApplicationInput,
} from "../api/update-application";
import { useMassDeleteApplications } from "../api/mass-delete-applications";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useUrlParams } from "@/hooks/use-url-params";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SortableHeader } from "@/components/SortableHeader";
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

type FilterParams = Omit<
  GetApplicationsParams,
  "page" | "per_page" | "q" | "sort_by" | "sort_order"
>;

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
  const testStatuses = ["online_test", "psychological_test", "technical_test"];
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
  max: number | undefined | null,
) => {
  const formatNum = (n: number | undefined | null) => {
    if (n === undefined || n === null || n === 0) return "0";
    if (n >= 1000000000) return `${(n / 1000000000).toFixed(1)} Miliar`;
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)} Juta`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)} Rb`;
    return n.toString();
  };

  if (!min && !max) return "-";
  if (min && !max) return `> Rp ${formatNum(min)}`;
  if (!min && max) return `< Rp ${formatNum(max)}`;
  if (min === max) return `Rp ${formatNum(min)}`;
  return `Rp ${formatNum(min)} - ${formatNum(max)}`;
};

export const ApplicationsList = () => {
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
    sort_by: "date" as GetApplicationsParams["sort_by"],
    sort_order: "desc" as "asc" | "desc",
    status: "",
    result_status: "",
    job_type: "",
    work_system: "",
    date_from: "",
    date_to: "",
    follow_up_date_from: "",
    follow_up_date_to: "",
    follow_up_date_has: "",
    follow_up_overdue: "",
    location: "",
    company_name: "",
    job_source: "",
    salary_from: "",
    salary_to: "",
  });

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [columnVisibility, setColumnVisibility] =
    useLocalStorage<ColumnVisibility>(
      "applications-table-columns",
      defaultColumnVisibility,
    );

  const [activeStatFilter, setActiveStatFilter] = useState<string | null>(null);

  // Combine filters
  const queryParams: GetApplicationsParams = {
    page: params.page,
    per_page: params.per_page,
    q: params.q || undefined,
    sort_by: params.sort_by,
    sort_order: params.sort_order,
    status: params.status
      ? (params.status as ApplicationStatus)
      : undefined,
    result_status: params.result_status
      ? (params.result_status as ResultStatus)
      : undefined,
    job_type: params.job_type ? (params.job_type as JobType) : undefined,
    work_system: params.work_system
      ? (params.work_system as WorkSystem)
      : undefined,
    date_from: params.date_from || undefined,
    date_to: params.date_to || undefined,
    follow_up_date_from: params.follow_up_date_from || undefined,
    follow_up_date_to: params.follow_up_date_to || undefined,
    follow_up_date_has: params.follow_up_date_has
      ? (params.follow_up_date_has as "true" | "false")
      : undefined,
    follow_up_overdue: params.follow_up_overdue
      ? (params.follow_up_overdue as "true" | "false")
      : undefined,
    location: params.location || undefined,
    company_name: params.company_name || undefined,
    job_source: params.job_source || undefined,
    salary_from: params.salary_from ? Number(params.salary_from) : undefined,
    salary_to: params.salary_to ? Number(params.salary_to) : undefined,
    ...(activeStatFilter === "active" ? { result_status: "pending" } : {}),
    ...(activeStatFilter === "rejected" ? { result_status: "failed" } : {}),
    ...(activeStatFilter === "offer" ? { status: "offering" } : {}),
    ...(activeStatFilter === "interview" ? { status: "hr_interview" } : {}), // Map closest
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
      onSuccess: (data) => {
        toast.success("Lamaran berhasil diduplikasi");
        navigate(paths.applications.detail.getHref(data.id));
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
    null,
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
    if (params.sort_by === field) {
      setParam(
        "sort_order",
        params.sort_order === "asc" ? "desc" : "asc",
        false,
      );
    } else {
      setParams({ sort_by: field, sort_order: "asc" }, false);
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
    setParam("page", 1, false);
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
        const {
          id: _id,
          user_id: _userId,
          created_at: _createdAt,
          updated_at: _updatedAt,
          ...data
        } = {
          ...app,
          [field]: value,
        };
        void _id;
        void _userId;
        void _createdAt;
        void _updatedAt;
        updateApplicationMutation.mutate({
          id: app.id,
          data: data as UpdateApplicationInput,
        });
      }
    };

    const handleSelectChange = (val: string) => {
      const {
        id: _id,
        user_id: _userId,
        created_at: _createdAt,
        updated_at: _updatedAt,
        ...data
      } = {
        ...app,
        [field]: val,
      };
      void _id;
      void _userId;
      void _createdAt;
      void _updatedAt;
      updateApplicationMutation.mutate({
        id: app.id,
        data: data as UpdateApplicationInput,
      });
    };

    if (type === "select") {
      let options: { value: string; label: string }[] = [];
      let getBadgeVariant: () => BadgeProps["variant"] = () => "default";

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
              variant={getBadgeVariant()}
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
              type === "number" ? Number(e.target.value) : e.target.value,
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
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className="cursor-pointer hover:bg-muted px-2 py-1 rounded transition-colors whitespace-nowrap block min-h-[1.5rem] truncate max-w-[150px]"
            onClick={() => setIsEditing(true)}
          >
            {displayValue === null ||
            displayValue === undefined ||
            displayValue === ""
              ? "-"
              : String(displayValue)}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {displayValue === null ||
            displayValue === undefined ||
            displayValue === ""
              ? "-"
              : String(displayValue)}
          </p>
        </TooltipContent>
      </Tooltip>
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
            placeholder="Cari perusahaan, posisi, lokasi, sumber, kontak..."
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
          <TooltipProvider>
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
                {columnVisibility.company_name && (
                  <TableHead>
                    <SortableHeader field="company_name" onSort={handleSort}>
                      Perusahaan
                    </SortableHeader>
                  </TableHead>
                )}
                {columnVisibility.position && (
                  <TableHead>
                    <SortableHeader field="position" onSort={handleSort}>
                      Posisi
                    </SortableHeader>
                  </TableHead>
                )}
                {columnVisibility.status && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Status
                  </TableHead>
                )}
                {columnVisibility.result_status && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Hasil
                  </TableHead>
                )}
                {columnVisibility.date && (
                  <TableHead>
                    <SortableHeader field="date" onSort={handleSort}>
                      Tanggal Lamar
                    </SortableHeader>
                  </TableHead>
                )}
                {columnVisibility.job_source && (
                  <TableHead className="uppercase text-xs font-medium tracking-wide">
                    Sumber Lowongan
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
                {columnVisibility.salary_range && (
                  <TableHead>
                    <SortableHeader field="salary_max" onSort={handleSort}>
                      Rentang Gaji
                    </SortableHeader>
                  </TableHead>
                )}
                {columnVisibility.follow_up_date && (
                  <TableHead>
                    <SortableHeader field="follow_up_date" onSort={handleSort}>
                      Follow Up
                    </SortableHeader>
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
                {columnVisibility.created_at && (
                  <TableHead>
                    <SortableHeader field="created_at" onSort={handleSort}>
                      Dibuat
                    </SortableHeader>
                  </TableHead>
                )}
                {columnVisibility.updated_at && (
                  <TableHead>
                    <SortableHeader field="updated_at" onSort={handleSort}>
                      Diperbarui
                    </SortableHeader>
                  </TableHead>
                )}
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={14} className="py-14 text-center">
                    <div className="inline-flex items-center gap-3 rounded-xl border bg-muted/30 px-5 py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Memuat data…
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
                      selectedIds.includes(app.id) && "bg-primary/5",
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
                    {columnVisibility.company_name && (
                      <TableCell className="font-medium max-w-[180px]">
                        <EditableCell app={app} field="company_name" />
                      </TableCell>
                    )}
                    {columnVisibility.position && (
                      <TableCell className="max-w-[200px]">
                        <EditableCell app={app} field="position" />
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
{columnVisibility.job_source && (
                      <TableCell className="max-w-[150px]">
                        <EditableCell app={app} field="job_source" />
                      </TableCell>
                    )}
{columnVisibility.location && (
                      <TableCell className="max-w-[150px]">
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
                    {columnVisibility.follow_up_date && (
                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        {app.follow_up_date
                          ? dayjs(app.follow_up_date).format("DD MMM YYYY")
                          : "-"}
                      </TableCell>
                    )}
{columnVisibility.contact_name && (
                      <TableCell className="max-w-[150px]">
                        <EditableCell app={app} field="contact_name" />
                      </TableCell>
                    )}
{columnVisibility.contact_email && (
                      <TableCell className="max-w-[200px]">
                        <EditableCell app={app} field="contact_email" />
                      </TableCell>
                    )}
{columnVisibility.contact_phone && (
                      <TableCell className="max-w-[150px]">
                        <EditableCell app={app} field="contact_phone" />
                      </TableCell>
                    )}
                    {columnVisibility.created_at && (
                      <TableCell className="text-muted-foreground whitespace-nowrap text-sm">
                        {dayjs(app.created_at).format("DD MMM YYYY, HH:mm")}
                      </TableCell>
                    )}
                    {columnVisibility.updated_at && (
                      <TableCell className="text-muted-foreground whitespace-nowrap text-sm">
                        {dayjs(app.updated_at).format("DD MMM YYYY, HH:mm")}
                      </TableCell>
                    )}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="secondary"
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
                            Lihat Detail
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
        </TooltipProvider>
        </div>
        {/* Pagination */}
        {pagination.total_items > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-border/60">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Menampilkan</span>
              <Select
                value={String(params.per_page)}
                onValueChange={(val) => {
                  setParam("per_page", Number(val), true);
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
                onClick={() => setParam("page", 1, false)}
                disabled={params.page === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setParam("page", params.page - 1, false)}
                disabled={params.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-3 text-sm">
                {params.page} / {pagination.total_pages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setParam("page", params.page + 1, false)}
                disabled={params.page === pagination.total_pages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setParam("page", pagination.total_pages, false)}
                disabled={params.page === pagination.total_pages}
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
        filters={{
          status: params.status
            ? (params.status as FilterParams["status"])
            : undefined,
          result_status: params.result_status
            ? (params.result_status as FilterParams["result_status"])
            : undefined,
          job_type: params.job_type
            ? (params.job_type as FilterParams["job_type"])
            : undefined,
          work_system: params.work_system
            ? (params.work_system as FilterParams["work_system"])
            : undefined,
          date_from: params.date_from || "",
          date_to: params.date_to || "",
          follow_up_date_from: params.follow_up_date_from || "",
          follow_up_date_to: params.follow_up_date_to || "",
          follow_up_date_has: params.follow_up_date_has
            ? (params.follow_up_date_has as FilterParams["follow_up_date_has"])
            : undefined,
          follow_up_overdue: params.follow_up_overdue
            ? (params.follow_up_overdue as FilterParams["follow_up_overdue"])
            : undefined,
          location: params.location || "",
          company_name: params.company_name || "",
          job_source: params.job_source || "",
          salary_from: params.salary_from
            ? Number(params.salary_from)
            : undefined,
          salary_to: params.salary_to ? Number(params.salary_to) : undefined,
        }}
        onApplyFilters={(newFilters) => {
          setParams(
            {
              status: newFilters.status || "",
              result_status: newFilters.result_status || "",
              job_type: newFilters.job_type || "",
              work_system: newFilters.work_system || "",
              date_from: newFilters.date_from || "",
              date_to: newFilters.date_to || "",
              follow_up_date_from: newFilters.follow_up_date_from || "",
              follow_up_date_to: newFilters.follow_up_date_to || "",
              follow_up_date_has: newFilters.follow_up_date_has || "",
              follow_up_overdue: newFilters.follow_up_overdue || "",
              location: newFilters.location || "",
              company_name: newFilters.company_name || "",
              job_source: newFilters.job_source || "",
              salary_from:
                newFilters.salary_from !== undefined
                  ? String(newFilters.salary_from)
                  : "",
              salary_to:
                newFilters.salary_to !== undefined
                  ? String(newFilters.salary_to)
                  : "",
            },
            true,
          );
          setFilterModalOpen(false);
        }}
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
