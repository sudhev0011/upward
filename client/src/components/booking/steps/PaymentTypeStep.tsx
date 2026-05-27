import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Split } from "lucide-react";
import type { BookingFormState } from "@/interfaces/client/booking.interface";
import { PaymentType } from "@/enums/payment-type.enum";
import { cn } from "@/lib/utils";

interface Props {
  formState: BookingFormState;
  onNext: (paymentType: PaymentType) => void;
  onBack: () => void;
}

interface PaymentOption {
  type: PaymentType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    type: PaymentType.FULL,
    label: "Full payment",
    description: "Pay the complete amount now to confirm your booking.",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    type: PaymentType.PARTIAL,
    label: "Partial payment",
    description: "Pay a deposit now and the rest later at the time of service.",
    icon: <Split className="h-5 w-5" />,
  },
];

export default function PaymentTypeStep({ formState, onNext, onBack }: Props) {
  const [selected, setSelected] = useState<PaymentType | null>(
    formState.paymentType ?? null
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">
          How would you like to pay for this service?
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {PAYMENT_OPTIONS.map((option) => {
          const isSelected = selected === option.type;

          return (
            <button
              key={option.type}
              onClick={() => setSelected(option.type)}
              className={cn(
                "flex items-start gap-4 rounded-xl border px-4 py-4 text-left transition-colors w-full",
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border/50 bg-secondary/30 hover:border-primary/50 hover:bg-primary/5"
              )}
            >
              <div
                className={cn(
                  "mt-0.5 shrink-0",
                  isSelected ? "text-primary" : "text-muted-foreground"
                )}
              >
                {option.icon}
              </div>

              <div className="flex flex-col gap-0.5">
                <span
                  className={cn(
                    "text-sm font-medium",
                    isSelected ? "text-primary" : "text-foreground"
                  )}
                >
                  {option.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {option.description}
                </span>
              </div>

              {/* selected indicator */}
              <div className="ml-auto shrink-0 mt-0.5">
                <div
                  className={cn(
                    "h-4 w-4 rounded-full border-2 transition-colors",
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-border"
                  )}
                />
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 mt-2">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button
          className="flex-1"
          disabled={!selected}
          onClick={() => selected && onNext(selected)}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}