import { useEffect, useMemo } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, TimerOff } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCreateServiceMutation } from "@/hooks/admin/service/useCreateService";
import { useUpdateServiceMutation } from "@/hooks/admin/service/useUpdateService";
import {
  createServiceSchema,
  type CreateServiceFormInput,
  type CreateServiceFormValues,
} from "@/utils/validations/admin/add-service.schema";
import { ServiceResponse } from "@/interfaces/admin/service.interface";

// Minimal shape this dialog needs from a category. If your
// useGetAllCategoriesAdmin hook already exports a proper Category type,
// swap this out for that import instead of keeping a duplicate shape.
export interface ServiceCategoryOption {
  id: string;
  name: string;
  mode?: "onsite" | "offsite" | "both";
}

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** null = create mode, a service = edit mode */
  service: ServiceResponse | null;
  categories: ServiceCategoryOption[];
}

const emptyDefaults: CreateServiceFormValues = {
  name: "",
  description: "",
  categoryId: "",
  maxHour: 1,
  mode: "onsite",
  isActive: true,
};

export function ServiceFormDialog({
  open,
  onOpenChange,
  service,
  categories,
}: ServiceFormDialogProps) {
  const isEditing = !!service;

  const createService = useCreateServiceMutation();
  const updateService = useUpdateServiceMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateServiceFormInput, any, CreateServiceFormValues>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: emptyDefaults,
  });

  // Re-sync the form whenever the dialog opens or the service to edit changes.
  // This replaces the parent having to call reset() itself.
  useEffect(() => {
    if (!open) return;

    if (service) {
      reset({
        name: service.name,
        description: service.description || "",
        categoryId: service.categoryId,
        maxHour: service.maxHour,
        mode: service.mode,
        isActive: service.isActive,
      });
    } else {
      reset(emptyDefaults);
    }
  }, [open, service, reset]);

  const selectedCategoryId = useWatch({ control, name: "categoryId" });
  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === selectedCategoryId),
    [selectedCategoryId, categories],
  );

  useEffect(() => {
    if (selectedCategory?.mode) {
      setValue("mode", selectedCategory.mode);
      if (selectedCategory.mode === "offsite") setValue("maxHour", null);
    }
  }, [selectedCategory, setValue]);

  const onSubmit = (data: CreateServiceFormValues) => {
    if (isEditing && service) {
      updateService.mutate(
        { id: service.id, ...data },
        {
          onSuccess: (res) => {
            toast.success(res.message || "Service updated successfully");
            onOpenChange(false);
          },
          onError: (error) => {
            toast.error(error.message || "Error updating service");
          },
        },
      );
    } else {
      createService.mutate(data, {
        onSuccess: (res) => {
          toast.success(res.message || "Service created successfully");
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message || "Error creating service");
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Service" : "Create New Service"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Modify the service details below."
                : "Add a specific service offering to the platform."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className={errors.categoryId ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && (
                <p className="text-[10px] text-destructive">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Service Name</Label>
              <Input
                {...register("name")}
                placeholder="e.g. 4K Video Editing"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-[10px] text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Service Mode</Label>
                <div className="h-10 flex items-center px-3 border rounded-md bg-muted text-xs capitalize">
                  {selectedCategory?.mode || "Select category..."}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  className={
                    selectedCategory?.mode === "offsite"
                      ? "text-muted-foreground/50"
                      : ""
                  }
                >
                  Max Hours
                </Label>
                {selectedCategory?.mode === "offsite" ? (
                  <div className="h-10 flex items-center justify-center bg-muted/30 border border-dashed rounded-md text-[10px] text-muted-foreground uppercase">
                    <TimerOff className="h-3 w-3 mr-1" /> Fixed Price
                  </div>
                ) : (
                  <Input
                    type="number"
                    {...register("maxHour")}
                    className={errors.maxHour ? "border-destructive" : ""}
                  />
                )}
                {errors.maxHour && (
                  <p className="text-[10px] text-destructive">
                    {errors.maxHour.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                {...register("description")}
                placeholder="Details about this offering..."
                className={`min-h-[80px] ${errors.description ? "border-destructive" : ""}`}
              />
              {errors.description && (
                <p className="text-[10px] text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between border p-3 rounded-lg bg-muted/10">
              <div className="space-y-0.5">
                <Label className="text-sm">Available for use</Label>
                <p className="text-[10px] text-muted-foreground">
                  Allow providers to select this service
                </p>
              </div>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateService.isPending || createService.isPending}
            >
              {(updateService.isPending || createService.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing ? "Update Service" : "Create Service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}