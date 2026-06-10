import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Clock } from "lucide-react";
import type { AvailableSlot, BookingFormState } from "@/interfaces/client/booking.interface";
import { useAvailableSlots } from "@/hooks/client/useBooking";
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";

interface Props {
  formState: BookingFormState;
  onNext: (startTime: string, endTime: string) => void;
  onBack: () => void;
}

const formatSlotTime = (time: string) => {
  return format(parse(time, "HH:mm", new Date()), "h:mm a");
};

export default function SlotPickerStep({ formState, onNext, onBack }: Props) {
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(
    formState.startTime && formState.endTime
      ? { startTime: formState.startTime, endTime: formState.endTime }
      : null
  );

  const { data, isLoading, isError,error } = useAvailableSlots(
    {
      providerId: formState.providerId,
      providerServiceId: formState.providerServiceId,
      date: formState.bookingDate,
    },
    true
  );

  const slots = data?.data ?? [];

  const handleNext = () => {
    if (!selectedSlot) return;
    onNext(selectedSlot.startTime, selectedSlot.endTime);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Fetching available slots...</p>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center py-10 gap-2">
          <p className="text-sm text-destructive">Failed to load slots.</p>
          <p className="text-xs text-muted-foreground">{error.message},Please go back and try again.</p>
        </div>
      );
    }

    if (slots.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 gap-2">
          <Clock className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No slots available for this date.</p>
          <p className="text-xs text-muted-foreground">Please go back and select a different date.</p>
        </div>
      );
    }

    return (
      <ScrollArea className="h-64 pr-2">
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
                    : "border-border/50 bg-secondary/30 text-foreground hover:border-primary/50 hover:bg-primary/5"
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
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Available slots for{" "}
          <span className="text-foreground font-medium">
            {format(new Date(formState.bookingDate), "MMM d, yyyy")}
          </span>
        </p>
      </div>

      {renderContent()}

      <div className="flex gap-2 mt-2">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button
          className="flex-1"
          disabled={!selectedSlot || isLoading}
          onClick={handleNext}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}