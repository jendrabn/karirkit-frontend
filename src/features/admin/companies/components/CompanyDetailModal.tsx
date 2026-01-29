import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  Calendar,
  Loader2,
  Briefcase,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { EMPLOYEE_SIZE_LABELS } from "@/types/company";
import { buildImageUrl, formatNumber } from "@/lib/utils";
import { useCompany } from "../api/get-company";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactItem, InfoItem, RichText } from "@/components/ui/display-info";
import { formatDateTime } from "@/lib/date";

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

  const companyMeta = company as typeof company & {
    employeeSize?: string | null;
    businessSector?: string | null;
    websiteUrl?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    jobCount?: number | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    founded_at?: string | null;
    foundedAt?: string | null;
  };

  const employeeSize = company?.employee_size ?? companyMeta?.employeeSize ?? null;
  const employeeSizeLabel = employeeSize
    ? EMPLOYEE_SIZE_LABELS[employeeSize as keyof typeof EMPLOYEE_SIZE_LABELS] ||
      employeeSize
    : "-";
  const businessSector =
    company?.business_sector ?? companyMeta?.businessSector ?? null;
  const websiteUrl = company?.website_url ?? companyMeta?.websiteUrl ?? null;
  const createdAt = company?.created_at ?? companyMeta?.createdAt ?? null;
  const updatedAt = company?.updated_at ?? companyMeta?.updatedAt ?? null;
  const jobCount = company?.job_count ?? companyMeta?.jobCount ?? null;
  const companyEmail = companyMeta?.email ?? null;
  const companyPhone = companyMeta?.phone ?? null;
  const address = companyMeta?.address ?? null;
  const foundedAt = companyMeta?.founded_at ?? companyMeta?.foundedAt ?? null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-4xl">
        <DialogHeader>
          <DialogTitle>Detail Perusahaan</DialogTitle>
          <DialogDescription>
            Informasi lengkap tentang perusahaan dan kontak.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : company ? (
          <div className="no-scrollbar -mx-4 max-h-[70vh] overflow-y-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Profil Perusahaan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16 rounded-lg shrink-0">
                        <AvatarImage
                          src={buildImageUrl(company.logo) || undefined}
                          alt={company.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold">
                          {company.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 space-y-1">
                        <p className="text-base font-semibold truncate">
                          {company.name}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono truncate">
                          {company.slug || "-"}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="gap-1.5">
                        <Users className="h-3 w-3" />
                        {employeeSizeLabel}
                      </Badge>
                      {businessSector && (
                        <Badge variant="outline" className="gap-1.5">
                          <Building2 className="h-3 w-3" />
                          {businessSector}
                        </Badge>
                      )}
                    </div>

              </CardContent>
            </Card>

            {company.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Deskripsi</CardTitle>
                </CardHeader>
                <CardContent>
                  <RichText content={company.description} />
                </CardContent>
              </Card>
            )}
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Kontak Perusahaan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ContactItem
                      type="url"
                      value={websiteUrl}
                      label="Website"
                      icon={Globe}
                    />
                    <ContactItem
                      type="email"
                      value={companyEmail}
                      label="Email"
                      icon={Mail}
                    />
                    <ContactItem
                      type="phone"
                      value={companyPhone}
                      label="Telepon"
                      icon={Phone}
                    />
                    {address && (
                      <InfoItem
                        label="Alamat"
                        value={address}
                        icon={MapPin}
                      />
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informasi Tambahan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <InfoItem
                      label="Sektor Bisnis"
                      value={businessSector}
                      icon={Briefcase}
                    />
                    <InfoItem
                      label="Ukuran Perusahaan"
                      value={employeeSizeLabel}
                      icon={Users}
                    />
                    <InfoItem
                      label="Jumlah Lowongan"
                      value={formatNumber(jobCount)}
                      icon={Building2}
                    />
                    <InfoItem
                      label="Didirikan"
                      value={foundedAt ? formatDateTime(foundedAt) : "-"}
                      icon={Calendar}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informasi Sistem</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Company ID
                      </p>
                      <p className="text-xs font-mono bg-muted px-2 py-1.5 rounded break-all">
                        {company.id}
                      </p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <InfoItem
                        label="Dibuat"
                        value={createdAt ? formatDateTime(createdAt) : "-"}
                        icon={Calendar}
                      />
                      <InfoItem
                        label="Diperbarui"
                        value={updatedAt ? formatDateTime(updatedAt) : "-"}
                        icon={Calendar}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            Data perusahaan tidak ditemukan
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Tutup
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
