import { useEffect, useState } from "react";
import { format } from "date-fns";
import { id as indonesianLocale } from "date-fns/locale";
import {
  ArrowRight,
  Check,
  Clock3,
  Crown,
  Infinity as InfinityIcon,
  Loader2,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { env } from "@/config/env";
import { useCancelSubscription } from "@/features/subscriptions/api/cancel-subscription";
import { useCreateSubscriptionOrder } from "@/features/subscriptions/api/create-subscription-order";
import { useMySubscription } from "@/features/subscriptions/api/get-my-subscription";
import { useSubscriptionPlans } from "@/features/subscriptions/api/get-subscription-plans";
import {
  formatSubscriptionLimit,
  formatSubscriptionPrice,
  formatSubscriptionStorage,
  getPlanFeatureAccess,
  SUBSCRIPTION_PLAN_LABELS,
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
    "snapUrl",
    "snap_url",
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

function resolveSnapToken(payload: Record<string, unknown>) {
  const candidateKeys = ["snapToken", "snap_token", "token"];

  for (const key of candidateKeys) {
    const value = payload[key];
    if (typeof value === "string" && value) {
      return value;
    }
  }

  return null;
}

function resolvePendingPlan(payload: Record<string, unknown>) {
  const candidateKeys = ["pendingPlan", "pending_plan"];

  for (const key of candidateKeys) {
    const value = payload[key];
    if (value === "free" || value === "pro" || value === "max") {
      return value;
    }
  }

  return null;
}

function resolveCanResumePayment(payload: Record<string, unknown>) {
  const candidateKeys = ["canResumePayment", "can_resume_payment"];

  for (const key of candidateKeys) {
    const value = payload[key];
    if (typeof value === "boolean") {
      return value;
    }
  }

  return false;
}

function getMidtransSnapScriptUrl(clientKey: string) {
  return clientKey.startsWith("SB-")
    ? "https://app.sandbox.midtrans.com/snap/snap.js"
    : "https://app.midtrans.com/snap/snap.js";
}

function waitForMidtransSnap(timeoutMs = 4000) {
  return new Promise<NonNullable<Window["snap"]> | null>((resolve) => {
    if (window.snap) {
      resolve(window.snap);
      return;
    }

    const startedAt = Date.now();
    const intervalId = window.setInterval(() => {
      if (window.snap) {
        window.clearInterval(intervalId);
        resolve(window.snap);
        return;
      }

      if (Date.now() - startedAt >= timeoutMs) {
        window.clearInterval(intervalId);
        resolve(null);
      }
    }, 150);
  });
}

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        },
      ) => void;
    };
  }
}

