import { useState } from "react";
import { ExternalLink, Megaphone, X } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { env } from "@/config/env";

export function JobPostRequestAlert() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || !env.JOB_POST_FORM_URL) {
    return null;
  }

  return (
    <div className="mb-6">
      <Alert className="rounded-2xl border-primary/15 bg-primary/5 p-5 pr-14 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Megaphone className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>

            <div className="space-y-2">
              <AlertTitle className="mb-0 text-lg font-semibold text-foreground">
                Punya Lowongan Kerja?
              </AlertTitle>
              <AlertDescription className="max-w-2xl text-sm leading-6 text-muted-foreground">
                Publikasikan lowongan Anda dan temukan kandidat yang sesuai di
                KarirKit.
              </AlertDescription>
            </div>
          </div>

          <Button asChild className="w-full sm:w-auto md:shrink-0">
            <a
              href={env.JOB_POST_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ajukan Post Lowongan
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Tutup informasi pengajuan lowongan"
          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
          onClick={() => setIsVisible(false)}
        >
          <X />
        </Button>
      </Alert>
    </div>
  );
}
