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
        "flex items-center gap-1 text-left whitespace-normal leading-tight cursor-pointer",
        className,
      )}
      onClick={() => onSort(field)}
    >
      <span className="whitespace-normal leading-tight text-left">
        {children}
      </span>
      <ArrowUpDown
        className={cn(
          "h-3.5 w-3.5 shrink-0",
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