export function SubscriptionManager() {
  const [isResumingPayment, setIsResumingPayment] = useState(false);
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

  useEffect(() => {
    if (typeof window === "undefined" || window.snap || !env.MIDTRANS_CLIENT_KEY) {
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      "script[data-midtrans-snap='true']",
    );

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.src = getMidtransSnapScriptUrl(env.MIDTRANS_CLIENT_KEY);
    script.async = true;
    script.setAttribute("data-client-key", env.MIDTRANS_CLIENT_KEY);
    script.setAttribute("data-midtrans-snap", "true");
    document.body.appendChild(script);
  }, []);

  async function openMidtransCheckout(
    payload: Record<string, unknown>,
    options?: {
      missingPaymentMessage?: string;
      loadingErrorMessage?: string;
    },
  ) {
    const snapToken = resolveSnapToken(payload);
    const checkoutUrl = resolveCheckoutUrl(payload);

    if (snapToken) {
      let snap: NonNullable<Window["snap"]> | undefined = window.snap;

      if (!snap && env.MIDTRANS_CLIENT_KEY) {
        const loadedSnap = await waitForMidtransSnap();
        if (loadedSnap) {
          snap = loadedSnap;
        }
      }

      if (snap) {
        snap.pay(snapToken, {
          onError: () => {
            toast.error(
              options?.loadingErrorMessage ?? "Pembayaran Midtrans gagal dibuka.",
            );
          },
          onClose: () => {
            toast.info("Pembayaran dibatalkan. Silakan coba lagi.");
          },
        });
        return;
      }

      if (!env.MIDTRANS_CLIENT_KEY) {
        toast.error(
          "Snap token tersedia, tetapi `VITE_APP_MIDTRANS_CLIENT_KEY` belum diisi di frontend.",
        );
        return;
      }

      toast.error(
        "Snap token tersedia, tetapi script Midtrans Snap gagal dimuat di browser.",
      );
      return;
    }

    if (checkoutUrl) {
      window.location.href = checkoutUrl;
      return;
    }

    toast.error(
      options?.missingPaymentMessage ??
        "Order berhasil dibuat, tetapi data pembayaran tidak ditemukan.",
    );
  }

  const orderMutation = useCreateSubscriptionOrder({
    mutationConfig: {
      onSuccess: (response) => {
        void openMidtransCheckout(response as Record<string, unknown>, {
          missingPaymentMessage:
            "Order berhasil dibuat, tetapi data pembayaran tidak ditemukan.",
        });
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

  const currentSubscriptionPayload = currentSubscription
    ? (currentSubscription as unknown as Record<string, unknown>)
    : null;
  const activePlanId = currentSubscription?.plan ?? "free";
  const pendingPlanId = currentSubscriptionPayload
    ? resolvePendingPlan(currentSubscriptionPayload)
    : null;
  const canResumePayment = currentSubscriptionPayload
    ? resolveCanResumePayment(currentSubscriptionPayload)
    : false;
  const hasPendingPayment =
    currentSubscription?.status === "pending" && canResumePayment && !!pendingPlanId;
  const pendingPlanLabel = pendingPlanId
    ? SUBSCRIPTION_PLAN_LABELS[pendingPlanId]
    : null;

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
      {hasPendingPayment ? (
        <Card className="rounded-3xl border-amber-200 dark:border-amber-800 bg-linear-to-r from-amber-50 via-background to-background dark:from-amber-950/50 dark:via-background dark:to-background p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <Badge
                variant="secondary"
                className="w-fit rounded-full bg-amber-100 dark:bg-amber-900 px-3 py-1 text-amber-800 dark:text-amber-200"
              >
                Menunggu Pembayaran
              </Badge>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                  Lanjutkan pembayaran paket {pendingPlanLabel}
                </h3>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                  Anda masih memiliki order subscription berstatus pending. Order
                  ini bisa dilanjutkan kembali tanpa membuat transaksi baru.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background dark:bg-background px-3 py-1.5">
                  <Clock3 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  Plan efektif saat ini: {SUBSCRIPTION_PLAN_LABELS[activePlanId]}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border bg-background dark:bg-background px-3 py-1.5">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  Pending upgrade: {pendingPlanLabel}
                </div>
              </div>
              {!env.MIDTRANS_CLIENT_KEY ? (
                <p className="text-xs text-muted-foreground">
                  Midtrans client key belum diisi di frontend. Sistem akan fallback
                  ke `snap_url` jika backend masih mengirimkannya.
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={async () => {
                  setIsResumingPayment(true);

                  try {
                    await openMidtransCheckout(
                      currentSubscriptionPayload as Record<string, unknown>,
                      {
                        missingPaymentMessage:
                          "Data resume pembayaran tidak tersedia untuk order pending ini.",
                        loadingErrorMessage:
                          "Gagal membuka resume pembayaran Midtrans.",
                      },
                    );
                  } finally {
                    setIsResumingPayment(false);
                  }
                }}
                disabled={
                  isResumingPayment ||
                  orderMutation.isPending ||
                  cancelMutation.isPending
                }
              >
                {isResumingPayment ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                Lanjutkan Pembayaran
              </Button>
              {currentSubscription.id ? (
                <Button
                  variant="outline"
                  onClick={() =>
                    cancelMutation.mutate(currentSubscription.id as string)
                  }
                  disabled={cancelMutation.isPending || orderMutation.isPending}
                >
                  {cancelMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  Batalkan
                </Button>
              ) : null}
            </div>
          </div>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = plan.id === activePlanId;
          const isPendingPlan = pendingPlanId === plan.id;
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
                  : isPendingPlan
                    ? "border-amber-200 shadow-md ring-1 ring-amber-100"
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
                    isCurrent || isPendingPlan
                      ? "outline"
                      : plan.id === "max" || isPopular
                        ? "default"
                        : "outline"
                  }
                  disabled={
                    isCurrent ||
                    isPendingPlan ||
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
                    : isPendingPlan
                      ? "Menunggu Pembayaran"
                      : plan.price === 0
                        ? "Paket Gratis"
                        : "Pilih Paket"}
                </Button>

                {(isCurrent && expiresAtLabel) || isPendingPlan ? (
                  <div className="mt-3 space-y-2 text-center">
                    {isCurrent && expiresAtLabel ? (
                      <p className="text-xs text-muted-foreground">
                        {`Berlaku sampai ${expiresAtLabel}`}
                      </p>
                    ) : null}
                    {/* {isPendingPlan ? (
                      <p className="text-xs font-medium text-amber-700">
                        Paket ini sedang menunggu pembayaran.
                      </p>
                    ) : null} */}
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
