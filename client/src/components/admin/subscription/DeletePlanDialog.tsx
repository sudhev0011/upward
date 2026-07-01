import { Trash2 } from "lucide-react";
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
import { SubscriptionPlanDto } from "@/api/subscription.api";

interface DeletePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlan: SubscriptionPlanDto | null;
  onConfirm: () => void;
}

export function DeletePlanDialog({
  open,
  onOpenChange,
  selectedPlan,
  onConfirm,
}: DeletePlanDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-destructive mb-2">
            <Trash2 className="h-5 w-5" />
            <AlertDialogTitle>Delete Subscription Tier?</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Are you sure you want to permanently delete the subscription plan{" "}
            <span className="font-bold text-foreground">
              "{selectedPlan?.name}"
            </span>
            ? This action cannot be undone. Active subscribers will not be
            affected but no new subscriptions can be created under this tier.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive hover:bg-destructive/95"
          >
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}