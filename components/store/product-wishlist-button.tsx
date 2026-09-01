"use client";

import { Heart } from "lucide-react";
import { useState, useTransition, type MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { toggleWishlistProduct } from "@/lib/services/wishlist-actions";
import { toast } from "@/lib/ui/toast";
import { cn } from "@/lib/utils";

type ProductWishlistButtonProps = {
  productId: string;
  initialSaved: boolean;
  className?: string;
};

export function ProductWishlistButton({
  productId,
  initialSaved,
  className,
}: ProductWishlistButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();

  function handleToggle(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    startTransition(async () => {
      const result = await toggleWishlistProduct(productId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      const nextSaved = result.saved ?? !saved;
      setSaved(nextSaved);
    });
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon-xs"
      className={cn(
        "absolute top-2 right-2 z-10 opacity-0 shadow-sm transition-opacity group-hover/card:opacity-100 focus-visible:opacity-100",
        saved && "opacity-100",
        className,
      )}
      disabled={pending}
      aria-pressed={saved}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      onClick={handleToggle}
    >
      <Heart
        className={cn("size-3.5", saved && "fill-current text-accent")}
        aria-hidden
      />
    </Button>
  );
}
