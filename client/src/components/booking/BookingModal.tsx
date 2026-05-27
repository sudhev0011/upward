import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { BookingFormState } from "@/interfaces/client/booking.interface";
import type { Location } from "@/interfaces/location.interface";
import { PaymentType } from "@/enums/payment-type.enum";
import DatePickerStep from "./steps/DatePickerStep";
import SlotPickerStep from "./steps/SlotPickerStep";
import LocationStep from "./steps/LocationStep";
import DetailsStep from "./steps/DetailsStep";
import PaymentTypeStep from "./steps/PaymentTypeStep";
import ConfirmStep from "./steps/ConfirmStep";
import StripeStep from "./steps/StripeStep";
import SuccessScreen from "./screens/SuccessScreen";
import FailureScreen from "./screens/FailureScreen";


export type BookingStep =
  | "date"
  | "slot"
  | "location"
  | "details"
  | "paymentType"
  | "confirm"
  | "stripe"
  | "success"
  | "failure";

interface Props {
  open: boolean;
  onClose: () => void;
  providerId: string;
  providerServiceId: string;
  providerName: string;
  serviceLabel: string;
}

const INITIAL_FORM_STATE: BookingFormState = {
  providerId: "",
  providerServiceId: "",
  providerName: "",
  serviceLabel: "",
  bookingDate: "",
  startTime: "",
  endTime: "",
  paymentType: null,
  notes: "",
  location: null,
};

const STEPS: BookingStep[] = [
  "date",
  "slot",
  "location",
  "details",
  "paymentType",
  "confirm",
  "stripe",
];

// success and failure are screens, not counted as steps
const STEP_LABELS: Record<BookingStep, string> = {
  date: "Select Date",
  slot: "Select Slot",
  location: "Location",
  details: "Details",
  paymentType: "Payment",
  confirm: "Confirm",
  stripe: "Pay",
  success: "",
  failure: "",
};

export default function BookingModal({
  open,
  onClose,
  providerId,
  providerServiceId,
  providerName,
  serviceLabel,
}: Props) {
  const [currentStep, setCurrentStep] = useState<BookingStep>("date");
  const [formState, setFormState] = useState<BookingFormState>({
    ...INITIAL_FORM_STATE,
    providerId,
    providerServiceId,
    providerName,
    serviceLabel,
  });

  // bookingId and clientSecret are set after POST /bookings and POST /payments/create-intent
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [failureMessage, setFailureMessage] = useState<string>("");

  const updateForm = (patch: Partial<BookingFormState>) => {
    setFormState((prev) => ({ ...prev, ...patch }));
  };

  const goTo = (step: BookingStep) => setCurrentStep(step);

  const goBack = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1]);
    }
  };

  const handleClose = () => {
    // reset everything on close
    setCurrentStep("date");
    setFormState({
      ...INITIAL_FORM_STATE,
      providerId,
      providerServiceId,
      providerName,
      serviceLabel,
    });
    setBookingId(null);
    setClientSecret(null);
    setFailureMessage("");
    onClose();
  };

  const isScreen = currentStep === "success" || currentStep === "failure";
  const stepIndex = STEPS.indexOf(currentStep);

  const renderStep = () => {
    switch (currentStep) {
      case "date":
        return (
          <DatePickerStep
            formState={formState}
            onNext={(date) => {
              updateForm({ bookingDate: date });
              goTo("slot");
            }}
          />
        );
      case "slot":
        return (
          <SlotPickerStep
            formState={formState}
            onNext={(startTime, endTime) => {
              updateForm({ startTime, endTime });
              goTo("location");
            }}
            onBack={goBack}
          />
        );
      case "location":
        return (
          <LocationStep
            formState={formState}
            onNext={(location: Location) => {
              updateForm({ location });
              goTo("details");
            }}
            onBack={goBack}
          />
        );
      case "details":
        return (
          <DetailsStep
            formState={formState}
            onNext={(notes) => {
              updateForm({ notes });
              goTo("paymentType");
            }}
            onBack={goBack}
          />
        );
      case "paymentType":
        return (
          <PaymentTypeStep
            formState={formState}
            onNext={(paymentType: PaymentType) => {
              updateForm({ paymentType });
              goTo("confirm");
            }}
            onBack={goBack}
          />
        );
      case "confirm":
        return (
          <ConfirmStep
            formState={formState}
            onBack={goBack}
            onBookingCreated={(id, secret) => {
              setBookingId(id);
              setClientSecret(secret);
              goTo("stripe");
            }}
            onError={(message) => {
              setFailureMessage(message);
              goTo("failure");
            }}
          />
        );
      case "stripe":
        return (
          <StripeStep
            clientSecret={clientSecret!}
            bookingId={bookingId!}
            onSuccess={() => goTo("success")}
            onFailure={(message) => {
              setFailureMessage(message);
              goTo("failure");
            }}
          />
        );
      case "success":
        return <SuccessScreen onClose={handleClose} />;
      case "failure":
        return (
          <FailureScreen
            message={failureMessage}
            onRetry={() => {
              // if booking exists, go back to stripe (reuse same bookingId)
              // if booking failed, go back to confirm
              if (bookingId && clientSecret) {
                goTo("stripe");
              } else {
                goTo("confirm");
              }
            }}
            onClose={handleClose}
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isScreen ? (
              // no title on success/failure screens
              null
            ) : (
              <span>
                Book{" "}
                <span className="text-primary">{serviceLabel}</span>
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Step indicator — only shown during actual steps */}
        {!isScreen && stepIndex !== -1 && (
          <div className="flex items-center gap-1.5 pb-2">
            {STEPS.map((step, i) => (
              <div
                key={step}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= stepIndex
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        )}

        {/* Step label */}
        {!isScreen && (
          <p className="text-xs text-muted-foreground -mt-2 mb-1">
            Step {stepIndex + 1} of {STEPS.length} —{" "}
            {STEP_LABELS[currentStep]}
          </p>
        )}

        {/* Active step or screen */}
        <div className="mt-2">{renderStep()}</div>
      </DialogContent>
    </Dialog>
  );
}