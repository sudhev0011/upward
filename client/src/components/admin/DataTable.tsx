import { Search,ChevronLeft, ChevronRight } from "lucide-react";
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
import { Button } from "../ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ColumnDef<TRow> {
  /** Header label. Pass an empty string for action columns. */
  header: string;
  /** Optional fixed width class, e.g. "w-10" */
  width?: string;
  /** Render the cell content for this row */
  cell: (row: TRow) => React.ReactNode;
}

interface DataTableProps<TRow> {
  /** Column definitions — header + cell renderer per column */
  columns: ColumnDef<TRow>[];
  /** The (already filtered) rows to render */
  data: TRow[];
  /** Unique key extractor */
  rowKey: (row: TRow) => string;
  /** Optional: fires when the row itself is clicked (not a button inside it) */
  onRowClick?: (row: TRow) => void;

  // ── Toolbar props ──────────────────────────────────────────────────────────
  /** Current search string */
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  /** Extra filter controls rendered to the right of the search box */
  filters?: React.ReactNode;
  /** CTA button rendered at the far right of the toolbar (e.g. "Add Provider") */
  action?: React.ReactNode;

  // ── Optional states ────────────────────────────────────────────────────────
  emptyMessage?: string;

  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

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
  return (
    <Card className="shadow-sm">
      {/* ── Toolbar ── */}
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          {/* Left: search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          {/* Right: filters + optional action CTA */}
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
      {totalPages > 1 && (
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
      )}
    </Card>
  );
}