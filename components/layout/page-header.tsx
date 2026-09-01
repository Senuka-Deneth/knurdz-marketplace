import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
  headingAs?: "h1" | "h2";
  size?: "default" | "compact";
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
  headingAs = "h1",
  size = "default",
}: PageHeaderProps) {
  const Heading = headingAs;
  const compact = size === "compact";

  return (
    <header
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 max-w-2xl">
        {eyebrow ? (
          <p className="font-mono text-sm text-accent">
            {eyebrow}
          </p>
        ) : null}
        <Heading
          className={cn(
            compact
              ? "text-2xl font-bold tracking-tight sm:text-3xl"
              : "text-4xl font-bold tracking-tight sm:text-5xl",
            eyebrow ? "mt-2" : null,
          )}
        >
          {title}
        </Heading>
        {description ? (
          <p
            className={cn(
              "mt-2 leading-relaxed text-muted-foreground",
              compact ? "text-sm sm:text-base" : "text-base sm:text-lg",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </header>
  );
}
