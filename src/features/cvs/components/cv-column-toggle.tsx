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
  latest_experience: boolean;
  latest_education: boolean;
  skills_count: boolean;
  language: boolean;
  visibility: boolean;
  views: boolean;
  name: boolean;
  email: boolean;
  phone: boolean;
  about: boolean;
  address: boolean;
  photo: boolean;
  certificates_count: boolean;
  awards_count: boolean;
  organizations_count: boolean;
  social_links_count: boolean;
  template: boolean;
  created_at: boolean;
  updated_at: boolean;
}

const columnLabels: Record<keyof ColumnVisibility, string> = {
  headline: "Headline / Posisi",
  latest_experience: "Pengalaman Terakhir",
  latest_education: "Pendidikan Terakhir",
  skills_count: "Jumlah Skill",
  language: "Bahasa",
  visibility: "Visibility",
  views: "Views",
  name: "Nama",
  email: "Email",
  phone: "No. Telepon",
  about: "Ringkasan",
  address: "Alamat",
  photo: "Foto",
  certificates_count: "Jumlah Sertifikat",
  awards_count: "Jumlah Penghargaan",
  organizations_count: "Organisasi",
  social_links_count: "Sosial",
  template: "Template",
  created_at: "Dibuat",
  updated_at: "Diperbarui",
};

interface CVColumnToggleProps {
  visibility: ColumnVisibility;
  onVisibilityChange: (visibility: ColumnVisibility) => void;
}

// Define the order of columns as specified
const columnOrder: (keyof ColumnVisibility)[] = [
  "headline",
  "latest_experience",
  "latest_education",
  "skills_count",
  "language",
  "visibility",
  "views",
  "name",
  "email",
  "phone",
  "about",
  "address",
  "photo",
  "certificates_count",
  "awards_count",
  "organizations_count",
  "social_links_count",
  "template",
  "created_at",
  "updated_at",
];
export function CVColumnToggle({
  visibility,
  onVisibilityChange,
}: CVColumnToggleProps) {
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
