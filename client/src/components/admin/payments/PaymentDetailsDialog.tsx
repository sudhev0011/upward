import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/StatusBadge";
import { CreditCard, User, UserCheck } from "lucide-react";
import { AdminPaymentRecord } from "@/interfaces/admin/payments.interface";
import { mapPaymentStatusForBadge } from "@/utils/admin/payments.helper";

interface PaymentDetailsDialogProps {
  payment: AdminPaymentRecord | null;
  open: boolean;
  onClose: () => void;
}

export function PaymentDetailsDialog({
  payment,
  open,
  onClose,
}: PaymentDetailsDialogProps) {
  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
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

        <div className="space-y-6 pt-2">
          <div className="rounded-2xl border border-border bg-secondary/10 p-5 text-center">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Amount Transacted
            </p>
            <p className="text-3xl font-extrabold text-foreground">
              ₹{payment.amount.toLocaleString()}
            </p>
            <div className="flex justify-center mt-3">
              <StatusBadge
                status={mapPaymentStatusForBadge(payment.transactionStatus)}
              />
            </div>
          </div>

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
                  <p className="text-xs font-bold leading-tight">
                    {payment.clientName}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 truncate">
                    {payment.clientEmail}
                  </p>
                </div>

                <div className="p-3 border border-border/50 rounded-xl bg-card">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <UserCheck className="h-3 w-3" />
                    <span>Provider</span>
                  </div>
                  <p className="text-xs font-bold leading-tight">
                    {payment.providerName}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 truncate">
                    {payment.providerEmail}
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
                  <span className="text-muted-foreground text-xs">
                    Transaction ID
                  </span>
                  <span className="font-mono text-xs font-semibold text-foreground select-all">
                    {payment.transactionId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-xs">
                    Internal ID
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {payment.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-xs">
                    Payment Method
                  </span>
                  <span className="font-semibold text-xs capitalize">
                    {payment.paymentType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-xs">
                    Booking Reference
                  </span>
                  <span className="font-mono text-xs font-semibold text-primary truncate max-w-[150px]">
                    {payment.bookingId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-xs">
                    Created At
                  </span>
                  <span className="text-xs">
                    {new Date(payment.createdAt).toLocaleString()}
                  </span>
                </div>
                {payment.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-xs">
                      Settled At
                    </span>
                    <span className="text-xs">
                      {new Date(payment.paidAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button size="sm" variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
