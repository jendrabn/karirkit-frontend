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
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { TEMPLATE_TYPE_OPTIONS, type TemplateType } from "@/types/template";
import type { GetTemplatesParams } from "../api/get-templates";

interface TemplatesFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: Omit<
    GetTemplatesParams,
    "page" | "per_page" | "q" | "sort_by" | "sort_order"
  >;
  onApply: (
    filters: Omit<
      GetTemplatesParams,
      "page" | "per_page" | "q" | "sort_by" | "sort_order"
    >,
  ) => void;
}

export function TemplatesFilterModal({
  open,
  onOpenChange,
  filters,
  onApply,
}: TemplatesFilterModalProps) {
  const [localFilters, setLocalFilters] = useState(filters);

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
        id="templates-filter-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleApply();
        }}
      >
        <DialogContent className="!max-w-3xl">
          <DialogHeader>
            <DialogTitle>Filter Template</DialogTitle>
            <DialogDescription>
              Atur filter untuk mencari template sesuai kriteria Anda
            </DialogDescription>
          </DialogHeader>

          <div className="no-scrollbar -mx-4 max-h-[65vh] overflow-y-auto px-4 py-4">
            <FieldSet className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Tipe Template</FieldLabel>
                <Select
                  value={localFilters.type || "all"}
                  onValueChange={(val) =>
                    setLocalFilters({
                      ...localFilters,
                      type: val === "all" ? undefined : (val as TemplateType),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua tipe</SelectItem>
                    {TEMPLATE_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Bahasa</FieldLabel>
                <Select
                  value={localFilters.language || "all"}
                  onValueChange={(val) =>
                    setLocalFilters({
                      ...localFilters,
                      language:
                        val === "all" ? undefined : (val as "en" | "id"),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua bahasa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua bahasa</SelectItem>
                    <SelectItem value="id">Indonesia</SelectItem>
                    <SelectItem value="en">Inggris</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Status Premium</FieldLabel>
                <Select
                  value={
                    localFilters.is_premium === undefined
                      ? "all"
                      : localFilters.is_premium
                        ? "true"
                        : "false"
                  }
                  onValueChange={(val) =>
                    setLocalFilters({
                      ...localFilters,
                      is_premium: val === "all" ? undefined : val === "true",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="true">Premium</SelectItem>
                    <SelectItem value="false">Gratis</SelectItem>
                  </SelectContent>
                </Select>
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
                <FieldLabel>Diperbarui</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={localFilters.updated_at_from || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        updated_at_from: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="date"
                    value={localFilters.updated_at_to || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        updated_at_to: e.target.value,
                      })
                    }
                  />
                </div>
              </Field>
            </FieldSet>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button type="submit" form="templates-filter-form">
              Terapkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
