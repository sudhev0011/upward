import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { DollarSign, TrendingUp, Wallet } from "lucide-react";
import { useGetPayoutsQuery } from "@/hooks/provider/useGetPayoutsQuery";
import { Loading } from "@/components/ui/Loading";

export default function PayoutsPage() {
  const { data: response, isLoading, error } = useGetPayoutsQuery();

  if (isLoading) {
    return <Loading message="Loading payouts information..." />;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 font-semibold bg-red-50 dark:bg-red-950/20 rounded-xl">
        Failed to load payouts data. Please try again.
      </div>
    );
  }

  const payouts = response?.data;
  const balance = payouts?.balance ?? 0;
  const totalEarned = payouts?.totalEarned ?? 0;
  const pendingAmount = payouts?.pendingAmount ?? 0;
  const transactions = payouts?.transactions ?? [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Payouts
          </h1>
          <p className="text-muted-foreground mt-1.5">
            Track your earnings and payout history.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Available Balance"
          value={`₹${balance.toLocaleString()}`}
          change="Cleared balance"
          changeType="neutral"
          icon={Wallet}
        />
        <StatCard
          title="Total Earned"
          value={`₹${totalEarned.toLocaleString()}`}
          change="Accumulated earnings"
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="Pending"
          value={`₹${pendingAmount.toLocaleString()}`}
          change="Pending final service completion"
          changeType="neutral"
          icon={TrendingUp}
        />
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground text-base">
            Payout History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No transactions found.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="text-left p-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left p-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-left p-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Method
                  </th>
                  <th className="text-left p-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const dateFormatted = new Date(tx.createdAt).toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "short", day: "numeric" }
                  );
                  const isCredit = tx.type === "credit";
                  const amountText = `${isCredit ? "+" : "-"}₹${tx.amount.toLocaleString()}`;

                  return (
                    <tr
                      key={tx.id}
                      className="border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors duration-200"
                    >
                      <td className="p-4 text-sm font-mono text-muted-foreground">
                        {tx.id}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {dateFormatted}
                      </td>
                      <td
                        className={`p-4 text-sm font-bold ${
                          isCredit ? "text-emerald-500" : "text-card-foreground"
                        }`}
                      >
                        {amountText}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {tx.type === "debit" ? "Bank Transfer" : "Booking Earnings"}
                      </td>
                      <td className="p-4">
                        <StatusBadge status="completed" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

