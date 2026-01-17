import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEGREE_OPTIONS,
  JOB_TYPE_OPTIONS,
  LANGUAGE_OPTIONS,
  ORGANIZATION_TYPE_OPTIONS,
  SKILL_LEVEL_OPTIONS,
} from "@/types/cv";
import { SKILL_CATEGORY_LABELS } from "@/types/skill-categories";

export interface FilterValues {
  visibility?: "private" | "public";
  language?: "id" | "en";
  views_from?: string;
  views_to?: string;
  educations_degree?: string;
  experiences_job_type?: string;
  experiences_is_current?: "true" | "false";
  skills_level?: string;
  skills_skill_category?: string;
  organizations_organization_type?: string;
}

interface CVFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterValues;
  onApplyFilters: (filters: FilterValues) => void;
}

export function CVFilterModal({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
}: CVFilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterValues>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, open]);

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
            <DialogTitle>Filter CV</DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto px-6 py-2">
            <FieldSet className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Bahasa</FieldLabel>
                <Select
                  value={localFilters.language || "all"}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      language:
                        value === "all" ? undefined : (value as "id" | "en"),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Bahasa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Bahasa</SelectItem>
                    {LANGUAGE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Visibilitas</FieldLabel>
                <Select
                  value={localFilters.visibility || "all"}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      visibility:
                        value === "all"
                          ? undefined
                          : (value as FilterValues["visibility"]),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Visibilitas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
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

              <Field>
                <FieldLabel>Pendidikan</FieldLabel>
                <Select
                  value={localFilters.educations_degree || "all"}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      educations_degree: value === "all" ? undefined : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua pendidikan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    {DEGREE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Tipe Pekerjaan</FieldLabel>
                <Select
                  value={localFilters.experiences_job_type || "all"}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      experiences_job_type: value === "all" ? undefined : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    {JOB_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Pengalaman Current</FieldLabel>
                <Select
                  value={localFilters.experiences_is_current || "all"}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      experiences_is_current:
                        value === "all"
                          ? undefined
                          : (value as FilterValues["experiences_is_current"]),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="true">Ya</SelectItem>
                    <SelectItem value="false">Tidak</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Level Keahlian</FieldLabel>
                <Select
                  value={localFilters.skills_level || "all"}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      skills_level: value === "all" ? undefined : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    {SKILL_LEVEL_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Kategori Keahlian</FieldLabel>
                <Select
                  value={localFilters.skills_skill_category || "all"}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      skills_skill_category:
                        value === "all" ? undefined : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua kategori" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectItem value="all">Semua</SelectItem>
                    {Object.entries(SKILL_CATEGORY_LABELS.id).map(
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
                <FieldLabel>Tipe Organisasi</FieldLabel>
                <Select
                  value={localFilters.organizations_organization_type || "all"}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      organizations_organization_type:
                        value === "all" ? undefined : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    {ORGANIZATION_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
