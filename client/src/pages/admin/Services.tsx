import { useState, useEffect, useMemo } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  MoreHorizontal,
  Power,
  Loader2,
  TimerOff,
  Edit2,
} from "lucide-react";
import { toast } from "sonner";

// Components
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Hooks
import { useGetAllPaginatedServices } from "@/hooks/admin/service/useGetAllPaginatedServices";
import { useCreateServiceMutation } from "@/hooks/admin/service/useCreateService";
import { useUpdateServiceMutation } from "@/hooks/admin/service/useUpdateService";
import { useGetAllCategoriesAdmin } from "@/hooks/admin/category/useGetAllCategoriesAdmin";

// Types/Validations
import {
  createServiceSchema,
  type CreateServiceFormInput,
  type CreateServiceFormValues,
} from "@/utils/validations/admin/add-service.schema";
import { ServiceResponse } from "@/interfaces/admin/service.interface";
import { useToggleService } from "@/hooks/admin/service/useToggleService";

export default function Services() {
  // --- STATE ---
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null,
  );

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"onsite" | "offsite" | "both" | undefined>();
  const [isActive, setIsActive] = useState<boolean | undefined>();
  const [sortBy, setSortBy] = useState<"name" | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const limit = 8;

  // --- SEARCH DEBOUNCE ---
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(t);
  }, [search]);

  const params = useMemo(
    () => ({
      page,
      limit,
      search: debouncedSearch,
      mode,
      isActive,
      sortBy,
      sortOrder,
    }),
    [page, debouncedSearch, mode, isActive, sortBy, sortOrder],
  );

  // --- QUERIES & MUTATIONS ---
  const {
    data: servicesRes,
    isLoading,
    isFetching,
  } = useGetAllPaginatedServices(params);
  const { data: categoriesRes } = useGetAllCategoriesAdmin();

  const createService = useCreateServiceMutation();
  const updateService = useUpdateServiceMutation();
  const toggleService = useToggleService();

  const services = servicesRes?.data?.data || [];
  const totalPages = servicesRes?.data?.totalPages || 1;
  const categories = categoriesRes?.data || [];

  // --- FORM SETUP ---
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateServiceFormInput, any, CreateServiceFormValues>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      maxHour: 1,
      mode: "onsite",
      isActive: true,
    },
  });

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

  // --- HANDLERS ---

  const onOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setIsEditing(false);
      setSelectedServiceId(null);
      reset({
        name: "",
        description: "",
        categoryId: "",
        maxHour: 1,
        mode: "onsite",
        isActive: true,
      });
    }
  };

  const handleEditClick = (service: ServiceResponse) => {
    setIsEditing(true);
    setSelectedServiceId(service.id);
    reset({
      name: service.name,
      description: service.description || "",
      categoryId: service.categoryId,
      maxHour: service.maxHour,
      mode: service.mode,
      isActive: service.isActive,
    });
    setDialogOpen(true);
  };

  const handleToggleStatus = (service: ServiceResponse) => {
    const promise = toggleService.mutateAsync({
      serviceId: service.id,
      isActive: !service.isActive,
    });

    toast.promise(promise, {
      loading: "Updating status...",
      success: (res) => res.message || "Status updated successfully",
      error: (err) => err?.message || "Failed to update status",
    });
  };

  const onSubmit = (data: CreateServiceFormValues) => {
    if (isEditing && selectedServiceId) {
      updateService.mutate(
        { id: selectedServiceId, ...data },
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

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || "Unknown";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-sm text-muted-foreground">
            Manage marketplace services
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-xs"
        />

        <Select
          value={mode || "all"}
          onValueChange={(val) => {
            setMode(val === "all" ? undefined : (val as typeof mode));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modes</SelectItem>
            <SelectItem value="onsite">Onsite</SelectItem>
            <SelectItem value="offsite">Offsite</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={isActive === undefined ? "all" : String(isActive)}
          onValueChange={(val) => {
            setIsActive(val === "all" ? undefined : val === "true");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(val: "name" | "createdAt") => {
            setSortBy(val);
            setSortOrder(val === "name" ? "asc" : "desc");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Recent</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortOrder}
          onValueChange={(val: "asc" | "desc") => {
            setSortOrder(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Desc</SelectItem>
            <SelectItem value="asc">Asc</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* CONTENT */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-2">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
          <p className="text-sm text-muted-foreground">Loading services...</p>
        </div>
      ) : (
        <>
          {isFetching && (
            <div className="flex items-center gap-2 text-[10px] text-primary animate-pulse">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" /> Syncing
              data...
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {services.map((s) => (
              <Card
                key={s.id}
                className="group shadow-sm hover:shadow-md transition-all border-muted/60"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <Badge
                      variant="secondary"
                      className="capitalize text-[10px] font-medium px-2 py-0"
                    >
                      {s.mode}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => handleEditClick(s)}>
                          <Edit2 className="mr-2 h-3.5 w-3.5" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={updateService.isPending}
                          onClick={() => handleToggleStatus(s)}
                        >
                          <Power
                            className={`mr-2 h-3.5 w-3.5 ${s.isActive ? "text-destructive" : "text-green-500"}`}
                          />
                          {s.isActive ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <h3 className="font-semibold text-sm truncate">{s.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 mb-3 line-clamp-2 min-h-[32px]">
                    {s.description || "No description provided."}
                  </p>

                  <div className="flex flex-col gap-1.5 text-[11px] border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium bg-muted px-2 py-0.5 rounded">
                        {getCategoryName(s.categoryId)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Work Unit</span>
                      <span
                        className={`font-medium ${s.maxHour ? "text-primary" : "text-orange-500"}`}
                      >
                        {s.maxHour ? `${s.maxHour} Hours Max` : "Fixed Project"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] mt-4">
                    <div
                      className={`h-2 w-2 rounded-full ${s.isActive ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}
                    />
                    <span
                      className={
                        s.isActive
                          ? "text-green-600 font-medium"
                          : "text-muted-foreground"
                      }
                    >
                      {s.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {services.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed rounded-xl bg-muted/10">
              <p className="text-muted-foreground">
                No services match your criteria.
              </p>
            </div>
          )}

          {services.length > 0 && totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={
                      page === 1
                        ? "pointer-events-none opacity-40"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => {
                  const pageNumber = i + 1;

                  // Show first page, last page, current page, and pages around current page
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= page - 1 && pageNumber <= page + 1)
                  ) {
                    return (
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={() => setPage(pageNumber)}
                          isActive={page === pageNumber}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  // Show ellipsis for gaps
                  if (
                    (pageNumber === page - 2 && pageNumber > 1) ||
                    (pageNumber === page + 2 && pageNumber < totalPages)
                  ) {
                    return <PaginationEllipsis key={i} />;
                  }

                  return null;
                })}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className={
                      page === totalPages
                        ? "pointer-events-none opacity-40"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      {/* FORM DIALOG */}
      <Dialog open={dialogOpen} onOpenChange={onOpenChange}>
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
                        className={
                          errors.categoryId ? "border-destructive" : ""
                        }
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
    </div>
  );
}
