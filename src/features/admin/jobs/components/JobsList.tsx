import { dayjs } from "@/lib/date";
import { useNavigate } from "react-router";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Loader2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { SortableHeader } from "@/components/SortableHeader";
import {
  type Job,
  type JobStatus,
  JOB_TYPE_LABELS,
  WORK_SYSTEM_LABELS,
  EDUCATION_LEVEL_LABELS,
} from "@/types/job";
import { cn } from "@/lib/utils";
import { type ColumnVisibility } from "./JobColumnToggle";

type JobSortField =
  | "title"
  | "company_name"
  | "salary_max"
  | "status"
  | "expiration_date"
  | "created_at"
  | "updated_at";

interface JobsListProps {
  jobs: Job[];
  isLoading: boolean;
  selectedIds: string[];
  onSelectAll: () => void;
  onSelectOne: (id: string) => void;
  onDelete: (id: string) => void;
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  sortField: JobSortField;
  sortOrder: "asc" | "desc";
  onSort: (field: JobSortField) => void;
  columnVisibility: ColumnVisibility;
}

const getStatusBadgeVariant = (status: JobStatus) => {
  const variants: Record<
    JobStatus,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    published: "default",
    draft: "secondary",
    closed: "destructive",
    archived: "outline",
  };
  return variants[status];
};

const STATUS_LABELS: Record<JobStatus, string> = {
  published: "Published",
  draft: "Draft",
  closed: "Closed",
  archived: "Archived",
};

