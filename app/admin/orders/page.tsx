import Link from "next/link";
import { AdminOrderOverrideActions } from "@/components/admin/admin-order-override-actions";
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
  formatOrderStatus,
  formatPaymentMethod,
} from "@/lib/order-display";
import {
  getPublicSellerByUserId,
  listAllOrders,
  parseOrderStatusFilter,
  parsePaymentMethodFilter,
  parsePaymentStatusFilter,
} from "@/lib/services";
import {
  ORDER_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  type PaymentStatus,
} from "@/lib/types";

const PAGE_SIZE = 25;

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Pending",
  awaiting_verification: "Awaiting verification",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};

function formatPaymentStatus(status: PaymentStatus): string {
  return PAYMENT_STATUS_LABELS[status];
}

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

function formatCreatedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function buildFilterHref(params: Record<string, string | undefined>): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) sp.set(key, value);
  }
  const qs = sp.toString();
  return qs ? `/admin/orders?${qs}` : "/admin/orders";
}

type PageProps = {
  searchParams: Promise<{
    status?: string;
    method?: string;
    paymentStatus?: string;
    cursor?: string;
  }>;
};

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = parseOrderStatusFilter(params.status);
  const method = parsePaymentMethodFilter(params.method);
  const paymentStatus = parsePaymentStatusFilter(params.paymentStatus);
  const cursor = params.cursor?.trim() || undefined;

  const { orders, nextCursor } = await listAllOrders({
    status,
    paymentMethod: method,
    paymentStatus,
    limit: PAGE_SIZE,
    cursor,
  });

  const sellerIds = [...new Set(orders.map((o) => o.sellerId))];
  const sellerEntries = await Promise.all(
    sellerIds.map(async (id) => {
      const seller = await getPublicSellerByUserId(id);
      return [id, seller?.shopName ?? null] as const;
    }),
  );
  const sellerById = new Map(sellerEntries);

  const hasFilters = Boolean(status || method || paymentStatus);
  const clearHref = "/admin/orders";

  const nextHref = nextCursor
    ? buildFilterHref({
        status,
        method,
        paymentStatus,
        cursor: nextCursor,
      })
    : null;

  return (
    <div>
      <PageHeader
        size="compact"
        headingAs="h2"
        eyebrow="Admin"
        title="All orders"
        description="Platform-wide order oversight. Cancel unpaid orders or refund paid ones."
      />

      <form method="get" className="mt-6 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 font-mono text-xs text-muted-foreground">
          Order status
          <select
            name="status"
            defaultValue={status ?? ""}
            className="min-w-[10rem] rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="">All</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {formatOrderStatus(s)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 font-mono text-xs text-muted-foreground">
          Payment method
          <select
            name="method"
            defaultValue={method ?? ""}
            className="min-w-[10rem] rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="">All</option>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {formatPaymentMethod(m)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 font-mono text-xs text-muted-foreground">
          Payment status
          <select
            name="paymentStatus"
            defaultValue={paymentStatus ?? ""}
            className="min-w-[10rem] rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="">All</option>
            {PAYMENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {formatPaymentStatus(s)}
              </option>
            ))}
          </select>
        </label>

        <Button type="submit" size="sm" variant="outline">
          Apply filters
        </Button>

        {hasFilters ? (
          <Button variant="ghost" size="sm" asChild>
            <Link href={clearHref}>Clear</Link>
          </Button>
        ) : null}
      </form>

      {orders.length === 0 ? (
        <p className="mt-8 rounded-md border border-border bg-card px-4 py-5 font-mono text-sm text-muted-foreground">
          {hasFilters
            ? "No orders match the selected filters."
            : "No orders yet."}
        </p>
      ) : (
        <DataTableFrame className="mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const shopName = sellerById.get(order.sellerId);
                return (
                  <TableRow key={order.$id}>
                    <TableCell className="font-mono text-xs">
                      {order.$id.slice(0, 10)}…
                    </TableCell>
                    <TableCell className="max-w-[120px] truncate font-mono text-xs text-muted-foreground">
                      {order.buyerId}
                    </TableCell>
                    <TableCell className="max-w-[140px] truncate">
                      {shopName ?? order.sellerId}
                    </TableCell>
                    <TableCell className="font-mono tabular-nums">
                      {formatAmount(order.totalAmount, order.currency)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-xs">{formatPaymentMethod(order.paymentMethod)}</p>
                        {order.paymentStatus ? (
                          <StatusBadge status={order.paymentStatus} />
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatCreatedAt(order.$createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <AdminOrderOverrideActions
                        orderId={order.$id}
                        orderStatus={order.status}
                        paymentStatus={order.paymentStatus}
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
            <Link href={nextHref}>Next page</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
