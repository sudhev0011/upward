import { Loader2, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SubscriptionPlanDto } from "@/api/subscription.api";

export type PlanCardAction = "current" | "downgrade" | "upgrade" | "subscribe";

interface PlanCardProps {
  plan: SubscriptionPlanDto;
  action: PlanCardAction;
  isPending: boolean;
  isFinalizing: boolean;
  onSubscribe: (planId: string) => void;
  onUpgrade: (planId: string) => void;
}

export function PlanCard({
  plan,
  action,
  isPending,
  isFinalizing,
  onSubscribe,
  onUpgrade,
}: PlanCardProps) {
  const isPopular =
    plan.name.toLowerCase().includes("professional") ||
    plan.name.toLowerCase().includes("pro");

  return (
    <Card
      className={`bg-card/40 backdrop-blur-sm border shadow-sm flex flex-col relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 ${
        isPopular ? "border-indigo-500/40 ring-1 ring-indigo-500/20" : ""
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 bg-indigo-500 text-white font-bold tracking-widest text-[9px] uppercase py-1 px-4 rounded-bl-xl shadow-sm z-10">
          Popular Choice
        </div>
      )}
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
        <CardDescription className="text-xs uppercase mt-0.5 tracking-wider font-semibold">
          {plan.billingCycle} billing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 flex-1 flex flex-col">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black">₹{plan.price}</span>
          <span className="text-xs text-muted-foreground font-semibold">
            /{plan.billingCycle === "yearly" ? "yr" : "mo"}
          </span>
        </div>

        <ul className="space-y-2.5 flex-1">
          <li className="text-xs flex items-center gap-2">
            <CheckCircle className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span className="text-muted-foreground">
              Max Services allowed:{" "}
              <strong className="text-foreground">
                {plan.features?.maxServices ?? 0}
              </strong>
            </span>
          </li>
          <li className="text-xs flex items-center gap-2">
            <CheckCircle className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span className="text-muted-foreground">
              Max Manual Blocks / 30 Days:{" "}
              <strong className="text-foreground">
                {plan.features?.maxManualUnavailability ?? 0}
              </strong>
            </span>
          </li>
          <li className="text-xs flex items-center gap-2">
            <CheckCircle className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span className="text-muted-foreground">
              Max Portfolios:{" "}
              <strong className="text-foreground">
                {plan.features?.maxPortfolios ?? 0}
              </strong>
            </span>
          </li>
        </ul>

        {action === "current" ? (
          <Button disabled className="w-full mt-4 h-9" variant="secondary">
            Current Plan
          </Button>
        ) : action === "downgrade" ? (
          <Button disabled className="w-full mt-4 h-9" variant="secondary">
            Lower Tier
          </Button>
        ) : action === "upgrade" ? (
          <Button
            onClick={() => onUpgrade(plan.id)}
            disabled={isPending}
            className={`w-full mt-4 h-9 shadow-md ${
              isPopular
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-primary hover:bg-primary/95"
            }`}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {isFinalizing ? "Finalizing..." : "Initializing..."}
              </>
            ) : (
              "Upgrade Now"
            )}
          </Button>
        ) : (
          <Button
            onClick={() => onSubscribe(plan.id)}
            disabled={isPending}
            className={`w-full mt-4 h-9 shadow-md ${
              isPopular
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-primary hover:bg-primary/95"
            }`}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {isFinalizing ? "Finalizing..." : "Initializing..."}
              </>
            ) : (
              "Subscribe Now"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}