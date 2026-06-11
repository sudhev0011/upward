import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useCreateRemainingPaymentIntent } from "@/hooks/client/useBooking";
import StripeStep from "./steps/StripeStep";
import SuccessScreen from "./screens/SuccessScreen";
import FailureScreen from "./screens/FailureScreen";

type ModalScreen = "loading" | "stripe" | "success" | "failure";

interface Props {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  remainingAmount: number;
}

export default function PayRemainingModal({
  open,
  onClose,
  bookingId,
  remainingAmount,
}: Props) {
  const [screen, setScreen] = useState<ModalScreen>("loading");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [failureMessage, setFailureMessage] = useState("");

  const { mutate: createRemainingIntent } = useCreateRemainingPaymentIntent(
    (data) => {
      const secret = data?.data?.clientSecret;
      if (!secret) {
        setFailureMessage(
          "Could not initialize payment. Please try again.",
        );
        setScreen("failure");
        return;
      }
      setClientSecret(secret);
      setScreen("stripe");
    },
    (error) => {
      setFailureMessage(
        error?.message ?? "Could not initialize payment. Please try again.",
      );
      setScreen("failure");
    },
  );

  // fetch intent as soon as modal opens
  useEffect(() => {
    if (open) {
      setScreen("loading");
      setClientSecret(null);
      setFailureMessage("");
      createRemainingIntent({ bookingId });
    }
  }, [open, bookingId]);

  const handleClose = () => {
    setScreen("loading");
    setClientSecret(null);
    setFailureMessage("");
    onClose();
  };

  const isScreen = screen === "success" || screen === "failure";

  const renderContent = () => {
    switch (screen) {
      case "loading":
        return (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Setting up payment...
            </p>
          </div>
        );

      case "stripe":
        return (
          <StripeStep
            clientSecret={clientSecret!}
            bookingId={bookingId}
            onSuccess={() => setScreen("success")}
            onFailure={(message) => {
              setFailureMessage(message);
              setScreen("failure");
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
              // if we already have clientSecret retry stripe directly
              // otherwise re-fetch the intent
              if (clientSecret) {
                setScreen("stripe");
              } else {
                setScreen("loading");
                createRemainingIntent({ bookingId });
              }
            }}
            onClose={handleClose}
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md md:max-w-xl lg:max-w-2xl p-0 gap-0 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Fixed header */}
        <div className="px-6 pt-6 pb-4 shrink-0">
          <DialogHeader>
            <DialogTitle>
              {isScreen ? null : (
                <span>
                  Pay remaining{" "}
                  <span className="text-primary">
                    ₹{remainingAmount.toLocaleString("en-IN")}
                  </span>
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}