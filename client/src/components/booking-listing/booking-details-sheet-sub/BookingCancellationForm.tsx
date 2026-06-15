import { useState } from "react";
import { Button } from "@/components/ui/button";

interface BookingCancellationFormProps {
  isCancelling: boolean;
  onCancel: (reason: string) => void;
  onBack: () => void;
}

export const BookingCancellationForm = ({
  isCancelling,
  onCancel,
  onBack,
}: BookingCancellationFormProps) => {
  const [reason, setReason] = useState("");

  return (
    <div className="space-y-3 p-1">
      <div>
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
          Reason for Cancellation <span className="text-muted-foreground/60 lowercase">(optional)</span>
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Provide an explanation for the counterparty regarding this cancellation request..."
          className="w-full min-h-[90px] text-sm p-3 border rounded-xl bg-background border-input focus-visible:ring-1 focus-visible:ring-ring outline-none resize-none transition-all"
          maxLength={500}
        />
      </div>

      <div className="flex gap-2.5">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex-1 h-11 font-medium border rounded-xl"
          disabled={isCancelling}
        >
          Go Back
        </Button>
        <Button
          variant="destructive"
          onClick={() => onCancel(reason)}
          className="flex-1 h-11 font-semibold rounded-xl gap-2 shadow-sm"
          disabled={isCancelling}
        >
          {isCancelling ? "Processing..." : "Confirm Cancellation"}
        </Button>
      </div>
    </div>
  );
};