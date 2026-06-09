import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Plus, ListChecks } from "lucide-react";
import type { BookingFormState } from "@/interfaces/client/booking.interface";
import { cn } from "@/lib/utils";

interface Props {
  formState: BookingFormState;
  onNext: (requirements: string[]) => void;
  onBack: () => void;
}

const MAX_REQUIREMENTS = 20;
const MAX_REQUIREMENT_LENGTH = 500;

export default function RequirementsStep({ formState, onNext, onBack }: Props) {
  const [requirements, setRequirements] = useState<string[]>(
    formState.requirements ?? []
  );
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addRequirement = () => {
    const trimmed = input.trim();

    if (!trimmed) return;

    if (trimmed.length > MAX_REQUIREMENT_LENGTH) {
      setError(`Each requirement must be under ${MAX_REQUIREMENT_LENGTH} characters.`);
      return;
    }

    if (requirements.length >= MAX_REQUIREMENTS) {
      setError(`You can add up to ${MAX_REQUIREMENTS} requirements only.`);
      return;
    }

    if (requirements.includes(trimmed)) {
      setError("This requirement has already been added.");
      return;
    }

    setRequirements((prev) => [...prev, trimmed]);
    setInput("");
    setError(null);
    inputRef.current?.focus();
  };

  const removeRequirement = (index: number) => {
    setRequirements((prev) => prev.filter((_, i) => i !== index));
    setError(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addRequirement();
    }
    // remove last tag on backspace if input is empty
    if (e.key === "Backspace" && input === "" && requirements.length > 0) {
      removeRequirement(requirements.length - 1);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">
          List any specific requirements for this service.
        </p>
        <p className="text-xs text-muted-foreground/70">
          This is optional — you can skip if nothing to add.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <ListChecks className="h-4 w-4 text-primary" />
          Requirements
          <span className="ml-auto text-xs text-muted-foreground font-normal">
            {requirements.length} / {MAX_REQUIREMENTS}
          </span>
        </Label>

        {/* Tag display area + input */}
        <div
          className={cn(
            "min-h-[100px] rounded-xl border bg-secondary/30 px-3 py-2.5 flex flex-wrap gap-2 cursor-text transition-colors",
            error
              ? "border-destructive/50"
              : "border-border/50 focus-within:border-primary/50"
          )}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Rendered tags */}
          {requirements.map((req, index) => (
            <span
              key={index}
              className="flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg px-2.5 py-1 text-xs font-medium max-w-full"
            >
              <span className="truncate max-w-[200px]">{req}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeRequirement(index);
                }}
                className="shrink-0 hover:text-destructive transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {/* Input */}
          {requirements.length < MAX_REQUIREMENTS && (
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder={
                requirements.length === 0
                  ? "Type a requirement and press Enter..."
                  : "Add another..."
              }
              className="flex-1 min-w-[160px] bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
            />
          )}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}

        {/* Add button — alternative to Enter key */}
        {input.trim().length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRequirement}
            className="self-start flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Add requirement
          </Button>
        )}

        {/* char count for current input */}
        {input.length > 0 && (
          <p className={cn(
            "text-xs text-right",
            input.length > MAX_REQUIREMENT_LENGTH
              ? "text-destructive"
              : "text-muted-foreground"
          )}>
            {input.length} / {MAX_REQUIREMENT_LENGTH}
          </p>
        )}
      </div>

      <div className="flex gap-2 mt-2">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          Back
        </Button>

        {requirements.length === 0 ? (
          <Button
            variant="ghost"
            className="flex-1 text-muted-foreground"
            onClick={() => onNext([])}
          >
            Skip for now
          </Button>
        ) : (
          <Button className="flex-1" onClick={() => onNext(requirements)}>
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}