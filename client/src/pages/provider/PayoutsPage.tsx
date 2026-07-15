import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { DollarSign, TrendingUp, Wallet } from "lucide-react";
import { useGetPayoutsQuery } from "@/hooks/provider/useGetPayoutsQuery";
import { useCreatePayoutRequest } from "@/hooks/provider/useCreatePayoutRequest";
import { useGetProviderPayoutRequests } from "@/hooks/provider/useGetProviderPayoutRequests";
import { Loading } from "@/components/ui/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function PayoutsPage() {
  const { data: response, isLoading: isLoadingPayouts, error } = useGetPayoutsQuery();
  const { data: requests = [], isLoading: isLoadingRequests } = useGetProviderPayoutRequests();
  const createPayoutRequestMutation = useCreatePayoutRequest();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  if (isLoadingPayouts || isLoadingRequests) {
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

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid withdrawal amount greater than zero.");
      return;
    }

    if (amount > balance) {
      toast.error(`Insufficient balance. You can withdraw up to ₹${balance.toLocaleString()}.`);
      return;
    }

    try {
      await createPayoutRequestMutation.mutateAsync(amount);
      toast.success("Withdrawal request submitted successfully!");
      setWithdrawAmount("");
      setIsDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to submit withdrawal request.");
    }
  };

  const getStatusLabelAndVariant = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "Pending", variant: "pending" as const };
      case "transferred":
        return { label: "Approved & Transferred", variant: "completed" as const };
      case "rejected":
        return { label: "Rejected", variant: "cancelled" as const };
      default:
        return { label: status, variant: "inactive" as const };
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Payouts & Withdrawals
          </h1>
          <p className="text-muted-foreground mt-1.5">
            Track your earnings, check balances, and request wallet withdrawals.
          </p>
        </div>
        <div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            disabled={balance <= 0}
            className="w-full sm:w-auto font-semibold px-6 shadow-md hover:shadow-lg transition-all duration-300"
          >
            Request Withdrawal
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Available Balance"
          value={`₹${balance.toLocaleString()}`}
          change="Cleared balance available for request"
          changeType="neutral"
          icon={Wallet}
        />
        <StatCard
          title="Total Earned"
          value={`₹${totalEarned.toLocaleString()}`}
          change="Accumulated platform earnings"
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="Pending Clearance"
          value={`₹${pendingAmount.toLocaleString()}`}
          change="Awaiting service completion"
          changeType="neutral"
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payout/Ledger History */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-card-foreground text-base font-bold">
              Ledger Statements
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {transactions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No ledger transactions found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/50 bg-secondary/10">
                      <th className="p-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="p-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Date
                      </th>
                      <th className="p-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="p-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Description
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
                          <td className="p-4 text-xs font-mono text-muted-foreground">
                            {tx.id?.slice(-8).toUpperCase() || "N/A"}
                          </td>
                          <td className="p-4 text-xs text-muted-foreground">
                            {dateFormatted}
                          </td>
                          <td
                            className={`p-4 text-xs font-bold ${
                              isCredit ? "text-emerald-500" : "text-rose-500"
                            }`}
                          >
                            {amountText}
                          </td>
                          <td className="p-4 text-xs text-muted-foreground max-w-[200px] truncate">
                            {tx.description}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Withdrawal Requests */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-card-foreground text-base font-bold">
              Withdrawal Requests History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {requests.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No withdrawal requests submitted yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/50 bg-secondary/10">
                      <th className="p-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Date
                      </th>
                      <th className="p-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="p-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="p-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req: any) => {
                      const dateFormatted = new Date(req.createdAt).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "short", day: "numeric" }
                      );
                      const statusConfig = getStatusLabelAndVariant(req.status);

                      return (
                        <tr
                          key={req.id}
                          className="border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors duration-200"
                        >
                          <td className="p-4 text-xs text-muted-foreground">
                            {dateFormatted}
                          </td>
                          <td className="p-4 text-xs font-bold text-foreground">
                            ₹{req.amount.toLocaleString()}
                          </td>
                          <td className="p-4">
                            <StatusBadge status={statusConfig.variant} />
                          </td>
                          <td className="p-4 text-xs text-muted-foreground max-w-[180px] truncate" title={req.adminNotes}>
                            {req.adminNotes || "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Dialog Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request Payout Withdrawal</DialogTitle>
            <DialogDescription>
              Submit a request to withdraw funds from your wallet available balance. The admin will verify and complete a bank transfer manually.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleWithdrawSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-semibold">
                Amount to Withdraw (₹)
              </Label>
              <Input
                id="amount"
                type="number"
                min="1"
                max={balance}
                placeholder={`Max ₹${balance.toLocaleString()}`}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                required
                className="w-full text-lg py-5"
              />
              <p className="text-xs text-muted-foreground">
                Available withdrawable balance: <span className="font-semibold text-foreground">₹{balance.toLocaleString()}</span>
              </p>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createPayoutRequestMutation.isPending}
              >
                {createPayoutRequestMutation.isPending ? "Submitting..." : "Confirm Request"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
