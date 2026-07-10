import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import type { BookingFormState } from "@/interfaces/client/booking.interface";
import type { Location } from "@/interfaces/location.interface";
import { LocationAutocomplete } from "@/components/location/LocationAutocomplete";
import { toast } from "sonner";

interface Props {
  formState: BookingFormState;
  onNext: (location: Location) => void;
  onBack: () => void;
}

export default function LocationStep({ formState, onNext, onBack }: Props) {
  const [location, setLocation] = useState<Location | null>(formState.location);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleLocation = (location: Location | null): void => {
    if (!location) {
      toast.error("please select a proper location");
      return;
    }

    onNext(location);
  };

  const handleLocationError = (errorMsg: string | null) => {
    setLocationError(errorMsg);
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">
          Where should the service take place?
        </p>
        <p className="text-xs text-muted-foreground/70">
          Note that some times the location you select don't have enough info in
          that case please reselect other options
        </p>
        {locationError && (
          <p className="text-xs text-red-400">{locationError}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm font-medium">Service location</span>
        </div>

        <LocationAutocomplete
          value={location}
          onChange={(val) => setLocation(val)}
          onError={handleLocationError}
          placeholder="Search for a location..."
        />
      </div>

      {/* selected location summary */}
      {location && (
        <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3">
          <p className="text-xs text-muted-foreground mb-0.5">
            Selected location
          </p>
          <p className="text-sm font-medium">{location.address}</p>
          {(location.city || location.country) && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {[location.city, location.state, location.country]
                .filter(Boolean)
                .join(", ")}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-2 mt-2">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button className="flex-1" onClick={() => handleLocation(location)}>
          Continue
        </Button>
      </div>
    </div>
  );
}
