import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Camera, Video, Palette, Settings2, Loader2, 
  Save, AlertCircle, Info 
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Hooks
import { useGetProviderSericeByCategoryQuery } from "@/hooks/provider/providerService/useGetProviderServiceByCategory";
import { useSetProviderServicePriceMutation } from "@/hooks/provider/providerService/useSetProviderServicePrice";

const ICON_MAP: Record<string, React.ElementType> = {
  Photography: Camera,
  Videography: Video,
  Editing: Palette,
  "Photo & Video Editing": Palette,
};

const getCategoryIcon = (name: string) => ICON_MAP[name] || Settings2;

export default function PricingPage() {
  // 1. Fetch real provider services
  const { data: response, isLoading, isError } = useGetProviderSericeByCategoryQuery({
    limit: 50, // Get all to manage pricing
    sortBy: "name",
    sortOrder: "asc",
  });

  // Local state to track input values (Key is providerServiceId)
  const [localPrices, setLocalPrices] = useState<Record<string, string>>({});
  const updatePriceMutation = useSetProviderServicePriceMutation();

  // The actual grouped data from your response structure
  const categories = response?.data?.data || [];

  // Sync server data to local state when it loads
  useEffect(() => {
    if (categories.length > 0) {
      const prices: Record<string, string> = {};
      categories.forEach((group) => {
        group.services.forEach((s) => {
          prices[s.providerServiceId] = s.price ? s.price.toString() : "";
        });
      });
      setLocalPrices(prices);
    }
  }, [response]);

  const handleInputChange = (id: string, val: string) => {
    setLocalPrices((prev) => ({ ...prev, [id]: val }));
  };

  const handleSave = async (providerServiceId: string) => {
    const priceStr = localPrices[providerServiceId];
    const price = parseFloat(priceStr);

    if (isNaN(price) || price < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    updatePriceMutation.mutate(
      { providerServiceId, price },
      {
        onSuccess: () => toast.success("Price updated"),
        onError: (err) => toast.error(err.message || "Update failed"),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading services...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load services. Please refresh the page.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Pricing</h1>
        <p className="text-muted-foreground mt-1.5">
          Set your rates for the services you offer. Services in <span className="font-semibold italic">draft</span> require a price to become active.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-border/50 bg-card/50 p-12 text-center">
          <p className="text-muted-foreground">
            No services added yet. Visit the Services page to select what you offer.
          </p>
        </div>
      ) : (
        <Accordion
          type="multiple"
          defaultValue={categories.map((c) => c.category.id)}
          className="space-y-4"
        >
          {categories.map((group) => {
            const Icon = getCategoryIcon(group.category.name);
            return (
              <AccordionItem
                key={group.category.id}
                value={group.category.id}
                className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden px-0"
              >
                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-card-foreground">
                        {group.category.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {group.services.length} services available
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5">
                  <div className="space-y-3 pt-1">
                    {group.services.map((service) => {
                      const isMutating = 
                        updatePriceMutation.isPending && 
                        updatePriceMutation.variables?.providerServiceId === service.providerServiceId;
                      
                      const hasChanged = localPrices[service.providerServiceId] !== (service.price?.toString() || "");

                      return (
                        <div
                          key={service.providerServiceId}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/50 bg-secondary/5 hover:border-primary/20 transition-all"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm text-card-foreground">
                                {service.serviceName}
                              </p>
                              <Badge 
                                variant={service.status === "active" ? "default" : "secondary"}
                                className={`text-[10px] h-4 px-1 ${service.status === 'active' ? 'bg-green-500/10 text-green-600 hover:bg-green-500/10' : ''}`}
                              >
                                {service.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                              <span className="capitalize">Mode: {service.mode}</span>
                              {service.maxHour && <span>Max: {service.maxHour}hrs</span>}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                                ₹
                              </span>
                              <Input
                                type="number"
                                placeholder="0.00"
                                className="w-32 pl-7 h-9 text-right rounded-lg bg-background border-border/50"
                                value={localPrices[service.providerServiceId] || ""}
                                onChange={(e) => handleInputChange(service.providerServiceId, e.target.value)}
                              />
                            </div>
                            <Button
                              size="sm"
                              variant={hasChanged ? "default" : "ghost"}
                              disabled={!hasChanged || isMutating}
                              onClick={() => handleSave(service.providerServiceId)}
                              className="h-9 w-9 p-0 shrink-0"
                            >
                              {isMutating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Save className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}