import Link from "next/link";
import {
  SellerApproveButton,
  SellerRejectForm,
} from "@/components/admin/seller-approval-actions";
import { DataTableFrame } from "@/components/layout/data-table-frame";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/layout/status-badge";
import { listPendingSellerApplications } from "@/lib/services";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function formatAppliedAt(iso: string | undefined): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default async function AdminSellersPage() {
  const pending = await listPendingSellerApplications();

  return (
    <div>
      <PageHeader
        size="compact"
        headingAs="h2"
        eyebrow="Admin"
        title="Seller approvals"
        description={
          <>
            Review pending applications.{" "}
            <Link
              href="/admin/sellers/performance"
              className="text-accent underline-offset-2 hover:underline"
            >
              Approved seller performance
            </Link>
          </>
        }
      />

      {pending.length === 0 ? (
        <p className="mt-8 rounded-md border border-border bg-card px-4 py-5 font-mono text-sm text-muted-foreground">
          No pending applications.
        </p>
      ) : (
        <DataTableFrame className="mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shop</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.map((app) => (
                <TableRow key={app.$id}>
                  <TableCell>
                    <p className="font-medium">{app.shopName}</p>
                    {app.bio ? (
                      <p className="mt-1 max-w-md truncate text-xs text-muted-foreground">
                        {app.bio}
                      </p>
                    ) : null}
                  </TableCell>
                  <TableCell className="font-mono text-xs">/shop/{app.slug}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatAppliedAt(app.$createdAt)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status="pending" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <SellerApproveButton sellerProfileId={app.$id} />
                      <SellerRejectForm
                        sellerProfileId={app.$id}
                        shopName={app.shopName}
                      />
                    </div>
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
