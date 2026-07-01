import { UseFormReturn } from "react-hook-form";
import { Loader2 } from "lucide-react";
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

export interface PlanFormData {
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly" | "";
  featuresString: string;
  isActive: boolean;
}

interface PlanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  formMethods: UseFormReturn<PlanFormData>;
  onSubmit: (values: PlanFormData) => void;
  isPending: boolean;
}

export function PlanFormDialog({
  open,
  onOpenChange,
  isEditing,
  formMethods,
  onSubmit,
  isPending,
}: PlanFormDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = formMethods;

  const isActiveValue = watch("isActive");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              {...register("name", {
                required: "Plan name is required",
                pattern: {
                  value: /[A-Za-z]{3}/,
                  message: "At least 3 letter name preferred",
                },
              })}
            />
            {errors.name && (
              <p className="text-xs font-medium text-destructive mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                placeholder="e.g. 499"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price cannot be negative" },
                })}
              />
              {errors.price && (
                <p className="text-xs font-medium text-destructive mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="billingCycle">Billing Interval</Label>
              <select
                id="billingCycle"
                className={`flex h-9 w-full rounded-md border px-3 py-1.5 text-sm bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.billingCycle ? "border-destructive" : "border-input"
                }`}
                {...register("billingCycle", {
                  required: "Please pick an interval",
                })}
              >
                <option value="" disabled hidden>
                  Select interval...
                </option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              {errors.billingCycle && (
                <p className="text-xs font-medium text-destructive mt-1">
                  {errors.billingCycle.message}
                </p>
              )}
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
              <p className="text-xs text-muted-foreground">
                Allow providers to see and subscribe to this plan.
              </p>
            </div>
            <Switch
              checked={isActiveValue}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Create Plan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}