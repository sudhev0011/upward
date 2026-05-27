import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Search, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { useDebounce } from "@/hooks/useDebounce";
import { ListBookingsRequest } from "@/interfaces/bookings/bookings.interface";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface BookingFiltersProps {
  filters: ListBookingsRequest;
  onChange: (filters: ListBookingsRequest) => void;
}

export const BookingFilters = ({ filters, onChange }: BookingFiltersProps) => {
  const [searchText, setSearchText] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchText, 400);

  const dateRange: DateRange | undefined = {
    from: filters.fromDate ? new Date(filters.fromDate) : undefined,
    to: filters.toDate ? new Date(filters.toDate) : undefined,
  };

  const updateFilters = useCallback((updates: Partial<ListBookingsRequest>) => {
    onChange({
      ...filters,
      ...updates,
      page: 1,
    });
  }, [filters, onChange]);

  useEffect(() => {
    updateFilters({ search: debouncedSearch || undefined });
  }, [debouncedSearch]);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    updateFilters({
      fromDate: range?.from ? format(range.from, "yyyy-MM-dd") : undefined,
      toDate: range?.to ? format(range.to, "yyyy-MM-dd") : undefined,
    });
  };

  const handleClear = () => {
    setSearchText("");
    onChange({
      page: 1,
      limit: filters.limit,
      sortOrder: "desc",
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-3 w-full">
      {/* Search Input Box */}
      <div className="relative flex-1 sm:col-span-2 lg:col-span-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
        <Input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search bookings..."
          className="pl-9 h-10 bg-background/50 shadow-sm"
        />
      </div>

      {/* Updated Status Selector Dropdown to Lowercase Enum Values */}
      <Select
        value={filters.status?.[0] || "ALL"}
        onValueChange={(value) => updateFilters({ status: value === "ALL" ? undefined : [value] })}
      >
        <SelectTrigger className="w-full lg:w-[170px] h-10 bg-background/50 shadow-sm">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Statuses</SelectItem>
          {/* Values now precisely match the backend BookingStatus enum values */}
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
          <SelectItem value="expired">Expired</SelectItem>
        </SelectContent>
      </Select>

      {/* Sorting Parameter Configurator */}
      <Select
        value={filters.sortOrder || "desc"}
        onValueChange={(value) => updateFilters({ sortOrder: value as "asc" | "desc" })}
      >
        <SelectTrigger className="w-full lg:w-[160px] h-10 bg-background/50 shadow-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">Newest First</SelectItem>
          <SelectItem value="asc">Oldest First</SelectItem>
        </SelectContent>
      </Select>

      {/* Date Range Selector Component */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full lg:w-[260px] h-10 justify-start text-left font-normal bg-background/50 shadow-sm truncate",
              (!filters.fromDate && !filters.toDate) && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 opacity-70 shrink-0" />
            <span className="truncate">
              {filters.fromDate ? (
                filters.toDate ? (
                  `${format(new Date(filters.fromDate), "LLL dd, yyyy")} - ${format(new Date(filters.toDate), "LLL dd, yyyy")}`
                ) : (
                  format(new Date(filters.fromDate), "LLL dd, yyyy")
                )
              ) : (
                <span>Filter by date window</span>
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-50" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleDateRangeChange}
            numberOfMonths={2}
            className="p-3"
          />
        </PopoverContent>
      </Popover>

      {/* Reset Filters */}
      <Button
        variant="ghost"
        onClick={handleClear}
        className="h-10 px-3 lg:px-2 gap-2 text-muted-foreground hover:text-foreground shrink-0 justify-center"
      >
        <RotateCcw className="h-4 w-4" />
        <span className="lg:hidden text-sm">Reset Filters</span>
      </Button>
    </div>
  );
};