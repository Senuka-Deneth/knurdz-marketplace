import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: string;
  className?: string;
};

const STATUS_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  approved: "default",
  paid: "default",
  completed: "default",
  pending: "secondary",
  pending_review: "secondary",
  pending_payment: "secondary",
  payment_review: "secondary",
  awaiting_verification: "secondary",
  processing: "secondary",
  shipped: "secondary",
  ready_pickup: "secondary",
  draft: "outline",
  suspended: "destructive",
  rejected: "destructive",
  cancelled: "destructive",
  failed: "destructive",
  refunded: "destructive",
  inactive: "outline",
  unavailable: "outline",
};

function formatStatusLabel(status: string): string {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = STATUS_VARIANTS[status] ?? "outline";

  return (
    <Badge variant={variant} className={cn("font-mono text-xs capitalize", className)}>
      {formatStatusLabel(status)}
    </Badge>
  );
}
