import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";
import type { BookingFormState } from "@/interfaces/client/booking.interface";

interface Props {
  formState: BookingFormState;
  onNext: (notes: string) => void;
  onBack: () => void;
}

const MAX_NOTES_LENGTH = 500;

export default function DetailsStep({ formState, onNext, onBack }: Props) {
  const [notes, setNotes] = useState(formState.notes ?? "");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">
          Any additional information for the provider?
        </p>
        <p className="text-xs text-muted-foreground/70">
          This is optional — you can skip if nothing to add.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <FileText className="h-4 w-4 text-primary" />
          Notes
        </Label>

        <Textarea
          value={notes}
          onChange={(e) => {
            if (e.target.value.length <= MAX_NOTES_LENGTH) {
              setNotes(e.target.value);
            }
          }}
          placeholder="e.g. I have a specific requirement, please bring..."
          className="bg-secondary/30 border-border/50 rounded-xl focus:border-primary/50 transition-colors resize-none min-h-[120px]"
        />

        <p className="text-xs text-muted-foreground text-right">
          {notes.length} / {MAX_NOTES_LENGTH}
        </p>
      </div>

      <div className="flex gap-2 mt-2">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          Back
        </Button>

        {notes.trim().length === 0 ? (
          <Button
            variant="ghost"
            className="flex-1 text-muted-foreground"
            onClick={() => onNext("")}
          >
            Skip for now
          </Button>
        ) : (
          <Button className="flex-1" onClick={() => onNext(notes.trim())}>
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}