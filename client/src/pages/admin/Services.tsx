import { useState, useEffect, useMemo } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, MoreHorizontal, Power, Loader2, TimerOff } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// ✅ NEW HOOK
import { useGetAllPaginatedServices } from "@/hooks/admin/service/useGetAllPaginatedServices";

import { useCreateServiceMutation } from "@/hooks/admin/service/useCreateService";
import { useGetAllCategoriesAdmin } from "@/hooks/admin/category/useGetAllCategoriesAdmin";
import { useToggleService } from "@/hooks/admin/service/useToggleService";

import {
  createServiceSchema,
  type CreateServiceFormInput,
  type CreateServiceFormValues,
} from "@/utils/validations/admin/add-service.schema";

export default function Services() {
  const [dialogOpen, setDialogOpen] = useState(false);

  // 🔥 STATE (pagination + filters + sorting)
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"onsite" | "offsite" | "both" | undefined>();
  const [isActive, setIsActive] = useState<boolean | undefined>();
  const [sortBy, setSortBy] = useState<"name" | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const limit = 8;

  // 🔥 debounce
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(t);
  }, [search]);

  // 🔥 params
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
    [page, limit, debouncedSearch, mode, isActive, sortBy, sortOrder],
  );

  const {
    data: servicesRes,
    isLoading,
    isFetching,
  } = useGetAllPaginatedServices(params);

  const services = servicesRes?.data?.data || [];
  const totalPages = servicesRes?.data?.totalPages || 1;

  const { data: categoriesRes } = useGetAllCategoriesAdmin();
  const categories = categoriesRes?.data || [];

  const createService = useCreateServiceMutation();
  const toggleService = useToggleService();

  // FORM
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

  const currentMode = useWatch({ control, name: "mode" });
  const selectedCategoryId = useWatch({ control, name: "categoryId" });

  const selectedCategory = useMemo(() => {
    return categories.find((c) => c.id === selectedCategoryId);
  }, [selectedCategoryId, categories]);
  useEffect(() => {
    if (selectedCategory?.mode) {
      setValue("mode", selectedCategory.mode);

      // reset maxHour if offsite
      if (selectedCategory.mode === "offsite") {
        setValue("maxHour", null);
      }
    }
  }, [selectedCategory, setValue]);

  const onSubmit = (data: CreateServiceFormValues) => {
    createService.mutate(data, {
      onSuccess: () => {
        toast.success("Service created successfully");
        setDialogOpen(false);
        reset();
      },
      onError: () => {
        toast.error("Failed to create service");
      },
    });
  };

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || "Unknown";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between">
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

      {/* 🔍 SEARCH + FILTERS */}
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-xs"
        />

        {/* MODE */}
        <select
          className="border px-2 py-1 rounded text-sm"
          value={mode || ""}
          onChange={(e) => {
            const val = e.target.value;
            setMode(val === "" ? undefined : (val as any));
            setPage(1);
          }}
        >
          <option value="">All Modes</option>
          <option value="onsite">Onsite</option>
          <option value="offsite">Offsite</option>
          <option value="both">Both</option>
        </select>

        {/* ACTIVE */}
        <select
          className="border px-2 py-1 rounded text-sm"
          value={isActive === undefined ? "" : String(isActive)}
          onChange={(e) => {
            const val = e.target.value;
            setIsActive(val === "" ? undefined : val === "true");
            setPage(1);
          }}
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {/* SORT BY */}
        <select
          className="border px-2 py-1 rounded text-sm"
          value={sortBy}
          onChange={(e) => {
            const val = e.target.value as "name" | "createdAt";
            setSortBy(val);
            setSortOrder(val === "name" ? "asc" : "desc");
            setPage(1);
          }}
        >
          <option value="createdAt">Sort by Date</option>
          <option value="name">Sort by Name</option>
        </select>

        {/* ORDER */}
        <select
          className="border px-2 py-1 rounded text-sm"
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value as "asc" | "desc");
            setPage(1);
          }}
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>

      {/* CONTENT */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin h-8 w-8" />
        </div>
      ) : (
        <>
          {isFetching && <p className="text-xs">Updating...</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {services.map((s) => (
              <Card
                key={s.id}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-5">
                  {/* 🔝 TOP BAR */}
                  <div className="flex items-start justify-between mb-3">
                    <Badge
                      variant="secondary"
                      className="capitalize text-[10px] font-medium"
                    >
                      {s.mode}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          disabled={toggleService.isPending}
                          onClick={() => {
                            toggleService.mutate({
                              serviceId: s.id,
                              isActive: !s.isActive,
                            });
                          }}
                        >
                          {toggleService.isPending ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Updating...
                            </span>
                          ) : s.isActive ? (
                            "Deactivate"
                          ) : (
                            "Activate"
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* 🧾 TITLE */}
                  <h3 className="font-semibold text-sm text-foreground truncate">
                    {s.name}
                  </h3>

                  {/* 📄 DESCRIPTION */}
                  <p className="text-xs text-muted-foreground mt-1 mb-3 line-clamp-2 min-h-[32px]">
                    {s.description || "No description"}
                  </p>

                  {/* 📊 DETAILS */}
                  <div className="flex flex-col gap-1.5 text-[11px] border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium bg-muted px-2 py-0.5 rounded text-foreground">
                        {getCategoryName(s.categoryId)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Work Unit</span>
                      <span
                        className={`font-medium ${
                          s.maxHour ? "text-primary" : "text-orange-500"
                        }`}
                      >
                        {s.maxHour ? `${s.maxHour} Hours Max` : "Fixed Project"}
                      </span>
                    </div>
                  </div>

                  {/* 🔘 STATUS */}
                  <div className="flex items-center gap-1.5 text-[10px] mt-4">
                    <Power
                      className={`h-3 w-3 ${
                        s.isActive ? "text-green-500" : "text-gray-300"
                      }`}
                    />
                    <span
                      className={
                        s.isActive ? "text-green-600" : "text-muted-foreground"
                      }
                    >
                      {s.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* EMPTY STATE */}
            {services.length === 0 && (
              <div className="col-span-full py-10 text-center border-2 border-dashed rounded-xl">
                <p className="text-muted-foreground">No services found.</p>
              </div>
            )}
          </div>

          {services.length > 0 && totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => p - 1)}
                    className={
                      page === 1
                        ? "pointer-events-none opacity-50"
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
                    onClick={() => setPage((p) => p + 1)}
                    className={
                      page === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      {/* DIALOG (unchanged except no refetch needed) */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create New Service</DialogTitle>
              <DialogDescription>
                Add a specific service offering to the platform.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Category */}
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

              {/* Service Name */}
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

              {/* Mode & MaxHour Logic */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Service Mode</Label>

                  <div className="h-10 flex items-center px-3 border rounded-md bg-muted text-sm capitalize">
                    {selectedCategory?.mode || "Select category first"}
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
                    <div className="h-10 flex items-center justify-center bg-muted/50 border border-dashed rounded-md text-[10px] text-muted-foreground uppercase tracking-wider">
                      <TimerOff className="h-3 w-3 mr-1" /> Not Required
                    </div>
                  ) : (
                    <>
                      <Input
                        type="number"
                        {...register("maxHour")}
                        className={errors.maxHour ? "border-destructive" : ""}
                      />
                      {errors.maxHour && (
                        <p className="text-[10px] text-destructive">
                          {errors.maxHour.message}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  {...register("description")}
                  placeholder="Explain what this service covers..."
                  className={`min-h-[80px] ${errors.description ? "border-destructive" : ""}`}
                />
                {errors.description && (
                  <p className="text-[10px] text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Active Switch */}
              <div className="flex items-center justify-between border p-3 rounded-lg bg-muted/20">
                <div className="space-y-0.5">
                  <Label className="text-sm">Active Status</Label>
                  <p className="text-[10px] text-muted-foreground">
                    Make this service visible to providers
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
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createService.isPending}>
                {createService.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {createService.isPending ? "Creating..." : "Save Service"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
