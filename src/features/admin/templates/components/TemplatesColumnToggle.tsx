import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

export type ColumnVisibility = {
  preview: boolean;
  type: boolean;
  name: boolean;
  language: boolean;
  is_premium: boolean;
  created_at: boolean;
};

interface TemplatesColumnToggleProps {
  visibleColumns: ColumnVisibility;
  onToggle: (column: keyof ColumnVisibility) => void;
}

export function TemplatesColumnToggle({
  visibleColumns,
  onToggle,
}: TemplatesColumnToggleProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="hidden lg:flex">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={visibleColumns.preview}
          onCheckedChange={() => onToggle("preview")}
        >
          Preview
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={visibleColumns.name}
          onCheckedChange={() => onToggle("name")}
        >
          Nama
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={visibleColumns.type}
          onCheckedChange={() => onToggle("type")}
        >
          Tipe
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={visibleColumns.language}
          onCheckedChange={() => onToggle("language")}
        >
          Bahasa
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={visibleColumns.is_premium}
          onCheckedChange={() => onToggle("is_premium")}
        >
          Premium
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={visibleColumns.created_at}
          onCheckedChange={() => onToggle("created_at")}
        >
          Dibuat
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
