import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface DonationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DonationModal({ open, onOpenChange }: DonationModalProps) {
  const { t } = useTranslation("common");

  const handleDonate = () => {
    window.open("https://saweria.co/karirkit", "_blank");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0">
        <div className="flex flex-col max-h-[85vh]">
          <DialogHeader className="px-6 pt-6 pb-4 md:text-left text-center">
            <DialogTitle className="text-xl">
              {t("donationModal.title")}
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed mt-2">
              {t("donationModal.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto px-6 py-2">
            {/* Additional content could go here if needed in the future */}
          </div>

          <div className="px-6 py-4 bg-muted/30 border-t flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto mt-2 sm:mt-0"
            >
              {t("donationModal.later")}
            </Button>
            <Button onClick={handleDonate} className="w-full sm:w-auto">
              {t("donationModal.donateViaSaweria")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
