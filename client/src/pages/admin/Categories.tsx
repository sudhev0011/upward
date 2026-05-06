import { useState, useEffect, useMemo } from "react";
import { Plus, Loader2, MoreHorizontal, AlertTriangle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

// Validation
import {
  categorySchema,
  CategoryFormData,
} from "@/utils/validations/admin/add-category.schema";

// Hooks
import { usePaginatedCategories } from "@/hooks/admin/category/useGetAllPaginatedCategories";
import { useCreateCategoryMutation } from "@/hooks/admin/category/useCreateCategory";
import { useUpdateCategoryMutation } from "@/hooks/admin/category/useUpdateCategory";

// Types
import { CategoryResponse } from "@/interfaces/admin/category.interface";
import { UpdateCategoryRequest } from "@/interfaces/admin/category.interface";

export default function Categories() {
  const queryClient = useQueryClient();

  // State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingToggle, setPendingToggle] =
    useState<UpdateCategoryRequest | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"onsite" | "offsite" | "both" | undefined>(
    undefined,
  );
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [sortBy, setSortBy] = useState<"name" | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const limit = 6;

  // Search Debounce
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
    [page, limit, debouncedSearch, mode, isActive, sortBy, sortOrder],
  );

  const { data: response, isLoading } = usePaginatedCategories(params);
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();

  const categories = response?.data?.data || [];
  const totalPages = response?.data?.totalPages || 1;

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      mode: "onsite",
      isActive: true,
    },
  });

  const handleEditClick = (category: CategoryResponse) => {
    setIsEditing(true);
    setSelectedId(category.id);

    // Set form values to the selected category data
    form.reset({
      name: category.name,
      description: category.description,
      mode: category.mode as "onsite" | "offsite" | "both",
      isActive: category.isActive,
    });

    setDialogOpen(true);
  };

  const onOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setIsEditing(false);
      setSelectedId(null);
      form.reset({
        name: "",
        description: "",
        mode: "onsite",
        isActive: true,
      });
    }
  };

  const triggerStatusToggle = (id: string, currentStatus: boolean) => {
    setPendingToggle({ id, isActive: !currentStatus });
    setConfirmOpen(true);
  };

  const handleConfirmToggle = () => {
    if (!pendingToggle) return;

    updateMutation.mutate(pendingToggle, {
      onSuccess: () => {
        setConfirmOpen(false);
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const onSubmit = (values: CategoryFormData) => {
    if (isEditing && selectedId) {
      // UPDATE LOGIC
      updateMutation.mutate(
        { id: selectedId, ...values },
        {
          onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["categoriesAdmin"] });
            setDialogOpen(false);
            toast.success(res.message || "Category updated successfully");
            onOpenChange(false);
          },
          onError: (error) => toast.error(error.message),
        },
      );
    } else {
      // CREATE LOGIC
      createMutation.mutate(values, {
        onSuccess: (res) => {
          queryClient.invalidateQueries({ queryKey: ["categoriesAdmin"] });
          setDialogOpen(false);
          toast.success(res.message);
          onOpenChange(false);
        },
        onError: (error) => toast.error(error.message),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground text-sm">
            Organize services into categories
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col lg:flex-row gap-3 justify-between">
        <Input
          placeholder="Search categories..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />

        <div className="flex flex-wrap gap-2">
          {/* Mode Filter */}
          <Select
            value={mode || "all"}
            onValueChange={(value) => {
              setMode(value === "all" ? undefined : (value as typeof mode));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Modes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modes</SelectItem>
              <SelectItem value="onsite">Onsite</SelectItem>
              <SelectItem value="offsite">Offsite</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={isActive === undefined ? "all" : String(isActive)}
            onValueChange={(value) => {
              setIsActive(value === "all" ? undefined : value === "true");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort By Filter */}
          <Select
            value={sortBy}
            onValueChange={(value) => {
              setSortBy(value as "name" | "createdAt");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Sort by Date</SelectItem>
              <SelectItem value="name">Sort by Name</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Order Filter */}
          <Select
            value={sortOrder}
            onValueChange={(value) => {
              setSortOrder(value as "asc" | "desc");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* CONTENT */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c: CategoryResponse) => (
              <Card key={c.id}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-sm capitalize">
                      {c.name}
                    </h3>

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
                        <DropdownMenuItem
                          onClick={() => triggerStatusToggle(c.id, c.isActive)}
                          className="cursor-pointer"
                        >
                          {c.isActive ? "Set Inactive" : "Set Active"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive cursor-pointer"
                          onClick={() => handleEditClick(c)}
                        >
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 h-8">
                    {c.description}
                  </p>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground">
                      ID: {c.id.slice(-6).toUpperCase()}
                    </span>

                    <span
                      className={`text-xs font-bold ${c.isActive ? "text-emerald-600" : "text-orange-500"}`}
                    >
                      {c.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* PAGINATION */}
          {categories.length > 0 && totalPages > 1 && (
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

      {/* CREATE DIALOG */}
      <Dialog open={dialogOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Category" : "Create New Category"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Mode</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="onsite">Onsite</SelectItem>
                        <SelectItem value="offsite">Offsite</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between border p-3 rounded">
                    <FormLabel className="m-0">Active by default</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditing ? "Update Category" : "Save Category"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* CONFIRMATION DIALOG */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-orange-600 mb-2">
              <AlertTriangle className="h-5 w-5" />
              <AlertDialogTitle>Change Category Status?</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Are you sure you want to set this category to{" "}
              <span className="font-bold">
                {pendingToggle?.isActive ? "Active" : "Inactive"}
              </span>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmToggle}
              className={
                pendingToggle?.isActive
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-orange-600 hover:bg-orange-700"
              }
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
