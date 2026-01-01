import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ColumnVisibility {
  original_name: boolean;
  type: boolean;
  size: boolean;
  uploaded_at: boolean;
}

export const defaultColumnVisibility: ColumnVisibility = {
  original_name: true,
  type: true,
  size: true,
  uploaded_at: true,
};

const columnLabels: Record<keyof ColumnVisibility, string> = {
  original_name: "Nama File",
  type: "Tipe",
  size: "Ukuran",
  uploaded_at: "Tanggal Upload",
};

const columnOrder: (keyof ColumnVisibility)[] = [
  "original_name",
  "type",
  "size",
  "uploaded_at",
];

type DocumentsColumnToggleProps = {
  visibility: ColumnVisibility;
  onVisibilityChange: (visibility: ColumnVisibility) => void;
};

export function DocumentsColumnToggle({
  visibility,
  onVisibilityChange,
}: DocumentsColumnToggleProps) {
  const handleToggle = (column: keyof ColumnVisibility) => {
    onVisibilityChange({ ...visibility, [column]: !visibility[column] });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="h-4 w-4 mr-2" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 z-50 bg-popover max-h-80 overflow-y-auto"
      >
        <DropdownMenuLabel>Tampilkan Kolom</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columnOrder.map((column) => (
          <DropdownMenuCheckboxItem
            key={column}
            checked={visibility[column]}
            onCheckedChange={() => handleToggle(column)}
          >
            {columnLabels[column]}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
