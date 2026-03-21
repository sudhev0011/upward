import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Video, Palette, Plus, X, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SubCategory {
  id: string;
  name: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  subCategories: SubCategory[];
}

const categories: ServiceCategory[] = [
  {
    id: "photography", name: "Photography", icon: Camera,
    subCategories: [
      { id: "portrait", name: "Portrait" },
      { id: "wedding", name: "Wedding" },
      { id: "product", name: "Product" },
      { id: "food", name: "Food" },
      { id: "event", name: "Event" },
      { id: "sports", name: "Sports" },
      { id: "real-estate", name: "Real Estate" },
      { id: "fashion", name: "Fashion" },
    ],
  },
  {
    id: "videography", name: "Videography", icon: Video,
    subCategories: [
      { id: "wedding-video", name: "Wedding" },
      { id: "corporate", name: "Corporate" },
      { id: "music-video", name: "Music Video" },
      { id: "documentary", name: "Documentary" },
      { id: "event-video", name: "Event" },
      { id: "promo", name: "Promotional" },
    ],
  },
  {
    id: "editing", name: "Photo & Video Editing", icon: Palette,
    subCategories: [
      { id: "photo-retouching", name: "Photo Retouching" },
      { id: "color-grading", name: "Color Grading" },
      { id: "video-editing", name: "Video Editing" },
      { id: "compositing", name: "Compositing" },
      { id: "motion-graphics", name: "Motion Graphics" },
    ],
  },
];

interface AddedService {
  categoryId: string;
  categoryName: string;
  subCategoryId: string;
  subCategoryName: string;
  icon: React.ElementType;
}

export default function ServicesPage() {
  const [addedServices, setAddedServices] = useState<AddedService[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);

  const addService = (category: ServiceCategory, sub: SubCategory) => {
    const key = `${category.id}-${sub.id}`;
    if (addedServices.some(s => `${s.categoryId}-${s.subCategoryId}` === key)) {
      toast.error("Already added");
      return;
    }
    setAddedServices(prev => [...prev, {
      categoryId: category.id,
      categoryName: category.name,
      subCategoryId: sub.id,
      subCategoryName: sub.name,
      icon: category.icon,
    }]);
    toast.success(`${sub.name} added under ${category.name}`);
  };

  const removeService = (categoryId: string, subCategoryId: string) => {
    setAddedServices(prev => prev.filter(s => !(s.categoryId === categoryId && s.subCategoryId === subCategoryId)));
    toast.success("Service removed");
  };

  const isAdded = (categoryId: string, subId: string) =>
    addedServices.some(s => s.categoryId === categoryId && s.subCategoryId === subId);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Services</h1>
          <p className="text-muted-foreground mt-1.5">Manage the services you offer.</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSelectedCategory(null); }}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4 mr-2" /> Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md p-0 overflow-hidden">
            <DialogHeader className="p-5 pb-0">
              {selectedCategory ? (
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> All Categories
                  </button>
                  <DialogTitle className="flex items-center gap-2">
                    <selectedCategory.icon className="h-5 w-5 text-primary" />
                    {selectedCategory.name}
                  </DialogTitle>
                </div>
              ) : (
                <DialogTitle>Select a Category</DialogTitle>
              )}
            </DialogHeader>

            <div className="p-5 pt-4 max-h-[60vh] overflow-y-auto">
              {!selectedCategory ? (
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const count = addedServices.filter(s => s.categoryId === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat)}
                        className="flex flex-col items-center gap-2 p-5 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all relative"
                      >
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <p className="font-medium text-sm text-card-foreground">{cat.name}</p>
                        {count > 0 && (
                          <Badge className="absolute top-2 right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px] bg-primary text-primary-foreground">
                            {count}
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedCategory.subCategories.map((sub) => {
                    const added = isAdded(selectedCategory.id, sub.id);
                    return (
                      <button
                        key={sub.id}
                        onClick={() => !added && addService(selectedCategory, sub)}
                        disabled={added}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                          added
                            ? "border-primary/20 bg-primary/5 cursor-default"
                            : "border-border/50 hover:border-primary/30 hover:bg-primary/5"
                        }`}
                      >
                        <span className="font-medium text-sm text-card-foreground">{sub.name}</span>
                        {added ? (
                          <Badge variant="secondary" className="text-[11px] rounded-lg bg-primary/10 text-primary border-0">Added</Badge>
                        ) : (
                          <Plus className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {addedServices.length === 0 ? (
        <Card className="border-dashed border-2 border-border/50 bg-card/50">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No services added yet. Click "Add Service" to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {categories
            .filter((cat) => addedServices.some((s) => s.categoryId === cat.id))
            .map((cat) => {
              const Icon = cat.icon;
              const catServices = addedServices.filter((s) => s.categoryId === cat.id);
              return (
                <Card key={cat.id} className="border-border/50 bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-card-foreground">{cat.name}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 ml-[52px]">
                      {catServices.map((service) => (
                        <Badge
                          key={service.subCategoryId}
                          variant="secondary"
                          className="text-xs rounded-lg bg-secondary/50 pr-1.5 flex items-center gap-1"
                        >
                          {service.subCategoryName}
                          <button
                            onClick={() => removeService(service.categoryId, service.subCategoryId)}
                            className="ml-1 rounded-full p-0.5 hover:bg-destructive/20 hover:text-destructive transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
}
