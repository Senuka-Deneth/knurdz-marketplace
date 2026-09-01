"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  Flag,
  FolderTree,
  Landmark,
  LayoutDashboard,
  MessageSquare,
  Package,
  ScrollText,
  Settings,
  Shield,
  ShoppingCart,
  Store,
  Ticket,
  TrendingUp,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type PortalNavItem = {
  href: string;
  label: string;
};

export type PortalNavGroup = {
  title?: string;
  items: PortalNavItem[];
};

const NAV_ICONS: Record<string, LucideIcon> = {
  "/admin": LayoutDashboard,
  "/admin/listings": Package,
  "/admin/categories": FolderTree,
  "/admin/coupons": Ticket,
  "/admin/orders": ShoppingCart,
  "/admin/sellers": Store,
  "/admin/sellers/performance": TrendingUp,
  "/admin/users": Users,
  "/admin/trust": Shield,
  "/admin/reports": Flag,
  "/admin/payments/bank-slips": Landmark,
  "/admin/payments/notify-logs": Bell,
  "/admin/analytics": BarChart3,
  "/admin/settings": Settings,
  "/admin/audit": ScrollText,
  "/seller": LayoutDashboard,
  "/seller/shop": Store,
  "/seller/listings": Package,
  "/seller/orders": ShoppingCart,
  "/seller/messages": MessageSquare,
  "/seller/earnings": Wallet,
  "/seller/settings": Settings,
};

function iconForHref(href: string): LucideIcon {
  return NAV_ICONS[href] ?? LayoutDashboard;
}

function isActivePath(pathname: string, href: string, allHrefs: string[]): boolean {
  if (pathname === href) return true;
  if (!pathname.startsWith(`${href}/`)) return false;
  return !allHrefs.some(
    (other) =>
      other !== href &&
      other.startsWith(`${href}/`) &&
      (pathname === other || pathname.startsWith(`${other}/`)),
  );
}

export function portalPageTitle(
  pathname: string,
  groups: PortalNavGroup[],
): string | null {
  const allItems = groups.flatMap((group) => group.items);
  const exact = allItems.find((item) => item.href === pathname);
  if (exact) return exact.label;

  const nested = allItems
    .filter((item) => pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return nested?.label ?? null;
}

export function PortalSideNav({
  groups,
  label,
  className,
}: {
  groups: PortalNavGroup[];
  label: string;
  className?: string;
}) {
  const pathname = usePathname();
  const allHrefs = groups.flatMap((group) => group.items.map((item) => item.href));

  return (
    <nav aria-label={label} className={cn("flex flex-col gap-5", className)}>
      {groups.map((group) => (
        <div key={group.title ?? group.items.map((item) => item.href).join("-")}>
          {group.title ? (
            <p className="px-3 pb-1.5 font-mono text-xs text-accent">
              {group.title}
            </p>
          ) : null}
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = isActivePath(pathname, item.href, allHrefs);
              const Icon = iconForHref(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md border-l-2 py-2 pl-[10px] pr-3 text-base transition",
                    active
                      ? "border-accent bg-accent/10 font-medium text-foreground"
                      : "border-transparent text-muted-foreground hover:bg-card hover:text-accent",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
