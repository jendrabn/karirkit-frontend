/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { format } from "date-fns";
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Eye,
  Pencil,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
  Mail,
  Phone,
} from "lucide-react";
import { ProtectedLayout } from "@/components/layouts/protected-layout";
import { PageHeader } from "@/components/layouts/PageHeader";
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
import {
  ApplicationFilterModal,
  type FilterValues,
} from "@/components/applications/ApplicationFilterModal";
import {
  ColumnToggle,
  type ColumnVisibility,
  defaultColumnVisibility,
} from "@/components/applications/ColumnToggle";
import { ApplicationStats } from "@/components/applications/ApplicationStats";
import { mockApplications } from "@/data/mockApplications";
import {
  type Application,
  type ApplicationStatus,
  type JobType,
  type WorkSystem,
  type ResultStatus,
  JOB_TYPE_OPTIONS,
  WORK_SYSTEM_OPTIONS,
  STATUS_OPTIONS,
  RESULT_STATUS_OPTIONS,
} from "@/types/application";
import { cn } from "@/lib/utils";

// Helper functions to get badge variants
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
  const interviewStatuses = ["user_interview", "final_interview"];

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

// Format salary range
const formatSalaryRange = (min: number, max: number) => {
  const formatNum = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return n.toString();
  };
  return `${formatNum(min)} - ${formatNum(max)}`;
};

type SortField =
  | "date"
  | "company_name"
  | "position"
  | "status"
  | "result_status"
  | "follow_up_date";
type SortOrder = "asc" | "desc";

