import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import type { UserRole } from "@/types/user";
import { USER_ROLE_OPTIONS } from "@/types/user";

export interface FilterValues {
  role?: UserRole;
  status?: "active" | "suspended" | "banned";
  gender?: "male" | "female";
  email_verified?: "true" | "false";
  suspended?: "true" | "false";
  created_at_from?: string;
  created_at_to?: string;
  daily_download_limit_from?: string;
  daily_download_limit_to?: string;
  document_storage_used_from?: string;
  document_storage_used_to?: string;
  download_total_count_from?: string;
  download_total_count_to?: string;
}

interface UserFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterValues;
  onApply: (filters: FilterValues) => void;
}

export function UserFilterModal({
  open,
  onOpenChange,
  filters,
  onApply,
}: UserFilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterValues>(filters);

  const handleApply = () => {
    onApply(localFilters);
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
            <DialogTitle>Filter Users</DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto px-6 py-2">
            <FieldSet className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Role</FieldLabel>
                <Select
                  value={localFilters.role || "all"}
                  onValueChange={(val) =>
                    setLocalFilters({
                      ...localFilters,
                      role: val === "all" ? undefined : (val as UserRole),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">Semua</SelectItem>
                    {USER_ROLE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Status</FieldLabel>
                <Select
                  value={localFilters.status || "all"}
                  onValueChange={(val) =>
                    setLocalFilters({
                      ...localFilters,
                      status:
                        val === "all"
                          ? undefined
                          : (val as FilterValues["status"]),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua status" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Gender</FieldLabel>
                <Select
                  value={localFilters.gender || "all"}
                  onValueChange={(val) =>
                    setLocalFilters({
                      ...localFilters,
                      gender:
                        val === "all"
                          ? undefined
                          : (val as FilterValues["gender"]),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="male">Laki-laki</SelectItem>
                    <SelectItem value="female">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Email Verified</FieldLabel>
                <Select
                  value={localFilters.email_verified || "all"}
                  onValueChange={(val) =>
                    setLocalFilters({
                      ...localFilters,
                      email_verified:
                        val === "all"
                          ? undefined
                          : (val as FilterValues["email_verified"]),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="true">Terverifikasi</SelectItem>
                    <SelectItem value="false">Belum</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Suspended</FieldLabel>
                <Select
                  value={localFilters.suspended || "all"}
                  onValueChange={(val) =>
                    setLocalFilters({
                      ...localFilters,
                      suspended:
                        val === "all"
                          ? undefined
                          : (val as FilterValues["suspended"]),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="true">Suspended</SelectItem>
                    <SelectItem value="false">Tidak</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Tanggal Dibuat</FieldLabel>
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
                <FieldLabel>Daily Download Limit</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Dari"
                    value={localFilters.daily_download_limit_from || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        daily_download_limit_from: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Sampai"
                    value={localFilters.daily_download_limit_to || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        daily_download_limit_to: e.target.value,
                      })
                    }
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel>Document Storage Used</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Dari"
                    value={localFilters.document_storage_used_from || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        document_storage_used_from: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Sampai"
                    value={localFilters.document_storage_used_to || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        document_storage_used_to: e.target.value,
                      })
                    }
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel>Total Download</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Dari"
                    value={localFilters.download_total_count_from || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        download_total_count_from: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Sampai"
                    value={localFilters.download_total_count_to || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        download_total_count_to: e.target.value,
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
