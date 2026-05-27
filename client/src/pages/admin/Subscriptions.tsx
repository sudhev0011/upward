import { useState } from "react";
import { Plus, Loader2, MoreHorizontal, CheckCircle, XCircle, Trash2, Crown } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

// UI Components
import { Card, CardContent, CardTitle, CardHeader, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

// Hooks & Types
import {
  useAdminPlans,
  useCreateSubscriptionPlan,
  useUpdateSubscriptionPlan,
  useDeleteSubscriptionPlan,
} from "@/hooks/subscription/useSubscriptions";
import { SubscriptionPlanDto } from "@/api/subscription.api";

interface PlanFormData {
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  featuresString: string;
  isActive: boolean;
}

export default function Subscriptions() {
  const { data: response, isLoading } = useAdminPlans();
  const createMutation = useCreateSubscriptionPlan();
  const updateMutation = useUpdateSubscriptionPlan();
  const deleteMutation = useDeleteSubscriptionPlan();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanDto | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const plans = response?.data || [];

  const { register, handleSubmit, reset, setValue, watch } = useForm<PlanFormData>({
    defaultValues: {
      name: "",
      price: 0,
      billingCycle: "monthly",
      featuresString: "",
      isActive: true,
    },
  });

  const billingCycleValue = watch("billingCycle");
  const isActiveValue = watch("isActive");

  const openCreateDialog = () => {
    setIsEditing(false);
    setSelectedPlan(null);
    reset({
      name: "",
      price: 0,
      billingCycle: "monthly",
      featuresString: "",
      isActive: true,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (plan: SubscriptionPlanDto) => {
    setIsEditing(true);
    setSelectedPlan(plan);
    reset({
      name: plan.name,
      price: plan.price,
      billingCycle: plan.billingCycle,
      featuresString: plan.features.join("\n"),
      isActive: plan.isActive,
    });
    setDialogOpen(true);
  };

  const triggerDeletePlan = (plan: SubscriptionPlanDto) => {
    setSelectedPlan(plan);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedPlan) return;

    deleteMutation.mutate(selectedPlan.id, {
      onSuccess: () => {
        toast.success("Subscription plan deleted successfully");
        setDeleteOpen(false);
        setSelectedPlan(null);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to delete subscription plan");
      },
    });
  };

  const handleStatusToggle = (plan: SubscriptionPlanDto) => {
    updateMutation.mutate(
      {
        id: plan.id,
        data: { isActive: !plan.isActive },
      },
      {
        onSuccess: () => {
          toast.success(`Plan set to ${!plan.isActive ? "active" : "inactive"}`);
        },
        onError: (err) => {
          toast.error(err.message || "Failed to update plan status");
        },
      },
    );
  };

  const onSubmit = (values: PlanFormData) => {
    const parsedRequest = {
      name: values.name,
      price: Number(values.price),
      billingCycle: values.billingCycle,
      features: values.featuresString
        .split("\n")
        .map((f) => f.trim())
        .filter((f) => f.length > 0),
      isActive: values.isActive,
    };

    if (isEditing && selectedPlan) {
      updateMutation.mutate(
        {
          id: selectedPlan.id,
          data: parsedRequest,
        },
        {
          onSuccess: () => {
            toast.success("Subscription plan updated successfully");
            setDialogOpen(false);
          },
          onError: (err) => {
            toast.error(err.message || "Failed to update subscription plan");
          },
        },
      );
    } else {
      createMutation.mutate(parsedRequest, {
        onSuccess: () => {
          toast.success("Subscription plan created successfully");
          setDialogOpen(false);
        },
        onError: (err) => {
          toast.error(err.message || "Failed to create subscription plan");
        },
      });
    }
  };

  const totalSubscribers = plans.reduce((acc, p) => acc + p.subscriberCount, 0);
  const activePlansCount = plans.filter((p) => p.isActive).length;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Subscriptions</h1>
          <p className="text-muted-foreground text-sm">
            Manage provider subscription tiers, visibility levels, and pricing
          </p>
        </div>
        <Button onClick={openCreateDialog} className="bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg transition-transform active:scale-[0.98]">
          <Plus className="h-4 w-4 mr-2" />
          Create Plan
        </Button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card/50 backdrop-blur-sm border shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Subscriber Base</p>
                <p className="text-3xl font-black mt-1 text-primary">{totalSubscribers}</p>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Crown className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Tiers</p>
                <p className="text-3xl font-black mt-1 text-emerald-600">{activePlansCount}</p>
              </div>
              <div className="h-10 w-10 bg-emerald-50 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Tiers Configured</p>
                <p className="text-3xl font-black mt-1 text-indigo-600">{plans.length}</p>
              </div>
              <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center">
                <Crown className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PLANS CATALOG */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
          <p className="text-muted-foreground text-sm">Fetching plan configurations...</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="rounded-xl border border-dashed p-16 text-center text-muted-foreground bg-card/25">
          <Crown className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
          <h3 className="font-semibold text-lg text-foreground mb-1">No plans available</h3>
          <p className="text-sm max-w-md mx-auto mb-4">You have not created any subscription plans yet. Create one to allow providers to subscribe.</p>
          <Button onClick={openCreateDialog} size="sm">Create Plan</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((p) => (
            <Card key={p.id} className={`bg-card/50 backdrop-blur-sm border shadow-sm relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 ${!p.isActive ? "opacity-75" : ""}`}>
              <div className={`absolute top-0 left-0 w-full h-1.5 ${p.isActive ? "bg-indigo-500" : "bg-muted"}`} />
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold">{p.name}</CardTitle>
                    <CardDescription className="text-xs uppercase mt-0.5 tracking-wider font-semibold">
                      {p.billingCycle} billing
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(p)} className="cursor-pointer">
                        Edit Configuration
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusToggle(p)} className="cursor-pointer">
                        {p.isActive ? "Deactivate Tier" : "Activate Tier"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => triggerDeletePlan(p)} className="text-destructive focus:text-destructive cursor-pointer">
                        Delete Tier
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* PRICE */}
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black">₹{p.price}</span>
                  <span className="text-xs text-muted-foreground font-semibold">/{p.billingCycle === "yearly" ? "yr" : "mo"}</span>
                </div>

                {/* VISUAL INDICATORS */}
                <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase">
                  <Badge variant={p.isActive ? "default" : "secondary"} className="h-5 px-2">
                    {p.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline" className="h-5 px-2 bg-background/50">
                    {p.subscriberCount} Subscribers
                  </Badge>
                </div>

                {/* FEATURES LIST */}
                <div className="pt-3 border-t">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Features Included</p>
                  <ul className="space-y-1.5">
                    {p.features.map((f, i) => (
                      <li key={i} className="text-xs flex items-start gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-indigo-500 mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                    {p.features.length === 0 && (
                      <li className="text-xs text-muted-foreground/50 italic">No features specified</li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* CREATE/EDIT DIALOG */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {isEditing ? "Edit Subscription Tier" : "Create New Subscription Tier"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <div className="space-y-1">
              <Label htmlFor="name">Plan Name</Label>
              <Input
                id="name"
                placeholder="e.g. Professional Premium"
                {...register("name", { required: true })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g. 499"
                  {...register("price", { required: true, min: 0 })}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="billingCycle">Billing Interval</Label>
                <select
                  id="billingCycle"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("billingCycle")}
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="featuresString">Features (one per line)</Label>
              <textarea
                id="featuresString"
                rows={4}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. Featured Search Listing&#10;Unlimited Job Bidding&#10;Premium Chat Badges"
                {...register("featuresString")}
              />
            </div>

            <div className="flex items-center justify-between border p-3 rounded-lg bg-muted/20">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold">Active Tier</Label>
                <p className="text-xs text-muted-foreground">Allow providers to see and subscribe to this plan.</p>
              </div>
              <Switch
                checked={isActiveValue}
                onCheckedChange={(checked) => setValue("isActive", checked)}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? "Save Changes" : "Create Plan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CONFIRM DELETE DIALOG */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-destructive mb-2">
              <Trash2 className="h-5 w-5" />
              <AlertDialogTitle>Delete Subscription Tier?</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Are you sure you want to permanently delete the subscription plan{" "}
              <span className="font-bold text-foreground">"{selectedPlan?.name}"</span>? 
              This action cannot be undone. Active subscribers will not be affected but no new subscriptions can be created under this tier.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/95">
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
