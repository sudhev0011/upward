import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import {
  useProviderActivePlans,
  useProviderStatus,
  useCreateSubscriptionCheckout,
  useCreateSubscriptionUpgradeCheckout,
  subscriptionKeys,
} from "@/hooks/subscription/useSubscriptions";

import { SubscriptionPlanDto } from "@/api/subscription.api";
import { PlanCardAction,PlanCard } from "@/components/provider/subscription/PlanCard";
import { ActivePlanCover } from "@/components/provider/subscription/ActivePlanCover";
import { StripeCheckoutDialog } from "@/components/provider/subscription/StripeCheckoutDialog";
import { BillingHistoryTable } from "@/components/provider/subscription/BillingHistoryTable";

function getPlanCardAction(
  plan: SubscriptionPlanDto,
  hasActiveSubscription: boolean | null | undefined,
  currentPlan: SubscriptionPlanDto | null | undefined,
): PlanCardAction {
  if (!hasActiveSubscription || !currentPlan) return "subscribe";
  if (currentPlan.id === plan.id) return "current";
  if (plan.price > currentPlan.price) return "upgrade";
  return "downgrade";
}

export default function SubscriptionsPage() {
  const queryClient = useQueryClient();
  const { data: plansRes, isLoading: loadingPlans } = useProviderActivePlans();

  const [isFinalizing, setIsFinalizing] = useState(false);
  const { data: statusRes, isLoading: loadingStatus } = useProviderStatus({
    refetchInterval: isFinalizing ? 1500 : false,
  });

  const checkoutMutation = useCreateSubscriptionCheckout();
  const upgradeMutation = useCreateSubscriptionUpgradeCheckout();

  const [checkoutClientSecret, setCheckoutClientSecret] = useState<
    string | null
  >(null);
  const [checkoutMode, setCheckoutMode] = useState<"subscribe" | "upgrade">(
    "subscribe",
  );
  const [pendingCheckoutPlanId, setPendingCheckoutPlanId] = useState<
    string | null
  >(null);

  const plans = plansRes?.data || [];
  const status = statusRes?.data;
  const history = status?.history || [];

  const hasActiveSubscription = Boolean(
    status?.activeSubscriptionExpiresAt &&
    new Date(status.activeSubscriptionExpiresAt) > new Date(),
  );

  const currentPlan = hasActiveSubscription
    ? plans.find((p) => p.id === status?.activeSubscriptionPlanId)
    : null;

  useEffect(() => {
    if (
      isFinalizing &&
      pendingCheckoutPlanId &&
      status?.activeSubscriptionPlanId === pendingCheckoutPlanId
    ) {
      setIsFinalizing(false);
      setPendingCheckoutPlanId(null);
      toast.success("Your subscription is now active!");
    }
  }, [isFinalizing, pendingCheckoutPlanId, status?.activeSubscriptionPlanId]);

  useEffect(() => {
    if (!isFinalizing) return;
    const timeout = setTimeout(() => {
      setIsFinalizing(false);
      setPendingCheckoutPlanId(null);
    }, 20000);
    return () => clearTimeout(timeout);
  }, [isFinalizing]);

  const handleCheckoutInit = (planId: string) => {
    checkoutMutation.mutate(planId, {
      onSuccess: (res) => {
        if (res.data) {
          setCheckoutMode("subscribe");
          setCheckoutClientSecret(res.data.clientSecret);
          setPendingCheckoutPlanId(planId);
        }
      },
      onError: (err) => {
        toast.error(err.message || "Failed to initialize checkout session");
      },
    });
  };

  const handleUpgradeInit = (planId: string) => {
    upgradeMutation.mutate(planId, {
      onSuccess: (res) => {
        if (res.data) {
          setCheckoutMode("upgrade");
          setCheckoutClientSecret(res.data.clientSecret);
          setPendingCheckoutPlanId(planId);
        }
      },
      onError: (err) => {
        toast.error(err.message || "Failed to initialize upgrade checkout");
      },
    });
  };

  const handlePaymentSuccess = () => {
    setCheckoutClientSecret(null);
    setIsFinalizing(true);
    queryClient.invalidateQueries({
      queryKey: subscriptionKeys.providerStatus(),
    });
  };

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

      {/* FINALIZING BANNER */}
      {isFinalizing && (
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700 flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Finalizing your subscription — this usually takes a few seconds.
        </div>
      )}

      {/* ACTIVE PLAN COVER */}
      <ActivePlanCover
        loading={loadingStatus}
        hasActiveSubscription={hasActiveSubscription}
        planName={status?.activeSubscriptionPlanName}
        expiresAt={status?.activeSubscriptionExpiresAt}
      />

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
              const action = getPlanCardAction(
                p,
                hasActiveSubscription,
                currentPlan,
              );

              const isPending =
                (checkoutMutation.isPending &&
                  checkoutMutation.variables === p.id) ||
                (upgradeMutation.isPending &&
                  upgradeMutation.variables === p.id) ||
                (isFinalizing && pendingCheckoutPlanId === p.id);

              return (
                <PlanCard
                  key={p.id}
                  plan={p}
                  action={action}
                  isPending={isPending}
                  isFinalizing={isFinalizing}
                  onSubscribe={handleCheckoutInit}
                  onUpgrade={handleUpgradeInit}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* STRIPE DIALOG CONTEXT */}
      {checkoutClientSecret && (
        <StripeCheckoutDialog
          clientSecret={checkoutClientSecret}
          mode={checkoutMode}
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

        <BillingHistoryTable history={history} />
      </div>
    </div>
  );
}
