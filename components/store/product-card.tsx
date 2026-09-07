import Link from "next/link";
import type { ProductCover } from "@/lib/services/products";
import type { Product } from "@/lib/types";
import { ProductWishlistButton } from "@/components/store/product-wishlist-button";
import {
  coverPreviewUrl,
  formatProductPrice,
  productCardClassName,
} from "@/components/store/product-display";

type ProductCardProps = {
  product: Product;
  cover?: ProductCover;
  isLoggedIn?: boolean;
  saved?: boolean;
};

export function ProductCard({
  product,
  cover,
  isLoggedIn = false,
  saved = false,
}: ProductCardProps) {
  const price = formatProductPrice(product);

  return (
    <li>
      <Link
        href={`/products/${product.$id}`}
        className={productCardClassName()}
      >
        {isLoggedIn ? (
          <ProductWishlistButton
            productId={product.$id}
            initialSaved={saved}
          />
        ) : null}
        <div className="relative aspect-square overflow-hidden bg-muted/40">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element -- Appwrite Storage preview URL
            <img
              src={coverPreviewUrl(cover)}
              alt={cover.alt ?? product.title}
              className="hover-zoom h-full w-full object-cover"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center border-b border-dashed border-border"
              aria-hidden
            >
              <span className="size-10 rounded-md border border-border bg-background/40" />
            </div>
          )}
          {product.isFree ? (
            <span className="absolute top-3 left-3 rounded-md bg-background/90 px-2 py-1 text-[11px] font-medium tracking-wide">
              Free
            </span>
          ) : null}
          {product.featured && !product.isFree ? (
            <span className="absolute top-3 left-3 rounded-md border border-border bg-background/90 px-2 py-1 text-[11px] font-medium tracking-wide">
              Featured
            </span>
          ) : null}
        </div>
        <div className="space-y-1 px-3 py-3">
          <p className="truncate text-sm font-medium tracking-tight">
            {product.title}
          </p>
          <p className="font-mono text-base font-semibold tabular-nums text-foreground">
            {price}
          </p>
        </div>
      </Link>
    </li>
  );
}
