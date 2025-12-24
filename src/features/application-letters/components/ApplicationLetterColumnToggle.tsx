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
  subject: boolean;
  company_name: boolean;
  application_date: boolean;
  language: boolean;
  name: boolean;
  email: boolean;
  phone: boolean;
  applicant_city: boolean;
  company_city: boolean;
  education: boolean;
  marital_status: boolean;
  gender: boolean;
}

export const defaultColumnVisibility: ColumnVisibility = {
  subject: true,
  company_name: true,
  application_date: true,
  language: true,
  name: false,
  email: false,
  phone: false,
  applicant_city: false,
  company_city: false,
  education: false,
  marital_status: false,
  gender: false,
};

const columnLabels: Record<keyof ColumnVisibility, string> = {
  subject: "Subjek",
  company_name: "Perusahaan",
  application_date: "Tanggal",
  language: "Bahasa",
  name: "Nama Pelamar",
  email: "Email",
  phone: "No. Telepon",
  applicant_city: "Kota Pelamar",
  company_city: "Kota Perusahaan",
  education: "Pendidikan",
  marital_status: "Status Pernikahan",
  gender: "Gender",
};

interface ColumnToggleProps {
  visibility: ColumnVisibility;
  onVisibilityChange: (visibility: ColumnVisibility) => void;
}

export function ApplicationLetterColumnToggle({ visibility, onVisibilityChange }: ColumnToggleProps) {
  const toggleColumn = (column: keyof ColumnVisibility) => {
    onVisibilityChange({
      ...visibility,
      [column]: !visibility[column],
    });
  };

  // Define the order of columns as specified
  const columnOrder: (keyof ColumnVisibility)[] = [
    "subject",
    "company_name",
    "application_date",
    "language",
    "name",
    "email",
    "phone",
    "applicant_city",
    "company_city",
    "education",
    "marital_status",
    "gender",
  ];

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
