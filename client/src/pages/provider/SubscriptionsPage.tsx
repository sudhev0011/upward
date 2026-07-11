import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "sonner";
import {
  Loader2,
  CheckCircle,
  Crown,
  Calendar,
  ShieldCheck,
  Zap,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

import {
  useProviderActivePlans,
  useProviderStatus,
  useCreateSubscriptionCheckout,
} from "@/hooks/subscription/useSubscriptions";
import { useQueryClient } from "@tanstack/react-query";
import { subscriptionKeys } from "@/hooks/subscription/useSubscriptions";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface StripeDialogProps {
  clientSecret: string;
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

function StripeDialog({ clientSecret, onSuccess, onClose }: StripeDialogProps) {
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
            Complete Subscription Purchase
          </DialogTitle>
          <DialogDescription>
            Provide your card or payment method to authorize the plan
            activation.
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

export default function SubscriptionsPage() {
  const queryClient = useQueryClient();
  const { data: plansRes, isLoading: loadingPlans } = useProviderActivePlans();
  const { data: statusRes, isLoading: loadingStatus } = useProviderStatus();
  const checkoutMutation = useCreateSubscriptionCheckout();

  const [checkoutClientSecret, setCheckoutClientSecret] = useState<
    string | null
  >(null);

  const plans = plansRes?.data || [];
  const status = statusRes?.data;
  const history = status?.history || [];

  const handleCheckoutInit = (planId: string) => {
    checkoutMutation.mutate(planId, {
      onSuccess: (res) => {
        if (res.data) setCheckoutClientSecret(res.data.clientSecret);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to initialize checkout session");
      },
    });
  };

  const handlePaymentSuccess = () => {
    setCheckoutClientSecret(null);
    queryClient.invalidateQueries({
      queryKey: subscriptionKeys.providerStatus(),
    });
  };

  const hasActiveSubscription =
    status?.activeSubscriptionExpiresAt &&
    new Date(status.activeSubscriptionExpiresAt) > new Date();

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Subscriptions & Billing
        </h1>
        <p className="text-muted-foreground text-sm">
          Keep your listing visible to clients, verify premium placement, and
          track purchase invoices.
        </p>
      </div>

      {/* ACTIVE PLAN COVER */}
      {loadingStatus ? (
        <div className="h-40 flex items-center justify-center border rounded-2xl bg-card/20">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <span className="text-muted-foreground text-sm">
            Fetching billing profile...
          </span>
        </div>
      ) : hasActiveSubscription ? (
        <Card className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/20 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <CardContent className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Crown className="h-6 w-6 text-amber-400 fill-amber-400/20" />
                <h2 className="text-2xl font-black">
                  Active Tier: {status?.activeSubscriptionPlanName}
                </h2>
                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 font-bold uppercase tracking-wider text-[10px] px-2.5 h-5 ml-1">
                  Active
                </Badge>
              </div>
              <p className="text-indigo-200 text-sm font-medium">
                Your profile is active, verified, and listing prominently in
                client search categories!
              </p>
            </div>
            <div className="flex gap-4 items-center shrink-0 border-t border-white/10 md:border-t-0 pt-4 md:pt-0 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-400" />
                <div>
                  <p className="text-[10px] font-bold uppercase text-indigo-300 tracking-wider">
                    Renewal Date
                  </p>
                  <p className="font-semibold text-sm">
                    {status?.activeSubscriptionExpiresAt
                      ? new Date(
                          status.activeSubscriptionExpiresAt,
                        ).toLocaleDateString(undefined, {
                          dateStyle: "medium",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 border-dashed border-2 shadow-sm text-foreground">
          <CardContent className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                <XCircleIcon className="h-5 w-5 text-amber-500" />
                Listing Invisible to Clients
              </h2>
              <p className="text-slate-500 text-sm max-w-xl">
                You do not have an active subscription plan. Your profile and
                services are currently hidden from public discovery pages.
                Subscribe below to list your services.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PLAN COMPARISON GRID */}
      <div className="space-y-4">
        <div className="text-center md:text-left">
          <h2 className="text-xl font-extrabold tracking-tight">
            Available Subscription Tiers
          </h2>
          <p className="text-muted-foreground text-xs">
            Choose the interval and features best suited for your scale.
          </p>
        </div>

        {loadingPlans ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">
              Loading available plans...
            </p>
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed p-12 text-center text-muted-foreground">
            No plans are currently configured for purchase. Check back later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((p) => {
              const isPopular =
                p.name.toLowerCase().includes("professional") ||
                p.name.toLowerCase().includes("pro");
              return (
                <Card
                  key={p.id}
                  className={`bg-card/40 backdrop-blur-sm border shadow-sm flex flex-col relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                    isPopular
                      ? "border-indigo-500/40 ring-1 ring-indigo-500/20"
                      : ""
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-0 right-0 bg-indigo-500 text-white font-bold tracking-widest text-[9px] uppercase py-1 px-4 rounded-bl-xl shadow-sm z-10">
                      Popular Choice
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold">
                      {p.name}
                    </CardTitle>
                    <CardDescription className="text-xs uppercase mt-0.5 tracking-wider font-semibold">
                      {p.billingCycle} billing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 flex-1 flex flex-col">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black">₹{p.price}</span>
                      <span className="text-xs text-muted-foreground font-semibold">
                        /{p.billingCycle === "yearly" ? "yr" : "mo"}
                      </span>
                    </div>

                    <ul className="space-y-2.5 flex-1">
                      <li className="text-xs flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                        <span className="text-muted-foreground">
                          Max Services allowed:{" "}
                          <strong className="text-foreground">
                            {p.features?.maxServices ?? 0}
                          </strong>
                        </span>
                      </li>
                      <li className="text-xs flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                        <span className="text-muted-foreground">
                          Max Manual Blocks / 30 Days:{" "}
                          <strong className="text-foreground">
                            {p.features?.maxManualUnavailability ?? 0}
                          </strong>
                        </span>
                      </li>
                      <li className="text-xs flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                        <span className="text-muted-foreground">
                          Max Portfolios:{" "}
                          <strong className="text-foreground">
                            {p.features?.maxPortfolios ?? 0}
                          </strong>
                        </span>
                      </li>
                    </ul>

                    <Button
                      onClick={() => handleCheckoutInit(p.id)}
                      disabled={
                        (checkoutMutation.isPending &&
                        checkoutMutation.variables === p.id) || (status?.activeSubscriptionPlanName == p.name)
                      }
                      className={`w-full mt-4 h-9 shadow-md ${
                        isPopular
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                          : "bg-primary hover:bg-primary/95"
                      }`}
                    >
                      {checkoutMutation.isPending &&
                      checkoutMutation.variables === p.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Initializing...
                        </>
                      ) : (
                        "Subscribe Now"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* STRIPE DIALOG CONTEXT */}
      {checkoutClientSecret && (
        <StripeDialog
          clientSecret={checkoutClientSecret}
          onSuccess={handlePaymentSuccess}
          onClose={() => setCheckoutClientSecret(null)}
        />
      )}

      {/* BILLING HISTORY */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">
            Billing & Invoices
          </h2>
          <p className="text-muted-foreground text-xs">
            Track your active plans and previous transaction receipts.
          </p>
        </div>

        <Card className="border bg-card/15 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b bg-muted/20 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Interval Start</th>
                  <th className="px-6 py-4">Interval End</th>
                  <th className="px-6 py-4">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                {history.map((h) => (
                  <tr
                    key={h.id}
                    className="hover:bg-muted/10 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs">
                      {h.stripePaymentIntentId
                        ? h.stripePaymentIntentId.slice(-12).toUpperCase()
                        : "PENDING_CHECKOUT"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          h.status === "active"
                            ? "default"
                            : h.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5"
                      >
                        {h.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {h.startDate
                        ? new Date(h.startDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {h.endDate
                        ? new Date(h.endDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 font-bold text-xs">₹{h.amount}</td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground italic text-xs"
                    >
                      No invoices found in your billing history.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

function XCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}
