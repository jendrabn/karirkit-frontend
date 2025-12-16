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
}

export const defaultColumnVisibility: ColumnVisibility = {
  position: true,
  company_name: true,
  status: true,
  result_status: true,
  date: true,
  follow_up_date: true,
  location: false,
  job_type: false,
  work_system: false,
  job_source: false,
  salary_range: false,
  contact_name: false,
  contact_email: false,
  contact_phone: false,
};

const columnLabels: Record<keyof ColumnVisibility, string> = {
  position: "Posisi",
  company_name: "Perusahaan",
  status: "Status",
  result_status: "Hasil",
  date: "Tanggal Lamar",
  follow_up_date: "Follow Up",
  location: "Lokasi",
  job_type: "Tipe Kerja",
  work_system: "Sistem Kerja",
  job_source: "Sumber Lowongan",
  salary_range: "Rentang Gaji",
  contact_name: "Kontak HR",
  contact_email: "Email HR",
  contact_phone: "Telepon HR",
};

// Define the order of columns as specified
const columnOrder: (keyof ColumnVisibility)[] = [
  "position",
  "company_name",
  "status",
  "result_status",
  "date",
  "follow_up_date",
  "location",
  "job_type",
  "work_system",
  "job_source",
  "salary_range",
  "contact_name",
  "contact_email",
  "contact_phone",
];

interface ColumnToggleProps {
  visibility: ColumnVisibility;
  onVisibilityChange: (visibility: ColumnVisibility) => void;
}

export function ColumnToggle({ visibility, onVisibilityChange }: ColumnToggleProps) {
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
      <DropdownMenuContent align="end" className="w-56 z-50 bg-popover max-h-80 overflow-y-auto">
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
