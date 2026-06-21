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
  max_applications_from?: string;
  max_applications_to?: string;
  max_cv_pdf_downloads_from?: string;
  max_cv_pdf_downloads_to?: string;
  max_cv_docx_downloads_from?: string;
  max_cv_docx_downloads_to?: string;
  max_letter_pdf_downloads_from?: string;
  max_letter_pdf_downloads_to?: string;
  max_letter_docx_downloads_from?: string;
  max_letter_docx_downloads_to?: string;
  max_cv_ai_improvements_from?: string;
  max_cv_ai_improvements_to?: string;
  max_application_letter_ai_improvements_from?: string;
  max_application_letter_ai_improvements_to?: string;
  max_document_storage_bytes_from?: string;
  max_document_storage_bytes_to?: string;
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
      <form
        id="user-filter-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleApply();
        }}
      >
        <DialogContent className="!max-w-3xl">
          <DialogHeader>
            <DialogTitle>Filter Users</DialogTitle>
            <DialogDescription>
              Atur filter untuk mencari pengguna sesuai kriteria Anda
            </DialogDescription>
          </DialogHeader>

          <div className="no-scrollbar -mx-4 max-h-[65vh] overflow-y-auto px-4 py-4">
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
                <FieldLabel>Total Lamaran</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Dari"
                    value={localFilters.max_applications_from || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        max_applications_from: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Sampai"
                    value={localFilters.max_applications_to || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        max_applications_to: e.target.value,
                      })
                    }
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel>Unduhan CV PDF</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Dari"
                    value={localFilters.max_cv_pdf_downloads_from || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        max_cv_pdf_downloads_from: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Sampai"
                    value={localFilters.max_cv_pdf_downloads_to || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        max_cv_pdf_downloads_to: e.target.value,
                      })
                    }
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel>Unduhan CV DOCX</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Dari"
                    value={localFilters.max_cv_docx_downloads_from || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        max_cv_docx_downloads_from: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Sampai"
                    value={localFilters.max_cv_docx_downloads_to || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        max_cv_docx_downloads_to: e.target.value,
                      })
                    }
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel>Unduhan Surat PDF</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Dari"
                    value={localFilters.max_letter_pdf_downloads_from || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        max_letter_pdf_downloads_from: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Sampai"
                    value={localFilters.max_letter_pdf_downloads_to || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        max_letter_pdf_downloads_to: e.target.value,
                      })
                    }
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel>Unduhan Surat DOCX</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Dari"
                    value={localFilters.max_letter_docx_downloads_from || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        max_letter_docx_downloads_from: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Sampai"
                    value={localFilters.max_letter_docx_downloads_to || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        max_letter_docx_downloads_to: e.target.value,
                      })
                    }
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel>AI CV</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Dari"
                    value={localFilters.max_cv_ai_improvements_from || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        max_cv_ai_improvements_from: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Sampai"
                    value={localFilters.max_cv_ai_improvements_to || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        max_cv_ai_improvements_to: e.target.value,
                      })
                    }
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel>AI Surat Lamaran</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Dari"
                    value={
                      localFilters.max_application_letter_ai_improvements_from ||
                      ""
                    }
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        max_application_letter_ai_improvements_from:
                          e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Sampai"
                    value={
                      localFilters.max_application_letter_ai_improvements_to ||
                      ""
                    }
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        max_application_letter_ai_improvements_to:
                          e.target.value,
                      })
                    }
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel>Penyimpanan (bytes)</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Dari"
                    value={localFilters.max_document_storage_bytes_from || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        max_document_storage_bytes_from: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Sampai"
                    value={localFilters.max_document_storage_bytes_to || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        max_document_storage_bytes_to: e.target.value,
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
            <Button type="submit" form="user-filter-form">
              Terapkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
