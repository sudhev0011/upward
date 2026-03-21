import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Eye, Upload, X, Image } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const categories = [
  {
    id: "photography",
    name: "Photography",
    icon: "📷",
    subCategories: ["Wedding", "Portrait", "Product", "Food", "Event", "Sports", "Real Estate", "Fashion"],
  },
  {
    id: "videography",
    name: "Videography",
    icon: "🎬",
    subCategories: ["Wedding", "Corporate", "Music Video", "Documentary", "Event", "Product", "Real Estate"],
  },
  {
    id: "editing",
    name: "Editing",
    icon: "✂️",
    subCategories: ["Photo Editing", "Video Editing", "Color Grading", "Motion Graphics", "Retouching"],
  },
];

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  subCategory: string;
  files: { name: string; url: string }[];
}

const initialItems: PortfolioItem[] = [
  { id: 1, title: "Beach Wedding", category: "Photography", subCategory: "Wedding", files: [] },
  { id: 2, title: "Corporate Event", category: "Videography", subCategory: "Corporate", files: [] },
];

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>(initialItems);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [title, setTitle] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeCategory = categories.find(c => c.id === selectedCategory);

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
    toast.success("Item removed from portfolio");
  };

  const resetDialog = () => {
    setSelectedCategory("");
    setSelectedSubCategory("");
    setTitle("");
    setUploadedFiles([]);
  };

  const handleOpenDialog = () => {
    resetDialog();
    setDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).map(f => ({
      name: f.name,
      url: URL.createObjectURL(f),
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddWork = () => {
    if (!selectedCategory) { toast.error("Please select a category"); return; }
    if (!selectedSubCategory) { toast.error("Please select a sub-category"); return; }
    if (!title.trim()) { toast.error("Please enter a title"); return; }
    if (uploadedFiles.length === 0) { toast.error("Please upload at least one file"); return; }

    const newItem: PortfolioItem = {
      id: Date.now(),
      title: title.trim(),
      category: activeCategory?.name || "",
      subCategory: selectedSubCategory,
      files: uploadedFiles,
    };
    setItems(prev => [...prev, newItem]);
    setDialogOpen(false);
    toast.success("Work added to portfolio");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Portfolio</h1>
          <p className="text-muted-foreground mt-1.5">Showcase your best work to potential clients.</p>
        </div>
        <Button className="rounded-xl shadow-lg shadow-primary/20" onClick={handleOpenDialog}>
          <Plus className="h-4 w-4 mr-2" /> Add Work
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="border-border/50 bg-card/80 backdrop-blur-sm group overflow-hidden hover:border-primary/20 transition-all duration-300">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-muted/30 flex items-center justify-center relative overflow-hidden">
              {item.files.length > 0 ? (
                <img src={item.files[0].url} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <Image className="h-10 w-10 text-muted-foreground/40" />
              )}
              <div className="absolute inset-0 bg-background/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all duration-300">
                <Button size="icon" variant="secondary" className="h-10 w-10 rounded-xl">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary" className="h-10 w-10 rounded-xl" onClick={() => removeItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-card-foreground">{item.title}</h3>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                <Badge variant="outline" className="text-xs">{item.subCategory}</Badge>
              </div>
              {item.files.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">{item.files.length} file{item.files.length > 1 ? "s" : ""}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Work to Portfolio</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-2">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="work-title">Title</Label>
              <Input
                id="work-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Beach Wedding Shoot"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSelectedSubCategory("");
                    }}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                      selectedCategory === cat.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 bg-card text-card-foreground hover:border-primary/40 hover:bg-accent/50"
                    )}
                  >
                    <span>{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-category */}
            {activeCategory && (
              <div className="space-y-2">
                <Label>Sub-category</Label>
                <div className="flex flex-wrap gap-2">
                  {activeCategory.subCategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubCategory(sub)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg border text-sm transition-all",
                        selectedSubCategory === sub
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border/60 bg-card text-card-foreground hover:border-primary/40 hover:bg-accent/50"
                      )}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Upload */}
            <div className="space-y-2">
              <Label>Upload Files</Label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-border/60 hover:border-primary/40 hover:bg-accent/30 transition-all text-muted-foreground"
              >
                <Upload className="h-8 w-8" />
                <span className="text-sm font-medium">Click to upload images or videos</span>
                <span className="text-xs">PNG, JPG, MP4 supported</span>
              </button>
            </div>

            {/* Preview */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Preview ({uploadedFiles.length})</Label>
                <div className="grid grid-cols-4 gap-2">
                  {uploadedFiles.map((file, i) => (
                    <div key={i} className="relative group/thumb rounded-lg overflow-hidden border border-border/40 aspect-square">
                      <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeFile(i)}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button className="w-full rounded-xl" onClick={handleAddWork}>
              Add to Portfolio
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
