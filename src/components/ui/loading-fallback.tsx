import { Spinner } from "./spinner";
import { cn } from "@/lib/utils";

interface LoadingFallbackProps {
  className?: string;
  message?: string;
}

export function LoadingFallback({
  className,
  message = "Loading...",
}: LoadingFallbackProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[200px] gap-4 p-8",
        className
      )}
    >
      <div className="relative">
        <Spinner className="size-8 text-primary" />
        <div className="absolute inset-0 animate-ping">
          <Spinner className="size-8 text-primary opacity-20" />
        </div>
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
    </div>
  );
}

export default LoadingFallback;
