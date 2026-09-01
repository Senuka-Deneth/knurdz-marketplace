"use client";

import Link from "next/link";
import {
  BookOpen,
  Cpu,
  Gamepad2,
  Gem,
  Headphones,
  Palette,
  Shirt,
  Sparkles,
  Tag,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

const SLUG_ICONS: Record<string, LucideIcon> = {
  books: BookOpen,
  "digital-goods": Cpu,
  gaming: Gamepad2,
  collectibles: Gem,
  audio: Headphones,
  art: Palette,
  apparel: Shirt,
  templates: Sparkles,
};

function iconForCategory(slug: string): LucideIcon {
  return SLUG_ICONS[slug] ?? Tag;
}

type CategorySliderProps = {
  categories: Category[];
  className?: string;
};

export function CategorySlider({ categories, className }: CategorySliderProps) {
  if (categories.length === 0) return null;

  return (
    <div className={cn("overflow-x-auto pb-1", className)}>
      <ul className="flex w-max gap-3">
        {categories.map((category) => {
          const Icon = iconForCategory(category.slug);
          return (
            <li key={category.$id}>
              <Link
                href={`/categories/${category.slug}`}
                className="flex w-24 flex-col items-center gap-2 rounded-xl border border-border bg-card px-3 py-4 text-center transition-colors hover:border-foreground/20 hover:bg-card-hover sm:w-28"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-muted/50 text-accent">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="line-clamp-2 text-xs font-medium leading-tight">
                  {category.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
