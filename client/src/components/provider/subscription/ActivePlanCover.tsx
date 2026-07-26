import { Loader2, Crown, Calendar, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ActivePlanCoverProps {
  loading: boolean;
  hasActiveSubscription: boolean;
  planName: string | null | undefined;
  expiresAt: string | null | undefined;
}

export function ActivePlanCover({
  loading,
  hasActiveSubscription,
  planName,
  expiresAt,
}: ActivePlanCoverProps) {
  if (loading) {
    return (
      <div className="h-40 flex items-center justify-center border rounded-2xl bg-card/20">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <span className="text-muted-foreground text-sm">
          Fetching billing profile...
        </span>
      </div>
    );
  }

  if (!hasActiveSubscription) {
    return (
      <Card className="bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 border-dashed border-2 shadow-sm text-foreground">
        <CardContent className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
              <XCircle className="h-5 w-5 text-amber-500" />
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
    );
  }

  return (
    <Card className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/20 text-white relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <CardContent className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-amber-400 fill-amber-400/20" />
            <h2 className="text-2xl font-black">Active Tier: {planName}</h2>
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
                {expiresAt
                  ? new Date(expiresAt).toLocaleDateString(undefined, {
                      dateStyle: "medium",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}