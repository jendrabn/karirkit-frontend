import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type ProjectType, projectTypeLabels } from "@/types/portfolio";
import { months, years } from "@/lib/date-options";

export interface PortfolioFilterValues {
  project_type?: ProjectType;
  industry?: string;
  year?: number;
  month?: number;
  year_from?: number;
  year_to?: number;
  month_from?: number;
  month_to?: number;
  tools_name?: string;
}

interface PortfolioFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: PortfolioFilterValues;
  onApplyFilters: (filters: PortfolioFilterValues) => void;
}

export function PortfolioFilterModal({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
}: PortfolioFilterModalProps) {
  const [localFilters, setLocalFilters] =
    useState<PortfolioFilterValues>(filters);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setLocalFilters({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-3xl p-0 gap-0">
        <div className="flex flex-col max-h-[85vh]">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle>Filter Portfolio</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto px-6 py-2">
            <FieldSet className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Tipe Proyek</FieldLabel>
                <Select
                  value={localFilters.project_type || "all"}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      project_type:
                        value === "all" ? undefined : (value as ProjectType),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    {Object.entries(projectTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Industri</FieldLabel>
                <Input
                  placeholder="Cari industri..."
                  value={localFilters.industry || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      industry: e.target.value || undefined,
                    })
                  }
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Tahun</FieldLabel>
                  <Select
                    value={localFilters.year?.toString() || "all"}
                    onValueChange={(value) =>
                      setLocalFilters({
                        ...localFilters,
                        year: value === "all" ? undefined : parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Semua tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Tahun</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Bulan</FieldLabel>
                  <Select
                    value={localFilters.month?.toString() || "all"}
                    onValueChange={(value) =>
                      setLocalFilters({
                        ...localFilters,
                        month: value === "all" ? undefined : parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Semua bulan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Bulan</SelectItem>
                      {months.map((month) => (
                        <SelectItem
                          key={month.value}
                          value={month.value.toString()}
                        >
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field>
                <FieldLabel>Rentang Tahun</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Dari"
                    value={localFilters.year_from?.toString() || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        year_from: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Sampai"
                    value={localFilters.year_to?.toString() || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        year_to: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel>Rentang Bulan</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Dari"
                    value={localFilters.month_from?.toString() || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        month_from: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Sampai"
                    value={localFilters.month_to?.toString() || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        month_to: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel>Tools</FieldLabel>
                <Input
                  placeholder="Contoh: Reporting, Process Safety"
                  value={localFilters.tools_name || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      tools_name: e.target.value || undefined,
                    })
                  }
                />
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
