import Link from "next/link";
import {
  ListingDescription,
  ListingRowActions,
} from "@/components/admin/listing-moderation-actions";
import { DataTableFrame } from "@/components/layout/data-table-frame";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/layout/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getPublicSellerByUserId,
  listCategories,
  listPendingModerationQueue,
  listProductsByStatus,
} from "@/lib/services";

const PAGE_SIZE = 24;

function formatPrice(price: number, currency: string, isFree: boolean): string {
  if (isFree || price === 0) return "Free";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(price);
  } catch {
    return `${currency} ${price.toFixed(2)}`;
  }
}

type PageProps = {
  searchParams: Promise<{ view?: string; cursor?: string }>;
};

export default async function AdminListingsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const view = params.view === "active" ? "active" : "pending";
  const cursor = params.cursor?.trim() || undefined;

  const [listings, categories] = await Promise.all([
    view === "active"
      ? listProductsByStatus("active", { limit: PAGE_SIZE, cursor })
      : listPendingModerationQueue({ limit: PAGE_SIZE, cursor }),
    listCategories(),
  ]);

  const categoryById = new Map(categories.map((c) => [c.$id, c.name]));

  const sellerIds = [...new Set(listings.map((p) => p.sellerId))];
  const sellerEntries = await Promise.all(
    sellerIds.map(async (id) => {
      const seller = await getPublicSellerByUserId(id);
      return [id, seller?.shopName ?? null] as const;
    }),
  );
  const sellerById = new Map(sellerEntries);

  const last = listings.at(-1);
  const nextCursor =
    listings.length === PAGE_SIZE && last ? last.$id : null;

  const nextHref = nextCursor
    ? `/admin/listings?${new URLSearchParams({
        view,
        cursor: nextCursor,
      }).toString()}`
    : null;

  const pendingHref = "/admin/listings?view=pending";
  const activeHref = "/admin/listings?view=active";

  return (
    <div>
      <PageHeader
        size="compact"
        headingAs="h2"
        eyebrow="Admin"
        title="Listing moderation"
        description="Review pending listings before they go live, or remove active listings from the storefront."
      />

      <nav className="mt-6 flex gap-2 font-mono text-sm">
        <Link
          href={pendingHref}
          className={
            view === "pending"
              ? "rounded-md border border-border bg-card px-3 py-2 font-bold"
              : "rounded-md border border-transparent px-3 py-2 text-muted-foreground hover:border-border"
          }
        >
          Pending review
        </Link>
        <Link
          href={activeHref}
          className={
            view === "active"
              ? "rounded-md border border-border bg-card px-3 py-2 font-bold"
              : "rounded-md border border-transparent px-3 py-2 text-muted-foreground hover:border-border"
          }
        >
          Active listings
        </Link>
      </nav>

      {listings.length === 0 ? (
        <p className="mt-8 rounded-md border border-border bg-card px-4 py-5 font-mono text-sm text-muted-foreground">
          {view === "pending"
            ? "No listings awaiting review."
            : "No active listings to manage."}
        </p>
      ) : (
        <DataTableFrame className="mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Listing</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((product) => {
                const shopName = sellerById.get(product.sellerId);
                const categoryName =
                  categoryById.get(product.categoryId) ?? product.categoryId;

                return (
                  <TableRow key={product.$id}>
                    <TableCell className="max-w-[220px]">
                      <p className="truncate font-medium">{product.title}</p>
                      <ListingDescription description={product.description} />
                    </TableCell>
                    <TableCell className="max-w-[160px] truncate font-mono text-xs text-muted-foreground">
                      {shopName ?? product.sellerId}
                    </TableCell>
                    <TableCell>{categoryName}</TableCell>
                    <TableCell className="font-mono tabular-nums">
                      {formatPrice(
                        product.price,
                        product.currency,
                        product.isFree,
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <StatusBadge status={product.status} />
                        {!product.available ? (
                          <StatusBadge status="unavailable" />
                        ) : null}
                        {product.featured ? (
                          <StatusBadge status="active" />
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <ListingRowActions
                        productId={product.$id}
                        title={product.title}
                        view={view}
                        featured={product.featured}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </DataTableFrame>
      )}

      {nextHref ? (
        <div className="mt-8">
          <Button variant="outline" size="sm" asChild>
            <Link href={nextHref}>Load more</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
