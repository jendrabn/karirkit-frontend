import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Building2,
  Users,
  Globe,
  Briefcase,
  Calendar,
  Hash,
  Clock,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { EMPLOYEE_SIZE_LABELS } from "@/types/company";
import { buildImageUrl } from "@/lib/utils";
import { useCompany } from "../api/get-company";

interface CompanyDetailModalProps {
  companyId: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CompanyDetailModal({
  companyId,
  isOpen,
  onOpenChange,
}: CompanyDetailModalProps) {
  const { data: company, isLoading } = useCompany({
    id: companyId || "",
    queryConfig: {
      enabled: !!companyId && isOpen,
    },
  });

  if (!companyId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <div className="flex items-center justify-between">
            <DialogTitle>Detail Perusahaan</DialogTitle>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : company ? (
          <>
            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <Avatar className="h-24 w-24 border sm:h-32 sm:w-32">
                    <AvatarImage
                      src={buildImageUrl(company.logo)}
                      alt={company.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl">
                      {company.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-bold">{company.name}</h2>
                      <Badge variant="secondary" className="font-mono">
                        {company.slug}
                      </Badge>
                    </div>

                    {company.website_url && (
                      <a
                        href={company.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline gap-1.5"
                      >
                        <Globe className="h-4 w-4" />
                        {company.website_url.replace(/^https?:\/\//, "")}
                      </a>
                    )}

                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground pt-1">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        <span>
                          {EMPLOYEE_SIZE_LABELS[
                            company.employee_size as keyof typeof EMPLOYEE_SIZE_LABELS
                          ] || company.employee_size}
                        </span>
                      </div>
                      <Separator orientation="vertical" className="h-4" />
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-4 w-4" />
                        <span>{company.business_sector}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Description Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <h3>Deskripsi Perusahaan</h3>
                  </div>
                  <div
                    className="prose prose-sm max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: company.description }}
                  />
                </div>

                <Separator />

                {/* Metadata Section */}
                <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">
                    Informasi Sistem
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground w-24">ID:</span>
                      <span className="font-mono truncate">{company.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground w-24">
                        Dibuat:
                      </span>
                      <span>
                        {format(
                          new Date(company.created_at),
                          "dd MMMM yyyy, HH:mm",
                          { locale: id }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground w-24">
                        Diupdate:
                      </span>
                      <span>
                        {format(
                          new Date(company.updated_at),
                          "dd MMMM yyyy, HH:mm",
                          { locale: id }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="px-6 py-4 bg-muted/30 border-t">
              <DialogClose asChild>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Tutup
                </Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            Data perusahaan tidak ditemukan
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
