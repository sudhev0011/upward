import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Plus,
  Loader2,
  MoreHorizontal,
  CheckCircle,
  Crown,
  Search,
  ArrowUpDown,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  useAdminPlans,
  useCreateSubscriptionPlan,
  useUpdateSubscriptionPlan,
  useDeleteSubscriptionPlan,
} from "@/hooks/subscription/useSubscriptions";
import { SubscriptionPlanDto } from "@/api/subscription.api";
import { usePagination } from "@/hooks/usePagination";
import { PlanFormData, PlanFormDialog } from "@/components/admin/subscription/PlanFormDialog";
import { DeletePlanDialog } from "@/components/admin/subscription/DeletePlanDialog";

export default function Subscriptions() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const debouncedSearch = useDebounce(searchTerm, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const {
    data: response,
    isLoading,
    isFetching,
  } = useAdminPlans({
    page,
    search: debouncedSearch,
    sort: sortBy,
    sortOrder,
  });

  const createMutation = useCreateSubscriptionPlan();
  const updateMutation = useUpdateSubscriptionPlan();
  const deleteMutation = useDeleteSubscriptionPlan();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanDto | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);

  const plans = response?.data?.data || [];
  const totalPages = response?.data?.totalPages || 1;
  const currentPage = response?.data?.page || 1;

  const { pageNumbers } = usePagination({ currentPage, totalPages });

  const formMethods = useForm<PlanFormData>({
    defaultValues: {
      name: "",
      price: 0,
      billingCycle: "",
      featuresString: "",
      isActive: true,
    },
  });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const openCreateDialog = () => {
    setIsEditing(false);
    setSelectedPlan(null);
    formMethods.reset({
      name: "",
      price: 0,
      billingCycle: "",
      featuresString: "",
      isActive: true,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (plan: SubscriptionPlanDto) => {
    setIsEditing(true);
    setSelectedPlan(plan);
    formMethods.reset({
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
      { id: plan.id, data: { isActive: !plan.isActive } },
      {
        onSuccess: () => {
          toast.success(
            `Plan set to ${!plan.isActive ? "active" : "inactive"}`,
          );
        },
        onError: (err) => {
          toast.error(err.message || "Failed to update plan status");
        },
      },
    );
  };

  const onSubmit = (values: PlanFormData) => {
    if (values.billingCycle === "") {
      toast.error("Please select a billing interval.");
      return;
    }

    const parsedRequest = {
      name: values.name,
      price: Number(values.price),
      billingCycle: values.billingCycle as "monthly" | "yearly",
      features: values.featuresString
        .split("\n")
        .map((f) => f.trim())
        .filter((f) => f.length > 0),
      isActive: values.isActive,
    };

    if (isEditing && selectedPlan) {
      updateMutation.mutate(
        { id: selectedPlan.id, data: parsedRequest },
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
          <h1 className="text-3xl font-extrabold tracking-tight">
            Subscriptions
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage provider subscription tiers, visibility levels, and pricing
          </p>
        </div>
        <Button
          onClick={openCreateDialog}
          className="shadow-lg active:scale-[0.98]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Plan
        </Button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* ... stats widgets unchanged ... */}
        <Card className="bg-card/50 backdrop-blur-sm border shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Total Subscribers
                </p>
                <p className="text-3xl font-black mt-1 text-primary">
                  {totalSubscribers}
                </p>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Crown className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Active Tiers
                </p>
                <p className="text-3xl font-black mt-1 text-emerald-600">
                  {activePlansCount}
                </p>
              </div>
              <div className="h-10 w-10 bg-emerald-50 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Tiers Configured
                </p>
                <p className="text-3xl font-black mt-1 text-indigo-600">
                  {plans.length}
                </p>
              </div>
              <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center">
                <Crown className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* UTILITIES CONTROLS */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/40 p-4 rounded-xl border">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9"
          />
          {isFetching && !isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-muted-foreground" />
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1.5">
                <ArrowUpDown className="h-3.5 w-3.5" />
                Sort By:{" "}
                {sortBy === "price"
                  ? "Price"
                  : sortBy === "name"
                    ? "Name"
                    : "Date"}
                <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded uppercase">
                  {sortOrder}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleSort("name")}>
                Plan Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("price")}>
                Price Tiers
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("createdAt")}>
                Creation Date
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* PLANS CATALOG */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
          <p className="text-muted-foreground text-sm">
            Fetching plan configurations...
          </p>
        </div>
      ) : plans.length === 0 ? (
        <div className="rounded-xl border border-dashed p-16 text-center text-muted-foreground bg-card/25">
          <Crown className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
          <h3 className="font-semibold text-lg text-foreground mb-1">
            No plans found
          </h3>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((p) => (
              <Card
                key={p.id}
                className={`bg-card/50 backdrop-blur-sm border shadow-sm relative overflow-hidden ${!p.isActive ? "opacity-75" : ""}`}
              >
                <div
                  className={`absolute top-0 left-0 w-full h-1.5 ${p.isActive ? "bg-indigo-500" : "bg-muted"}`}
                />
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold">
                        {p.name}
                      </CardTitle>
                      <CardDescription className="text-xs uppercase mt-0.5 tracking-wider font-semibold">
                        {p.billingCycle} billing
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(p)}>
                          Edit Configuration
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusToggle(p)}>
                          {p.isActive ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => triggerDeletePlan(p)}
                          className="text-destructive"
                        >
                          Delete Tier
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black">₹{p.price}</span>
                    <span className="text-xs text-muted-foreground">
                      /{p.billingCycle === "yearly" ? "yr" : "mo"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px] font-semibold">
                    <Badge variant={p.isActive ? "default" : "secondary"}>
                      {p.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">
                      {p.subscriberCount} Subscribers
                    </Badge>
                  </div>
                  <div className="pt-3 border-t">
                    <ul className="space-y-1.5">
                      {p.features.map((f, i) => (
                        <li key={i} className="text-xs flex items-start gap-2">
                          <CheckCircle className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                          <span className="text-muted-foreground">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* PAGINATION */}
          {plans.length > 0 && totalPages > 1 && (
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
                {pageNumbers.map((pageNumber, idx) => (
                  <PaginationItem key={`page-item-${idx}`}>
                    {pageNumber === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        isActive={currentPage === pageNumber}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(pageNumber);
                        }}
                        className={
                          isLoading
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      >
                        {pageNumber}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
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
        </div>
      )}

      {/* EXTRACTED MODAL MODULES */}
      <PlanFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        isEditing={isEditing}
        formMethods={formMethods}
        onSubmit={onSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <DeletePlanDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        selectedPlan={selectedPlan}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
