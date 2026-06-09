import type { FormEvent, KeyboardEvent } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type PublicPageHeroProps = {
  title: string;
  description: string;
  searchId: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (event?: FormEvent | KeyboardEvent) => void;
};

const cornerDotPattern = {
  backgroundImage:
    "radial-gradient(hsl(var(--primary) / 0.34) 1.25px, transparent 1.25px)",
  backgroundSize: "13px 13px",
  maskImage: "linear-gradient(135deg, black 0%, transparent 76%)",
  WebkitMaskImage: "linear-gradient(135deg, black 0%, transparent 76%)",
};

const cornerLinePattern = {
  backgroundImage:
    "linear-gradient(135deg, hsl(var(--primary) / 0.28) 1.25px, transparent 1.25px)",
  backgroundSize: "12px 12px",
  maskImage: "linear-gradient(315deg, black 0%, transparent 76%)",
  WebkitMaskImage: "linear-gradient(315deg, black 0%, transparent 76%)",
};

export function PublicPageHero({
  title,
  description,
  searchId,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onSearchSubmit,
}: PublicPageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b bg-muted">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-36 w-36 opacity-85 sm:h-48 sm:w-48"
        style={cornerDotPattern}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-36 w-36 opacity-90 sm:h-52 sm:w-52"
        style={cornerLinePattern}
      />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              {title}
            </h1>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              {description}
            </p>
          </div>

          <form
            onSubmit={onSearchSubmit}
            className="mt-5 w-full max-w-xl sm:mt-6"
          >
            <label htmlFor={searchId} className="sr-only">
              {searchPlaceholder}
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id={searchId}
                placeholder={searchPlaceholder}
                className="h-12 w-full rounded-lg border-border bg-background pl-11 pr-4 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/70 hover:border-foreground/20 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 sm:text-base"
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
