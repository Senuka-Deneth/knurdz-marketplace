import Link from "next/link";
import {
  getAdminMetrics,
  listPendingBankSlips,
  listPendingModerationQueue,
  listPendingSellerApplications,
} from "@/lib/services";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

function formatCount(value: number): string {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatRevenue(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 2,
    }).format(amount);
  }
}

export default async function AdminPage() {
  const [metrics, pendingListings, pendingSellers, pendingSlips] =
    await Promise.all([
      getAdminMetrics(),
      listPendingModerationQueue({ limit: 100 }),
      listPendingSellerApplications(),
      listPendingBankSlips({ limit: 100 }),
    ]);

  const cards = [
    { label: "Total users", value: formatCount(metrics.totalUsers) },
    { label: "Active sellers", value: formatCount(metrics.activeSellers) },
    { label: "Total orders", value: formatCount(metrics.totalOrders) },
    {
      label: "Gross revenue",
      value: formatRevenue(metrics.grossRevenue, metrics.currency),
    },
  ];

  const attention = [
    {
      label: "Pending listings",
      count: pendingListings.length,
      href: "/admin/listings?view=pending",
      hint: "Awaiting moderation",
    },
    {
      label: "Seller applications",
      count: pendingSellers.length,
      href: "/admin/sellers",
      hint: "Awaiting approval",
    },
    {
      label: "Bank slips",
      count: pendingSlips.slips.length,
      href: "/admin/payments/bank-slips",
      hint: "Awaiting verification",
    },
  ].filter((item) => item.count > 0);

  return (
    <div>
      <PageHeader
        size="compact"
        headingAs="h2"
        eyebrow="Admin"
        title="Dashboard"
        description="Platform snapshot. Approvals, slips, and moderation live in the sidebar."
      />

      {attention.length > 0 ? (
        <section className="mt-8" aria-labelledby="needs-attention-heading">
          <h3
            id="needs-attention-heading"
            className="text-sm font-semibold tracking-tight"
          >
            Needs attention
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {attention.map((item) => (
              <Link key={item.href} href={item.href}>
                <Card className="h-full transition-colors hover:border-foreground/20 hover:bg-card-hover">
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="mt-2 text-2xl font-bold tabular-nums">
                      {formatCount(item.count)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value }) => (
          <Card key={label}>
            <CardContent>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
