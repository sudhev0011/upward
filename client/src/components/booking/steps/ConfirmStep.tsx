import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  Clock,
  MapPin,
  FileText,
  CreditCard,
  User,
  Loader2,
  ListChecks,
} from "lucide-react";
import type {
  BookingFormState,
  CreateOnsiteBookingRequest,
  CreateOffsiteBookingRequest,
} from "@/interfaces/client/booking.interface";
import { useCreateOnsiteBooking, useCreateOffsiteBooking } from "@/hooks/client/useBooking";
import { clientApi } from "@/api/client.api";
import { format, parse } from "date-fns";
import { PaymentType } from "@/enums/payment-type.enum";

interface Props {
  formState: BookingFormState;
  onBack: () => void;
  onBookingCreated: (bookingId: string, clientSecret: string) => void;
  onError: (message: string) => void;
}

const formatTime = (time: string) =>
  format(parse(time, "HH:mm", new Date()), "h:mm a");

const formatDate = (date: string) =>
  format(new Date(date), "EEEE, MMMM d yyyy");

const PAYMENT_LABEL: Record<PaymentType, string> = {
  [PaymentType.FULL]: "Full payment",
  [PaymentType.PARTIAL]: "Partial payment",
};

interface SummaryRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const SummaryRow = ({ icon, label, value }: SummaryRowProps) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 text-primary shrink-0">{icon}</div>
    <div className="flex flex-col gap-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  </div>
);

const RequirementsSummary = ({ requirements }: { requirements: string[] }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 text-primary shrink-0">
      <ListChecks className="h-4 w-4" />
    </div>
    <div className="flex flex-col gap-1.5">
      <p className="text-xs text-muted-foreground">Requirements</p>
      <div className="flex flex-wrap gap-1.5">
        {requirements.map((req, i) => (
          <span
            key={i}
            className="text-xs bg-primary/10 text-primary border border-primary/20 rounded-lg px-2.5 py-1 font-medium"
          >
            {req}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default function ConfirmStep({
  formState,
  onBack,
  onBookingCreated,
  onError,
}: Props) {
  const isOnsite = formState.mode === "onsite";

  const handleSuccess = async (data: Awaited<ReturnType<typeof clientApi.createOnsiteBooking>>) => {
    const booking = data?.data;

    if (!booking?.id) {
      onError("Booking was created but we could not retrieve the booking ID. Please contact support.");
      return;
    }

    try {
      const intentResponse = await clientApi.createPaymentIntent({
        bookingId: booking.id,
      });

      const intent = intentResponse?.data;

      if (!intent?.clientSecret) {
        onError("Booking created but payment setup failed. Please try again.");
        return;
      }

      onBookingCreated(booking.id, intent.clientSecret);
    } catch {
      onError("Booking created but we could not initialize payment. Please try again.");
    }
  };

  const handleError = (error: Error) => {
    onError(
      error?.message ?? "Something went wrong while creating your booking. Please try again."
    );
  };

  const { mutate: createOnsiteBooking, isPending: isOnsitePending } =
    useCreateOnsiteBooking(handleSuccess, handleError);

  const { mutate: createOffsiteBooking, isPending: isOffsitePending } =
    useCreateOffsiteBooking(handleSuccess, handleError);

  const isPending = isOnsitePending || isOffsitePending;

  const handleConfirm = () => {
    if (isOnsite) {
      const payload: CreateOnsiteBookingRequest = {
        providerServiceId: formState.providerServiceId,
        bookingDate: formState.bookingDate,
        startTime: formState.startTime,
        paymentType: formState.paymentType!,
        notes: formState.notes.trim() || null,
        location: formState.location!,
        requirements: formState.requirements,
      };
      createOnsiteBooking(payload);
    } else {
      const payload: CreateOffsiteBookingRequest = {
        providerServiceId: formState.providerServiceId,
        bookingDate: formState.bookingDate,
        paymentType: formState.paymentType!,
        notes: formState.notes.trim() || null,
        requirements: formState.requirements,
      };
      createOffsiteBooking(payload);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Review your booking details before confirming.
      </p>

      <div className="rounded-xl border border-border/50 bg-secondary/30 px-4 py-4 flex flex-col gap-3">
        <SummaryRow
          icon={<User className="h-4 w-4" />}
          label="Provider"
          value={formState.providerName}
        />

        <Separator className="opacity-50" />

        <SummaryRow
          icon={<CalendarDays className="h-4 w-4" />}
          label="Date"
          value={formatDate(formState.bookingDate)}
        />

        {/* slot time — onsite only */}
        {isOnsite && formState.startTime && (
          <>
            <Separator className="opacity-50" />
            <SummaryRow
              icon={<Clock className="h-4 w-4" />}
              label="Time"
              value={`${formatTime(formState.startTime)} — ${formatTime(formState.endTime)}`}
            />
          </>
        )}

        {/* location — onsite only */}
        {isOnsite && formState.location && (
          <>
            <Separator className="opacity-50" />
            <SummaryRow
              icon={<MapPin className="h-4 w-4" />}
              label="Location"
              value={formState.location.address}
            />
          </>
        )}

        {/* requirements — both flows */}
        {formState.requirements.length > 0 && (
          <>
            <Separator className="opacity-50" />
            <RequirementsSummary requirements={formState.requirements} />
          </>
        )}

        {/* notes — both flows */}
        {formState.notes.trim().length > 0 && (
          <>
            <Separator className="opacity-50" />
            <SummaryRow
              icon={<FileText className="h-4 w-4" />}
              label="Notes"
              value={formState.notes.trim()}
            />
          </>
        )}

        <Separator className="opacity-50" />

        <SummaryRow
          icon={<CreditCard className="h-4 w-4" />}
          label="Payment type"
          value={PAYMENT_LABEL[formState.paymentType!]}
        />
      </div>

      <div className="flex gap-2 mt-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onBack}
          disabled={isPending}
        >
          Back
        </Button>

        <Button
          className="flex-1"
          onClick={handleConfirm}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Confirming...
            </>
          ) : (
            "Confirm & Pay"
          )}
        </Button>
      </div>
    </div>
  );
}