import Link from "next/link";
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
  formatPaymentMethod,
} from "@/lib/order-display";
import {
  listSellerOrders,
  SELLER_PENDING_STATUSES,
} from "@/lib/services";

type SellerOrdersPageProps = {
  searchParams: Promise<{ filter?: string; cursor?: string }>;
};

const INBOX_PAGE_SIZE = 50;

function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export default async function SellerOrdersPage({
  searchParams,
}: SellerOrdersPageProps) {
  const { filter, cursor } = await searchParams;
  const pendingOnly = filter === "pending";
  const pageCursor = cursor?.trim() || undefined;

  const orders = pendingOnly
    ? await listSellerOrders({
        status: SELLER_PENDING_STATUSES,
        cursor: pageCursor,
      })
    : await listSellerOrders({ cursor: pageCursor });

  const last = orders.at(-1);
  const nextCursor =
    orders.length === INBOX_PAGE_SIZE && last ? last.$id : null;
  const nextHref = nextCursor
    ? `/seller/orders?${new URLSearchParams({
        ...(pendingOnly ? { filter: "pending" } : {}),
        cursor: nextCursor,
      }).toString()}`
    : null;

  return (
    <div>
      <PageHeader
        size="compact"
        headingAs="h2"
        eyebrow="Seller"
        title="Orders"
        description="Orders for your shop. Open an order to update fulfillment status."
      />

      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          variant={pendingOnly ? "outline" : "default"}
          size="sm"
          asChild
        >
          <Link href="/seller/orders">All</Link>
        </Button>
        <Button
          variant={pendingOnly ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/seller/orders?filter=pending">Needs action</Link>
        </Button>
      </div>

      {orders.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          {pendingOnly
            ? "No orders need fulfillment right now."
            : "No orders yet."}
        </p>
      ) : (
        <DataTableFrame className="mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.$id}>
                  <TableCell className="font-mono text-xs">
                    {order.$id.slice(0, 10)}…
                  </TableCell>
                  <TableCell className="font-mono tabular-nums">
                    {formatAmount(order.totalAmount, order.currency)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-xs">
                    {formatPaymentMethod(order.paymentMethod)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/seller/orders/${order.$id}`}>Open</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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
