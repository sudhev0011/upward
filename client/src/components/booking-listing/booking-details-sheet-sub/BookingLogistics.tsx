import { Calendar, Clock, MapPin, Video } from "lucide-react";
import { BookingListItem } from "@/interfaces/bookings/bookings.interface";

export const BookingLogistics = ({ booking }: { booking: BookingListItem }) => {
  return (
    <div className="space-y-2.5">
      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <Calendar className="h-3.5 w-3.5 text-muted-foreground/80" />
        Logistics & Schedule
      </h4>
      <div className="rounded-xl border bg-card divide-y overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-3.5 text-sm">
          <span className="text-muted-foreground text-xs">Order Placed</span>
          <span className="font-medium text-foreground">
            {new Date(booking.bookingDate).toLocaleDateString([], { dateStyle: "medium" })}
          </span>
        </div>

        {booking.startDateTime && (
          <div className="flex items-start gap-3.5 p-3.5 text-sm">
            <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">Execution Window</span>
              <span className="font-semibold text-foreground">
                {new Date(booking.startDateTime).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
              </span>
              <span className="text-xs text-muted-foreground block mt-0.5">
                {new Date(booking.startDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                {booking.endDateTime && ` — ${new Date(booking.endDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3.5 p-3.5 text-sm">
          {booking?.bookingMode === "onsite" && booking.location ? (
            <>
              <MapPin className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground block">Target Location</span>
                <p className="font-medium text-foreground leading-normal">{booking.location.address}</p>
                {(booking.location.city || booking.location.country) && (
                  <span className="text-xs text-muted-foreground block">
                    {[booking.location.city, booking.location.state, booking.location.country].filter(Boolean).join(", ")}
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              <Video className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-xs text-muted-foreground block">Target Location</span>
                <span className="font-medium text-foreground">Remote Delivery</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};