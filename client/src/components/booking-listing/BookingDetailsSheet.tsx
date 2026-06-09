import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { BookingListItem } from "@/interfaces/bookings/bookings.interface";
import { chatApi } from "@/api/chat.api";
import { cn } from "@/lib/utils";
import { useCancelBooking } from "@/hooks/booking/use-cancel-booking";
import { toast } from "sonner";

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
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400",
  },
  CONFIRMED: {
    label: "Confirmed",
    className:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400",
  },
  COMPLETED: {
    label: "Completed",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400",
  },
  CANCELLED: {
    label: "Cancelled",
    className:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400",
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
  const [cancelReason, setCancelReason] = useState("");

  const { mutateAsync: cancelBooking, isPending: isCancelling } =
    useCancelBooking();

  if (!booking) return null;

  const providerInitials =
    booking.provider.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "P";

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
    } catch (error) {
      toast.error(`Failed to start conversation: ${error}`);
    } finally {
      setIsMessaging(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;
    try {
      await cancelBooking({
        bookingId: booking.id,
        role: role === "admin" ? "client" : role,
        reason: cancelReason.trim() || null,
      });
      toast.success("Booking cancelled successfully");
      setShowConfirmCancel(false);
      setCancelReason("");
      onOpenChange(false);
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : "Failed to cancel booking";
      toast.error(errMsg);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col h-full bg-background border-l"
      >
        <div className="p-6 border-b bg-slate-50/50 dark:bg-zinc-900/40">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold tracking-tight">
              Booking Overview
            </SheetTitle>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Info Container Block */}
          <div className="flex items-start gap-4 p-4 border rounded-xl bg-background/50 backdrop-blur-sm">
            <Avatar className="h-14 w-14 rounded-xl border shadow-sm">
              <AvatarFallback className="rounded-xl font-black text-slate-700 bg-slate-100 dark:bg-zinc-800 dark:text-zinc-200">
                {providerInitials}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1 min-w-0">
              <h3 className="font-bold text-lg text-slate-900 dark:text-zinc-50 truncate leading-snug">
                {booking.service.name}
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                Provided by{" "}
                <span className="text-foreground font-semibold">
                  {booking.provider.name}
                </span>
              </p>

              <div className="flex flex-wrap gap-1.5 pt-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs py-0.5 font-medium rounded-md uppercase tracking-wide",
                    currentStatus.className,
                  )}
                >
                  {currentStatus.label}
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-xs py-0.5 rounded-md font-normal"
                >
                  {booking.service.mode}
                </Badge>
              </div>
            </div>
          </div>

          {/* Schedule Segment details block layout */}
          {/* Logistics & Schedule */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Logistics & Schedule
            </h4>
            <div className="rounded-xl border bg-background/50 divide-y overflow-hidden">
              {/* Date — always shown */}
              <div className="flex items-center gap-3 p-3.5 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Date</span>
                  <span className="font-medium">{booking.bookingDate}</span>
                </div>
              </div>

              {/* Time slot — onsite only */}
              {booking.bookingMode === "onsite" && booking.startDateTime && (
                <div className="flex items-center gap-3 p-3.5 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      Time slot
                    </span>
                    <span className="font-medium">
                      {new Date(booking.startDateTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {booking.endDateTime && (
                        <>
                          {" "}
                          —{" "}
                          {new Date(booking.endDateTime).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Location — onsite only */}
              {booking.bookingMode === "onsite" && booking.location && (
                <div className="flex items-start gap-3 p-3.5 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      Location
                    </span>
                    <span className="font-medium leading-normal pt-0.5">
                      {booking.location.address}
                    </span>
                    {(booking.location.city || booking.location.country) && (
                      <span className="text-xs text-muted-foreground mt-0.5">
                        {[
                          booking.location.city,
                          booking.location.state,
                          booking.location.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Requirements — both modes, only if present */}
          {booking?.requirements?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Requirements
              </h4>
              <div className="flex flex-wrap gap-2">
                {booking.requirements.map((req, i) => (
                  <span
                    key={i}
                    className="text-xs bg-primary/10 text-primary border border-primary/20 rounded-lg px-2.5 py-1 font-medium"
                  >
                    {req}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Financials & Balance Invoicing breakdown block layout */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Ledger Breakdown
            </h4>
            <div className="rounded-xl border bg-slate-50/40 dark:bg-zinc-900/20 p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Base service valuation
                </span>
                <span className="font-medium text-slate-900 dark:text-zinc-100">
                  ₹{booking.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Liquid funds settled
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  - ₹{booking.paidAmount.toLocaleString("en-IN")}
                </span>
              </div>

              <Separator className="my-1" />

              <div className="flex items-center justify-between text-sm pt-1">
                <span className="font-bold text-slate-800 dark:text-zinc-200">
                  Outstanding Balance
                </span>
                <span
                  className={cn(
                    "font-black text-base",
                    booking.remainingAmount > 0
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-slate-900 dark:text-zinc-50",
                  )}
                >
                  ₹{booking.remainingAmount.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2 text-xs font-medium text-slate-500 border-t border-dashed mt-2">
                <CreditCard className="h-3.5 w-3.5 opacity-80" />
                <span>
                  Settled using{" "}
                  <span className="font-semibold text-foreground uppercase">
                    {booking.paymentType}
                  </span>
                </span>
                <span className="ml-auto uppercase text-[10px] tracking-wider px-1.5 py-0.5 bg-background border rounded font-bold text-muted-foreground">
                  {booking.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Execution Strategy Notes Panel layout block */}
          {booking.notes && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Client Instructions
              </h4>
              <div className="p-4 rounded-xl border bg-amber-50/20 dark:bg-amber-950/10 border-amber-100 dark:border-amber-950/40 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                {booking.notes}
              </div>
            </div>
          )}
        </div>

        {/* Action Panel Sheet Footing Controls panel block layout */}
        <div className="p-4 border-t bg-slate-50/50 dark:bg-zinc-900/40 flex flex-col gap-2.5">
          {!showConfirmCancel ? (
            <>
              <Button
                onClick={handleMessageProvider}
                disabled={isMessaging}
                className="w-full gap-2 h-11 font-medium shadow-sm"
              >
                <MessageSquare className="h-4 w-4" />
                {isMessaging ? "Initializing..." : "Message Provider"}
              </Button>

              {(booking.status.toLowerCase() === "pending" ||
                booking.status.toLowerCase() === "confirmed") &&
                (() => {
                  const now = new Date();
                  const executionDate = new Date(booking?.startDateTime ?? booking.bookingDate);
                  const diffTime = executionDate.getTime() - now.getTime();
                  const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
                  const isLocked =
                    role === "client" &&
                    booking.status.toLowerCase() === "confirmed" &&
                    diffTime < oneWeekInMs;

                  if (isLocked) {
                    return (
                      <div className="space-y-2">
                        <Button
                          disabled
                          variant="outline"
                          className="w-full gap-2 h-11 text-rose-400 border-rose-100 dark:border-rose-950/20 font-medium"
                        >
                          <AlertTriangle className="h-4 w-4" />
                          Cancel Booking (Locked)
                        </Button>
                        <p className="text-xs text-rose-500 font-medium text-center px-2">
                          Confirmed bookings can only be cancelled at least one
                          week before the scheduled service time.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <Button
                      onClick={() => setShowConfirmCancel(true)}
                      variant="outline"
                      className="w-full gap-2 h-11 text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-950/60 dark:hover:bg-rose-950/30 font-medium"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Cancel Booking
                    </Button>
                  );
                })()}
            </>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider block mb-1.5">
                  Cancellation Reason (Optional)
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Tell us why you need to cancel this booking..."
                  className="w-full min-h-[80px] text-sm p-3 border rounded-xl bg-background resize-none focus:outline-none focus:ring-1 focus:ring-[#719FC4] dark:border-zinc-800"
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
                  Back
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelBooking}
                  className="flex-1 h-11 font-medium rounded-xl gap-2 shadow-sm"
                  disabled={isCancelling}
                >
                  {isCancelling ? "Cancelling..." : "Confirm Cancel"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
