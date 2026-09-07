import Link from "next/link";
import {
  UserSuspendForm,
  UserUnsuspendButton,
} from "@/components/admin/user-management-actions";
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
import { listUsers } from "@/lib/services";

function formatJoinedAt(iso: string | undefined): string {
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

function formatLabels(labels: string[]): string {
  if (labels.length === 0) return "—";
  return labels.join(", ");
}

type PageProps = {
  searchParams: Promise<{ q?: string; cursor?: string }>;
};

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.q?.trim() ?? "";
  const cursor = params.cursor?.trim() ?? undefined;

  const { users, total, nextCursor } = await listUsers({
    search: search || undefined,
    cursor,
  });

  const nextHref = nextCursor
    ? `/admin/users?${new URLSearchParams({
        ...(search ? { q: search } : {}),
        cursor: nextCursor,
      }).toString()}`
    : null;

  return (
    <div>
      <PageHeader
        size="compact"
        headingAs="h2"
        eyebrow="Admin"
        title="User management"
        description="View platform users and suspend or unsuspend accounts."
      />

      <form method="get" className="mt-6 flex flex-wrap gap-2">
        <input
          type="search"
          name="q"
          defaultValue={search}
          placeholder="Search by name or email"
          maxLength={256}
          className="min-w-[12rem] flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        <Button type="submit" size="sm" variant="outline">
          Search
        </Button>
        {search ? (
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/users">Clear</Link>
          </Button>
        ) : null}
      </form>

      <p className="mt-4 font-mono text-xs text-muted-foreground">
        {total} user{total === 1 ? "" : "s"}
        {search ? ` matching “${search}”` : ""}
      </p>

      {users.length === 0 ? (
        <p className="mt-8 rounded-md border border-border bg-card px-4 py-5 font-mono text-sm text-muted-foreground">
          No users found.
        </p>
      ) : (
        <DataTableFrame className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const displayLabel = user.name || user.email || user.userId;
                return (
                  <TableRow key={user.userId}>
                    <TableCell>
                      <p className="font-medium">{displayLabel}</p>
                      {user.email ? (
                        <p className="font-mono text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      ) : null}
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate font-mono text-xs text-muted-foreground">
                      {formatLabels(user.labels)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatJoinedAt(user.$createdAt)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={user.suspended ? "suspended" : "active"} />
                    </TableCell>
                    <TableCell className="text-right">
                      {user.isAdmin ? (
                        <span className="text-xs text-muted-foreground">Admin</span>
                      ) : user.suspended ? (
                        <UserUnsuspendButton userId={user.userId} />
                      ) : (
                        <UserSuspendForm
                          userId={user.userId}
                          displayLabel={displayLabel}
                        />
                      )}
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
