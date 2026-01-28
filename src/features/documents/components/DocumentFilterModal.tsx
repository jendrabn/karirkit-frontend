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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  documentTypes,
  documentTypeLabels,
  type DocumentType,
} from "@/types/document";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";

export interface DocumentFilterValues {
  q?: string;
  type?: DocumentType;
  mime_type?: string;
}

interface DocumentFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: DocumentFilterValues;
  onApply: (filters: DocumentFilterValues) => void;
}

export function DocumentFilterModal({
  open,
  onOpenChange,
  filters,
  onApply,
}: DocumentFilterModalProps) {
  const [localFilters, setLocalFilters] =
    useState<DocumentFilterValues>(filters);

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
        id="document-filter-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleApply();
        }}
      >
        <DialogContent className="!max-w-3xl">
          <DialogHeader>
            <DialogTitle>Filter Dokumen</DialogTitle>
            <DialogDescription>
              Atur filter untuk mencari dokumen sesuai kriteria Anda
            </DialogDescription>
          </DialogHeader>

          <div className="no-scrollbar -mx-4 max-h-[65vh] overflow-y-auto px-4 py-4">
            <FieldSet className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <Field>
                <FieldLabel htmlFor="q">Cari</FieldLabel>
                <Input
                  id="q"
                  placeholder="Cari nama file..."
                  value={localFilters.q || ""}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({ ...prev, q: e.target.value }))
                  }
                />
              </Field>

              <Field>
                <FieldLabel>Tipe Dokumen</FieldLabel>
                <Select
                  value={localFilters.type || "all"}
                  onValueChange={(value) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      type:
                        value === "all" ? undefined : (value as DocumentType),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Tipe" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    {documentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {documentTypeLabels[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>MIME Type</FieldLabel>
                <Input
                  placeholder="Contoh: application/pdf"
                  value={localFilters.mime_type || ""}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      mime_type: e.target.value,
                    }))
                  }
                />
              </Field>
            </FieldSet>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button type="submit" form="document-filter-form">
              Terapkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
