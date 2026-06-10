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
import { BookingMode } from "@/enums/booking-mode";
import RequirementsStep from "./steps/RequirementsStep";

export type BookingStep =
  | "date"
  | "slot"
  | "location"
  | "requirements"
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
  mode: BookingMode;
}

const INITIAL_FORM_STATE: BookingFormState = {
  providerId: "",
  providerServiceId: "",
  providerName: "",
  serviceLabel: "",
  mode: "onsite",
  bookingDate: "",
  startTime: "",
  endTime: "",
  paymentType: null,
  notes: "",
  location: null,
  requirements: [],
};

const ONSITE_STEPS: BookingStep[] = [
  "date",
  "slot",
  "location",
  "requirements",
  "details",
  "paymentType",
  "confirm",
  "stripe",
];

const OFFSITE_STEPS: BookingStep[] = [
  "date",
  "requirements",
  "details",
  "paymentType",
  "confirm",
  "stripe",
];

const STEP_LABELS: Record<BookingStep, string> = {
  date: "Select date",
  slot: "Select slot",
  location: "Location",
  requirements: "Requirements",
  details: "Details",
  paymentType: "Payment type",
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
  mode,
}: Props) {
  const STEPS = mode === "onsite" ? ONSITE_STEPS : OFFSITE_STEPS;
  const [currentStep, setCurrentStep] = useState<BookingStep>(STEPS[0]);
  const [formState, setFormState] = useState<BookingFormState>({
    ...INITIAL_FORM_STATE,
    providerId,
    providerServiceId,
    providerName,
    serviceLabel,
    mode,
  });

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
    setCurrentStep(STEPS[0]);
    setFormState({
      ...INITIAL_FORM_STATE,
      providerId,
      providerServiceId,
      providerName,
      serviceLabel,
      mode,
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
              goTo(STEPS[1]);
            }}
          />
        );

      case "slot":
        return (
          <SlotPickerStep
            formState={formState}
            onNext={(startTime, endTime) => {
              updateForm({ startTime, endTime });
              goTo(STEPS[STEPS.indexOf("slot") + 1]);
            }}
            onBack={goBack}
          />
        );

      case "location":
        return (
          <LocationStep
            formState={formState}
            onNext={(location: Location | null) => {
              updateForm({ location });
              goTo(STEPS[STEPS.indexOf("location") + 1]);
            }}
            onBack={goBack}
          />
        );

      case "requirements":
        return (
          <RequirementsStep
            formState={formState}
            onNext={(requirements) => {
              updateForm({ requirements });
              goTo(STEPS[STEPS.indexOf("requirements") + 1]);
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
              goTo(STEPS[STEPS.indexOf("details") + 1]);
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
              goTo(STEPS[STEPS.indexOf("paymentType") + 1]);
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
      <DialogContent
        className="sm:max-w-md md:max-w-xl lg:max-w-2xl p-0 gap-0 max-h-[90vh] flex flex-col overflow-hidden"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Fixed header */}
        <div className="px-6 pt-6 pb-3 shrink-0">
          <DialogHeader>
            <DialogTitle>
              {isScreen ? null : (
                <span>
                  Book <span className="text-primary">{serviceLabel}</span>
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          {/* Step indicator */}
          {!isScreen && stepIndex !== -1 && (
            <div className="flex items-center gap-1.5 pt-3 pb-1">
              {STEPS.map((step, i) => (
                <div
                  key={step}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i <= stepIndex ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Step label */}
          {!isScreen && (
            <p className="text-xs text-muted-foreground mt-1">
              Step {stepIndex + 1} of {STEPS.length} —{" "}
              {STEP_LABELS[currentStep]}
            </p>
          )}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
          {renderStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
