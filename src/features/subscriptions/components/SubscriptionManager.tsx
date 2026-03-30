import {
  Check,
  Crown,
  Infinity as InfinityIcon,
  Loader2,
  X,
  Zap,
} from "lucide-react";
import { format } from "date-fns";
import { id as indonesianLocale } from "date-fns/locale";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCancelSubscription } from "@/features/subscriptions/api/cancel-subscription";
import { useCreateSubscriptionOrder } from "@/features/subscriptions/api/create-subscription-order";
import { useMySubscription } from "@/features/subscriptions/api/get-my-subscription";
import { useSubscriptionPlans } from "@/features/subscriptions/api/get-subscription-plans";
import {
  formatSubscriptionLimit,
  formatSubscriptionPrice,
  formatSubscriptionStorage,
  getPlanFeatureAccess,
} from "@/features/subscriptions/utils";

const planIconMap = {
  free: Zap,
  pro: Crown,
  max: InfinityIcon,
} as const;

function FeatureRow({
  enabled,
  label,
}: {
  enabled: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      {enabled ? (
        <Check className="h-4 w-4 shrink-0 text-emerald-500" />
      ) : (
        <X className="h-4 w-4 shrink-0 text-muted-foreground/40" />
      )}
      <span
        className={
          enabled ? "text-sm text-foreground" : "text-sm text-muted-foreground/60"
        }
      >
        {label}
      </span>
    </div>
  );
}

function resolveCheckoutUrl(payload: Record<string, unknown>) {
  const candidateKeys = [
    "redirectUrl",
    "redirect_url",
    "paymentUrl",
    "payment_url",
    "url",
  ];

  for (const key of candidateKeys) {
    const value = payload[key];
    if (typeof value === "string" && value) {
      return value;
    }
  }

  return null;
}

