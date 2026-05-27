import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
interface Props {
  clientSecret: string;
  bookingId: string;
  onSuccess: () => void;
  onFailure: (message: string) => void;
}

// inner form — must be inside <Elements> to use useStripe and useElements
interface PaymentFormProps {
  onSuccess: () => void;
  onFailure: (message: string) => void;
}

function PaymentForm({ onSuccess, onFailure }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isPending, setIsPending] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;

    setIsPending(true);

    // confirm without redirect — result handled inline
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: "if_required",
    });

    setIsPending(false);

    if (error) {
      // card declined, insufficient funds, etc.
      onFailure(
        error.message ?? "Payment failed. Please try again."
      );
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      onSuccess();
      return;
    }

    // any other status — requires_action, processing, etc.
    onFailure(
      "Payment could not be completed. Please try a different payment method."
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border/50 bg-secondary/30 px-4 py-4">
        <PaymentElement
        //   options={{
        //     layout: "tabs",
        //   }}
        />
      </div>

      {/* security note */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
        <span>Your payment is secured by Stripe. We never store your card details.</span>
      </div>

      <Button
        className="w-full"
        onClick={handlePay}
        disabled={!stripe || !elements || isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Processing payment...
          </>
        ) : (
          "Pay now"
        )}
      </Button>
    </div>
  );
}

// outer wrapper — provides Stripe context via <Elements>
export default function StripeStep({
  clientSecret,
  bookingId: _bookingId,
  onSuccess,
  onFailure,
}: Props) {
  // do not mount Elements at all until clientSecret is ready
  if (!clientSecret) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Setting up payment...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Complete your payment to finalize the booking.
      </p>

      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: "stripe",
            variables: {
              borderRadius: "12px",
              fontSizeBase: "14px",
            },
          },
        }}
      >
        <PaymentForm onSuccess={onSuccess} onFailure={onFailure} />
      </Elements>
    </div>
  );
}