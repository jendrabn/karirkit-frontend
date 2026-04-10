import { useRegisterSW } from "virtual:pwa-register/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

function PWAUpdatePromptContent() {
  const { t } = useTranslation("common");
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const showReload = needRefresh;

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  const reload = () => {
    updateServiceWorker(true);
  };

  if (!showReload && !offlineReady) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm animate-in slide-in-from-bottom-5">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            {needRefresh ? t("pwa.updateTitle") : t("pwa.offlineReadyTitle")}
          </CardTitle>
          <CardDescription>
            {needRefresh
              ? t("pwa.updateDescription")
              : t("pwa.offlineReadyDescription")}
          </CardDescription>
        </CardHeader>
        <CardFooter className="gap-2">
          <Button variant="outline" onClick={close} className="flex-1">
            {needRefresh ? t("action.later") : t("action.close")}
          </Button>
          {needRefresh && (
            <Button onClick={reload} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              {t("action.reload")}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export function PWAUpdatePrompt() {
  if (import.meta.env.DEV) {
    return null;
  }

  return <PWAUpdatePromptContent />;
}
