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
  position: boolean;
  company_name: boolean;
  status: boolean;
  result_status: boolean;
  date: boolean;
  follow_up_date: boolean;
  location: boolean;
  job_type: boolean;
  work_system: boolean;
  job_source: boolean;
  salary_range: boolean;
  contact_name: boolean;
  contact_email: boolean;
  contact_phone: boolean;
  updated_at: boolean;
  created_at: boolean;
}

const columnLabels: Record<keyof ColumnVisibility, string> = {
  company_name: "Perusahaan",
  position: "Posisi",
  status: "Status",
  result_status: "Hasil",
  date: "Tanggal Lamar",
  job_source: "Sumber Lowongan",
  location: "Lokasi",
  follow_up_date: "Follow Up",
  job_type: "Tipe Kerja",
  work_system: "Sistem Kerja",
  salary_range: "Rentang Gaji",
  contact_name: "Kontak HR",
  contact_email: "Email HR",
  contact_phone: "Telepon HR",
  created_at: "Dibuat",
  updated_at: "Diperbarui",
};

const columnOrder: (keyof ColumnVisibility)[] = [
  "company_name",
  "position",
  "status",
  "result_status",
  "date",
  "job_source",
  "location",
  "job_type",
  "work_system",
  "salary_range",
  "follow_up_date",
  "contact_name",
  "contact_email",
  "contact_phone",
  "created_at",
  "updated_at",
];

interface ColumnToggleProps {
  visibility: ColumnVisibility;
  onVisibilityChange: (visibility: ColumnVisibility) => void;
}

export function ApplicationColumnToggle({
  visibility,
  onVisibilityChange,
}: ColumnToggleProps) {
  const toggleColumn = (column: keyof ColumnVisibility) => {
    onVisibilityChange({
      ...visibility,
      [column]: !visibility[column],
    });
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
            onCheckedChange={() => toggleColumn(column)}
          >
            {columnLabels[column]}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
