import { useEffect, useEffectEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { locationApi } from "@/api/location";
import { useLocationSearch } from "@/hooks/useLocationSearch";
import { LocationSuggestion, Location } from "@/interfaces/location.interface";
import { Check, MapPin, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  value?: Location | null;

  onChange: (location: Location) => void;

  onError: (errorMsg: string | null) => void

  placeholder?: string;
}

export function LocationAutocomplete({ value, onChange, onError, placeholder }: Props) {
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [isEditing, setIsEditing] = useState(!value);

  const { data: suggestions = [], isLoading, isPending } = useLocationSearch(search);

  const updateSearch = useEffectEvent((value: string) => {
    setSearch(value);
  });
  useEffect(() => {
    if (value?.address) {
      updateSearch(value.address);
    }
  }, [value]);

  const handleSelect = async (suggestion: LocationSuggestion) => {
    const location = await locationApi.getPlaceDetails(suggestion.placeId);
    if (!location) {
      toast.error("location not found, please try again with proper selection");
      return;
    }
    if (
      !location.coordinates.coordinates.every(
        (val: number | [] ) => typeof val === "number" && isFinite(val),
      )
    ) {
      toast.info(
        "please select another option from search because the selected location does not have accurate information",
      );
      onError("Selected location is not proceedable, Please select another option of the location you want")
      return;
    }

    onError(null)

    onChange(location);

    setSearch(location.address);

    setOpen(false);

    setIsEditing(false);
  };

  if (value && !isEditing) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-border/50 bg-secondary/30 px-4 py-3">
        <div className="flex items-start gap-3">
          <MapPin className="h-4 w-4 mt-1 text-primary" />

          <div>
            <p className="text-sm font-medium">{value.address}</p>

            {(value.city || value.country) && (
              <p className="text-xs text-muted-foreground">
                {[value.city, value.state, value.country]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div>
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);

              setOpen(true);
            }}
            placeholder={placeholder || "Search location..."}
            className="bg-secondary/30 border-border/50 rounded-xl focus:border-primary/50 transition-colors"
          />
        </div>
      </PopoverTrigger>

      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command shouldFilter={false} autoFocus={false}>

          <CommandList>
            {isPending && (
              <div className="p-4 text-sm text-muted-foreground">
                searching...
              </div>
            )}

            {!isLoading && suggestions.length === 0 && search.length >= 3 && (
              <CommandEmpty>No locations found.</CommandEmpty>
            )}

            <CommandGroup>
              {suggestions.map((suggestion: LocationSuggestion) => (
                <CommandItem
                  key={suggestion.placeId}
                  value={suggestion.description}
                  onSelect={() => handleSelect(suggestion)}
                  className="cursor-pointer"
                >
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />

                  <span className="flex-1">{suggestion.description}</span>

                  {value?.placeId === suggestion.placeId && (
                    <Check className={cn("h-4 w-4")} />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
