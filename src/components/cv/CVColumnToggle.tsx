import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ColumnVisibility {
  headline: boolean;
  about: boolean;
  latest_experience: boolean;
  latest_education: boolean;
  skills_count: boolean;
  updated_at: boolean;
  name: boolean;
  email: boolean;
  phone: boolean;
  address: boolean;
  photo: boolean;
  certificates_count: boolean;
  awards_count: boolean;
  organizations_count: boolean;
}

export const defaultColumnVisibility: ColumnVisibility = {
  headline: true,
  about: true,
  latest_experience: true,
  latest_education: true,
  skills_count: true,
  updated_at: true,
  name: false,
  email: false,
  phone: false,
  address: false,
  photo: false,
  certificates_count: false,
  awards_count: false,
  organizations_count: false,
};

const columnLabels: Record<keyof ColumnVisibility, string> = {
  headline: "Headline / Posisi",
  about: "Ringkasan",
  latest_experience: "Pengalaman Terakhir",
  latest_education: "Pendidikan Terakhir",
  skills_count: "Jumlah Skill",
  updated_at: "Terakhir Diperbarui",
  name: "Nama Pemilik",
  email: "Email",
  phone: "No. Telepon",
  address: "Alamat",
  photo: "Foto",
  certificates_count: "Jumlah Sertifikat",
  awards_count: "Jumlah Penghargaan",
  organizations_count: "Organisasi",
};

interface CVColumnToggleProps {
  visibility: ColumnVisibility;
  onVisibilityChange: (visibility: ColumnVisibility) => void;
}

// Define the order of columns as specified
const columnOrder: (keyof ColumnVisibility)[] = [
  "headline",
  "about",
  "latest_experience",
  "latest_education",
  "skills_count",
  "updated_at",
  "name",
  "email",
  "phone",
  "address",
  "photo",
  "certificates_count",
  "awards_count",
  "organizations_count",
];

export function CVColumnToggle({ visibility, onVisibilityChange }: CVColumnToggleProps) {
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
      <DropdownMenuContent align="end" className="w-56 z-50 bg-popover max-h-80 overflow-y-auto">
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
