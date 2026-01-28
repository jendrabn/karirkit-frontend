import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BlogStatus, BlogCategory } from "@/types/blog";
import { BLOG_STATUS_OPTIONS } from "@/types/blog";

export interface FilterValues {
  category_id?: string;
  status?: BlogStatus;
  user_id?: string;
  tag_id?: string;
  published_at_from?: string;
  published_at_to?: string;
  created_at_from?: string;
  created_at_to?: string;
  read_time_from?: string;
  read_time_to?: string;
  views_from?: string;
  views_to?: string;
}

interface BlogFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterValues;
  onApply: (filters: FilterValues) => void;
  categories: BlogCategory[];
}

export function BlogFilterModal({
  open,
  onOpenChange,
  filters,
  onApply,
  categories,
}: BlogFilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterValues>(filters);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setLocalFilters(filters);
    }
    onOpenChange(nextOpen);
  };

  const handleApply = () => {
    onApply(localFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setLocalFilters({});
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <form
        id="blog-filter-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleApply();
        }}
      >
        <DialogContent className="!max-w-3xl">
          <DialogHeader>
            <DialogTitle>Filter Blog</DialogTitle>
            <DialogDescription>
              Atur filter untuk mencari blog sesuai kriteria Anda
            </DialogDescription>
          </DialogHeader>

          <div className="no-scrollbar -mx-4 max-h-[65vh] overflow-y-auto px-4 py-4">
            <FieldSet className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Kategori</FieldLabel>
                <Select
                  value={localFilters.category_id?.toString() || "all"}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      category_id: value === "all" ? undefined : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Status</FieldLabel>
                <Select
                  value={localFilters.status || "all"}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      status:
                        value === "all" ? undefined : (value as BlogStatus),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    {BLOG_STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>User ID</FieldLabel>
                <Input
                  placeholder="Masukkan user ID"
                  value={localFilters.user_id || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      user_id: e.target.value,
                    })
                  }
                />
              </Field>

              <Field>
                <FieldLabel>Tag ID</FieldLabel>
                <Input
                  placeholder="Contoh: id1,id2"
                  value={localFilters.tag_id || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      tag_id: e.target.value,
                    })
                  }
                />
              </Field>

              <Field>
                <FieldLabel>Published At</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={localFilters.published_at_from || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        published_at_from: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="date"
                    value={localFilters.published_at_to || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        published_at_to: e.target.value,
                      })
                    }
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel>Dibuat</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={localFilters.created_at_from || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        created_at_from: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="date"
                    value={localFilters.created_at_to || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        created_at_to: e.target.value,
                      })
                    }
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel>Read Time</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Dari"
                    value={localFilters.read_time_from || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        read_time_from: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Sampai"
                    value={localFilters.read_time_to || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        read_time_to: e.target.value,
                      })
                    }
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel>Views</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Dari"
                    value={localFilters.views_from || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        views_from: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Sampai"
                    value={localFilters.views_to || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        views_to: e.target.value,
                      })
                    }
                  />
                </div>
              </Field>
            </FieldSet>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button type="submit" form="blog-filter-form">
              Terapkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
