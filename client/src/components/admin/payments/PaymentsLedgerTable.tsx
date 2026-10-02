import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, ColumnDef } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { AdminPaymentRecord } from "@/interfaces/admin/payments.interface";
import { getInitials, mapPaymentStatusForBadge, formatShortDate } from "@/utils/admin/payments.helper";

interface PaymentsLedgerTableProps {
  data: AdminPaymentRecord[];
  total: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  search: string;
  transactionStatus?: string;
  onSearchChange: (search: string) => void;
  onStatusChange: (status?: string) => void;
  onPageChange: (page: number) => void;
  onSelectPayment: (payment: AdminPaymentRecord) => void;
}

export function PaymentsLedgerTable({
  data,
  currentPage,
  totalPages,
  isLoading,
  search,
  transactionStatus,
  onSearchChange,
  onStatusChange,
  onPageChange,
  onSelectPayment,
}: PaymentsLedgerTableProps) {
  const columns: ColumnDef<AdminPaymentRecord>[] = [
    {
      header: "Transaction ID",
      cell: (p: AdminPaymentRecord) => (
        <span className="font-mono text-xs font-semibold text-muted-foreground select-all">
          {p.transactionId}
        </span>
      ),
    },
    {
      header: "Client",
      cell: (p: AdminPaymentRecord) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7 border">
            <AvatarFallback className="bg-primary/5 text-primary text-[10px]">
              {getInitials(p.clientName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-xs leading-none mb-0.5">
              {p.clientName}
            </p>
            <p className="text-[10px] text-muted-foreground">{p.clientEmail}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Provider",
      cell: (p: AdminPaymentRecord) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7 border">
            <AvatarFallback className="bg-primary/5 text-primary text-[10px]">
              {getInitials(p.providerName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-xs leading-none mb-0.5">
              {p.providerName}
            </p>
            <p className="text-[10px] text-muted-foreground">{p.providerEmail}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Amount",
      cell: (p: AdminPaymentRecord) => (
        <span className="font-bold text-sm text-foreground">
          ₹{p.amount.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Method",
      cell: (p: AdminPaymentRecord) => (
        <Badge
          variant="outline"
          className="text-[10px] uppercase tracking-wider font-semibold"
        >
          {p.paymentType}
        </Badge>
      ),
    },
    {
      header: "Status",
      cell: (p: AdminPaymentRecord) => (
        <StatusBadge status={mapPaymentStatusForBadge(p.transactionStatus)} />
      ),
    },
    {
      header: "Date",
      cell: (p: AdminPaymentRecord) => (
        <span className="text-xs text-muted-foreground">
          {formatShortDate(p.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      rowKey={(p) => p.id}
      onRowClick={onSelectPayment}
      search={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search client, provider, transaction id..."
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      emptyMessage={
        isLoading
          ? "Loading transactions..."
          : "No transaction history found."
      }
      filters={
        <div className="flex gap-2">
          <Select
            value={transactionStatus || "all"}
            onValueChange={(val) =>
              onStatusChange(val === "all" ? undefined : val)
            }
          >
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="succeeded">Succeeded</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
    />
  );
}