export function JobsList({
  jobs,
  isLoading,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onDelete,
  currentPage,
  perPage,
  totalPages,
  totalItems,
  onPageChange,
  onPerPageChange,
  sortField,
  sortOrder,
  onSort,
  columnVisibility,
}: JobsListProps) {
  const navigate = useNavigate();

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatExperienceRange = (min: number, max: number | null) => {
    if (max && max > min) {
      return `${min}-${max} tahun`;
    }
    return `${min}+ tahun`;
  };

  return (
    <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={
                    jobs.length > 0 && selectedIds.length === jobs.length
                  }
                  onCheckedChange={onSelectAll}
                />
              </TableHead>
              {columnVisibility.title && (
                <TableHead>
                  <SortableHeader
                    field="title"
                    onSort={onSort}
                    activeField={sortField}
                    sortOrder={sortOrder}
                  >
                    Judul
                  </SortableHeader>
                </TableHead>
              )}
              {columnVisibility.company && (
                <TableHead>
                  <SortableHeader
                    field="company_name"
                    onSort={onSort}
                    activeField={sortField}
                    sortOrder={sortOrder}
                  >
                    Perusahaan
                  </SortableHeader>
                </TableHead>
              )}
              {columnVisibility.role && (
                <TableHead className="uppercase text-xs font-medium tracking-wide">
                  Role
                </TableHead>
              )}
              {columnVisibility.city && (
                <TableHead className="uppercase text-xs font-medium tracking-wide">
                  Lokasi
                </TableHead>
              )}
              {columnVisibility.type && (
                <TableHead className="uppercase text-xs font-medium tracking-wide">
                  Tipe
                </TableHead>
              )}
              {columnVisibility.workSystem && (
                <TableHead className="uppercase text-xs font-medium tracking-wide">
                  Sistem Kerja
                </TableHead>
              )}
              {columnVisibility.salary && (
                <TableHead>
                  <SortableHeader
                    field="salary_max"
                    onSort={onSort}
                    activeField={sortField}
                    sortOrder={sortOrder}
                  >
                    Gaji
                  </SortableHeader>
                </TableHead>
              )}
              {columnVisibility.status && (
                <TableHead>
                  <SortableHeader
                    field="status"
                    onSort={onSort}
                    activeField={sortField}
                    sortOrder={sortOrder}
                  >
                    Status
                  </SortableHeader>
                </TableHead>
              )}
              {columnVisibility.expiration_date && (
                <TableHead>
                  <SortableHeader
                    field="expiration_date"
                    onSort={onSort}
                    activeField={sortField}
                    sortOrder={sortOrder}
                  >
                    Tanggal Expired
                  </SortableHeader>
                </TableHead>
              )}
              {columnVisibility.education_level && (
                <TableHead className="uppercase text-xs font-medium tracking-wide">
                  Pendidikan
                </TableHead>
              )}
              {columnVisibility.experience && (
                <TableHead className="uppercase text-xs font-medium tracking-wide">
                  Pengalaman
                </TableHead>
              )}
              {columnVisibility.talent_quota && (
                <TableHead className="uppercase text-xs font-medium tracking-wide">
                  Kuota
                </TableHead>
              )}
              {columnVisibility.created_at && (
                <TableHead>
                  <SortableHeader
                    field="created_at"
                    onSort={onSort}
                    activeField={sortField}
                    sortOrder={sortOrder}
                  >
                    Dibuat
                  </SortableHeader>
                </TableHead>
              )}
              {columnVisibility.updated_at && (
                <TableHead>
                  <SortableHeader
                    field="updated_at"
                    onSort={onSort}
                    activeField={sortField}
                    sortOrder={sortOrder}
                  >
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
                <TableCell colSpan={16} className="py-14 text-center">
                  <div className="inline-flex items-center gap-3 rounded-xl border bg-muted/30 px-5 py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Memuat data…
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={16} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Briefcase className="h-10 w-10 mb-2 opacity-50" />
                    <p>Tidak ada lowongan ditemukan.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job, index) => (
                <TableRow
                  key={job.id}
                  className={cn(index % 2 === 1 && "bg-muted/30")}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(job.id)}
                      onCheckedChange={() => onSelectOne(job.id)}
                    />
                  </TableCell>
                  {columnVisibility.title && (
                    <TableCell>
                      <div className="max-w-[200px]">
                        <p className="font-medium truncate">{job.title}</p>
                      </div>
                    </TableCell>
                  )}
                  {columnVisibility.company && (
                    <TableCell>
                      <span className="text-sm">{job.company?.name}</span>
                    </TableCell>
                  )}
                  {columnVisibility.role && (
                    <TableCell className="text-sm text-muted-foreground">
                      {job.job_role?.name}
                    </TableCell>
                  )}
                  {columnVisibility.city && (
                    <TableCell className="text-muted-foreground text-sm">
                      {job.city?.name}
                    </TableCell>
                  )}
                  {columnVisibility.type && (
                    <TableCell>
                      <Badge variant="outline">
                        {JOB_TYPE_LABELS[job.job_type]}
                      </Badge>
                    </TableCell>
                  )}
                  {columnVisibility.workSystem && (
                    <TableCell>
                      <Badge variant="secondary">
                        {WORK_SYSTEM_LABELS[job.work_system]}
                      </Badge>
                    </TableCell>
                  )}
                  {columnVisibility.salary && (
                    <TableCell className="text-sm">
                      {formatSalary(job.salary_min || 0)}
                    </TableCell>
                  )}
                  {columnVisibility.status && (
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(job.status)}>
                        {STATUS_LABELS[job.status]}
                      </Badge>
                    </TableCell>
                  )}
                  {columnVisibility.expiration_date && (
                    <TableCell className="text-muted-foreground whitespace-nowrap text-sm">
                      {job.expiration_date
                        ? dayjs(job.expiration_date).format("DD MMM YYYY")
                        : "-"}
                    </TableCell>
                  )}
                  {columnVisibility.education_level && (
                    <TableCell>
                      <Badge variant="outline">
                        {EDUCATION_LEVEL_LABELS[job.education_level] ||
                          job.education_level}
                      </Badge>
                    </TableCell>
                  )}
                  {columnVisibility.experience && (
                    <TableCell className="text-muted-foreground whitespace-nowrap text-sm">
                      {formatExperienceRange(
                        job.min_years_of_experience,
                        job.max_years_of_experience
                      )}
                    </TableCell>
                  )}
                  {columnVisibility.talent_quota && (
                    <TableCell>
                      <Badge variant="secondary">{job.talent_quota}</Badge>
                    </TableCell>
                  )}
                  {columnVisibility.created_at && (
                    <TableCell className="text-muted-foreground text-sm">
                      {dayjs(job.created_at).format("DD MMM YYYY, HH:mm")}
                    </TableCell>
                  )}
                  {columnVisibility.updated_at && (
                    <TableCell className="text-muted-foreground text-sm">
                      {dayjs(job.updated_at).format("DD MMM YYYY, HH:mm")}
                    </TableCell>
                  )}
                  <TableCell className="text-right">
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
                        className="w-48 bg-popover z-50"
                      >
                        <DropdownMenuItem
                          onClick={() => navigate(`/admin/jobs/${job.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate(`/admin/jobs/${job.id}/edit`)}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(job.id)}
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

      {!isLoading && jobs.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Menampilkan</span>
            <Select
              value={String(perPage)}
              onValueChange={(val) => onPerPageChange(Number(val))}
            >
              <SelectTrigger className="w-[70px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {[5, 10, 20, 50].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>dari {totalItems} data</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-sm">
              Halaman {currentPage} dari {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
