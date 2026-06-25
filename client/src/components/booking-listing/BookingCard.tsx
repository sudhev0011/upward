import {
  Calendar,
  Clock,
  ChevronRight,
  MapPin,
  CreditCard,
  FileText,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { BookingListItem } from "@/interfaces/bookings/bookings.interface";

interface BookingCardProps {
  booking: BookingListItem;
  onClick?: () => void;
}

const STATUS_VARIANTS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
  CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
  COMPLETED: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
  CANCELLED: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400",
  PROVIDER_COMPLETED: "bg-yellow-500 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400",
};

const PAYMENT_STATUS_VARIANTS: Record<string, string> = {
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PARTIAL: "bg-amber-50 text-amber-700 border-amber-200",
  UNPAID: "bg-rose-50 text-rose-700 border-rose-200",
  REFUNDED: "bg-gray-100 text-gray-700 border-gray-200",
};

export const BookingCard = ({ booking, onClick }: BookingCardProps) => {
  const getInitials = (name?: string, fallback: string = "?") => {
    return name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || fallback;
  };

  const providerInitials = getInitials(booking.provider.name, "P");
  const clientInitials = getInitials(booking.client.name, "C");

  const formatSlotDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatSlotTime = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card
      onClick={onClick}
      className="
        group
        cursor-pointer
        transition-all
        duration-200
        hover:shadow-md
        hover:border-primary/40
        overflow-hidden
      "
    >
      <CardContent className="p-0">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 bg-muted/40 border-b border-border/60 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-mono font-medium tracking-tight text-foreground/80">
              ID: {booking.bookingId}
            </span>
            <span>•</span>
            <span>Booked on {new Date(booking.bookingDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="font-normal capitalize">
              {booking?.bookingMode?.toLowerCase()}
            </Badge>
            <Badge className={`${STATUS_VARIANTS[booking.status.toUpperCase()] || ""} font-semibold`}>
              {booking.status}
            </Badge>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            
            {/* Left Column: Service, Provider and Client Profile Info */}
            <div className="flex gap-4 min-w-0 flex-1">
              {/* Provider Image / Avatar */}
              <Avatar className="h-12 w-12 rounded-lg border shadow-sm shrink-0">
                {booking.provider.avatarFileName && (
                  <AvatarImage 
                    src={booking.provider.avatarFileName} 
                    alt={booking.provider.name || "Provider Avatar"} 
                    className="object-cover"
                  />
                )}
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold">
                  {providerInitials}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2 min-w-0 flex-1">
                <div>
                  <h3 className="font-semibold text-base text-foreground leading-snug truncate group-hover:text-primary transition-colors">
                    {booking.service.name}
                  </h3>
                  
                  {/* Provider & Client Stacked Context */}
                  <div className="flex flex-col gap-1 mt-1 text-sm text-muted-foreground">
                    <p className="truncate">
                      <span>By <strong>{booking.provider.name || booking.provider.email}</strong></span>
                    </p>
                    
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
                      {/* Mini Client Thumbnail */}
                      <Avatar className="h-4 w-4 rounded-full border border-muted-foreground/20">
                        {booking.client.avatarFileName && (
                          <AvatarImage 
                            src={booking.client.avatarFileName} 
                            alt={booking.client.name || "Client Avatar"} 
                          />
                        )}
                        <AvatarFallback className="text-[8px] bg-muted text-muted-foreground">
                          {clientInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">For: {booking.client.name || booking.client.email}</span>
                    </div>
                  </div>
                </div>

                {/* Timing Row */}
                {booking.startDateTime && (
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-foreground/90 font-medium pt-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{formatSlotDate(booking.startDateTime)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-4 w-4 text-muted-foreground/70" />
                      <span>
                        {formatSlotTime(booking.startDateTime)} - {formatSlotTime(booking.endDateTime)}
                      </span>
                    </div>
                  </div>
                )}
                {booking.bookingDate && booking.bookingMode == 'offsite' && (
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-foreground/90 font-medium pt-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{formatSlotDate(booking.bookingDate)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Total Pricing Summary */}
            <div className="text-right shrink-0">
              <p className="font-bold text-xl tracking-tight text-foreground">
                ₹{booking.totalAmount.toLocaleString()}
              </p>
              <Badge variant="outline" className={`mt-1.5 ${PAYMENT_STATUS_VARIANTS[booking.paymentStatus] || ""}`}>
                {booking.paymentStatus}
              </Badge>
            </div>
          </div>

          {/* Conditional Bottom Blocks (Address, Ledger Info) */}
          {(booking.location?.address || booking.notes || booking.remainingAmount > 0) && (
            <div className="border-t border-border/60 pt-3 mt-1 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground">
              
              {/* Left Meta Sub-column: Location / Mode Details */}
              <div className="space-y-1.5">
                {booking.location?.address ? (
                  <div className="flex items-start gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 text-foreground/80">
                      {booking.location.address}, {booking.location.city}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>Service Mode: <strong className="text-foreground/80 capitalize">{booking?.service?.mode.toLowerCase()}</strong></span>
                  </div>
                )}

                {booking.notes && (
                  <div className="flex items-start gap-1.5 italic bg-muted/50 p-1.5 rounded border border-dashed">
                    <FileText className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground/60" />
                    <span className="line-clamp-1">"{booking.notes}"</span>
                  </div>
                )}
              </div>

              {/* Right Meta Sub-column: Detailed Financial Ledger */}
              <div className="flex flex-col justify-end items-start md:items-end gap-1 text-right">
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  <span>Paid:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    ₹{booking.paidAmount.toLocaleString()}
                  </span>
                </div>
                {booking.remainingAmount > 0 && (
                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    <span>Balance Due:</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      ₹{booking.remainingAmount.toLocaleString()}
                    </span>
                  </div>
                )}
                {booking.refundAmount > 0 && (
                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    <span>Refunded:</span>
                    <span className="font-semibold text-rose-600 dark:text-rose-400">
                      ₹{booking.refundAmount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Card Footer Action Strip */}
        <div className="px-5 py-2 bg-muted/20 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground group-hover:bg-muted/40 transition-colors">
          <div className="flex items-center gap-1">
            <CreditCard className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span>Via {booking.paymentType.replace(/_/g, " ")}</span>
          </div>
          <div className="flex items-center gap-0.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium">
            View Details
            <ChevronRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};