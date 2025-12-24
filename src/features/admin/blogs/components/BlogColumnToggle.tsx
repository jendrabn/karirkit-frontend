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
  category: boolean;
  author: boolean;
  status: boolean;
  views_count: boolean;
  min_read: boolean;
  published_at: boolean;
  updated_at: boolean;
}

export const defaultColumnVisibility: ColumnVisibility = {
  title: true,
  category: true,
  author: true,
  status: true,
  views_count: true,
  min_read: true,
  published_at: true,
  updated_at: true,
};

interface BlogColumnToggleProps {
  visibility: ColumnVisibility;
  onVisibilityChange: (visibility: ColumnVisibility) => void;
}

export function BlogColumnToggle({ visibility, onVisibilityChange }: BlogColumnToggleProps) {
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
          Kolom
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Tampilkan Kolom</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={visibility.title}
          onCheckedChange={() => toggleColumn("title")}
        >
          Judul
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={visibility.category}
          onCheckedChange={() => toggleColumn("category")}
        >
          Kategori
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={visibility.author}
          onCheckedChange={() => toggleColumn("author")}
        >
          Penulis
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={visibility.status}
          onCheckedChange={() => toggleColumn("status")}
        >
          Status
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={visibility.views_count}
          onCheckedChange={() => toggleColumn("views_count")}
        >
          Views
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={visibility.min_read}
          onCheckedChange={() => toggleColumn("min_read")}
        >
          Waktu Baca
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={visibility.published_at}
          onCheckedChange={() => toggleColumn("published_at")}
        >
          Tanggal Publish
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={visibility.updated_at}
          onCheckedChange={() => toggleColumn("updated_at")}
        >
          Terakhir Diperbarui
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
