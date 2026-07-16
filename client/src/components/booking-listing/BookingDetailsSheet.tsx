import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  AlertTriangle,
  CreditCard,
  FileText,
  RotateCcw,
} from "lucide-react";
import { BookingListItem } from "@/interfaces/bookings/bookings.interface";
import { chatApi } from "@/api/chat.api";
import { useCancelBooking } from "@/hooks/booking/use-cancel-booking";
import { toast } from "sonner";
import { generateAndDownloadInvoice } from "@/utils/invoice";

// Sub-components import layout
import { BookingHeaderProfile } from "./booking-details-sheet-sub/BookingHeaderProfile";
import { BookingLogistics } from "./booking-details-sheet-sub/BookingLogistics";
import { BookingLedger } from "./booking-details-sheet-sub/BookingLedger";
import { BookingCancellationForm } from "./booking-details-sheet-sub/BookingCancellationForm";
import PayRemainingModal from "@/components/booking/PayRemainingModal";
import { useCompleteBooking } from "@/hooks/booking/use-complete-booking";
import RescheduleBookingModal from "./RescheduleBookingModal";

interface BookingDetailsSheetProps {
  booking: BookingListItem | null;
  role: "client" | "provider" | "admin";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30",
  },
  COMPLETED: {
    label: "Completed",
    className:
      "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30",
  },
  PROVIDER_COMPLETED: {
    label: "provider completed",
    className: "bg-yellow-500 border-rose-200 dark:bg-rose-900/30",
  },
};

