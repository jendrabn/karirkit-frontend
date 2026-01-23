import { useState } from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ColumnVisibility {
  preview: boolean;
  type: boolean;
  name: boolean;
  language: boolean;
  is_premium: boolean;
  path: boolean;
  created_at: boolean;
  updated_at: boolean;
}

const columnLabels: Record<keyof ColumnVisibility, string> = {
  preview: "Preview",
  type: "Tipe",
  name: "Nama",
  language: "Bahasa",
  is_premium: "Premium",
  path: "Path",
  created_at: "Dibuat",
  updated_at: "Diperbarui",
};

const columnOrder: (keyof ColumnVisibility)[] = [
  "preview",
  "name",
  "type",
  "language",
  "is_premium",
  "path",
  "created_at",
  "updated_at",
];

interface ColumnToggleProps {
  visibility: ColumnVisibility;
  onVisibilityChange: (visibility: ColumnVisibility) => void;
}

export function TemplatesColumnToggle({
  visibility,
  onVisibilityChange,
}: ColumnToggleProps) {
  const [open, setOpen] = useState(false);

  const toggleColumn = (column: keyof ColumnVisibility) => {
    onVisibilityChange({
      ...visibility,
      [column]: !visibility[column],
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
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
            onCheckedChange={() => toggleColumn(column)}
          >
            {columnLabels[column]}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
