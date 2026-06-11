import {
  Calendar,
  Clock,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { BookingListItem } from "@/interfaces/bookings/bookings.interface";

interface BookingCardProps {
  booking: BookingListItem;

  onClick?: () => void;
}

const STATUS_VARIANTS: Record<
  string,
  string
> = {
  PENDING:
    "bg-yellow-100 text-yellow-800 border-yellow-200",

  CONFIRMED:
    "bg-blue-100 text-blue-800 border-blue-200",

  COMPLETED:
    "bg-green-100 text-green-800 border-green-200",

  CANCELLED:
    "bg-red-100 text-red-800 border-red-200",
};

export const BookingCard = ({
  booking,
  onClick,
}: BookingCardProps) => {
  const providerInitials =
    booking.provider.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "P";

  return (
    <Card
      onClick={onClick}
      className="
        cursor-pointer
        transition-all
        hover:shadow-md
        hover:border-primary/30
      "
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4 min-w-0">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {providerInitials}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-3 min-w-0">
              <div>
                <h3 className="font-semibold text-base truncate">
                  {booking.service.name}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {booking.provider.name}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                >
                  {booking.service.mode}
                </Badge>

                <Badge
                  className={
                    STATUS_VARIANTS[
                      booking.status
                    ]
                  }
                >
                  {booking.status}
                </Badge>

                <Badge variant="secondary">
                  {
                    booking.paymentStatus
                  }
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />

                  {booking.bookingDate}
                </div>

                {booking.startDateTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />

                    {new Date(
                      booking.startDateTime,
                    ).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end justify-between gap-3 shrink-0">
            <div className="text-right">
              <p className="font-bold text-lg">
                ₹
                {booking.totalAmount.toLocaleString()}
              </p>

              <p className="text-xs text-muted-foreground">
                Total Amount
              </p>
            </div>

            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};