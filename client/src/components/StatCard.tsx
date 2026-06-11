import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  /** Pass a number (e.g. 12.5 or -3.1) — sign and % are added automatically.
   *  Pass a string for custom labels (e.g. "No change"). */
  change?: number | string;
  changeType?: "positive" | "negative" | "neutral" | string;
  icon: LucideIcon;
}

export function StatCard({ title, value, change, changeType, icon: Icon }: StatCardProps) {
  const isNumber = typeof change === "number";
  const isPositive = isNumber && (change as number) >= 0;
  const changeLabel = isNumber
    ? `${isPositive ? "+" : ""}${change}% from last month`
    : change;
  const changeColor = changeType
    ? changeType === "positive"
      ? "text-success"
      : changeType === "negative"
        ? "text-destructive"
        : "text-muted-foreground"
    : isNumber
      ? isPositive
        ? "text-[#10B981]" // text-success
        : "text-[#EF4444]" // text-destructive
      : "text-muted-foreground";

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:border-primary/20 transition-all duration-300 group">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {title}
            </p>
            <p className="text-2xl font-bold text-card-foreground">{value}</p>
            {changeLabel && (
              <p className={`text-xs font-medium ${changeColor}`}>
                {changeLabel}
              </p>
            )}
          </div>
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-300">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}