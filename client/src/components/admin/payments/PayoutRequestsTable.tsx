import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, ColumnDef } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { AdminPayoutRequestItem } from "@/interfaces/admin/payout-request.interface";
import {
  getInitials,
  getPayoutRequestStatusVariant,
  formatShortDate,
} from "@/utils/admin/payments.helper";

interface PayoutRequestsTableProps {
  data: AdminPayoutRequestItem[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  search: string;
  status?: string;
  onSearchChange: (search: string) => void;
  onStatusChange: (status?: string) => void;
  onPageChange: (page: number) => void;
  onSelectRequest: (request: AdminPayoutRequestItem) => void;
}

export function PayoutRequestsTable({
  data,
  currentPage,
  totalPages,
  isLoading,
  search,
  status,
  onSearchChange,
  onStatusChange,
  onPageChange,
  onSelectRequest,
}: PayoutRequestsTableProps) {
  const columns: ColumnDef<AdminPayoutRequestItem>[] = [
    {
      header: "Provider",
      cell: (req: AdminPayoutRequestItem) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7 border">
            <AvatarFallback className="bg-primary/5 text-primary text-[10px]">
              {getInitials(req.provider?.name || "")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-xs leading-none mb-0.5">
              {req.provider?.name || "Unknown"}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {req.provider?.email || "Unknown"}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Bank Details",
      cell: (req: AdminPayoutRequestItem) =>
        req.bankDetails ? (
          <div>
            <p className="font-medium text-foreground">
              {req.bankDetails.bankName}
            </p>
            <p className="text-[10px] text-muted-foreground">
              Acct: {req.bankDetails.accountNumber}
            </p>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs italic">
            No bank info
          </span>
        ),
    },
    {
      header: "Date Requested",
      cell: (req: AdminPayoutRequestItem) => (
        <span className="text-xs text-muted-foreground">
          {formatShortDate(req.payoutRequest.createdAt)}
        </span>
      ),
    },
    {
      header: "Amount",
      cell: (req: AdminPayoutRequestItem) => (
        <span className="font-bold text-foreground">
          ₹{req.payoutRequest.amount.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (req: AdminPayoutRequestItem) => (
        <StatusBadge
          status={getPayoutRequestStatusVariant(req.payoutRequest.status)}
        />
      ),
    },
    {
      header: "Notes",
      cell: (req: AdminPayoutRequestItem) => (
        <span
          className="text-xs text-muted-foreground max-w-[150px] truncate block"
          title={req.payoutRequest.adminNotes}
        >
          {req.payoutRequest.adminNotes || "—"}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      rowKey={(req) => req.payoutRequest.id}
      onRowClick={onSelectRequest}
      search={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search provider, email, bank..."
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      emptyMessage={
        isLoading
          ? "Loading withdrawal requests..."
          : "No withdrawal requests found."
      }
      filters={
        <div className="flex gap-2">
          <Select
            value={status || "all"}
            onValueChange={(val) => onStatusChange(val === "all" ? undefined : val)}
          >
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="transferred">Transferred</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
    />
  );
}
