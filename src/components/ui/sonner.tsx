import { Toaster as Sonner, type ToasterProps } from "sonner";

import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

export function Toaster({
  className,
  theme: themeProp,
  richColors = true,
  ...props
}: ToasterProps) {
  const { theme } = useTheme();
  const resolvedTheme = themeProp ?? theme;

  return (
    <Sonner
      {...props}
      theme={resolvedTheme}
      richColors={richColors}
      className={cn("toaster", className)}
    />
  );
}
