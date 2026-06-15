import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail } from "lucide-react";
import { BookingListItem } from "@/interfaces/bookings/bookings.interface";
import { cn } from "@/lib/utils";

interface BookingHeaderProfileProps {
  booking: BookingListItem;
  currentStatus: { label: string; className: string };
  providerInitials: string;
  clientInitials: string;
}

export const BookingHeaderProfile = ({
  booking,
  currentStatus,
  providerInitials,
  clientInitials,
}: BookingHeaderProfileProps) => {
  return (
    <div className="p-5 border rounded-xl bg-card shadow-sm space-y-4">
      <div className="flex items-start gap-4">
        <Avatar className="h-14 w-14 rounded-xl border shadow-sm shrink-0">
          {booking.provider.avatarFileName && (
            <AvatarImage
              src={booking.provider.avatarFileName}
              alt={booking.provider.name}
              className="object-cover"
            />
          )}
          <AvatarFallback className="rounded-xl font-bold bg-primary/10 text-primary text-lg">
            {providerInitials}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1 min-w-0 flex-1">
          <h3 className="font-bold text-lg text-foreground truncate leading-snug">
            {booking.service.name}
          </h3>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Badge className={cn("text-xs py-0.5 font-semibold border", currentStatus.className)}>
              {currentStatus.label}
            </Badge>
            <Badge variant="secondary" className="text-xs py-0.5 font-medium capitalize">
              {booking?.bookingMode?.toLowerCase()}
            </Badge>
          </div>
        </div>
      </div>

      <Separator className="bg-border/60" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
        <div className="space-y-2 p-3 rounded-lg bg-muted/40 border border-dashed">
          <p className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Service Provider</p>
          <span className="font-semibold text-foreground text-sm truncate block">{booking.provider.name || "N/A"}</span>
          <div className="flex items-center gap-1.5 text-muted-foreground truncate">
            <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
            <span className="truncate">{booking.provider.email}</span>
          </div>
        </div>

        <div className="space-y-2 p-3 rounded-lg bg-muted/40 border border-dashed">
          <p className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Client / Requester</p>
          <div className="flex items-center gap-2">
            <Avatar className="h-4 w-4 rounded-full border">
              {booking.client.avatarFileName && (
                <AvatarImage src={booking.client.avatarFileName} />
              )}
              <AvatarFallback className="text-[8px] bg-primary/5 text-primary">
                {clientInitials}
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold text-foreground text-sm truncate">{booking.client.name || "Client"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground truncate">
            <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
            <span className="truncate">{booking.client.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};