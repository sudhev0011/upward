import { useState, useEffect, useMemo } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationLink,
} from "@/components/ui/pagination";

import { useGetAllPaginatedServices } from "@/hooks/admin/service/useGetAllPaginatedServices";
import { useGetAllCategoriesAdmin } from "@/hooks/admin/category/useGetAllCategoriesAdmin";
import { useToggleService } from "@/hooks/admin/service/useToggleService";
import { usePagination } from "@/hooks/usePagination";

import { ServiceResponse } from "@/interfaces/admin/service.interface";
import { ServiceCard } from "@/components/admin/services/ServiceCard";
import {
  ServiceFilters,
  type ServiceMode,
  type ServiceSortBy,
  type ServiceSortOrder,
} from "@/components/admin/services/ServiceFilters";
import { ServiceFormDialog } from "@/components/admin/services/ServiceFormDialog";

export default function Services() {
  // --- DIALOG STATE ---
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceResponse | null>(
    null,
  );

  // --- FILTER / PAGINATION STATE ---
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<ServiceMode | undefined>();
  const [isActive, setIsActive] = useState<boolean | undefined>();
  const [sortBy, setSortBy] = useState<ServiceSortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<ServiceSortOrder>("desc");

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
  const toggleService = useToggleService();

  const services = servicesRes?.data?.data || [];
  const categories = categoriesRes?.data || [];

  // --- PAGINATION (usePagination handles the page-number/ellipsis math) ---
  const currentPage = servicesRes?.data?.page || page || 1;
  const totalPages = servicesRes?.data?.totalPages || 1;
  const { pageNumbers } = usePagination({ currentPage, totalPages });

  // --- DIALOG HANDLERS ---
  const openCreateDialog = () => {
    setEditingService(null);
    setDialogOpen(true);
  };

  const openEditDialog = (service: ServiceResponse) => {
    setEditingService(service);
    setDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditingService(null);
  };

  // --- LIST HANDLERS ---
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

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || "Unknown";

  // --- FILTER HANDLERS (each resets to page 1, like the original) ---
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  const handleModeChange = (value: ServiceMode | undefined) => {
    setMode(value);
    setPage(1);
  };
  const handleIsActiveChange = (value: boolean | undefined) => {
    setIsActive(value);
    setPage(1);
  };
  const handleSortByChange = (value: ServiceSortBy) => {
    setSortBy(value);
    setSortOrder(value === "name" ? "asc" : "desc");
    setPage(1);
  };
  const handleSortOrderChange = (value: ServiceSortOrder) => {
    setSortOrder(value);
    setPage(1);
  };

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
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </div>

      {/* FILTERS */}
      <ServiceFilters
        search={search}
        onSearchChange={handleSearchChange}
        mode={mode}
        onModeChange={handleModeChange}
        isActive={isActive}
        onIsActiveChange={handleIsActiveChange}
        sortBy={sortBy}
        onSortByChange={handleSortByChange}
        sortOrder={sortOrder}
        onSortOrderChange={handleSortOrderChange}
      />

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
              <ServiceCard
                key={s.id}
                service={s}
                categoryName={getCategoryName(s.categoryId)}
                onEdit={openEditDialog}
                onToggleStatus={handleToggleStatus}
                isToggleDisabled={toggleService.isPending}
              />
            ))}
          </div>

          {services.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed rounded-xl bg-muted/10">
              <p className="text-muted-foreground">
                No services match your criteria.
              </p>
            </div>
          )}

          {/* PAGINATION */}
          {services.length > 0 && totalPages > 1 && (
            <div className="flex flex-col gap-4 sm:flex-row items-center justify-between border-t border-border/30 pt-6 mt-4">
              <div className="text-xs font-medium text-muted-foreground order-2 sm:order-1">
                Page{" "}
                <span className="text-foreground font-semibold">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="text-foreground font-semibold">
                  {totalPages}
                </span>
              </div>

              <div className="order-1 sm:order-2 w-full sm:w-auto">
                <Pagination>
                  <PaginationContent className="flex-wrap justify-end gap-1">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => {
                          if (currentPage > 1) setPage(currentPage - 1);
                        }}
                        className={
                          currentPage === 1 || isFetching || isLoading
                            ? "pointer-events-none opacity-40"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {pageNumbers.map((pageNumber, idx) => (
                      <PaginationItem key={`page-node-${idx}`}>
                        {pageNumber === "ellipsis" ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            isActive={currentPage === pageNumber}
                            onClick={() => setPage(pageNumber)}
                            className={
                              isFetching || isLoading
                                ? "pointer-events-none opacity-40"
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
                        onClick={() => {
                          if (currentPage < totalPages)
                            setPage(currentPage + 1);
                        }}
                        className={
                          currentPage >= totalPages || isFetching || isLoading
                            ? "pointer-events-none opacity-40"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </>
      )}

      {/* FORM DIALOG */}
      <ServiceFormDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        service={editingService}
        categories={categories}
      />
    </div>
  );
}