export function SubscriptionManager() {
  const {
    data: plans = [],
    isLoading: isPlansLoading,
    error: plansError,
  } = useSubscriptionPlans();
  const {
    data: currentSubscription,
    isLoading: isSubscriptionLoading,
    error: subscriptionError,
  } = useMySubscription();

  const orderMutation = useCreateSubscriptionOrder({
    mutationConfig: {
      onSuccess: (response) => {
        const checkoutUrl = resolveCheckoutUrl(response as Record<string, unknown>);

        if (checkoutUrl) {
          window.location.href = checkoutUrl;
          return;
        }

        toast.success("Order berhasil dibuat. Silakan lanjutkan pembayaran.");
      },
    },
  });

  const cancelMutation = useCancelSubscription({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Langganan pending berhasil dibatalkan");
      },
    },
  });

  const activePlanId = currentSubscription?.plan ?? "free";

  if (isPlansLoading || isSubscriptionLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-2xl border bg-card">
        <div className="inline-flex items-center gap-3 rounded-xl border bg-muted/30 px-5 py-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm font-medium text-muted-foreground">
            Memuat data langganan...
          </span>
        </div>
      </div>
    );
  }

  if (plansError || subscriptionError || !currentSubscription) {
    return (
      <Card className="border-destructive/20 bg-destructive/5 p-6">
        <p className="text-sm text-destructive">
          Data langganan tidak dapat dimuat saat ini. Silakan coba lagi beberapa saat lagi.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = plan.id === activePlanId;
          const isPopular = plan.id === "pro";
          const Icon = planIconMap[plan.id];
          const features = getPlanFeatureAccess(undefined, plan);
          const isOrdering =
            orderMutation.isPending && orderMutation.variables?.planId === plan.id;
          const expiresAtLabel =
            isCurrent && currentSubscription.expires_at
              ? format(new Date(currentSubscription.expires_at), "d MMM yyyy", {
                  locale: indonesianLocale,
                })
              : null;

          return (
            <Card
              key={plan.id}
              className={
                "relative overflow-hidden rounded-2xl transition-all " +
                (isCurrent
                  ? "border-primary shadow-lg ring-1 ring-primary/20"
                  : "border-border hover:border-primary/30 hover:shadow-md")
              }
            >
              <div className={isPopular ? "p-6 pt-10" : "p-6"}>
                <div className="mb-5 text-center">
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                  <div className="mt-2">
                    <div>
                      <span className="text-3xl font-bold text-foreground">
                        {formatSubscriptionPrice(plan.price)}
                      </span>
                      {plan.duration_days > 0 ? (
                        <span className="text-sm text-muted-foreground">
                          /{plan.duration_days} hari
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="mb-5 space-y-2.5 border-b pb-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Maks CV</span>
                    <span className="font-semibold text-foreground">
                      {formatSubscriptionLimit(plan.max_cvs)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tracker Lamaran</span>
                    <span className="font-semibold text-foreground">
                      {formatSubscriptionLimit(plan.max_applications)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Maks Surat Lamaran</span>
                    <span className="font-semibold text-foreground">
                      {formatSubscriptionLimit(plan.max_application_letters)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Download CV PDF</span>
                    <span className="font-semibold text-foreground">
                      {formatSubscriptionLimit(plan.cv_pdf_downloads_per_day)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Download CV DOCX</span>
                    <span className="font-semibold text-foreground">
                      {formatSubscriptionLimit(plan.cv_docx_downloads_per_day)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Download Surat PDF</span>
                    <span className="font-semibold text-foreground">
                      {formatSubscriptionLimit(
                        plan.application_letter_pdf_downloads_per_day,
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Download Surat DOCX</span>
                    <span className="font-semibold text-foreground">
                      {formatSubscriptionLimit(
                        plan.application_letter_docx_downloads_per_day,
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Penyimpanan</span>
                    <span className="font-semibold text-foreground">
                      {plan.max_document_storage_bytes === 0
                        ? "-"
                        : formatSubscriptionStorage(
                            plan.max_document_storage_bytes,
                          )}
                    </span>
                  </div>
                </div>

                <div className="mb-6 space-y-0.5">
                  <FeatureRow
                    enabled={features.canDownloadCvDocx}
                    label="Download CV DOCX"
                  />
                  <FeatureRow
                    enabled={features.canDownloadCvPdf}
                    label="Download CV PDF"
                  />
                  <FeatureRow
                    enabled={features.canDownloadApplicationLetterDocx}
                    label="Download Surat DOCX"
                  />
                  <FeatureRow
                    enabled={features.canDownloadApplicationLetterPdf}
                    label="Download Surat PDF"
                  />
                  <FeatureRow
                    enabled={features.canManageDocuments}
                    label="Kelola Dokumen"
                  />
                  <FeatureRow
                    enabled={features.canUsePremiumCvTemplates}
                    label="Template Premium CV"
                  />
                  <FeatureRow
                    enabled={features.canUsePremiumApplicationLetterTemplates}
                    label="Template Premium Surat"
                  />
                  <FeatureRow
                    enabled={features.canDuplicateCvs}
                    label="Duplikasi CV"
                  />
                  <FeatureRow
                    enabled={features.canDuplicateApplications}
                    label="Duplikasi Tracker"
                  />
                  <FeatureRow
                    enabled={features.canDuplicateApplicationLetters}
                    label="Duplikasi Surat"
                  />
                </div>

                <Button
                  className="w-full"
                  variant={
                    isCurrent
                      ? "outline"
                      : plan.id === "max" || isPopular
                        ? "default"
                        : "outline"
                  }
                  disabled={
                    isCurrent ||
                    plan.id === "free" ||
                    orderMutation.isPending ||
                    cancelMutation.isPending
                  }
                  onClick={() => {
                    if (plan.id === "free") {
                      return;
                    }

                    orderMutation.mutate({ planId: plan.id });
                  }}
                >
                  {isOrdering ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {isCurrent
                    ? "Paket Saat Ini"
                    : plan.price === 0
                      ? "Paket Gratis"
                      : "Pilih Paket"}
                </Button>

                {isCurrent && expiresAtLabel ? (
                  <div className="mt-3 space-y-2 text-center">
                    <p className="text-xs text-muted-foreground">
                      {`Berlaku sampai ${expiresAtLabel}`}
                    </p>
                    {currentSubscription.status === "pending" &&
                    currentSubscription.id ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto px-2 py-1 text-xs"
                        onClick={() =>
                          cancelMutation.mutate(currentSubscription.id as string)
                        }
                        disabled={cancelMutation.isPending}
                      >
                        {cancelMutation.isPending ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : null}
                        Batalkan pending
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
