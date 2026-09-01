import { BUCKET_PRODUCT_IMAGES } from "@/lib/appwrite/config";
import { getFilePreviewUrl } from "@/lib/appwrite/storage-urls";
import type { ProductCover } from "@/lib/services/products";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function formatProductPrice(product: Pick<Product, "isFree" | "price" | "currency">): string {
  if (product.isFree) return "Free";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: product.currency,
      maximumFractionDigits: 2,
    }).format(product.price);
  } catch {
    return `${product.currency} ${product.price.toFixed(2)}`;
  }
}

export function coverPreviewUrl(cover: ProductCover, size = 640): string {
  return getFilePreviewUrl(BUCKET_PRODUCT_IMAGES, cover.fileId, {
    width: size,
    height: size,
  });
}

export function coverBannerUrl(cover: ProductCover, width = 1400): string {
  return getFilePreviewUrl(BUCKET_PRODUCT_IMAGES, cover.fileId, {
    width,
    height: Math.round(width * 0.43),
  });
}

export function productCardClassName(className?: string): string {
  return cn(
    "group/card relative block overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-foreground/20 hover:bg-card-hover",
    className,
  );
}
