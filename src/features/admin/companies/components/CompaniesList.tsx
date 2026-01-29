import { dayjs } from "@/lib/date";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Building2,
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
import { type Company, EMPLOYEE_SIZE_LABELS } from "@/types/company";
import { cn } from "@/lib/utils";
import { type ColumnVisibility } from "./CompanyColumnToggle";
import { SortableHeader } from "@/components/SortableHeader";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CompaniesListProps {
  companies: Company[];
  isLoading: boolean;
  selectedIds: string[];
  onSelectAll: () => void;
  onSelectOne: (id: string) => void;
  onEdit: (company: Company) => void;
  onView: (company: Company) => void;
  onDelete: (id: string) => void;
  sortField:
    | "created_at"
    | "updated_at"
    | "name"
    | "employee_size"
    | "job_count";
  sortOrder: "asc" | "desc";
  onSort: (
    field:
      | "created_at"
      | "updated_at"
      | "name"
      | "employee_size"
      | "job_count"
  ) => void;
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  columnVisibility: ColumnVisibility;
}

export function CompaniesList({
  companies,
  isLoading,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onEdit,
  onView,
  onDelete,
  sortField,
  sortOrder,
  onSort,
  currentPage,
  perPage,
  totalPages,
  totalItems,
  onPageChange,
  onPerPageChange,
  columnVisibility,
}: CompaniesListProps) {
  return (
    <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <TooltipProvider>
          <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={
                    companies.length > 0 &&
                    selectedIds.length === companies.length
                  }
                  onCheckedChange={onSelectAll}
                />
              </TableHead>
              {columnVisibility.name && (
                <TableHead>
                  <SortableHeader
                    field="name"
                    onSort={onSort}
                    activeField={sortField}
                    sortOrder={sortOrder}
                  >
                    Nama Perusahaan
                  </SortableHeader>
                </TableHead>
              )}
              {columnVisibility.slug && (
                <TableHead className="uppercase text-xs font-medium tracking-wide">
                  Slug
                </TableHead>
              )}
              {columnVisibility.sector && (
                <TableHead className="uppercase text-xs font-medium tracking-wide">
                  Sektor Bisnis
                </TableHead>
              )}
              {columnVisibility.size && (
                <TableHead>
                  <SortableHeader
                    field="employee_size"
                    onSort={onSort}
                    activeField={sortField}
                    sortOrder={sortOrder}
                  >
                    Ukuran
                  </SortableHeader>
                </TableHead>
              )}
              {columnVisibility.jobCount && (
                <TableHead>
                  <SortableHeader
                    field="job_count"
                    onSort={onSort}
                    activeField={sortField}
                    sortOrder={sortOrder}
                  >
                    Lowongan
                  </SortableHeader>
                </TableHead>
              )}
              {columnVisibility.website_url && (
                <TableHead className="uppercase text-xs font-medium tracking-wide">
                  Website
                </TableHead>
              )}
              {columnVisibility.description && (
                <TableHead className="uppercase text-xs font-medium tracking-wide">
                  Deskripsi
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
                <TableCell colSpan={11} className="py-14 text-center">
                  <div className="inline-flex items-center gap-3 rounded-xl border bg-muted/30 px-5 py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Memuat data…
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : companies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Building2 className="h-10 w-10 mb-2 opacity-50" />
                    <p>Tidak ada perusahaan ditemukan.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              companies.map((company, index) => (
                <TableRow
                  key={company.id}
                  className={cn(
                    index % 2 === 0 ? "bg-background" : "bg-muted/20"
                  )}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(company.id)}
                      onCheckedChange={() => onSelectOne(company.id)}
                    />
                  </TableCell>
                   {columnVisibility.name && (
                     <TableCell className="max-w-[180px]">
                       <Tooltip>
                         <TooltipTrigger asChild>
                           <span className="block truncate font-medium">
                             {company.name}
                           </span>
                         </TooltipTrigger>
                         <TooltipContent>
                           <p>{company.name}</p>
                         </TooltipContent>
                       </Tooltip>
                     </TableCell>
                   )}
                   {columnVisibility.slug && (
                     <TableCell className="max-w-[150px]">
                       <Tooltip>
                         <TooltipTrigger asChild>
                           <span className="block truncate text-sm text-muted-foreground">
                             {company.slug}
                           </span>
                         </TooltipTrigger>
                         <TooltipContent>
                           <p>{company.slug}</p>
                         </TooltipContent>
                       </Tooltip>
                     </TableCell>
                   )}
                  {columnVisibility.sector && (
                    <TableCell>
                      <Badge variant="outline">{company.business_sector}</Badge>
                    </TableCell>
                  )}
                  {columnVisibility.size && (
                    <TableCell className="text-sm text-muted-foreground">
                      {company.employee_size
                        ? EMPLOYEE_SIZE_LABELS[company.employee_size]
                        : "-"}
                    </TableCell>
                  )}
                  {columnVisibility.jobCount && (
                    <TableCell className="text-sm">
                      <Badge variant="secondary">{company.job_count}</Badge>
                    </TableCell>
                  )}
                   {columnVisibility.website_url && (
                     <TableCell className="max-w-[200px]">
                       {company.website_url ? (
                         <Tooltip>
                           <TooltipTrigger asChild>
                             <a
                               href={company.website_url}
                               target="_blank"
                               rel="noreferrer"
                               className="text-primary underline-offset-2 hover:underline block truncate"
                             >
                               {company.website_url}
                             </a>
                           </TooltipTrigger>
                           <TooltipContent>
                             <p>{company.website_url}</p>
                           </TooltipContent>
                         </Tooltip>
                       ) : (
                         <span className="text-muted-foreground">-</span>
                       )}
                     </TableCell>
                   )}
                  {columnVisibility.description && (
                    <TableCell className="text-muted-foreground max-w-[250px] truncate">
                      {company.description || "-"}
                    </TableCell>
                  )}
                  {columnVisibility.created_at && (
                    <TableCell className="text-muted-foreground text-sm">
                      {dayjs(company.created_at).format("DD MMM YYYY, HH:mm")}
                    </TableCell>
                  )}
                  {columnVisibility.updated_at && (
                    <TableCell className="text-muted-foreground text-sm">
                      {dayjs(company.updated_at).format("DD MMM YYYY, HH:mm")}
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
                        <DropdownMenuItem onClick={() => onView(company)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(company)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(company.id)}
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
      {!isLoading && companies.length > 0 && (
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
