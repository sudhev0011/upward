import { useState } from "react";
import { useProviderBookings } from "@/hooks/booking/use-provider-bookings";
import { BookingListItem } from "@/interfaces/bookings/bookings.interface";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePagination } from "@/hooks/usePagination";
import { OrdersTable } from "./OrdersTable";
import { OrderDetailsDialog } from "./OrderDetailsDialog";
import { useDebounce } from "@/hooks/useDebounce";

type StatusFilter = "all" | "active" | "pending" | "completed" | "cancelled";

export default function OrdersPage() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<BookingListItem | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const backendStatuses = {
    all: undefined,
    active: ["confirmed"],
    pending: ["pending"],
    completed: ["completed"],
    cancelled: ["cancelled"],
  }[filter];

  const { data, isLoading, isFetching } = useProviderBookings({
    page,
    limit: 10,
    search: debouncedSearch.trim() || undefined,
    status: backendStatuses,
  });

  const currentPage = data?.page || page || 1;
  const totalPages = data?.totalPages || 1;
  const { pageNumbers } = usePagination({ currentPage, totalPages });

  const mapBackendStatusToBadgeStyle = (status: string): "active" | "pending" | "completed" | "cancelled" | "failed" | "provider completed" | "client completed" => {
    const s = status.toUpperCase();
    if (s === "CONFIRMED") return "active";
    if (s === "PENDING") return "pending";
    if (s === "COMPLETED") return "completed";
    if (s === "CANCELLED") return "cancelled";
    if (s=== "PROVIDER_COMPLETED") return "provider completed";
    if (s=== "CLIENT_COMPLETED") return "client completed";
    return "failed";
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Orders</h1>
        <p className="text-muted-foreground mt-1.5">Manage and track all your orders.</p>
      </div>

      {/* Controls & Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders by client, service, location..."
            className="pl-9 bg-secondary/30 border-border/50 rounded-xl"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(["all", "active", "pending", "completed", "cancelled"] as StatusFilter[]).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "ghost"}
              size="sm"
              onClick={() => { setFilter(f); setPage(1); }}
              className={`capitalize rounded-xl text-xs ${filter === f ? "shadow-lg shadow-primary/20" : ""}`}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Grid View Container */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <OrdersTable 
              data={data?.data} 
              isLoading={isLoading} 
              onSelectOrder={setSelectedOrder} 
              mapStatusStyle={mapBackendStatusToBadgeStyle} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Consistent Numbered Pagination Interface Footer */}
      <div className="flex flex-col gap-4 sm:flex-row items-center justify-between border-t border-border/30 pt-6 mt-4">
        <div className="text-xs font-medium text-muted-foreground order-2 sm:order-1">
          Page <span className="text-foreground font-semibold">{currentPage}</span> of{" "}
          <span className="text-foreground font-semibold">{totalPages}</span>
        </div>

        <div className="order-1 sm:order-2 w-full sm:w-auto">
          <Pagination>
            <PaginationContent className="flex-wrap justify-end gap-1">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); if (currentPage > 1) setPage((prev) => Math.max(prev - 1, 1)); }}
                  className={currentPage === 1 || isFetching || isLoading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {pageNumbers.map((pageNumber, idx) => (
                <PaginationItem key={`page-node-${idx}`}>
                  {pageNumber === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      isActive={currentPage === pageNumber}
                      onClick={(e) => { e.preventDefault(); setPage(Number(pageNumber)); }}
                      className={isFetching || isLoading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    >
                      {pageNumber}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setPage((prev) => prev + 1); }}
                  className={currentPage >= totalPages || isFetching || isLoading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {/* Single View Overlay Context */}
      <OrderDetailsDialog 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        mapStatusStyle={mapBackendStatusToBadgeStyle} 
      />
    </div>
  );
}