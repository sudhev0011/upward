import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, SlidersHorizontal, CalendarDays, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookingListItem,
  ListBookingsRequest,
} from "@/interfaces/bookings/bookings.interface";
import { useListBookings } from "@/hooks/booking/use-list-bookings";
import { BookingFilters } from "@/components/client/booking/BookingFilters";
import { BookingCardSkeleton } from "@/components/client/booking/BookingCardSkeleton";
import { BookingCard } from "@/components/client/booking/BookingCard";
import { BookingDetailsSheet } from "@/components/client/booking/BookingDetailsSheet";

const BookingsPage = () => {
  const [selectedBooking, setSelectedBooking] = useState<BookingListItem | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState<ListBookingsRequest>({
    page: 1,
    limit: 10,
    sortOrder: "desc",
  });

  const { data, isLoading, isFetching } = useListBookings(filters);

  // Fast Summary Stats Calculator
  const stats = useMemo(() => {
    if (!data?.data) return { pending: 0, confirmed: 0, completed: 0 };
    return data.data.reduce(
      (acc, booking) => {
        if (booking.status === "pending") acc.pending++;
        if (booking.status === "confirmed") acc.confirmed++;
        if (booking.status === "completed") acc.completed++;
        return acc;
      },
      { pending: 0, confirmed: 0, completed: 0 }
    );
  }, [data?.data]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-900/20">
      <div className="container max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
              My Bookings
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor schedules, track payment balances, and manage your provider interactions.
            </p>
          </div>
        </div>

        {/* Dynamic Metric Overview Panels */}
        {!isLoading && data && data.data.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-background shadow-sm border-slate-100 dark:border-zinc-800">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-lg">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Total Bookings</p>
                  <h3 className="text-xl font-bold">{data.total || 0}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-background shadow-sm border-slate-100 dark:border-zinc-800">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-lg">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Pending Setup</p>
                  <h3 className="text-xl font-bold">{stats.pending}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-background shadow-sm border-slate-100 dark:border-zinc-800">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-lg">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Confirmed</p>
                  <h3 className="text-xl font-bold">{stats.confirmed}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-background shadow-sm border-slate-100 dark:border-zinc-800">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 rounded-lg">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Completed</p>
                  <h3 className="text-xl font-bold">{stats.completed}</h3>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filter Toolbar Interface */}
        <div className="space-y-4">
          <div className="flex items-center justify-between lg:hidden">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showMobileFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            {isFetching && <p className="text-xs text-muted-foreground animate-pulse">Syncing shifts...</p>}
          </div>

          <div className={`${showMobileFilters ? "block" : "hidden"} lg:block backdrop-blur-sm bg-background/60 p-4 rounded-xl border border-slate-100 dark:border-zinc-800/80 shadow-sm`}>
            <BookingFilters filters={filters} onChange={setFilters} />
          </div>
        </div>

        {/* Core Render Pipeline */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <BookingCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Showing {data?.data.length || 0} of {data?.total || 0} matching records
              </p>
              <div className="hidden lg:block">
                {isFetching && <p className="text-xs text-muted-foreground animate-pulse">Updating tracking pipeline...</p>}
              </div>
            </div>

            {!data?.data.length ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-16 text-center bg-background/50 backdrop-blur-sm">
                <div className="h-12 w-12 bg-slate-100 dark:bg-zinc-800 flex items-center justify-center rounded-full text-muted-foreground mb-4">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight">No match found</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                  We couldn't find any historical items fitting these filters. Try modifying your dynamic queries.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-5"
                  onClick={() => setFilters({ page: 1, limit: 10, sortOrder: "desc" })}
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-2">
                  {data.data.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onClick={() => setSelectedBooking(booking)}
                    />
                  ))}
                </div>

                {/* Micro-Pagination Controller */}
                {data.totalPages > 1 && (
                  <div className="flex items-center justify-between border-t pt-6 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={filters.page === 1}
                      onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))}
                    >
                      Previous
                    </Button>

                    <div className="text-xs font-medium text-muted-foreground">
                      Page <span className="text-foreground font-semibold">{data.page}</span> of <span className="text-foreground font-semibold">{data.totalPages}</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={data.page >= data.totalPages}
                      onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <BookingDetailsSheet
          booking={selectedBooking}
          open={!!selectedBooking}
          onOpenChange={(open) => !open && setSelectedBooking(null)}
        />
      </div>
    </div>
  );
};

export default BookingsPage;