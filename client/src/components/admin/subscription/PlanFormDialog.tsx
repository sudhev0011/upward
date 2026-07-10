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

// 1. Updated form structure to hold explicit configuration properties
export interface PlanFormData {
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly" | "";
  isActive: boolean;
  maxServices: number;
  maxManualUnavailability: number;
  maxPortfolios: number;
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
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing
              ? "Edit Subscription Tier"
              : "Create New Subscription Tier"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Plan Name */}
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

          {/* Pricing & Cycle */}
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
                  valueAsNumber: true,
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

          <hr className="my-2 border-muted" />

          {/* 2. Structured Numerical Feature Limits */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
              Plan Limits & Features
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="maxServices">Max Active Services</Label>
                <Input
                  id="maxServices"
                  type="number"
                  placeholder="3"
                  {...register("maxServices", {
                    required: "Required",
                    min: { value: 1, message: "Must be at least 1" },
                    valueAsNumber: true,
                  })}
                />
                {errors.maxServices && (
                  <p className="text-xs font-medium text-destructive mt-1">
                    {errors.maxServices.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="maxManualUnavailability">
                  Manual Blocks / 30 Days
                </Label>
                <Input
                  id="maxManualUnavailability"
                  type="number"
                  placeholder="2"
                  {...register("maxManualUnavailability", {
                    required: "Required",
                    min: { value: 0, message: "Cannot be negative" },
                    valueAsNumber: true,
                  })}
                />
                {errors.maxManualUnavailability && (
                  <p className="text-xs font-medium text-destructive mt-1">
                    {errors.maxManualUnavailability.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="maxPortfolios">Max Portfolios</Label>
              <Input
                id="maxPortfolios"
                type="number"
                placeholder="1"
                {...register("maxPortfolios", {
                  required: "Required",
                  min: { value: 1, message: "Must be at least 1" },
                  valueAsNumber: true,
                })}
              />
              {errors.maxPortfolios && (
                <p className="text-xs font-medium text-destructive mt-1">
                  {errors.maxPortfolios.message}
                </p>
              )}
            </div>
          </div>

          {/* Plan Status */}
          <div className="flex items-center justify-between border p-3 rounded-lg bg-muted/10">
            <div className="space-y-0.5 pr-2">
              <Label className="text-sm font-semibold">Active Tier</Label>
              <p className="text-xs text-muted-foreground">
                Allow providers to see and subscribe to this plan immediately.
              </p>
            </div>
            <Switch
              checked={isActiveValue}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
          </div>

          {/* Form Actions */}
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
