import { Link } from "react-router";
import { Crown, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { paths } from "@/config/paths";

type SubscriptionUpgradeCardProps = {
  title?: string;
  description?: string;
  compact?: boolean;
};

export function SubscriptionUpgradeCard({
  title = "Upgrade paket untuk membuka fitur ini",
  description = "Fitur ini mengikuti capability plan aktif Anda. Upgrade ke Pro atau Max untuk melanjutkan.",
  compact = false,
}: SubscriptionUpgradeCardProps) {
  return (
    <Card className="border-primary/20 bg-linear-to-br from-primary/5 via-background to-background">
      <CardHeader className={compact ? "pb-3" : undefined}>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldAlert className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
        <Button asChild>
          <Link to={paths.subscriptions.list.getHref()}>
            <Crown className="h-4 w-4" />
            Lihat Paket
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
