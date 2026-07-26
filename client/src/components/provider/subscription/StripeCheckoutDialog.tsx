import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { Loader2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface StripeCheckoutDialogProps {
  clientSecret: string;
  mode: "subscribe" | "upgrade";
  onSuccess: () => void;
  onClose: () => void;
}

function StripeCheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isPending, setIsPending] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;

    setIsPending(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: "if_required",
    });

    setIsPending(false);

    if (error) {
      toast.error(error.message ?? "Payment failed. Please try again.");
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      toast.success("Payment completed successfully!");
      onSuccess();
      return;
    }

    toast.error(
      "Payment could not be completed. Please try a different payment method.",
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-secondary/10 p-4">
        <PaymentElement />
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
        <span>
          Your checkout is secured by Stripe. We never store credit card
          details.
        </span>
      </div>

      <Button
        className="w-full h-10 shadow-md font-semibold"
        onClick={handlePay}
        disabled={!stripe || !elements || isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Verifying Transaction...
          </>
        ) : (
          "Authorize & Pay Now"
        )}
      </Button>
    </div>
  );
}

export function StripeCheckoutDialog({
  clientSecret,
  mode,
  onSuccess,
  onClose,
}: StripeCheckoutDialogProps) {
  const isUpgrade = mode === "upgrade";

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-500 fill-indigo-500/20" />
            {isUpgrade
              ? "Complete Plan Upgrade"
              : "Complete Subscription Purchase"}
          </DialogTitle>
          <DialogDescription>
            {isUpgrade
              ? "Provide your card or payment method to authorize the upgrade."
              : "Provide your card or payment method to authorize the plan activation."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2">
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
            <StripeCheckoutForm onSuccess={onSuccess} />
          </Elements>
        </div>
      </DialogContent>
    </Dialog>
  );
}