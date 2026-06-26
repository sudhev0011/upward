import { useState } from "react";
import { useGetAdminPaymentsQuery } from "@/hooks/admin/useGetAdminPaymentsQuery";
import { DataTable } from "@/components/admin/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/StatusBadge";
import { CreditCard, User, UserCheck } from "lucide-react";
import { AdminPaymentRecord } from "@/interfaces/admin/payments.interface";

export default function Payments() {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    transactionStatus: undefined as string | undefined,
  });

  const [selectedPayment, setSelectedPayment] = useState<AdminPaymentRecord | null>(null);

  const { data: response, isLoading } = useGetAdminPaymentsQuery({
    page: params.page,
    limit: params.limit,
    search: params.search,
    transactionStatus: params.transactionStatus === "all" ? undefined : params.transactionStatus,
  });

  const paymentsData = response?.data;

  const mapStatusForBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === "succeeded") return "completed";
    return s as any;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const columns = [
    {
      header: "Transaction ID",
      cell: (p: AdminPaymentRecord) => (
        <span className="font-mono text-xs font-semibold text-muted-foreground select-all">
          {p.transactionId}
        </span>
      ),
    },
    {
      header: "Client",
      cell: (p: AdminPaymentRecord) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7 border">
            <AvatarFallback className="bg-primary/5 text-primary text-[10px]">
              {getInitials(p.clientName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-xs leading-none mb-0.5">{p.clientName}</p>
            <p className="text-[10px] text-muted-foreground">{p.clientEmail}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Provider",
      cell: (p: AdminPaymentRecord) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7 border">
            <AvatarFallback className="bg-primary/5 text-primary text-[10px]">
              {getInitials(p.providerName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-xs leading-none mb-0.5">{p.providerName}</p>
            <p className="text-[10px] text-muted-foreground">{p.providerEmail}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Amount",
      cell: (p: AdminPaymentRecord) => (
        <span className="font-bold text-sm text-foreground">
          ₹{p.amount.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Method",
      cell: (p: AdminPaymentRecord) => (
        <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold">
          {p.paymentType}
        </Badge>
      ),
    },
    {
      header: "Status",
      cell: (p: AdminPaymentRecord) => (
        <StatusBadge status={mapStatusForBadge(p.transactionStatus)} />
      ),
    },
    {
      header: "Date",
      cell: (p: AdminPaymentRecord) => (
        <span className="text-xs text-muted-foreground">
          {new Date(p.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Payments & Ledger</h1>
        <p className="text-sm text-muted-foreground">Monitor checkout transactions, payments, and commission records.</p>
      </div>

      <DataTable
        columns={columns}
        data={paymentsData?.data || []}
        rowKey={(p) => p.id}
        onRowClick={(p) => setSelectedPayment(p)}
        search={params.search}
        onSearchChange={(val) => setParams((prev) => ({ ...prev, search: val, page: 1 }))}
        searchPlaceholder="Search client, provider, transaction id..."
        currentPage={paymentsData?.page || 1}
        totalPages={paymentsData?.totalPages || 1}
        onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
        emptyMessage={isLoading ? "Loading transactions..." : "No transaction history found."}
        filters={
          <div className="flex gap-2">
            <Select
              value={params.transactionStatus || "all"}
              onValueChange={(val) =>
                setParams((p) => ({
                  ...p,
                  transactionStatus: val === "all" ? undefined : val,
                  page: 1,
                }))
              }
            >
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="succeeded">Succeeded</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      {/* ─── TRANSACTION DETAILS DRAWERS ─── */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="sm:max-w-md overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Transaction Details
            </DialogTitle>
            <DialogDescription>
              Detailed invoice metrics and audit ledger.
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-6 pt-2">
              {/* Header card */}
              <div className="rounded-2xl border border-border bg-secondary/10 p-5 text-center">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Amount Transacted
                </p>
                <p className="text-3xl font-extrabold text-foreground">
                  ₹{selectedPayment.amount.toLocaleString()}
                </p>
                <div className="flex justify-center mt-3">
                  <StatusBadge status={mapStatusForBadge(selectedPayment.transactionStatus)} />
                </div>
              </div>

              {/* Transaction details ledger */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Participants
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border border-border/50 rounded-xl bg-card">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        <User className="h-3 w-3" />
                        <span>Client</span>
                      </div>
                      <p className="text-xs font-bold leading-tight">{selectedPayment.clientName}</p>
                      <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 truncate">
                        {selectedPayment.clientEmail}
                      </p>
                    </div>

                    <div className="p-3 border border-border/50 rounded-xl bg-card">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        <UserCheck className="h-3 w-3" />
                        <span>Provider</span>
                      </div>
                      <p className="text-xs font-bold leading-tight">{selectedPayment.providerName}</p>
                      <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 truncate">
                        {selectedPayment.providerEmail}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Ledger Meta
                  </h4>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs">Transaction ID</span>
                      <span className="font-mono text-xs font-semibold text-foreground select-all">
                        {selectedPayment.transactionId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs">Internal ID</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {selectedPayment.id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs">Payment Method</span>
                      <span className="font-semibold text-xs capitalize">{selectedPayment.paymentType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs">Booking Reference</span>
                      <span className="font-mono text-xs font-semibold text-primary truncate max-w-[150px]">
                        {selectedPayment.bookingId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs">Created At</span>
                      <span className="text-xs">
                        {new Date(selectedPayment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {selectedPayment.paidAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-xs">Settled At</span>
                        <span className="text-xs">
                          {new Date(selectedPayment.paidAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button size="sm" variant="outline" onClick={() => setSelectedPayment(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
