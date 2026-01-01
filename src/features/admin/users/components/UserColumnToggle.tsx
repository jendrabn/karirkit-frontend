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
  name: boolean;
  username: boolean;
  email: boolean;
  role: boolean;
  status: boolean;
  phone: boolean;
  daily_download_limit: boolean;
  total_downloads: boolean;
  created_at: boolean;
  updated_at: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const defaultColumnVisibility: ColumnVisibility = {
  name: true,
  username: true,
  email: true,
  role: true,
  status: true,
  phone: false,
  daily_download_limit: true,
  total_downloads: false,
  created_at: true,
  updated_at: false,
};

const columnOrder: (keyof ColumnVisibility)[] = [
  "name",
  "username",
  "email",
  "role",
  "status",
  "phone",
  "daily_download_limit",
  "total_downloads",
  "created_at",
  "updated_at",
];

const columnLabels: Record<keyof ColumnVisibility, string> = {
  name: "Nama",
  username: "Username",
  email: "Email",
  role: "Role",
  status: "Status",
  phone: "Telepon",
  daily_download_limit: "Batas Unduhan",
  total_downloads: "Total Unduhan",
  created_at: "Dibuat",
  updated_at: "Diperbarui",
};

interface ColumnToggleProps {
  visibility: ColumnVisibility;
  onVisibilityChange: (visibility: ColumnVisibility) => void;
}

export function UserColumnToggle({
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
