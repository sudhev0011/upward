import { CreditCard, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookingListItem } from "@/interfaces/bookings/bookings.interface";
import { cn } from "@/lib/utils";

const PAYMENT_STATUS_CONFIG: Record<string, string> = {
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400",
  PARTIAL: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400",
  UNPAID: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400",
  REFUNDED: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:text-zinc-400",
};

export const BookingLedger = ({ booking }: { booking: BookingListItem }) => {
  return (
    <div className="space-y-2.5">
      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <Receipt className="h-3.5 w-3.5 text-muted-foreground/80" />
        Ledger Breakdown
      </h4>
      <div className="rounded-xl border bg-card p-4 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Base Service Valuation</span>
          <span className="font-medium text-foreground">
            ₹{booking.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Liquid Funds Settled</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            - ₹{booking.paidAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>

        {booking.refundAmount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Returned / Refunded Funds</span>
            <span className="font-semibold text-rose-600 dark:text-rose-400">
              + ₹{booking.refundAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}

        <Separator className="my-1" />

        <div className="flex items-center justify-between pt-0.5">
          <span className="font-bold text-sm text-foreground">Outstanding Balance</span>
          <span className="font-black text-lg tracking-tight text-foreground">
            ₹{booking.remainingAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 text-xs font-medium border-t border-dashed text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CreditCard className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span>Settlement Via <strong className="uppercase text-foreground font-semibold">{booking.paymentType.replace(/_/g, " ")}</strong></span>
          </div>
          <Badge variant="outline" className={cn("text-[10px] uppercase font-bold tracking-wider rounded px-1.5 py-0.5", PAYMENT_STATUS_CONFIG[booking.paymentStatus.toUpperCase()])}>
            {booking.paymentStatus}
          </Badge>
        </div>
      </div>
    </div>
  );
};