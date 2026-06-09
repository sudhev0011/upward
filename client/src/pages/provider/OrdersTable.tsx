import { BookingListItem } from "@/interfaces/bookings/bookings.interface";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Eye, AlertTriangle } from "lucide-react";

interface OrdersTableProps {
  data: BookingListItem[] | undefined;
  isLoading: boolean;
  onSelectOrder: (order: BookingListItem) => void;
  mapStatusStyle: (status: string) => "active" | "pending" | "completed" | "cancelled" | "failed";
}

export function OrdersTable({ data, isLoading, onSelectOrder, mapStatusStyle }: OrdersTableProps) {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground animate-pulse">
        Loading orders...
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="p-16 text-center">
        <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm font-medium text-foreground">No orders found</p>
        <p className="text-xs text-muted-foreground mt-1">No historical items match the current search or filters.</p>
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-border/50">
          {["Order ID", "Client", "Service", "Date", "Amount", "Status", "Action"].map((header) => (
            <th key={header} className="text-left p-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((booking) => (
          <tr key={booking.id} className="border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors duration-200">
            <td className="p-4 text-sm font-mono text-muted-foreground">#{booking.bookingId}</td>
            <td className="p-4 text-sm font-medium text-card-foreground">{booking.client.name || "Client"}</td>
            <td className="p-4 text-sm text-card-foreground">{booking.service.name}</td>
            <td className="p-4 text-sm text-muted-foreground">{booking.bookingDate}</td>
            <td className="p-4 text-sm font-bold text-card-foreground">₹{booking.totalAmount.toLocaleString("en-IN")}</td>
            <td className="p-4">
              <StatusBadge status={mapStatusStyle(booking.status)} />
            </td>
            <td className="p-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-primary/10"
                onClick={() => onSelectOrder(booking)}
              >
                <Eye className="h-4 w-4 text-primary" />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}