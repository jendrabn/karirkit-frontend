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
  ArrowUpDown,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  type Job,
  type JobStatus,
  JOB_TYPE_LABELS,
  WORK_SYSTEM_LABELS,
} from "@/types/job";
import { cn } from "@/lib/utils";
import { type ColumnVisibility } from "./JobColumnToggle";

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
  sortField: string;
  sortOrder: "asc" | "desc";
  onSort: (field: any) => void;
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
    expired: "outline",
  };
  return variants[status];
};

const STATUS_LABELS: Record<JobStatus, string> = {
  published: "Published",
  draft: "Draft",
  closed: "Closed",
  expired: "Expired",
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

  const SortableHeader = ({
    field,
    children,
  }: {
    field: string;
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent uppercase text-xs font-medium tracking-wide text-muted-foreground hover:text-foreground"
      onClick={() => onSort(field)}
    >
      {children}
      <ArrowUpDown
        className={cn(
          "ml-1.5 h-3.5 w-3.5 transition-opacity",
          sortField === field ? "opacity-100" : "opacity-30"
        )}
        style={{
          transform:
            sortField === field && sortOrder === "desc"
              ? "rotate(180deg)"
              : "none",
        }}
      />
    </Button>
  );

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
                <TableHead className="uppercase text-xs font-medium tracking-wide">
                  Judul
                </TableHead>
              )}
              {columnVisibility.company && (
                <TableHead className="uppercase text-xs font-medium tracking-wide">
                  Perusahaan
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
                  <SortableHeader field="salary_min">Gaji</SortableHeader>
                </TableHead>
              )}
              {columnVisibility.status && (
                <TableHead className="uppercase text-xs font-medium tracking-wide">
                  Status
                </TableHead>
              )}
              {columnVisibility.created_at && (
                <TableHead>
                  <SortableHeader field="created_at">Dibuat</SortableHeader>
                </TableHead>
              )}
              {columnVisibility.updated_at && (
                <TableHead>
                  <SortableHeader field="updated_at">Diperbarui</SortableHeader>
                </TableHead>
              )}
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={12} className="h-16 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Memuat data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="h-32 text-center">
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
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={job.company?.logo} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {job.company?.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{job.company?.name}</span>
                      </div>
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
                      {formatSalary(job.salary_min)}
                    </TableCell>
                  )}
                  {columnVisibility.status && (
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(job.status)}>
                        {STATUS_LABELS[job.status]}
                      </Badge>
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
