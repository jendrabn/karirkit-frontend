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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EDUCATION_LEVEL_LABELS } from "@/types/job";

export interface JobFilterValues {
  status?: "draft" | "published" | "closed" | "archived";
  job_type?: string;
  work_system?: string;
  education_level?: keyof typeof EDUCATION_LEVEL_LABELS;
  company_id?: string;
  job_role_id?: string;
  city_id?: string;
  salary_from?: string;
  salary_to?: string;
  years_of_experience_from?: string;
  years_of_experience_to?: string;
  expiration_date_from?: string;
  expiration_date_to?: string;
  created_at_from?: string;
  created_at_to?: string;
}

interface JobFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: JobFilterValues;
  onApply: (filters: JobFilterValues) => void;
}

export function JobFilterModal({
  open,
  onOpenChange,
  filters,
  onApply,
}: JobFilterModalProps) {
  const [localFilters, setLocalFilters] = useState<JobFilterValues>(filters);

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
        id="job-filter-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleApply();
        }}
      >
        <DialogContent className="!max-w-3xl">
          <DialogHeader>
            <DialogTitle>Filter Lowongan</DialogTitle>
            <DialogDescription>
              Atur filter untuk mencari lowongan pekerjaan sesuai kriteria Anda
            </DialogDescription>
          </DialogHeader>

          <div className="no-scrollbar -mx-4 max-h-[65vh] overflow-y-auto px-4 py-4">
            <FieldSet className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Status</FieldLabel>
                <Select
                  value={localFilters.status || "all"}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      status:
                        value === "all"
                          ? undefined
                          : (value as JobFilterValues["status"]),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua status" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Tipe Pekerjaan</FieldLabel>
                <Input
                  placeholder="Contoh: full_time, contract"
                  value={localFilters.job_type || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      job_type: e.target.value,
                    })
                  }
                />
              </Field>

              <Field>
                <FieldLabel>Sistem Kerja</FieldLabel>
                <Input
                  placeholder="Contoh: onsite, hybrid"
                  value={localFilters.work_system || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      work_system: e.target.value,
                    })
                  }
                />
              </Field>

              <Field>
                <FieldLabel>Level Pendidikan</FieldLabel>
                <Select
                  value={localFilters.education_level || "all"}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      education_level:
                        value === "all"
                          ? undefined
                          : (value as JobFilterValues["education_level"]),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua level" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">Semua</SelectItem>
                    {Object.entries(EDUCATION_LEVEL_LABELS).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Company ID</FieldLabel>
                <Input
                  placeholder="Masukkan ID perusahaan"
                  value={localFilters.company_id || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      company_id: e.target.value,
                    })
                  }
                />
              </Field>

              <Field>
                <FieldLabel>Job Role ID</FieldLabel>
                <Input
                  placeholder="Masukkan ID role"
                  value={localFilters.job_role_id || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      job_role_id: e.target.value,
                    })
                  }
                />
              </Field>

              <Field>
                <FieldLabel>City ID</FieldLabel>
                <Input
                  placeholder="Masukkan ID kota"
                  value={localFilters.city_id || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      city_id: e.target.value,
                    })
                  }
                />
              </Field>

              <Field>
                <FieldLabel>Rentang Gaji</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Dari"
                    value={localFilters.salary_from || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        salary_from: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Sampai"
                    value={localFilters.salary_to || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        salary_to: e.target.value,
                      })
                    }
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel>Pengalaman (Tahun)</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Dari"
                    value={localFilters.years_of_experience_from || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        years_of_experience_from: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Sampai"
                    value={localFilters.years_of_experience_to || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        years_of_experience_to: e.target.value,
                      })
                    }
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel>Expiration Date</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={localFilters.expiration_date_from || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        expiration_date_from: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="date"
                    value={localFilters.expiration_date_to || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        expiration_date_to: e.target.value,
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
            <Button type="submit" form="job-filter-form">
              Terapkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
