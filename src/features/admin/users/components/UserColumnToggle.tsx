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
  id: boolean;
  name: boolean;
  username: boolean;
  email: boolean;
  phone: boolean;
  headline: boolean;
  location: boolean;
  role: boolean;
  status: boolean;
  email_verified_at: boolean;
  last_login_at: boolean;
  subscription_plan: boolean;
  subscription_expires_at: boolean;
  download_today_count: boolean;
  download_total_count: boolean;
  created_at: boolean;
  updated_at: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const defaultColumnVisibility: ColumnVisibility = {
  id: false,
  name: true,
  username: true,
  email: true,
  phone: false,
  headline: true,
  location: false,
  role: true,
  status: true,
  email_verified_at: false,
  last_login_at: true,
  subscription_plan: true,
  subscription_expires_at: false,
  download_today_count: false,
  download_total_count: true,
  created_at: true,
  updated_at: false,
};

const columnOrder: (keyof ColumnVisibility)[] = [
  "id",
  "name",
  "username",
  "email",
  "phone",
  "headline",
  "location",
  "role",
  "status",
  "email_verified_at",
  "last_login_at",
  "subscription_plan",
  "subscription_expires_at",
  "download_today_count",
  "download_total_count",
  "created_at",
  "updated_at",
];

const columnLabels: Record<keyof ColumnVisibility, string> = {
  id: "ID",
  name: "Nama",
  username: "Username",
  email: "Email",
  phone: "Telepon",
  headline: "Headline",
  location: "Lokasi",
  role: "Role",
  status: "Status",
  email_verified_at: "Email Verified",
  last_login_at: "Login Terakhir",
  subscription_plan: "Paket",
  subscription_expires_at: "Masa Aktif",
  download_today_count: "Unduhan Hari Ini",
  download_total_count: "Total Unduhan",
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
