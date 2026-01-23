import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "text-sm font-medium transition-all duration-200",
    "cursor-pointer disabled:pointer-events-none disabled:opacity-50",
    "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "rounded-lg bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:shadow-md",
        destructive:
          "rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "rounded-lg border border-primary bg-transparent text-primary hover:bg-primary/5",
        secondary:
          "rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "rounded-lg hover:bg-accent hover:text-accent-foreground",
        link: "rounded-lg text-primary underline-offset-4 hover:underline",
        hero: "rounded-lg bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-4",
        sm: "h-9 rounded-md px-4 has-[>svg]:px-3",
        lg: "h-12 rounded-lg px-8 text-base has-[>svg]:px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
