import { Search, Filter, Plus, ArrowUpDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DocumentsActionsBarProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCount: number;
  onMassDelete: () => void;
  sortValue: string;
  onSortChange: (value: string) => void;
  onOpenFilter: () => void;
  onOpenUpload: () => void;
};

export function DocumentsActionsBar({
  searchQuery,
  onSearchChange,
  selectedCount,
  onMassDelete,
  sortValue,
  onSortChange,
  onOpenFilter,
  onOpenUpload,
}: DocumentsActionsBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div className="relative w-full md:w-auto md:min-w-[300px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama file..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        {selectedCount > 0 && (
          <Button variant="destructive" size="sm" onClick={onMassDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus ({selectedCount})
          </Button>
        )}

        <Select value={sortValue} onValueChange={onSortChange}>
          <SelectTrigger className="w-auto min-w-[180px]">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at-desc">Terbaru Diupload</SelectItem>
            <SelectItem value="created_at-asc">Terlama Diupload</SelectItem>
            <SelectItem value="original_name-asc">Nama (A-Z)</SelectItem>
            <SelectItem value="original_name-desc">Nama (Z-A)</SelectItem>
            <SelectItem value="size-desc">Ukuran (Terbesar)</SelectItem>
            <SelectItem value="size-asc">Ukuran (Terkecil)</SelectItem>
            <SelectItem value="type-asc">Tipe (A-Z)</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={onOpenFilter}>
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>

        <Button size="sm" onClick={onOpenUpload}>
          <Plus className="h-4 w-4 mr-2" />
          Upload Dokumen
        </Button>
      </div>
    </div>
  );
}