export const BookingDetailsSheet = ({
  booking,
  role = "client",
  open,
  onOpenChange,
}: BookingDetailsSheetProps) => {
  const navigate = useNavigate();
  const [isMessaging, setIsMessaging] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [showPayRemaining, setShowPayRemaining] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);

  const { mutateAsync: cancelBooking, isPending: isCancelling } =
    useCancelBooking();
  const { mutateAsync: completeBooking, isPending: isCompleting } =
    useCompleteBooking();

  if (!booking) return null;

  const getInitials = (name?: string, fb = "?") =>
    name
      ?.split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || fb;
  const currentStatus = STATUS_CONFIG[booking.status.toUpperCase()] || {
    label: booking.status,
    className: "",
  };

  const handleMessageProvider = async () => {
    if (!booking?.provider?.id) return;
    setIsMessaging(true);
    try {
      const response = await chatApi.findOrCreateConversation(
        booking.provider.id,
      );
      if (response.success && response.data) {
        onOpenChange(false);
        navigate("/client/dashboard/messages", {
          state: { conversationId: response.data.id },
        });
      }
    } catch (e) {
      toast.error(`Failed to start conversation: ${e}`);
    } finally {
      setIsMessaging(false);
    }
  };

  const handleCancelBooking = async (reason: string) => {
    try {
      await cancelBooking({
        bookingId: booking.id,
        role: role === "admin" ? "client" : role,
        reason: reason.trim() || null,
      });
      toast.success("Booking cancelled successfully");
      setShowConfirmCancel(false);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel booking",
      );
    }
  };

  const handleCompleteBooking = async () => {
    try {
      await completeBooking({
        bookingId: booking.id,
        role: "client",
      });

      toast.success("Booking completed successfully!");

      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to complete booking",
      );
    }
  };
  const normalizedStatus = booking.status.toLowerCase();

  const isPending = normalizedStatus === "pending";

  const isConfirmed = normalizedStatus === "confirmed";

  const isProviderCompleted = normalizedStatus === "provider_completed";

  const isClientCompleted = normalizedStatus === "client_completed";

  const isCompleted = normalizedStatus === "completed";

  const canCancel = isPending || isConfirmed;

  const canPayRemaining =
    booking.paymentType === "partial" &&
    booking.remainingAmount > 0 &&
    !["cancelled", "completed", "client_completed"].includes(normalizedStatus);

  const canConfirmCompletion =
    role === "client" && isProviderCompleted && booking.remainingAmount === 0;

  const now = new Date();
  const executionDate = new Date(booking?.startDateTime ?? booking.bookingDate);
  const isLocked =
    role === "client" &&
    isConfirmed &&
    executionDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col h-full bg-background border-l shadow-2xl"
      >
        <div className="p-6 border-b bg-muted/30 flex items-center justify-between">
          <SheetTitle className="text-xl font-bold tracking-tight">
            Booking Details
          </SheetTitle>
          <div className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-md border">
            ID: {booking.bookingId}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <BookingHeaderProfile
            booking={booking}
            currentStatus={currentStatus}
            providerInitials={getInitials(booking.provider.name, "P")}
            clientInitials={getInitials(booking.client.name, "C")}
          />
          <BookingLogistics booking={booking} />

          {booking.requirements?.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Requirements
              </h4>
              <div className="flex flex-wrap gap-2 p-3 border rounded-xl bg-muted/20">
                {booking.requirements.map((req, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="text-xs bg-background px-2.5 py-1 rounded-lg"
                  >
                    {req}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <BookingLedger booking={booking} />

          {booking.notes && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Instructions
              </h4>
              <div className="p-4 rounded-xl border bg-amber-50/20 text-sm leading-relaxed italic text-foreground/80">
                "{booking.notes}"
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-muted/30 flex flex-col gap-2.5">
          {!showConfirmCancel ? (
            <>
              {role === "client" && (
                <Button
                  onClick={handleMessageProvider}
                  disabled={isMessaging}
                  className="w-full gap-2 h-11 font-semibold shadow-sm"
                >
                  <MessageSquare className="h-4 w-4" />{" "}
                  {isMessaging ? "Opening Messenger..." : "Message Provider"}
                </Button>
              )}

              {role === "client" && booking.paidAmount > 0 && (
                <Button
                  variant="outline"
                  onClick={() => generateAndDownloadInvoice(booking)}
                  className="w-full gap-2 h-11 font-semibold border-slate-200 hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-900/40"
                >
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Download Invoice
                </Button>
              )}

              {canPayRemaining && (
                <Button
                  variant="outline"
                  className="w-full gap-2 h-11 text-amber-600 border-amber-200 bg-amber-50/30 hover:bg-amber-50 font-semibold"
                  onClick={() => setShowPayRemaining(true)}
                >
                  <CreditCard className="h-4 w-4" />
                  Pay Remaining Balance ( ₹
                  {booking.remainingAmount.toLocaleString("en-IN")})
                </Button>
              )}

              {canConfirmCompletion && (
                <Button
                  onClick={handleCompleteBooking}
                  disabled={isCompleting}
                  className="w-full gap-2 h-11 font-semibold bg-emerald-600 hover:bg-emerald-700"
                >
                  {isCompleting ? "Completing..." : "Confirm Work Completion"}
                </Button>
              )}

              {isClientCompleted && (
                <div className="w-full rounded-xl border bg-muted/30 p-4 text-center">
                  <p className="text-sm font-medium">
                    Work completed successfully
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    Provider payout is being processed.
                  </p>
                </div>
              )}

              {isCompleted && (
                <div className="w-full rounded-xl border bg-muted/30 p-4 text-center">
                  <p className="text-sm font-medium text-emerald-600">
                    Booking completed
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    Payment settled successfully.
                  </p>
                </div>
              )}

              {canCancel &&
                (isLocked ? (
                  <div className="space-y-2">
                    <Button
                      disabled
                      variant="outline"
                      className="w-full gap-2 h-11 text-muted-foreground/60 bg-muted/20"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reschedule (Locked)
                    </Button>
                    <Button
                      disabled
                      variant="outline"
                      className="w-full gap-2 h-11 text-muted-foreground/60 bg-muted/20"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Cancel Booking (Locked)
                    </Button>
                    <p className="text-[11px] text-rose-500 font-medium text-center px-2">
                      Confirmed bookings can only be cancelled or rescheduled at
                      least 7 days before execution.
                    </p>
                  </div>
                ) : (
                  <>
                    {isConfirmed && (
                      <Button
                        onClick={() => setShowReschedule(true)}
                        variant="outline"
                        className="w-full gap-2 h-11 text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950/30 font-semibold"
                      >
                        <RotateCcw className="h-4 w-4" /> Reschedule Booking
                      </Button>
                    )}
                    <Button
                      onClick={() => setShowConfirmCancel(true)}
                      variant="outline"
                      className="w-full gap-2 h-11 text-rose-600 border-rose-200 hover:bg-rose-50 font-semibold"
                    >
                      <AlertTriangle className="h-4 w-4" /> Cancel Booking
                    </Button>
                  </>
                ))}
            </>
          ) : (
            <BookingCancellationForm
              isCancelling={isCancelling}
              onCancel={handleCancelBooking}
              onBack={() => setShowConfirmCancel(false)}
            />
          )}
        </div>
      </SheetContent>

      <PayRemainingModal
        open={showPayRemaining}
        onClose={() => setShowPayRemaining(false)}
        bookingId={booking.id}
        remainingAmount={booking.remainingAmount}
      />

      {showReschedule && (
        <RescheduleBookingModal
          open={showReschedule}
          onClose={() => setShowReschedule(false)}
          booking={booking}
        />
      )}
    </Sheet>
  );
};
