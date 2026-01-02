import { dayjs } from "@/lib/date";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
import { type JobRole } from "@/types/job";
import { cn } from "@/lib/utils";
import { type ColumnVisibility } from "./JobRoleColumnToggle";

interface JobRolesListProps {
  roles: JobRole[];
  isLoading: boolean;
  selectedIds: string[];
  onSelectAll: () => void;
  onSelectOne: (id: string) => void;
  onEdit: (role: JobRole) => void;
  onDelete: (id: string) => void;
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  columnVisibility: ColumnVisibility;
}

export function JobRolesList({
  roles,
  isLoading,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onEdit,
  onDelete,
  currentPage,
  perPage,
  totalPages,
  totalItems,
  onPageChange,
  onPerPageChange,
  columnVisibility,
}: JobRolesListProps) {
  return (
    <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={
                    roles.length > 0 && selectedIds.length === roles.length
                  }
                  onCheckedChange={onSelectAll}
                />
              </TableHead>
              {columnVisibility.name && <TableHead>Nama Role</TableHead>}
              {columnVisibility.slug && <TableHead>Slug</TableHead>}
              {columnVisibility.jobCount && <TableHead>Lowongan</TableHead>}
              {columnVisibility.created_at && <TableHead>Dibuat</TableHead>}
              {columnVisibility.updated_at && <TableHead>Diperbarui</TableHead>}
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7} className="py-14 text-center">
                  <div className="inline-flex items-center gap-3 rounded-xl border bg-muted/30 px-5 py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Memuat data…
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Briefcase className="h-10 w-10 mb-2 opacity-50" />
                    <p>Tidak ada role ditemukan.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role, index) => (
                <TableRow
                  key={role.id}
                  className={cn(index % 2 === 1 && "bg-muted/30")}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(role.id)}
                      onCheckedChange={() => onSelectOne(role.id)}
                    />
                  </TableCell>
                  {columnVisibility.name && (
                    <TableCell>
                      <span className="font-medium">{role.name}</span>
                    </TableCell>
                  )}
                  {columnVisibility.slug && (
                    <TableCell className="text-sm text-muted-foreground">
                      {role.slug}
                    </TableCell>
                  )}
                  {columnVisibility.jobCount && (
                    <TableCell className="text-sm">
                      <Badge variant="secondary">{role.job_count}</Badge>
                    </TableCell>
                  )}
                  {columnVisibility.created_at && (
                    <TableCell className="text-muted-foreground text-sm">
                      {dayjs(role.created_at).format("DD MMM YYYY, HH:mm")}
                    </TableCell>
                  )}
                  {columnVisibility.updated_at && (
                    <TableCell className="text-muted-foreground text-sm">
                      {dayjs(role.updated_at).format("DD MMM YYYY, HH:mm")}
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
                        <DropdownMenuItem onClick={() => onEdit(role)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(role.id)}
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
      {!isLoading && roles.length > 0 && (
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
