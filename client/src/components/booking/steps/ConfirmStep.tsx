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
} from "lucide-react";
import type { BookingFormState, CreateBookingRequest } from "@/interfaces/client/booking.interface";
import { useCreateBooking } from "@/hooks/client/useBooking";
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

export default function ConfirmStep({
  formState,
  onBack,
  onBookingCreated,
  onError,
}: Props) {
  const { mutate: createBooking, isPending } = useCreateBooking(
    // onSuccess — booking created, now get payment intent
    async (data) => {
      const booking = data?.data;

      if (!booking?.bookingId) {
        onError("Booking was created but we could not retrieve the booking ID. Please contact support.");
        return;
      }

      try {
        const intentResponse = await clientApi.createPaymentIntent({
          bookingId: booking.bookingId,
        });

        const intent = intentResponse?.data;

        if (!intent?.clientSecret) {
          onError("Booking created but payment setup failed. Please try again.");
          return;
        }
        console.log("clientSecret received:", intent.clientSecret)
        onBookingCreated(booking.bookingId, intent.clientSecret);
      } catch {
        onError("Booking created but we could not initialize payment. Please try again.");
      }
    },
    (error) => {
      onError(error?.message ?? "Something went wrong while creating your booking. Please try again.");
    }
  );

  const handleConfirm = () => {
    const payload: CreateBookingRequest = {
      providerServiceId: formState.providerServiceId,
      bookingDate: formState.bookingDate,
      startTime: formState.startTime,
      paymentType: formState.paymentType!,
      location: formState.location!,
      notes: formState.notes.trim() || null,
    };

    createBooking(payload);
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

        <Separator className="opacity-50" />

        <SummaryRow
          icon={<Clock className="h-4 w-4" />}
          label="Time"
          value={`${formatTime(formState.startTime)} — ${formatTime(formState.endTime)}`}
        />

        {formState.location && (
          <>
            <Separator className="opacity-50" />
            <SummaryRow
              icon={<MapPin className="h-4 w-4" />}
              label="Location"
              value={formState.location.address}
            />
          </>
        )}

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