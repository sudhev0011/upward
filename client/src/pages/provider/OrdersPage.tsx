import { useState } from "react";
import { useProviderBookings } from "@/hooks/booking/use-provider-bookings";
import { BookingListItem } from "@/interfaces/bookings/bookings.interface";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown, Calendar, CreditCard } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

// 1. Updated filter types to accommodate your full backend Enum strings
type StatusFilter = "all" | "confirmed" | "pending" | "completed" | "cancelled" | "expired" | "provider_completed" | "client_completed";
type SortOrder = "asc" | "desc";
type PaymentStatusFilter = "all" | "pending" | "paid" | "failed" | "refunded";

export default function OrdersPage() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusFilter>("all");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<BookingListItem | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  // 2. Map frontend tabs precisely to your enum strings array format expected by the DTO transformer
  const backendStatuses = {
    all: undefined,
    confirmed: ["confirmed"],
    pending: ["pending"],
    completed: ["completed"],
    cancelled: ["cancelled"],
    expired: ["expired"],
    provider_completed: ["provider_completed"],
    client_completed: ["client_completed"],
  }[filter];

  const { data, isLoading, isFetching } = useProviderBookings({
    page,
    limit: 10,
    search: debouncedSearch.trim() || undefined,
    status: backendStatuses,
    sortOrder,
    paymentStatus: paymentStatus === "all" ? undefined : [paymentStatus],
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
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
    if (s === "PROVIDER_COMPLETED") return "provider completed";
    if (s === "CLIENT_COMPLETED") return "client completed";
    return "failed";
  };

  const handleClearFilters = () => {
    setFilter("all");
    setSearch("");
    setSortOrder("desc");
    setPaymentStatus("all");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  // Helper to accurately format underscores for tab text values
  const formatTabLabel = (label: string) => label.replace("_", " ");

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1.5">Manage and track all your orders.</p>
        </div>
        {(filter !== "all" || search || sortOrder !== "desc" || paymentStatus !== "all" || fromDate || toDate) && (
          <Button variant="outline" size="sm" onClick={handleClearFilters} className="rounded-xl self-start sm:self-auto">
            Clear Filters
          </Button>
        )}
      </div>

      {/* Controls & Toolbar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders by client, service, location..."
              className="pl-9 bg-secondary/30 border-border/50 rounded-xl"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          {/* 3. Render all tabs corresponding dynamically with backend values */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 tokens-scrollbar">
            {(["all", "confirmed", "pending", "completed", "cancelled", "expired", "provider_completed", "client_completed"] as StatusFilter[]).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "ghost"}
                size="sm"
                onClick={() => { setFilter(f); setPage(1); }}
                className={`capitalize rounded-xl text-xs flex-shrink-0 ${filter === f ? "shadow-lg shadow-primary/20" : ""}`}
              >
                {formatTabLabel(f)}
              </Button>
            ))}
          </div>
        </div>

        {/* Extended Filters Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-secondary/10 p-3 rounded-xl border border-border/40">
          {/* Sorting drop-down */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <ArrowUpDown className="h-3 w-3" /> Sort Order
            </label>
            <Select value={sortOrder} onValueChange={(val: SortOrder) => { setSortOrder(val); setPage(1); }}>
              <SelectTrigger className="bg-background border-border/50 rounded-xl h-9 text-xs">
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest First</SelectItem>
                <SelectItem value="asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Status filter dropdown */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <CreditCard className="h-3 w-3" /> Payment Status
            </label>
            <Select value={paymentStatus} onValueChange={(val: PaymentStatusFilter) => { setPaymentStatus(val); setPage(1); }}>
              <SelectTrigger className="bg-background border-border/50 rounded-xl h-9 text-xs capitalize">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* From Date selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" /> From Date
            </label>
            <Input
              type="date"
              className="bg-background border-border/50 rounded-xl h-9 text-xs block w-full"
              value={fromDate}
              max={toDate || undefined}
              onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
            />
          </div>

          {/* To Date selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" /> To Date
            </label>
            <Input
              type="date"
              className="bg-background border-border/50 rounded-xl h-9 text-xs block w-full"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => { setToDate(e.target.value); setPage(1); }}
            />
          </div>
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