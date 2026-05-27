import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import type { BookingFormState } from "@/interfaces/client/booking.interface";
import { format, isBefore, startOfDay } from "date-fns";

interface Props {
  formState: BookingFormState;
  onNext: (date: string) => void;
}

export default function DatePickerStep({ formState, onNext }: Props) {
  const [selected, setSelected] = useState<Date | undefined>(
    formState.bookingDate
      ? new Date(formState.bookingDate)
      : undefined
  );

  const handleNext = () => {
    if (!selected) return;
    // format to YYYY-MM-DD as backend expects
    onNext(format(selected, "yyyy-MM-dd"));
  };

  const isDateDisabled = (date: Date) => {
    // disable all past dates including today
    return isBefore(date, startOfDay(new Date()));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Calendar
        mode="single"
        selected={selected}
        onSelect={setSelected}
        disabled={isDateDisabled}
        initialFocus
        className="rounded-xl border border-border/50"
      />

      <Button
        className="w-full"
        disabled={!selected}
        onClick={handleNext}
      >
        Continue
      </Button>
    </div>
  );
}