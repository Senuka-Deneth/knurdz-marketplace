"use client";

import { usePathname } from "next/navigation";
import { portalPageTitle } from "@/components/layout/portal-side-nav";
import type { PortalNavGroup } from "@/components/layout/portal-side-nav";

type PortalCurrentTitleProps = {
  nav: PortalNavGroup[];
  fallback: string;
};

export function PortalCurrentTitle({ nav, fallback }: PortalCurrentTitleProps) {
  const pathname = usePathname();
  const title = portalPageTitle(pathname, nav) ?? fallback;

  return (
    <h1 className="hidden text-sm font-bold tracking-tight md:block">{title}</h1>
  );
}
