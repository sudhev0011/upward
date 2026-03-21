import { Badge } from "@/components/ui/badge";

type Status = "active" | "pending" | "completed" | "cancelled" | "verified" | "unverified";

const statusStyles: Record<Status, string> = {
  active: "bg-success/10 text-success border-success/20 shadow-sm shadow-success/5",
  pending: "bg-warning/10 text-warning border-warning/20 shadow-sm shadow-warning/5",
  completed: "bg-primary/10 text-primary border-primary/20 shadow-sm shadow-primary/5",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20 shadow-sm shadow-destructive/5",
  verified: "bg-success/10 text-success border-success/20 shadow-sm shadow-success/5",
  unverified: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge variant="outline" className={`${statusStyles[status]} text-[11px] font-semibold tracking-wide`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
