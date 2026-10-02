import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/StatusBadge";
import { DollarSign } from "lucide-react";
import { AdminPayoutRequestItem } from "@/interfaces/admin/payout-request.interface";
import { getPayoutRequestStatusVariant } from "@/utils/admin/payments.helper";

interface PayoutRequestDialogProps {
  request: AdminPayoutRequestItem | null;
  open: boolean;
  onClose: () => void;
  onProcess: (status: "transferred" | "rejected", adminNotes?: string) => Promise<void>;
  isProcessing?: boolean;
}

export function PayoutRequestDialog({
  request,
  open,
  onClose,
  onProcess,
  isProcessing = false,
}: PayoutRequestDialogProps) {
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    if (request) {
      setAdminNotes(request.payoutRequest.adminNotes || "");
    } else {
      setAdminNotes("");
    }
  }, [request]);

  if (!request) return null;

  const handleAction = async (status: "transferred" | "rejected") => {
    await onProcess(status, adminNotes.trim() || undefined);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
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

        <div className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 items-start">
            {/* LEFT SIDE: Snapshot Banner & Form Entry */}
            <div className="md:col-span-2 space-y-5">
              <div className="rounded-xl border border-border bg-secondary/10 p-5 text-center space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Withdrawal Amount
                </p>
                <p className="text-3xl font-black text-foreground tracking-tight">
                  ₹{request.payoutRequest.amount.toLocaleString()}
                </p>
                <div className="flex justify-center pt-1">
                  <StatusBadge
                    status={getPayoutRequestStatusVariant(
                      request.payoutRequest.status
                    )}
                  />
                </div>
              </div>

              {request.payoutRequest.status === "pending" ? (
                <div className="space-y-2">
                  <Label
                    htmlFor="adminNotes"
                    className="text-xs font-semibold text-muted-foreground"
                  >
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
                  <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Log Notes
                  </h4>
                  <p className="text-xs p-3 bg-secondary/30 border border-border/40 rounded-lg text-muted-foreground leading-relaxed">
                    {request.payoutRequest.adminNotes || "No notes registered."}
                  </p>
                </div>
              )}
            </div>

            {/* RIGHT SIDE: Details & Metadata */}
            <div className="md:col-span-3 space-y-5 border-t md:border-t-0 md:border-l border-border/60 pt-5 md:pt-0 md:pl-6">
              {/* Provider Row */}
              <div>
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Provider Details
                </h4>
                <div className="p-3 border border-border/50 rounded-xl bg-card">
                  <p className="text-xs font-bold text-foreground">
                    {request.provider.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {request.provider.email}
                  </p>
                </div>
              </div>

              {/* Bank Coordinates */}
              <div>
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Bank Destination
                </h4>
                {request.bankDetails ? (
                  <div className="border border-border/50 rounded-xl bg-card divide-y divide-border/40 text-xs">
                    <div className="p-2.5 flex justify-between items-center gap-4">
                      <span className="text-muted-foreground text-[11px] shrink-0">
                        Bank
                      </span>
                      <span className="font-medium text-foreground text-right truncate">
                        {request.bankDetails.bankName}
                      </span>
                    </div>
                    <div className="p-2.5 flex justify-between items-center gap-4">
                      <span className="text-muted-foreground text-[11px] shrink-0">
                        Beneficiary
                      </span>
                      <span className="font-medium text-foreground text-right truncate">
                        {request.bankDetails.accountHolderName}
                      </span>
                    </div>

                    <div className="p-2.5 flex justify-between items-center gap-4">
                      <span className="text-muted-foreground text-[11px] shrink-0">
                        Account No.
                      </span>
                      <span
                        className="font-mono font-semibold text-foreground select-all bg-muted/60 px-2 py-1 rounded text-[11px] max-w-[180px] sm:max-w-[220px] truncate block"
                        title={request.bankDetails.accountNumber}
                      >
                        {request.bankDetails.accountNumber.length > 14
                          ? `${request.bankDetails.accountNumber.slice(0, 6)}...${request.bankDetails.accountNumber.slice(-4)}`
                          : request.bankDetails.accountNumber}
                      </span>
                    </div>

                    <div className="p-2.5 flex justify-between items-center gap-4">
                      <span className="text-muted-foreground text-[11px] shrink-0">
                        IFSC Code
                      </span>
                      <span
                        className="font-mono font-semibold text-foreground select-all bg-muted/60 px-2 py-1 rounded text-[11px] max-w-[180px] sm:max-w-[220px] truncate block"
                        title={request.bankDetails.ifscCode}
                      >
                        {request.bankDetails.ifscCode.length > 11
                          ? `${request.bankDetails.ifscCode.slice(0, 4)}...${request.bankDetails.ifscCode.slice(-4)}`
                          : request.bankDetails.ifscCode}
                      </span>
                    </div>

                    {request.bankDetails.passbookUrl && (
                      <div className="p-2.5 flex justify-between items-center bg-primary/[0.02]">
                        <span className="text-muted-foreground text-[11px]">
                          Verification Doc
                        </span>
                        <a
                          href={request.bankDetails.passbookUrl}
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
            {request.payoutRequest.status === "pending" ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="px-4 sm:mr-auto"
                  onClick={onClose}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="px-4"
                  disabled={isProcessing}
                  onClick={() => handleAction("rejected")}
                >
                  Reject & Refund
                </Button>
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4"
                  disabled={isProcessing}
                  onClick={() => handleAction("transferred")}
                >
                  Mark as Transferred
                </Button>
              </>
            ) : (
              <Button size="sm" variant="outline" className="px-5" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
