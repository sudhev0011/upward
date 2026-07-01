import { Search } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationLink,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { current } from "@reduxjs/toolkit";
export interface ColumnDef<TRow> {
  header: string;
  width?: string;
  cell: (row: TRow) => React.ReactNode;
}

interface DataTableProps<TRow> {
  columns: ColumnDef<TRow>[];
  data: TRow[];
  rowKey: (row: TRow) => string;
  onRowClick?: (row: TRow) => void;
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  action?: React.ReactNode;
  emptyMessage?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function DataTable<TRow>({
  columns,
  data,
  rowKey,
  onRowClick,
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  action,
  emptyMessage = "No results found.",
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: DataTableProps<TRow>) {
  // 1. Maintain local visual state independently
  const [localSearch, setLocalSearch] = useState(search);

  const { pageNumbers } = usePagination({ currentPage, totalPages });

  // 2. Track the debounced value
  const debouncedSearch = useDebounce(localSearch, 500);

  // 3. Keep local state in sync ONLY when the parent's actual search state changes
  // (e.g., if the parent resets the search filter externally)
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // 4. Emit the updated value to the parent ONLY if it differs from the current parent state
  useEffect(() => {
    if (debouncedSearch !== search) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, search, onSearchChange]);

  return (
    <Card className="shadow-sm">
      {/* ── Toolbar ── */}
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {filters}
            {action}
          </div>
        </div>
      </CardHeader>

      {/* ── Table ── */}
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, i) => (
                <TableHead key={i} className={col.width}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow
                  key={rowKey(row)}
                  onClick={() => onRowClick?.(row)}
                  className={onRowClick ? "cursor-pointer" : undefined}
                >
                  {columns.map((col, i) => (
                    <TableCell key={i}>{col.cell(row)}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* ── Pagination Footer ── */}
      {/* {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <p className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange?.(currentPage - 1)}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange?.(currentPage + 1)}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )} */}

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange?.(currentPage - 1)}
                className={
                  currentPage === 1
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
                      onPageChange?.(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange?.(currentPage + 1)}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-40"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </Card>
  );
}
