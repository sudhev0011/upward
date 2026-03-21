import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Video, Palette, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ServiceType {
  id: string;
  name: string;
  description: string;
}

interface CategoryWithServices {
  id: string;
  name: string;
  icon: React.ElementType;
  serviceTypes: ServiceType[];
}

// Admin-defined service types per category
const adminCategories: CategoryWithServices[] = [
  {
    id: "photography",
    name: "Photography",
    icon: Camera,
    serviceTypes: [
      { id: "photo-half-day", name: "Half-Day Shoot", description: "Up to 4 hours coverage" },
      { id: "photo-full-day", name: "Full-Day Shoot", description: "Up to 8 hours coverage" },
      { id: "photo-10", name: "10 Photos Package", description: "10 edited photos delivered" },
      { id: "photo-20", name: "20 Photos Package", description: "20 edited photos delivered" },
      { id: "photo-50", name: "50 Photos Package", description: "50 edited photos delivered" },
      { id: "photo-per-hour", name: "Per Hour", description: "Hourly rate for photography" },
    ],
  },
  {
    id: "videography",
    name: "Videography",
    icon: Video,
    serviceTypes: [
      { id: "video-half-day", name: "Half-Day Shoot", description: "Up to 4 hours coverage" },
      { id: "video-full-day", name: "Full-Day Shoot", description: "Up to 8 hours coverage" },
      { id: "video-highlight", name: "Highlight Reel", description: "3-5 min edited video" },
      { id: "video-full-edit", name: "Full Event Video", description: "Complete event coverage" },
      { id: "video-per-hour", name: "Per Hour", description: "Hourly rate for videography" },
    ],
  },
  {
    id: "editing",
    name: "Photo & Video Editing",
    icon: Palette,
    serviceTypes: [
      { id: "edit-photo", name: "Photo Editing", description: "Per photo retouching" },
      { id: "edit-video", name: "Video Editing", description: "Per minute of edited video" },
      { id: "edit-color", name: "Color Grading", description: "Color correction & grading" },
      { id: "edit-graphics", name: "Graphics Design", description: "Custom graphics & overlays" },
      { id: "edit-motion", name: "Motion Graphics", description: "Animated graphics & effects" },
    ],
  },
];

// TODO: Replace with actual provider-selected categories from shared state/db
const providerSelectedCategoryIds = ["photography", "videography", "editing"];

export default function PricingPage() {
  const [prices, setPrices] = useState<Record<string, string>>({});

  const selectedCategories = adminCategories.filter((c) =>
    providerSelectedCategoryIds.includes(c.id)
  );

  const updatePrice = (serviceId: string, value: string) => {
    setPrices((prev) => ({ ...prev, [serviceId]: value }));
  };

  const handleSave = () => {
    const filledPrices = Object.entries(prices).filter(([, v]) => v && Number(v) > 0);
    if (filledPrices.length === 0) {
      toast.error("Please set at least one price");
      return;
    }
    toast.success(`${filledPrices.length} service price(s) saved!`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Pricing</h1>
          <p className="text-muted-foreground mt-1.5">
            Set your pricing for the services you offer.
          </p>
        </div>
        <Button
          className="rounded-xl shadow-lg shadow-primary/20"
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>

      {selectedCategories.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-border/50 bg-card/50 p-12 text-center">
          <p className="text-muted-foreground">
            No services selected yet. Go to the Services section to add your service categories.
          </p>
        </div>
      ) : (
        <Accordion type="multiple" defaultValue={selectedCategories.map((c) => c.id)} className="space-y-4">
          {selectedCategories.map((category) => {
            const Icon = category.icon;
            return (
              <AccordionItem
                key={category.id}
                value={category.id}
                className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden px-0"
              >
                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-card-foreground">{category.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {category.serviceTypes.length} service types
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5">
                  <div className="space-y-3 pt-1">
                    {category.serviceTypes.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-border/50 bg-secondary/10 hover:border-primary/20 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-card-foreground">
                            {service.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {service.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-sm font-medium text-muted-foreground">₹</span>
                          <Input
                            type="number"
                            placeholder="0"
                            value={prices[service.id] || ""}
                            onChange={(e) => updatePrice(service.id, e.target.value)}
                            className="w-28 h-9 text-right rounded-lg border-border/50 bg-background"
                          />
                        </div>
                      </div>
                    ))}
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
