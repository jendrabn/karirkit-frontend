import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";

export interface CategoryFilterValues {
  blog_count_from?: string;
  blog_count_to?: string;
  created_at_from?: string;
  created_at_to?: string;
}

interface CategoryFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: CategoryFilterValues;
  onApply: (filters: CategoryFilterValues) => void;
}

export function CategoryFilterModal({
  open,
  onOpenChange,
  filters,
  onApply,
}: CategoryFilterModalProps) {
  const [localFilters, setLocalFilters] =
    useState<CategoryFilterValues>(filters);

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
        id="category-filter-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleApply();
        }}
      >
        <DialogContent className="!max-w-3xl">
          <DialogHeader>
            <DialogTitle>Filter Kategori</DialogTitle>
            <DialogDescription>
              Atur filter untuk mencari kategori blog sesuai kriteria Anda
            </DialogDescription>
          </DialogHeader>

          <div className="no-scrollbar -mx-4 max-h-[65vh] overflow-y-auto px-4 py-4">
            <FieldSet className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Jumlah Blog</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Dari"
                    value={localFilters.blog_count_from || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        blog_count_from: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Sampai"
                    value={localFilters.blog_count_to || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        blog_count_to: e.target.value,
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
            </FieldSet>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button type="submit" form="category-filter-form">
              Terapkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
