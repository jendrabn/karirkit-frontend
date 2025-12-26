import { Spinner } from "./spinner";

interface LoadingOverlayProps {
  show: boolean;
  message?: string;
}

export function LoadingOverlay({
  show,
  message = "Memproses...",
}: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-300">
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-card border border-border shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          <Spinner size="lg" className="text-primary w-12 h-12" />
        </div>
        {message && (
          <p className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
