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
  title: boolean;
  company: boolean;
  role: boolean;
  city: boolean;
  type: boolean;
  workSystem: boolean;
  salary: boolean;
  status: boolean;
  createdAt: boolean;
  updatedAt: boolean;
}

export const defaultColumnVisibility: ColumnVisibility = {
  title: true,
  company: true,
  role: true,
  city: true,
  type: true,
  workSystem: true,
  salary: true,
  status: true,
  createdAt: false,
  updatedAt: false,
};

const columnLabels: Record<keyof ColumnVisibility, string> = {
  title: "Judul",
  company: "Perusahaan",
  role: "Role",
  city: "Kota",
  type: "Tipe",
  workSystem: "Sistem Kerja",
  salary: "Gaji",
  status: "Status",
  createdAt: "Dibuat",
  updatedAt: "Diupdate",
};

interface ColumnToggleProps {
  visibility: ColumnVisibility;
  onVisibilityChange: (visibility: ColumnVisibility) => void;
}

export function JobColumnToggle({
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
        {Object.keys(visibility).map((column) => (
          <DropdownMenuCheckboxItem
            key={column}
            checked={visibility[column as keyof ColumnVisibility]}
            onCheckedChange={() =>
              toggleColumn(column as keyof ColumnVisibility)
            }
          >
            {columnLabels[column as keyof ColumnVisibility]}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
