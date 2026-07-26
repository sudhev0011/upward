import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProviderSubscriptionDto } from "@/api/subscription.api";

interface BillingHistoryTableProps {
  history: ProviderSubscriptionDto[];
}

export function BillingHistoryTable({ history }: BillingHistoryTableProps) {
  return (
    <Card className="border bg-card/15 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b bg-muted/20 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Interval Start</th>
              <th className="px-6 py-4">Interval End</th>
              <th className="px-6 py-4">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y text-slate-700">
            {history.map((h) => (
              <tr key={h.id} className="hover:bg-muted/10 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">
                  {h.stripePaymentIntentId
                    ? h.stripePaymentIntentId.slice(-12).toUpperCase()
                    : "PENDING_CHECKOUT"}
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant={
                      h.status === "active"
                        ? "default"
                        : h.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                    className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5"
                  >
                    {h.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-xs">
                  {h.startDate
                    ? new Date(h.startDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="px-6 py-4 text-xs">
                  {h.endDate
                    ? new Date(h.endDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="px-6 py-4 font-bold text-xs">₹{h.amount}</td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground italic text-xs"
                >
                  No invoices found in your billing history.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}