import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Clock,
  Loader2,
  MapPin,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { format, isBefore, addDays, startOfDay, parse } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { BookingListItem } from "@/interfaces/bookings/bookings.interface";
import type { Location } from "@/interfaces/location.interface";
import type { AvailableSlot } from "@/interfaces/client/booking.interface";
import { LocationAutocomplete } from "@/components/location/LocationAutocomplete";
import { useAvailableSlots } from "@/hooks/client/useBooking";
import { useRescheduleBooking } from "@/hooks/booking/use-reschedule-booking";

// ─── Types ───────────────────────────────────────────────────────────────────

type RescheduleStep = "date" | "slot" | "location" | "confirm";

interface Props {
  open: boolean;
  onClose: () => void;
  booking: BookingListItem;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatSlotTime = (time: string) =>
  format(parse(time, "HH:mm", new Date()), "h:mm a");

const MIN_RESCHEDULE_DATE = addDays(new Date(), 7);

// ─── Component ───────────────────────────────────────────────────────────────

export default function RescheduleBookingModal({ open, onClose, booking }: Props) {
  const isOnsite = booking.bookingMode?.toLowerCase() === "onsite";

  // Steps: onsite = date → slot → location → confirm
  //        offsite = date → confirm
  const STEPS: RescheduleStep[] = isOnsite
    ? ["date", "slot", "location", "confirm"]
    : ["date", "confirm"];

  const [step, setStep] = useState<RescheduleStep>(STEPS[0]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const bookingDateStr = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : "";

  // Fetch slots whenever date is selected (only for onsite)
  const { data: slotsData, isLoading: slotsLoading, isError: slotsError } =
    useAvailableSlots(
      {
        providerId: booking.provider.id,
        providerServiceId: booking.providerService.id,
        date: bookingDateStr,
      },
      isOnsite && step === "slot" && !!bookingDateStr,
    );

  const slots: AvailableSlot[] = slotsData?.data ?? [];

  const { mutateAsync: reschedule, isPending } = useRescheduleBooking();

  // ─── Helpers ─────────────────────────────────────────────────────────────

  const reset = () => {
    setStep(STEPS[0]);
    setSelectedDate(undefined);
    setSelectedSlot(null);
    setLocation(null);
    setLocationError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const goTo = (s: RescheduleStep) => setStep(s);

  const goBack = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const handleConfirm = async () => {
    if (!selectedDate) return;

    try {
      if (isOnsite) {
        if (!selectedSlot || !location) return;
        await reschedule({
          mode: "onsite",
          bookingId: booking.id,
          bookingDate: bookingDateStr,
          startTime: selectedSlot.startTime,
          location,
        });
      } else {
        await reschedule({
          mode: "offsite",
          bookingId: booking.id,
          bookingDate: bookingDateStr,
        });
      }
      toast.success("Booking rescheduled successfully!");
      handleClose();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Failed to reschedule booking",
      );
    }
  };

  // ─── Step indicator ──────────────────────────────────────────────────────

  const stepIndex = STEPS.indexOf(step);
  const STEP_LABELS: Record<RescheduleStep, string> = {
    date: "Select new date",
    slot: "Pick a slot",
    location: "Update location",
    confirm: "Confirm",
  };

  // ─── Step renders ────────────────────────────────────────────────────────

  const renderDate = () => (
    <div className="flex flex-col items-center gap-5">
      <p className="text-sm text-muted-foreground text-center">
        Select a new date at least{" "}
        <span className="font-semibold text-foreground">7 days</span> from today.
      </p>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        disabled={(d) => isBefore(d, startOfDay(MIN_RESCHEDULE_DATE))}
        initialFocus
        className="rounded-xl border border-border/50"
      />
      <Button
        className="w-full"
        disabled={!selectedDate}
        onClick={() => goTo(STEPS[stepIndex + 1])}
      >
        Continue
      </Button>
    </div>
  );

  const renderSlot = () => (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Available slots for{" "}
        <span className="font-medium text-foreground">
          {selectedDate && format(selectedDate, "MMM d, yyyy")}
        </span>
      </p>

      {slotsLoading ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Fetching slots…</p>
        </div>
      ) : slotsError ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <p className="text-sm text-destructive">Failed to load slots.</p>
          <p className="text-xs text-muted-foreground">
            Please go back and select a different date.
          </p>
        </div>
      ) : slots.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <Clock className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No slots available for this date.
          </p>
        </div>
      ) : (
        <ScrollArea className="h-56 pr-2">
          <div className="grid grid-cols-2 gap-2">
            {slots.map((slot) => {
              const isSelected =
                selectedSlot?.startTime === slot.startTime &&
                selectedSlot?.endTime === slot.endTime;
              return (
                <button
                  key={slot.startTime}
                  onClick={() => setSelectedSlot(slot)}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-xl border px-3 py-3 text-sm transition-colors",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border/50 bg-secondary/30 hover:border-primary/50 hover:bg-primary/5",
                  )}
                >
                  <span>{formatSlotTime(slot.startTime)}</span>
                  <span className="text-xs text-muted-foreground mt-0.5">
                    to {formatSlotTime(slot.endTime)}
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      )}

      <div className="flex gap-2 mt-1">
        <Button variant="outline" className="flex-1" onClick={goBack}>
          Back
        </Button>
        <Button
          className="flex-1"
          disabled={!selectedSlot || slotsLoading}
          onClick={() => goTo("location")}
        >
          Continue
        </Button>
      </div>
    </div>
  );

  const renderLocation = () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">
          Where should the rescheduled service take place?
        </p>
        {locationError && (
          <p className="text-xs text-destructive">{locationError}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm font-medium">Service location</span>
        </div>
        <LocationAutocomplete
          value={location}
          onChange={(val) => setLocation(val)}
          onError={(err) => setLocationError(err)}
          placeholder="Search for a location…"
        />
      </div>

      {location && (
        <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3">
          <p className="text-xs text-muted-foreground mb-0.5">
            Selected location
          </p>
          <p className="text-sm font-medium">{location.address}</p>
          {(location.city || location.country) && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {[location.city, location.state, location.country]
                .filter(Boolean)
                .join(", ")}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-2 mt-1">
        <Button variant="outline" className="flex-1" onClick={goBack}>
          Back
        </Button>
        <Button
          className="flex-1"
          disabled={!location}
          onClick={() => goTo("confirm")}
        >
          Continue
        </Button>
      </div>
    </div>
  );

  const renderConfirm = () => (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted-foreground">
        Please confirm the new booking details below.
      </p>

      <div className="rounded-xl border bg-muted/20 divide-y divide-border/50">
        {/* Original date */}
        <div className="flex items-start gap-3 px-4 py-3">
          <CalendarDays className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Original date</p>
            <p className="text-sm font-medium line-through text-muted-foreground">
              {format(new Date(booking.bookingDate), "MMM d, yyyy")}
            </p>
          </div>
        </div>

        {/* New date */}
        <div className="flex items-start gap-3 px-4 py-3">
          <CalendarDays className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">New date</p>
            <p className="text-sm font-semibold">
              {selectedDate && format(selectedDate, "MMM d, yyyy")}
            </p>
          </div>
          <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200 bg-emerald-50/40">
            Updated
          </Badge>
        </div>

        {/* Slot (onsite only) */}
        {isOnsite && selectedSlot && (
          <div className="flex items-start gap-3 px-4 py-3">
            <Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Time slot</p>
              <p className="text-sm font-semibold">
                {formatSlotTime(selectedSlot.startTime)} →{" "}
                {formatSlotTime(selectedSlot.endTime)}
              </p>
            </div>
          </div>
        )}

        {/* Location (onsite only) */}
        {isOnsite && location && (
          <div className="flex items-start gap-3 px-4 py-3">
            <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-semibold truncate">{location.address}</p>
              {(location.city || location.country) && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {[location.city, location.state, location.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={goBack} disabled={isPending}>
          Back
        </Button>
        <Button
          className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
          onClick={handleConfirm}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Rescheduling…
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Confirm Reschedule
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case "date":     return renderDate();
      case "slot":     return renderSlot();
      case "location": return renderLocation();
      case "confirm":  return renderConfirm();
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-md md:max-w-xl p-0 gap-0 max-h-[90vh] flex flex-col overflow-hidden"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-3 shrink-0 border-b">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-blue-500" />
              Reschedule Booking
              <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md ml-1">
                {booking.bookingId}
              </span>
            </DialogTitle>
          </DialogHeader>

          {/* Step progress bar */}
          <div className="flex items-center gap-1.5 pt-4 pb-1">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={cn(
                  "h-1 flex-1 rounded-full transition-all duration-300",
                  i <= stepIndex ? "bg-blue-500" : "bg-muted",
                )}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Step {stepIndex + 1} of {STEPS.length} — {STEP_LABELS[step]}
          </p>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 min-h-0">
          {renderStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
