import Link from "next/link";
import { DataTableFrame } from "@/components/layout/data-table-frame";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/layout/status-badge";
import { SubmitListingButton } from "@/components/seller/submit-listing-button";
import { EmptyState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listCategories } from "@/lib/services/categories";
import {
  canSubmitListingForReview,
  countProductImagesForOwnProducts,
  listOwnProducts,
} from "@/lib/services/seller-listings";

function formatPrice(price: number, currency: string, isFree: boolean): string {
  if (isFree || price === 0) return "Free";
  return `${currency} ${price.toLocaleString()}`;
}

export default async function SellerListingsPage() {
  const [products, categories] = await Promise.all([
    listOwnProducts(),
    listCategories(),
  ]);

  const imageCounts = await countProductImagesForOwnProducts(products);

  return (
    <div>
      <PageHeader
        size="compact"
        headingAs="h2"
        eyebrow="Seller"
        title="Listings"
        description="Drafts stay private until you submit for review. Approved listings appear on the storefront."
        actions={
          <Button asChild disabled={categories.length === 0}>
            <Link href="/seller/listings/new">New listing</Link>
          </Button>
        }
      />

      {products.length === 0 ? (
        <EmptyState
          className="mt-10"
          title="No listings yet"
          description="Create your first draft to get started."
          action={
            categories.length > 0 ? (
              <Button asChild>
                <Link href="/seller/listings/new">Create draft listing</Link>
              </Button>
            ) : null
          }
        />
      ) : (
        <DataTableFrame className="mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Listing</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Images</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.$id}>
                  <TableCell className="max-w-[240px]">
                    <Link
                      href={`/seller/listings/${product.$id}`}
                      className="truncate font-medium hover:text-accent"
                    >
                      {product.title}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono tabular-nums">
                    {formatPrice(product.price, product.currency, product.isFree)}
                  </TableCell>
                  <TableCell className="tabular-nums">{product.stock}</TableCell>
                  <TableCell className="tabular-nums">
                    {imageCounts.get(product.$id) ?? 0}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <StatusBadge status={product.status} />
                      {!product.available ? (
                        <StatusBadge status="unavailable" />
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {canSubmitListingForReview(product.status) ? (
                      <SubmitListingButton productId={product.$id} />
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTableFrame>
      )}
    </div>
  );
}
