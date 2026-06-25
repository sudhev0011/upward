import { useState } from "react";
import { toast } from "sonner";
import { useCancelBooking } from "@/hooks/booking/use-cancel-booking";
import { BookingListItem } from "@/interfaces/bookings/bookings.interface";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import {
  User,
  MapPin,
  Briefcase,
  Calendar,
  CreditCard,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { useCompleteBooking } from "@/hooks/booking/use-complete-booking";
interface OrderDetailsDialogProps {
  order: BookingListItem | null;
  onClose: () => void;
  mapStatusStyle: (
    status: string,
  ) => "active" | "pending" | "completed" | "cancelled" | "failed" | "provider completed" | "client completed";
}

export function OrderDetailsDialog({
  order,
  onClose,
  mapStatusStyle,
}: OrderDetailsDialogProps) {
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const { mutateAsync: cancelBooking, isPending: isCancelling } =
    useCancelBooking();
  const { mutateAsync: completeBooking, isPending: isCompleting } =
    useCompleteBooking();

  if (!order) return null;

  const handleConfirmCancel = async () => {
    try {
      await cancelBooking({
        bookingId: order.id,
        role: "provider",
        reason: cancelReason.trim() || null,
      });
      toast.success(
        "Order cancelled successfully, payment refunded to client's wallet.",
      );
      setShowConfirmCancel(false);
      setCancelReason("");
      onClose();
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : "Failed to cancel booking";
      toast.error(errMsg);
    }
  };

  const handleCompleteBooking = async () => {
    try {
      await completeBooking({
        bookingId: order.id,
        role: "provider",
      });

      toast.success("Booking marked as completed successfully!");

      onClose();
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : "Failed to complete booking";

      toast.error(errMsg);
    }
  };

  const normalizedStatus = order.status.toUpperCase();

  const isCancelable = ["PENDING", "CONFIRMED"].includes(normalizedStatus);

  const isCompletable = normalizedStatus === "CONFIRMED";

  const isWaitingForClient = normalizedStatus === "PROVIDER_COMPLETED";

  const isCompleted = normalizedStatus === "COMPLETED";

  const formattedTime = order.startDateTime
    ? new Date(order.startDateTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Flexible / Not set";

  return (
    <Dialog open={!!order} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl bg-card border-border/50 max-h-[85vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">
                Order Overview
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">
                ID: {order.bookingId}
              </p>
            </div>
            <StatusBadge status={mapStatusStyle(order.status)} />
          </div>
        </DialogHeader>

        <Separator className="bg-border/50" />

        {/* Client Info */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Client Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <p className="text-[11px] text-muted-foreground">Name</p>
                <p className="text-sm font-medium text-card-foreground">
                  {order.client.name || "Client"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {order.client.email}
                </p>
              </div>
            </div>

            {/* Safe Guarded Location Mapping */}
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <p className="text-[11px] text-muted-foreground">Location</p>
                <p className="text-sm font-medium text-card-foreground leading-normal">
                  {order.location?.address ? (
                    order.location.address
                  ) : (
                    <span className="text-muted-foreground italic font-normal text-xs">
                      No service location specified (Remote/Online)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Service Details */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Service Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Briefcase className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <p className="text-[11px] text-muted-foreground">
                  Service Mode
                </p>
                <p className="text-sm font-medium text-card-foreground">
                  {order.service.name}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  Mode: {order.service.mode}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <p className="text-[11px] text-muted-foreground">
                  Date & Scheduled Time
                </p>
                <p className="text-sm font-medium text-card-foreground">
                  {order.bookingDate}
                </p>
                <p className="text-xs text-muted-foreground">{formattedTime}</p>
              </div>
            </div>
          </div>
        </div>

        {order.notes && (
          <>
            <Separator className="bg-border/50" />
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> Special
                Instructions
              </h3>
              <div className="bg-secondary/30 rounded-xl p-4 border border-border/30">
                <p className="text-sm text-card-foreground leading-relaxed">
                  {order.notes}
                </p>
              </div>
            </div>
          </>
        )}

        <Separator className="bg-border/50" />

        {/* Payment Details */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" /> Financials
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-secondary/30 rounded-xl p-4 border border-border/30 text-center">
              <p className="text-[11px] text-muted-foreground">
                Total Valuation
              </p>
              <p className="text-lg font-bold text-card-foreground mt-1">
                ₹{order.totalAmount.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="bg-secondary/30 rounded-xl p-4 border border-border/30 text-center">
              <p className="text-[11px] text-muted-foreground">Liquid Paid</p>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                ₹{order.paidAmount.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="bg-secondary/30 rounded-xl p-4 border border-border/30 text-center">
              <p className="text-[11px] text-muted-foreground">
                Remaining Balance
              </p>
              <p className="text-sm font-semibold text-card-foreground mt-1">
                ₹{order.remainingAmount.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Actions Section */}
        <div className="pt-2">
          {!showConfirmCancel ? (
            <div className="flex gap-3">
              {isCancelable && (
                <Button
                  variant="destructive"
                  onClick={() => setShowConfirmCancel(true)}
                  className="flex-1 gap-2 h-11 font-medium rounded-xl shadow-sm"
                >
                  <AlertTriangle className="h-4 w-4" /> Cancel Booking
                </Button>
              )}
              {isCompletable && (
                <Button
                  onClick={handleCompleteBooking}
                  disabled={isCompleting}
                  className="flex-1 gap-2 h-11 font-medium rounded-xl bg-[#10B981] hover:bg-[#059669] text-white shadow-sm"
                >
                  {isCompleting ? "Completing..." : "Complete Booking"}
                </Button>
              )}

              {isWaitingForClient && (
                <div className="flex-1 rounded-xl border border-border bg-secondary/30 p-3 text-center">
                  <p className="text-sm text-muted-foreground">
                    Waiting for client confirmation
                  </p>
                </div>
              )}

              {isCompleted && (
                <div className="flex-1 rounded-xl border border-border bg-secondary/30 p-3 text-center">
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    Payout released successfully
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 p-4 border border-rose-100 dark:border-rose-950/20 bg-rose-50/10 dark:bg-rose-950/5 rounded-2xl">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider block mb-1.5">
                  Specify Cancellation Reason (Optional)
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Provide details about why this booking is being cancelled..."
                  className="w-full min-h-[80px] text-sm p-3 border rounded-xl bg-background resize-none focus:outline-none focus:ring-1 focus:ring-destructive dark:border-zinc-800"
                  maxLength={500}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowConfirmCancel(false);
                    setCancelReason("");
                  }}
                  className="flex-1 h-11 font-medium rounded-xl"
                  disabled={isCancelling}
                >
                  Keep Booking
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmCancel}
                  className="flex-1 h-11 font-medium rounded-xl gap-2 shadow-sm"
                  disabled={isCancelling}
                >
                  {isCancelling ? "Cancelling..." : "Yes, Cancel Order"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
