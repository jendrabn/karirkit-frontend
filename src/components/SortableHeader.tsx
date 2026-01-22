import type { ReactNode } from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SortOrder = "asc" | "desc";

type SortableHeaderProps<TField extends string | number> = {
  field: TField;
  onSort: (field: TField) => void;
  children: ReactNode;
  activeField?: TField;
  sortOrder?: SortOrder;
  className?: string;
};

export function SortableHeader<TField extends string | number>({
  field,
  onSort,
  children,
  activeField,
  sortOrder,
  className,
}: SortableHeaderProps<TField>) {
  const hasActiveState = activeField !== undefined;
  const isActive = hasActiveState && activeField === field;

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "-ml-3 h-8 data-[state=open]:bg-accent uppercase text-xs font-medium tracking-wide text-muted-foreground hover:text-foreground",
        className,
      )}
      onClick={() => onSort(field)}
    >
      {children}
      <ArrowUpDown
        className={cn(
          "ml-1.5 h-3.5 w-3.5",
          hasActiveState ? "transition-opacity" : "opacity-50",
          hasActiveState && (isActive ? "opacity-100" : "opacity-30"),
        )}
        style={
          isActive && sortOrder === "desc"
            ? { transform: "rotate(180deg)" }
            : undefined
        }
      />
    </Button>
  );
}
