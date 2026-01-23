import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EMPLOYEE_SIZE_LABELS, type EmployeeSize } from "@/types/company";

export interface CompanyFilterValues {
  employee_size?: EmployeeSize;
  business_sector?: string;
  job_count_from?: string;
  job_count_to?: string;
  created_at_from?: string;
  created_at_to?: string;
}

interface CompanyFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: CompanyFilterValues;
  onApply: (filters: CompanyFilterValues) => void;
}

export function CompanyFilterModal({
  open,
  onOpenChange,
  filters,
  onApply,
}: CompanyFilterModalProps) {
  const [localFilters, setLocalFilters] = useState<CompanyFilterValues>(filters);

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
      <DialogContent className="!max-w-3xl p-0 gap-0">
        <div className="flex flex-col max-h-[85vh]">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle>Filter Perusahaan</DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto px-6 py-2">
            <FieldSet className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Ukuran Karyawan</FieldLabel>
                <Select
                  value={localFilters.employee_size || "all"}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      employee_size:
                        value === "all" ? undefined : (value as EmployeeSize),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua ukuran" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">Semua</SelectItem>
                    {Object.entries(EMPLOYEE_SIZE_LABELS).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Sektor Bisnis</FieldLabel>
                <Input
                  placeholder="Contoh: Technology, Finance"
                  value={localFilters.business_sector || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      business_sector: e.target.value,
                    })
                  }
                />
              </Field>

              <Field>
                <FieldLabel>Jumlah Lowongan</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Dari"
                    value={localFilters.job_count_from || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        job_count_from: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Sampai"
                    value={localFilters.job_count_to || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        job_count_to: e.target.value,
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

          <DialogFooter className="px-6 py-4 bg-muted/30 border-t">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleApply}>Terapkan</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