const ApplicationsRouter = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({});
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(
    defaultColumnVisibility
  );
  const [sortField, setSortField] = useState<SortField | null>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [applications, setApplications] =
    useState<Application[]>(mockApplications);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<string | null>(
    null
  );
  const [activeStatFilter, setActiveStatFilter] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedApplications = useMemo(() => {
    let result = [...applications];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Stat filters
    if (activeStatFilter) {
      switch (activeStatFilter) {
        case "active":
          result = result.filter((app) => app.result_status === "pending");
          break;
        case "interview":
          result = result.filter(
            (app) =>
              app.status === "user_interview" ||
              app.status === "final_interview"
          );
          break;
        case "offer":
          result = result.filter(
            (app) =>
              app.status === "offering" ||
              app.status === "mcu" ||
              app.status === "onboarding" ||
              app.status === "accepted"
          );
          break;
        case "rejected":
          result = result.filter((app) => app.result_status === "failed");
          break;
        case "needFollowUp":
          result = result.filter((app) => {
            if (!app.follow_up_date) return false;
            const followUpDate = new Date(app.follow_up_date);
            followUpDate.setHours(0, 0, 0, 0);
            return followUpDate.getTime() === today.getTime();
          });
          break;
        case "overdue":
          result = result.filter((app) => {
            if (!app.follow_up_date) return false;
            const followUpDate = new Date(app.follow_up_date);
            followUpDate.setHours(0, 0, 0, 0);
            return (
              followUpDate.getTime() < today.getTime() &&
              app.result_status === "pending"
            );
          });
          break;
        case "noFollowUp":
          result = result.filter(
            (app) => !app.follow_up_date && app.result_status === "pending"
          );
          break;
      }
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (app) =>
          app.company_name.toLowerCase().includes(query) ||
          app.position.toLowerCase().includes(query) ||
          app.job_source.toLowerCase().includes(query) ||
          app.location.toLowerCase().includes(query)
      );
    }

    // Filters
    if (filters.job_type) {
      result = result.filter((app) => app.job_type === filters.job_type);
    }
    if (filters.work_system) {
      result = result.filter((app) => app.work_system === filters.work_system);
    }
    if (filters.status) {
      result = result.filter((app) => app.status === filters.status);
    }
    if (filters.result_status) {
      result = result.filter(
        (app) => app.result_status === filters.result_status
      );
    }
    if (filters.dateFrom) {
      result = result.filter((app) => new Date(app.date) >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      result = result.filter((app) => new Date(app.date) <= filters.dateTo!);
    }

    // Sort
    if (sortField) {
      result.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];

        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortOrder === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        return 0;
      });
    }

    return result;
  }, [
    applications,
    searchQuery,
    filters,
    sortField,
    sortOrder,
    activeStatFilter,
  ]);

  const totalPages = Math.ceil(filteredAndSortedApplications.length / perPage);
  const paginatedApplications = filteredAndSortedApplications.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const updateApplication = (
    id: string,
    field: keyof Application,
    value: any
  ) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? { ...app, [field]: value, updated_at: new Date().toISOString() }
          : app
      )
    );
  };

  const handleDelete = (id: string) => {
    setApplicationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (applicationToDelete) {
      setApplications((prev) =>
        prev.filter((app) => app.id !== applicationToDelete)
      );
      setDeleteDialogOpen(false);
      setApplicationToDelete(null);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedApplications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedApplications.map((app) => app.id));
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const confirmBulkDelete = () => {
    setApplications((prev) =>
      prev.filter((app) => !selectedIds.includes(app.id))
    );
    setSelectedIds([]);
    setBulkDeleteDialogOpen(false);
  };

  const handleStatClick = (filter: string) => {
    if (activeStatFilter === filter || filter === "total") {
      setActiveStatFilter(null);
    } else {
      setActiveStatFilter(filter);
    }
    setCurrentPage(1);
  };

  const SortableHeader = ({
    field,
    children,
  }: {
    field: SortField;
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
    const [value, setValue] = useState(app[field]);

    const handleBlur = () => {
      setIsEditing(false);
      if (value !== app[field]) {
        updateApplication(app.id, field, value);
      }
    };

    if (
      type === "select" &&
      (field === "job_type" ||
        field === "work_system" ||
        field === "status" ||
        field === "result_status")
    ) {
      const options =
        field === "job_type"
          ? JOB_TYPE_OPTIONS
          : field === "work_system"
          ? WORK_SYSTEM_OPTIONS
          : field === "status"
          ? STATUS_OPTIONS
          : RESULT_STATUS_OPTIONS;

      const currentValue = app[field] as string;
      const currentLabel =
        options.find((opt) => opt.value === currentValue)?.label ||
        currentValue;

      // Get badge variant based on field type
      const getBadgeVariant = () => {
        if (field === "job_type")
          return getJobTypeBadgeVariant(currentValue as JobType);
        if (field === "work_system")
          return getWorkSystemBadgeVariant(currentValue as WorkSystem);
        if (field === "result_status")
          return getResultStatusBadgeVariant(currentValue as ResultStatus);
        if (field === "status")
          return getStatusBadgeVariant(currentValue as ApplicationStatus);
        return "default";
      };

      return (
        <Select
          value={currentValue}
          onValueChange={(val) => updateApplication(app.id, field, val)}
        >
          <SelectTrigger className="h-auto w-full border-0 bg-transparent p-0 shadow-none focus:ring-0">
            <Badge
              variant={getBadgeVariant() as any}
              className="cursor-pointer w-full justify-center text-center"
            >
              {currentLabel}
            </Badge>
          </SelectTrigger>
          <SelectContent className="z-50 bg-popover">
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

    return (
      <span
        className="cursor-pointer hover:bg-muted px-2 py-1 rounded"
        onClick={() => setIsEditing(true)}
      >
        {String(app[field]) || "-"}
      </span>
    );
  };

  return (
    <ProtectedLayout>
      <PageHeader
        title="Lamaran Kerja"
        subtitle="Kelola dan pantau semua lamaran kerja Anda."
      />

      {/* Stats Section */}
      <ApplicationStats
        applications={applications}
        onStatClick={handleStatClick}
        activeFilter={activeStatFilter || undefined}
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
              onClick={() => setBulkDeleteDialogOpen(true)}
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
          <ColumnToggle
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
      <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={
                      paginatedApplications.length > 0 &&
                      selectedIds.length === paginatedApplications.length
                    }
                    onCheckedChange={handleSelectAll}
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
                  <TableHead>
                    <SortableHeader field="follow_up_date">
                      Follow Up
                    </SortableHeader>
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
              {paginatedApplications.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={16}
                    className="text-center py-16 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-10 w-10 text-muted-foreground/50" />
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
                paginatedApplications.map((app, index) => (
                  <TableRow
                    key={app.id}
                    className={cn(
                      index % 2 === 0 ? "bg-background" : "bg-muted/20",
                      selectedIds.includes(app.id) && "bg-primary/5"
                    )}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(app.id)}
                        onCheckedChange={() => handleSelectOne(app.id)}
                      />
                    </TableCell>
                    {columnVisibility.position && (
                      <TableCell className="font-medium whitespace-nowrap">
                        <EditableCell app={app} field="position" />
                      </TableCell>
                    )}
                    {columnVisibility.company_name && (
                      <TableCell className="whitespace-nowrap">
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
                      <TableCell className="text-muted-foreground">
                        {format(new Date(app.date), "dd MMM yyyy")}
                      </TableCell>
                    )}
                    {columnVisibility.follow_up_date && (
                      <TableCell className="text-muted-foreground">
                        {app.follow_up_date
                          ? format(new Date(app.follow_up_date), "dd MMM yyyy")
                          : "-"}
                      </TableCell>
                    )}
                    {columnVisibility.location && (
                      <TableCell className="whitespace-nowrap">
                        <EditableCell app={app} field="location" />
                      </TableCell>
                    )}
                    {columnVisibility.job_type && (
                      <TableCell className="whitespace-nowrap">
                        <EditableCell
                          app={app}
                          field="job_type"
                          type="select"
                        />
                      </TableCell>
                    )}
                    {columnVisibility.work_system && (
                      <TableCell className="whitespace-nowrap">
                        <EditableCell
                          app={app}
                          field="work_system"
                          type="select"
                        />
                      </TableCell>
                    )}
                    {columnVisibility.job_source && (
                      <TableCell className="whitespace-nowrap">
                        <EditableCell app={app} field="job_source" />
                      </TableCell>
                    )}
                    {columnVisibility.salary_range && (
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {formatSalaryRange(app.salary_min, app.salary_max)}
                        </Badge>
                      </TableCell>
                    )}
                    {columnVisibility.contact_name && (
                      <TableCell className="whitespace-nowrap">
                        <EditableCell app={app} field="contact_name" />
                      </TableCell>
                    )}
                    {columnVisibility.contact_email && (
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <EditableCell app={app} field="contact_email" />
                          {app.contact_email && (
                            <a
                              href={`mailto:${app.contact_email}`}
                              className="text-muted-foreground hover:text-primary transition-colors"
                              title="Kirim Email"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Mail className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </TableCell>
                    )}
                    {columnVisibility.contact_phone && (
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <EditableCell app={app} field="contact_phone" />
                          {app.contact_phone && (
                            <a
                              href={`https://wa.me/62${app.contact_phone
                                .replace(/^0/, "")
                                .replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                              title="Hubungi via WhatsApp"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Phone className="h-4 w-4" />
                            </a>
                          )}
                        </div>
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
                            onClick={() => {
                              const newApp = {
                                ...app,
                                id: `${Date.now()}`,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString(),
                              };
                              setApplications((prev) => [newApp, ...prev]);
                            }}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Duplikasi
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
        {filteredAndSortedApplications.length > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-border/60">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Tampilkan</span>
              <Select
                value={String(perPage)}
                onValueChange={(value) => {
                  setPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[70px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span>dari {filteredAndSortedApplications.length} data</span>
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
                Halaman {currentPage} dari {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <ApplicationFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        filters={filters}
        onApplyFilters={setFilters}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Lamaran</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus lamaran ini? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Hapus {selectedIds.length} Lamaran
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus {selectedIds.length} lamaran
              yang dipilih? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus Semua
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ProtectedLayout>
  );
};

export default ApplicationsRouter;
