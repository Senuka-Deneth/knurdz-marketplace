"use client";

import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  coverBannerUrl,
  formatProductPrice,
} from "@/components/store/product-display";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import type { ProductCover } from "@/lib/services/products";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export type PromoSlide =
  | {
      kind: "product";
      product: Product;
      cover?: ProductCover;
    }
  | {
      kind: "cta";
      title: string;
      description: string;
      href: string;
      cta: string;
    };

type PromoSliderProps = {
  slides: PromoSlide[];
};

function subscribeReducedMotion() {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const handler = () => {};
  mq.addEventListener("change", handler);
  return () => mq.removeEventListener("change", handler);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function PromoSlider({ slides }: PromoSliderProps) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const plugins = reducedMotion
    ? []
    : [
        Autoplay({
          delay: 6000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ];

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (slides.length === 0) return null;

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        opts={{ loop: slides.length > 1, align: "start" }}
        plugins={plugins}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {slides.map((slide) => (
            <CarouselItem
              key={slide.kind === "product" ? slide.product.$id : "cta"}
              className="pl-0"
            >
              {slide.kind === "product" ? (
                <Link
                  href={`/products/${slide.product.$id}`}
                  className="group relative block aspect-[21/9] min-h-[220px] overflow-hidden rounded-2xl border border-border bg-card sm:min-h-[280px]"
                >
                  {slide.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element -- Appwrite Storage preview URL
                    <img
                      src={coverBannerUrl(slide.cover)}
                      alt={slide.cover.alt ?? slide.product.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-muted/40" aria-hidden />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
                  <div className="relative flex h-full flex-col justify-end p-6 sm:p-10">
                    {slide.product.featured ? (
                      <p className="font-mono text-xs text-accent">Featured</p>
                    ) : null}
                    <h2 className="mt-2 max-w-lg text-2xl font-bold tracking-tight sm:text-4xl">
                      {slide.product.title}
                    </h2>
                    <p className="mt-2 font-mono text-lg tabular-nums text-accent">
                      {formatProductPrice(slide.product)}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="relative flex aspect-[21/9] min-h-[220px] flex-col justify-center overflow-hidden rounded-2xl border border-border bg-card px-6 sm:min-h-[280px] sm:px-10">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,color-mix(in_srgb,var(--accent)_18%,transparent)_0%,transparent_55%)]"
                  />
                  <p className="font-mono text-xs text-accent">Sell on Knurdz</p>
                  <h2 className="mt-2 max-w-md text-2xl font-bold tracking-tight sm:text-4xl">
                    {slide.title}
                  </h2>
                  <p className="mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
                    {slide.description}
                  </p>
                  <div className="mt-6">
                    <Button asChild>
                      <Link href={slide.href}>{slide.cta}</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {slides.length > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={
                slide.kind === "product"
                  ? `${slide.product.$id}-dot`
                  : "cta-dot"
              }
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={selectedIndex === index ? "true" : undefined}
              className={cn(
                "size-2 rounded-full transition-colors",
                selectedIndex === index
                  ? "bg-accent"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50",
              )}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
