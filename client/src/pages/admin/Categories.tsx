import { useState } from "react";
import { Plus, MoreHorizontal, Home, GraduationCap, Palette, Trees, Truck, Heart, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export interface Category {
  id: string;
  name: string;
  icon: string;
  serviceCount: number;
  description: string;
  isActive: boolean;
  color: string;
}


export const categories: Category[] = [
  { id: "cat1", name: "Home Services", icon: "Home", serviceCount: 4, description: "Cleaning, repairs and maintenance", isActive: true, color: "hsl(217 91% 53%)" },
  { id: "cat2", name: "Education", icon: "GraduationCap", serviceCount: 1, description: "Tutoring and learning services", isActive: true, color: "hsl(142 71% 45%)" },
  { id: "cat3", name: "Creative", icon: "Palette", serviceCount: 1, description: "Photography, design and arts", isActive: true, color: "hsl(280 65% 60%)" },
  { id: "cat4", name: "Outdoor", icon: "Trees", serviceCount: 1, description: "Landscaping and outdoor work", isActive: true, color: "hsl(38 92% 50%)" },
  { id: "cat5", name: "Logistics", icon: "Truck", serviceCount: 1, description: "Moving and delivery services", isActive: false, color: "hsl(0 72% 51%)" },
  { id: "cat6", name: "Health & Wellness", icon: "Heart", serviceCount: 0, description: "Fitness, spa, and health services", isActive: true, color: "hsl(340 82% 52%)" },
];
interface SubCategory {
  id: string;
  name: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home, GraduationCap, Palette, Trees, Truck, Heart,
};

export default function Categories() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [newSubName, setNewSubName] = useState("");

  const openEdit = (c: Category) => {
    setEditing(c);
    setSubCategories([]);
    setDialogOpen(true);
  };
  const openNew = () => {
    setEditing(null);
    setSubCategories([]);
    setDialogOpen(true);
  };

  const addSubCategory = () => {
    if (!newSubName.trim()) return;
    setSubCategories((prev) => [...prev, { id: crypto.randomUUID(), name: newSubName.trim() }]);
    setNewSubName("");
  };

  const removeSubCategory = (id: string) => {
    setSubCategories((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">Organize services into categories</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Add Category</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => {
          const Icon = iconMap[c.icon] || Home;
          return (
            <Card key={c.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-lg" style={{ backgroundColor: `${c.color}15` }}>
                    <Icon className="h-5 w-5" style={{ color: c.color }} />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(c)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <h3 className="font-semibold text-sm">{c.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 mb-3">{c.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{c.serviceCount} services</span>
                  <span className={`text-xs font-medium ${c.isActive ? "text-success" : "text-muted-foreground"}`}>
                    {c.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Category" : "Create Category"}</DialogTitle>
            <DialogDescription>{editing ? "Update category details" : "Add a new category"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input defaultValue={editing?.name || ""} placeholder="Category name" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea defaultValue={editing?.description || ""} placeholder="Describe the category..." />
            </div>
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch defaultChecked={editing?.isActive ?? true} />
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-sm font-semibold">Sub-Categories</Label>
              <p className="text-xs text-muted-foreground">Add sub-categories to organize services further</p>

              {subCategories.length > 0 && (
                <div className="space-y-2">
                  {subCategories.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2">
                      <span className="text-sm">{sub.name}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeSubCategory(sub.id)}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 rounded-md border border-dashed border-border p-3">
                <Input
                  placeholder="Sub-category name"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSubCategory())}
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={addSubCategory} className="shrink-0">
                  <Plus className="h-4 w-4 mr-1" />Add
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setDialogOpen(false)}>{editing ? "Save Changes" : "Create Category"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
