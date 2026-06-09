import type { ReactNode } from "react";
import { AlertCircle, Copy, MessageCircle } from "lucide-react";
import { SiGojek, SiShopee } from "react-icons/si";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { env } from "@/config/env";
import { getContactLink } from "@/lib/utils";
import type { SubscriptionPlan } from "@/types/subscription";
import type { User } from "@/types/user";
import { formatSubscriptionPrice } from "../utils";

type ManualPaymentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: SubscriptionPlan | null;
  order: {
    order_id: string;
    amount?: number | null;
  } | null;
  user?: Pick<User, "name" | "email"> | null;
};

type PaymentMethod = {
  name: string;
  phone: string;
  logo: ReactNode;
  className: string;
};

function OvoLogo() {
  return (
    <span className="text-sm font-extrabold tracking-normal text-[#4c2a86]">
      OVO
    </span>
  );
}

export function ManualPaymentDialog({
  open,
  onOpenChange,
  plan,
  order,
  user,
}: ManualPaymentDialogProps) {
  const methods: PaymentMethod[] = [
    {
      name: "ShopeePay",
      phone: env.EWALLET_SHOPEEPAY_PHONE,
      logo: <SiShopee className="h-5 w-5" />,
      className: "border-[#ee4d2d]/20 bg-[#ee4d2d]/10 text-[#ee4d2d]",
    },
    {
      name: "GoPay",
      phone: env.EWALLET_GOPAY_PHONE,
      logo: <SiGojek className="h-5 w-5" />,
      className: "border-[#00aa13]/20 bg-[#00aa13]/10 text-[#00aa13]",
    },
    {
      name: "OVO",
      phone: env.EWALLET_OVO_PHONE,
      logo: <OvoLogo />,
      className: "border-[#4c2a86]/20 bg-[#4c2a86]/10 text-[#4c2a86]",
    },
  ];
  const hasConfiguredMethod = methods.some((method) => method.phone);
  const formattedAmount = formatSubscriptionPrice(order?.amount ?? plan?.price);
  const whatsappMessage = plan && order
    ? `Halo ${env.APP_NAME}, saya ingin konfirmasi pembayaran langganan.

Order ID: ${order.order_id}
Nama: ${user?.name || "-"}
Email: ${user?.email || "-"}
Paket: ${plan.name}
Nominal: ${formattedAmount}

Saya akan melampirkan screenshot bukti transfer pada chat ini.`
    : "";
  const whatsappLink =
    env.SUPPORT_WHATSAPP && whatsappMessage
      ? getContactLink("phone", env.SUPPORT_WHATSAPP, whatsappMessage)
      : "";
  const handleCopyPhone = async (phone: string, methodName: string) => {
    if (!phone) {
      return;
    }

    try {
      await navigator.clipboard.writeText(phone);
      toast.success(`Nomor ${methodName} disalin`);
    } catch {
      toast.error("Gagal menyalin nomor e-wallet");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="px-6 py-5">
          <DialogTitle>Instruksi Pembayaran Manual</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-10rem)]">
          <div className="space-y-5 px-6 pb-5">
            <p className="text-sm leading-6 text-muted-foreground">
              Transfer sesuai nominal paket, lalu konfirmasi melalui WhatsApp
              dengan melampirkan screenshot bukti transfer.
            </p>

            <Card className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Paket dipilih</p>
                  <p className="text-lg font-semibold">{plan?.name || "-"}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-sm text-muted-foreground">Nominal bayar</p>
                  <p className="text-2xl font-bold">{formattedAmount}</p>
                </div>
              </div>
              <div className="mt-4 border-t pt-4">
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="break-all font-mono text-sm font-semibold">
                  {order?.order_id || "-"}
                </p>
              </div>
            </Card>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Pilih salah satu e-wallet
                </h3>
              </div>

              <div className="grid gap-3">
                {methods.map((method) => (
                  <Card key={method.name} className="p-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md border ${method.className}`}
                      >
                        {method.logo}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium text-muted-foreground">
                            {method.name}
                          </p>
                          {!method.phone ? (
                            <span className="rounded-md border px-2 py-0.5 text-xs text-muted-foreground">
                              Belum dikonfigurasi
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 break-all font-mono text-base font-semibold text-foreground">
                          {method.phone || "Nomor e-wallet belum tersedia"}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        disabled={!method.phone}
                        onClick={() => handleCopyPhone(method.phone, method.name)}
                        aria-label={`Salin nomor ${method.name}`}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {!hasConfiguredMethod ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Nomor e-wallet belum dikonfigurasi</AlertTitle>
                <AlertDescription>
                  Isi env e-wallet agar user bisa melihat tujuan transfer manual.
                </AlertDescription>
              </Alert>
            ) : null}

            {!env.SUPPORT_WHATSAPP ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>WhatsApp support belum dikonfigurasi</AlertTitle>
                <AlertDescription>
                  Isi VITE_APP_SUPPORT_WHATSAPP agar user bisa mengirim konfirmasi
                  pembayaran.
                </AlertDescription>
              </Alert>
            ) : null}

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Konfirmasi wajib dilakukan</AlertTitle>
              <AlertDescription>
                Setelah transfer, klik Konfirmasi Pembayaran dan lampirkan
                screenshot bukti transfer di chat WhatsApp.
              </AlertDescription>
            </Alert>
          </div>
        </ScrollArea>

        <DialogFooter className="border-t px-6 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
          {whatsappLink ? (
            <Button asChild>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onOpenChange(false)}
              >
                <MessageCircle className="h-4 w-4" />
                Konfirmasi Pembayaran
              </a>
            </Button>
          ) : (
            <Button disabled>
              <MessageCircle className="h-4 w-4" />
              Konfirmasi Pembayaran
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
