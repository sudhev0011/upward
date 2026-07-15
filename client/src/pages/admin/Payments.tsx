import { useState } from "react";
import { useGetAdminPaymentsQuery } from "@/hooks/admin/useGetAdminPaymentsQuery";
import { useGetAdminPayoutRequests } from "@/hooks/admin/useGetAdminPayoutRequests";
import { useProcessPayoutRequest } from "@/hooks/admin/useProcessPayoutRequest";
import { DataTable } from "@/components/admin/DataTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/StatusBadge";
import { CreditCard, User, UserCheck, DollarSign } from "lucide-react";
import { AdminPaymentRecord } from "@/interfaces/admin/payments.interface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Payments() {
  const [activeTab, setActiveTab] = useState<"payments" | "payout-requests">("payments");
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    transactionStatus: undefined as string | undefined,
  });

  const [selectedPayment, setSelectedPayment] = useState<AdminPaymentRecord | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const { data: response, isLoading: isLoadingPayments } = useGetAdminPaymentsQuery({
    page: params.page,
    limit: params.limit,
    search: params.search,
    transactionStatus: params.transactionStatus === "all" ? undefined : params.transactionStatus,
  });

  const { data: payoutRequests = [], isLoading: isLoadingPayoutRequests } = useGetAdminPayoutRequests();
  const processPayoutRequestMutation = useProcessPayoutRequest();

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

  const handleProcessRequest = async (status: "transferred" | "rejected") => {
    if (!selectedRequest) return;

    try {
      await processPayoutRequestMutation.mutateAsync({
        id: selectedRequest.payoutRequest.id,
        data: {
          status,
          adminNotes: adminNotes.trim() || undefined,
        },
      });

      toast.success(
        status === "transferred"
          ? "Payout marked as transferred successfully!"
          : "Payout request rejected and wallet refunded successfully."
      );
      setAdminNotes("");
      setSelectedRequest(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to process payout request.");
    }
  };

  const paymentColumns = [
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

  const getPayoutRequestStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "pending";
      case "transferred":
        return "completed";
      case "rejected":
        return "cancelled";
      default:
        return "inactive";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Payments & Withdrawals</h1>
        <p className="text-sm text-muted-foreground">
          Monitor checkout ledger transactions and process provider withdrawal requests.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="payments">Payments Ledger</TabsTrigger>
          <TabsTrigger value="payout-requests">Payout Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="mt-4">
          <DataTable
            columns={paymentColumns}
            data={paymentsData?.data || []}
            rowKey={(p) => p.id}
            onRowClick={(p) => setSelectedPayment(p)}
            search={params.search}
            onSearchChange={(val) => setParams((prev) => ({ ...prev, search: val, page: 1 }))}
            searchPlaceholder="Search client, provider, transaction id..."
            currentPage={paymentsData?.page || 1}
            totalPages={paymentsData?.totalPages || 1}
            onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
            emptyMessage={isLoadingPayments ? "Loading transactions..." : "No transaction history found."}
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
        </TabsContent>

        <TabsContent value="payout-requests" className="mt-4">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {isLoadingPayoutRequests ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                Loading withdrawal requests...
              </div>
            ) : payoutRequests.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No withdrawal requests found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-secondary/10">
                      <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                        Provider
                      </th>
                      <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                        Bank Details
                      </th>
                      <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                        Date Requested
                      </th>
                      <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                        Status
                      </th>
                      <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payoutRequests.map((req: any) => {
                      const dateFormatted = new Date(req.payoutRequest.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });

                      return (
                        <tr
                          key={req.payoutRequest.id}
                          onClick={() => setSelectedRequest(req)}
                          className="border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors duration-200 cursor-pointer"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7 border">
                                <AvatarFallback className="bg-primary/5 text-primary text-[10px]">
                                  {getInitials(req.provider.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-xs leading-none mb-0.5">{req.provider.name}</p>
                                <p className="text-[10px] text-muted-foreground">{req.provider.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-xs">
                            {req.bankDetails ? (
                              <div>
                                <p className="font-medium text-foreground">{req.bankDetails.bankName}</p>
                                <p className="text-[10px] text-muted-foreground">Acct: {req.bankDetails.accountNumber}</p>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-xs italic">No bank info</span>
                            )}
                          </td>
                          <td className="p-4 text-xs text-muted-foreground">{dateFormatted}</td>
                          <td className="p-4 font-bold text-foreground">₹{req.payoutRequest.amount.toLocaleString()}</td>
                          <td className="p-4">
                            <StatusBadge status={getPayoutRequestStatusVariant(req.payoutRequest.status)} />
                          </td>
                          <td className="p-4 text-xs text-muted-foreground max-w-[150px] truncate" title={req.payoutRequest.adminNotes}>
                            {req.payoutRequest.adminNotes || "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* ─── PAYMENTS LEDGER DETAILS DRAWER ─── */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="sm:max-w-md overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Transaction Details
            </DialogTitle>
            <DialogDescription>Detailed invoice metrics and audit ledger.</DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-6 pt-2">
              <div className="rounded-2xl border border-border bg-secondary/10 p-5 text-center">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Amount Transacted
                </p>
                <p className="text-3xl font-extrabold text-foreground">₹{selectedPayment.amount.toLocaleString()}</p>
                <div className="flex justify-center mt-3">
                  <StatusBadge status={mapStatusForBadge(selectedPayment.transactionStatus)} />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Participants</h4>
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
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Ledger Meta</h4>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs">Transaction ID</span>
                      <span className="font-mono text-xs font-semibold text-foreground select-all">
                        {selectedPayment.transactionId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs">Internal ID</span>
                      <span className="font-mono text-xs text-muted-foreground">{selectedPayment.id}</span>
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
                      <span className="text-xs">{new Date(selectedPayment.createdAt).toLocaleString()}</span>
                    </div>
                    {selectedPayment.paidAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-xs">Settled At</span>
                        <span className="text-xs">{new Date(selectedPayment.paidAt).toLocaleString()}</span>
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

      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
  <DialogContent className="sm:max-w-xl md:max-w-3xl p-6 md:p-8 overflow-hidden gap-0">
    <DialogHeader className="pb-4 border-b border-border/60">
      <DialogTitle className="flex items-center gap-2.5 text-lg font-bold">
        <DollarSign className="h-5 w-5 text-primary" />
        Process Payout Request
      </DialogTitle>
      <DialogDescription className="text-xs text-muted-foreground">
        Review details, complete manual bank transfer, and process request.
      </DialogDescription>
    </DialogHeader>

    {selectedRequest && (
      <div className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 items-start">
          
          {/* LEFT SIDE: Snapshot Banner & Form Entry */}
          <div className="md:col-span-2 space-y-5">
            <div className="rounded-xl border border-border bg-secondary/10 p-5 text-center space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Withdrawal Amount
              </p>
              <p className="text-3xl font-black text-foreground tracking-tight">
                ₹{selectedRequest.payoutRequest.amount.toLocaleString()}
              </p>
              <div className="flex justify-center pt-1">
                <StatusBadge status={getPayoutRequestStatusVariant(selectedRequest.payoutRequest.status)} />
              </div>
            </div>

            {selectedRequest.payoutRequest.status === "pending" ? (
              <div className="space-y-2">
                <Label htmlFor="adminNotes" className="text-xs font-semibold text-muted-foreground">
                  Reference / Transfer ID
                </Label>
                <Input
                  id="adminNotes"
                  placeholder="Enter bank Txn ID..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full text-xs h-9"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Log Notes</h4>
                <p className="text-xs p-3 bg-secondary/30 border border-border/40 rounded-lg text-muted-foreground leading-relaxed">
                  {selectedRequest.payoutRequest.adminNotes || "No notes registered."}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Details & Metadata */}
          <div className="md:col-span-3 space-y-5 border-t md:border-t-0 md:border-l border-border/60 pt-5 md:pt-0 md:pl-6">
            {/* Provider Row */}
            <div>
              <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Provider Details</h4>
              <div className="p-3 border border-border/50 rounded-xl bg-card">
                <p className="text-xs font-bold text-foreground">{selectedRequest.provider.name}</p>
                <p className="text-[11px] text-muted-foreground">{selectedRequest.provider.email}</p>
              </div>
            </div>

            {/* Bank Coordinates with Middle-Truncation to fit values perfectly */}
            <div>
              <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Bank Destination</h4>
              {selectedRequest.bankDetails ? (
                <div className="border border-border/50 rounded-xl bg-card divide-y divide-border/40 text-xs">
                  <div className="p-2.5 flex justify-between items-center gap-4">
                    <span className="text-muted-foreground text-[11px] shrink-0">Bank</span>
                    <span className="font-medium text-foreground text-right truncate">{selectedRequest.bankDetails.bankName}</span>
                  </div>
                  <div className="p-2.5 flex justify-between items-center gap-4">
                    <span className="text-muted-foreground text-[11px] shrink-0">Beneficiary</span>
                    <span className="font-medium text-foreground text-right truncate">{selectedRequest.bankDetails.accountHolderName}</span>
                  </div>
                  
                  {/* Account Number with Max Width + Middle Truncation */}
                  <div className="p-2.5 flex justify-between items-center gap-4">
                    <span className="text-muted-foreground text-[11px] shrink-0">Account No.</span>
                    <span 
                      className="font-mono font-semibold text-foreground select-all bg-muted/60 px-2 py-1 rounded text-[11px] max-w-[180px] sm:max-w-[220px] truncate block"
                      title={selectedRequest.bankDetails.accountNumber}
                    >
                      {selectedRequest.bankDetails.accountNumber.length > 14 
                        ? `${selectedRequest.bankDetails.accountNumber.slice(0, 6)}...${selectedRequest.bankDetails.accountNumber.slice(-4)}`
                        : selectedRequest.bankDetails.accountNumber}
                    </span>
                  </div>

                  {/* IFSC Code with Max Width + Middle Truncation */}
                  <div className="p-2.5 flex justify-between items-center gap-4">
                    <span className="text-muted-foreground text-[11px] shrink-0">IFSC Code</span>
                    <span 
                      className="font-mono font-semibold text-foreground select-all bg-muted/60 px-2 py-1 rounded text-[11px] max-w-[180px] sm:max-w-[220px] truncate block"
                      title={selectedRequest.bankDetails.ifscCode}
                    >
                      {selectedRequest.bankDetails.ifscCode.length > 11 
                        ? `${selectedRequest.bankDetails.ifscCode.slice(0, 4)}...${selectedRequest.bankDetails.ifscCode.slice(-4)}`
                        : selectedRequest.bankDetails.ifscCode}
                    </span>
                  </div>
                  
                  {selectedRequest.bankDetails.passbookUrl && (
                    <div className="p-2.5 flex justify-between items-center bg-primary/[0.02]">
                      <span className="text-muted-foreground text-[11px]">Verification Doc</span>
                      <a
                        href={selectedRequest.bankDetails.passbookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-primary font-bold hover:underline"
                      >
                        View Passbook
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 border border-dashed border-border rounded-xl text-center text-xs text-muted-foreground italic">
                  No bank details linked.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* BOTTOM ACTION BUTTONS BAR */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6 pt-4 border-t border-border/60">
          {selectedRequest.payoutRequest.status === "pending" ? (
            <>
              <Button size="sm" variant="outline" className="px-4 sm:mr-auto" onClick={() => setSelectedRequest(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="px-4"
                disabled={processPayoutRequestMutation.isPending}
                onClick={() => handleProcessRequest("rejected")}
              >
                Reject & Refund
              </Button>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4"
                disabled={processPayoutRequestMutation.isPending}
                onClick={() => handleProcessRequest("transferred")}
              >
                Mark as Transferred
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" className="px-5" onClick={() => setSelectedRequest(null)}>
              Close
            </Button>
          )}
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>

        
        
      
    </div>
  );
}
