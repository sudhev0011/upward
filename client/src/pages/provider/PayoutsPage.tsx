import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/provider/dashboard/StatCard";
import { StatusBadge } from "@/components/provider/dashboard/StatusBadge";
import { DollarSign, TrendingUp, Wallet, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

const payoutHistory = [
  { id: "PAY-001", date: "Mar 1, 2026", amount: "$3,200", method: "Bank Transfer", status: "completed" as const },
  { id: "PAY-002", date: "Feb 15, 2026", amount: "$2,800", method: "Bank Transfer", status: "completed" as const },
  { id: "PAY-003", date: "Feb 1, 2026", amount: "$1,950", method: "Bank Transfer", status: "completed" as const },
  { id: "PAY-004", date: "Jan 15, 2026", amount: "$4,100", method: "Bank Transfer", status: "completed" as const },
  { id: "PAY-005", date: "Jan 1, 2026", amount: "$2,400", method: "Bank Transfer", status: "completed" as const },
];

export default function PayoutsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Payouts</h1>
          <p className="text-muted-foreground mt-1.5">Track your earnings and withdrawal history.</p>
        </div>
        <Button className="rounded-xl shadow-lg shadow-primary/20" onClick={() => toast.success("Withdrawal request submitted!")}>
          <ArrowUpRight className="h-4 w-4 mr-2" /> Request Withdrawal
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Available Balance" value="$4,580" change="Ready to withdraw" changeType="neutral" icon={Wallet} />
        <StatCard title="Total Earned" value="$24,580" change="+12% this month" changeType="positive" icon={DollarSign} />
        <StatCard title="Pending" value="$1,200" change="2 orders in progress" changeType="neutral" icon={TrendingUp} />
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground text-base">Payout History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Payout ID</th>
                <th className="text-left p-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="text-left p-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="text-left p-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Method</th>
                <th className="text-left p-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {payoutHistory.map((payout) => (
                <tr key={payout.id} className="border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors duration-200">
                  <td className="p-4 text-sm font-mono text-muted-foreground">{payout.id}</td>
                  <td className="p-4 text-sm text-muted-foreground">{payout.date}</td>
                  <td className="p-4 text-sm font-bold text-card-foreground">{payout.amount}</td>
                  <td className="p-4 text-sm text-muted-foreground">{payout.method}</td>
                  <td className="p-4"><StatusBadge status={payout.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
