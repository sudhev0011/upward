import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Eye, Upload, X, ImageIcon, Loader2, FolderOpen, Pencil, AlertTriangle } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useGetPortfolio } from "@/hooks/provider/portfolio/useGetPortfolio";
import { useCreatePortfolioItem } from "@/hooks/provider/portfolio/useCreatePortfolioItem";
import { useUpdatePortfolioItem } from "@/hooks/provider/portfolio/useUpdatePortfolioItem";
import { useRemovePortfolioImage } from "@/hooks/provider/portfolio/useRemovePortfolioImage";
import { useDeletePortfolioItem } from "@/hooks/provider/portfolio/useDeletePortfolioItem";
import { useUploadPortfolioFiles } from "@/hooks/provider/portfolio/useUploadPortfolioFiles";
import { PortfolioItem } from "@/interfaces/provider/portfolio.interface";

// ─── Constants ────────────────────────────────────────────────────────────────

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

// ─── Local file type (before upload) ─────────────────────────────────────────

interface LocalFile {
  file: File;
  previewUrl: string;
}

// ─── Confirm state for image removal warning ──────────────────────────────────

interface RemoveImageConfirm {
  itemId: string;
  imageUrl: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PortfolioPage() {

  // ── Server state ────────────────────────────────────────────────────────────
  const { data: portfolioRes, isLoading: isFetching } = useGetPortfolio();
  const { mutate: uploadFiles, isPending: isUploading } = useUploadPortfolioFiles();
  const { mutate: createItem, isPending: isSaving } = useCreatePortfolioItem();
  const { mutate: updateItem, isPending: isUpdating } = useUpdatePortfolioItem();
  const { mutate: removeImage, isPending: isRemovingImage } = useRemovePortfolioImage();
  const { mutate: deleteItem, isPending: isDeleting } = useDeletePortfolioItem();

  const portfolioItems = portfolioRes?.data ?? [];

  // ── Add dialog state ─────────────────────────────────────────────────────
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [localFiles, setLocalFiles] = useState<LocalFile[]>([]);
  const addFileInputRef = useRef<HTMLInputElement>(null);

  // ── Edit dialog state ────────────────────────────────────────────────────
  const [editItem, setEditItem] = useState<PortfolioItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editNewFiles, setEditNewFiles] = useState<LocalFile[]>([]);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // ── Viewer + confirm dialogs ─────────────────────────────────────────────
  const [viewImages, setViewImages] = useState<string[] | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [removeImageConfirm, setRemoveImageConfirm] = useState<RemoveImageConfirm | null>(null);

  const activeCategory = categories.find((c) => c.id === selectedCategory);
  const isAddSubmitting = isUploading || isSaving;
  const isEditSubmitting = isUploading || isUpdating;

  // ── Add dialog handlers ──────────────────────────────────────────────────

  const resetAddDialog = () => {
    setSelectedCategory("");
    setSelectedSubCategory("");
    setTitle("");
    setDescription("");
    localFiles.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    setLocalFiles([]);
  };

  const handleAddFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setLocalFiles((prev) => [
      ...prev,
      ...Array.from(files).map((file) => ({ file, previewUrl: URL.createObjectURL(file) })),
    ]);
    e.target.value = "";
  };

  const removeLocalFile = (index: number) => {
    setLocalFiles((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleAddWork = () => {
    if (!selectedCategory) return toast.error("Please select a category");
    if (!selectedSubCategory) return toast.error("Please select a sub-category");
    if (!title.trim()) return toast.error("Please enter a title");
    if (localFiles.length === 0) return toast.error("Please upload at least one image");

    const tags = [activeCategory?.name ?? "", selectedSubCategory].filter(Boolean);

    uploadFiles(localFiles.map((f) => f.file), {
      onSuccess: (uploaded) => {
        createItem(
          {
            title: title.trim(),
            description: description.trim() || null,
            images: uploaded.map((u) => u.fileUrl),
            storageKeys: uploaded.map((u) => u.storageKey),
            thumbnailUrl: uploaded[0]?.fileUrl ?? null,
            tags,
          },
          {
            onSuccess: () => {
              toast.success("Work added to portfolio");
              setAddDialogOpen(false);
              resetAddDialog();
            },
            onError: () => toast.error("Failed to save portfolio item"),
          }
        );
      },
      onError: () => toast.error("Failed to upload images"),
    });
  };

  // ── Edit dialog handlers ─────────────────────────────────────────────────

  const openEditDialog = (item: PortfolioItem) => {
    setEditItem(item);
    setEditTitle(item.title);
    setEditDescription(item.description ?? "");
    setEditNewFiles([]);
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setEditNewFiles((prev) => [
      ...prev,
      ...Array.from(files).map((file) => ({ file, previewUrl: URL.createObjectURL(file) })),
    ]);
    e.target.value = "";
  };

  const removeEditLocalFile = (index: number) => {
    setEditNewFiles((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSaveEdit = () => {
    if (!editItem) return;
    if (!editTitle.trim()) return toast.error("Title cannot be empty");

    const saveUpdate = (newImages?: string[], newStorageKeys?: string[]) => {
      updateItem(
        {
          id: editItem.id,
          data: {
            title: editTitle.trim(),
            description: editDescription.trim() || null,
            tags: editItem.tags,
            ...(newImages?.length ? { newImages, newStorageKeys } : {}),
          },
        },
        {
          onSuccess: () => {
            toast.success("Portfolio item updated");
            setEditItem(null);
            editNewFiles.forEach((f) => URL.revokeObjectURL(f.previewUrl));
            setEditNewFiles([]);
          },
          onError: () => toast.error("Failed to update portfolio item"),
        }
      );
    };

    if (editNewFiles.length > 0) {
      uploadFiles(editNewFiles.map((f) => f.file), {
        onSuccess: (uploaded) => {
          saveUpdate(
            uploaded.map((u) => u.fileUrl),
            uploaded.map((u) => u.storageKey)
          );
        },
        onError: () => toast.error("Failed to upload new images"),
      });
    } else {
      saveUpdate();
    }
  };

  // ── Image removal (with confirm) ─────────────────────────────────────────

  const handleConfirmRemoveImage = () => {
    if (!removeImageConfirm) return;
    removeImage(removeImageConfirm, {
      onSuccess: () => {
        toast.success("Image deleted");
        // update editItem local state to reflect removal immediately
        if (editItem) {
          setEditItem((prev) =>
            prev
              ? { ...prev, images: prev.images.filter((url) => url !== removeImageConfirm.imageUrl) }
              : null
          );
        }
        setRemoveImageConfirm(null);
      },
      onError: () => toast.error("Failed to delete image"),
    });
  };

  // ── Delete whole item (with confirm) ─────────────────────────────────────

  const handleConfirmDelete = () => {
    if (!deleteConfirmId) return;
    deleteItem(deleteConfirmId, {
      onSuccess: () => { toast.success("Item removed"); setDeleteConfirmId(null); },
      onError: () => toast.error("Failed to delete item"),
    });
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Portfolio</h1>
          <p className="text-muted-foreground mt-1.5">Showcase your best work to potential clients.</p>
        </div>
        <Button className="rounded-xl shadow-lg shadow-primary/20" onClick={() => { resetAddDialog(); setAddDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Work
        </Button>
      </div>

      {/* ── Grid ── */}
      {isFetching ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : portfolioItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
          <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center">
            <FolderOpen className="h-7 w-7 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground text-sm">No portfolio items yet. Add your first work.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolioItems.map((item) => (
            <Card key={item.id} className="border-border/50 bg-card/80 backdrop-blur-sm group overflow-hidden hover:border-primary/20 transition-all duration-300">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-muted/30 flex items-center justify-center relative overflow-hidden">
                {item.thumbnailUrl ? (
                  <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
                )}
                <div className="absolute inset-0 bg-background/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all duration-300">
                  <Button size="icon" variant="secondary" className="h-10 w-10 rounded-xl" onClick={() => setViewImages(item.images)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="h-10 w-10 rounded-xl" onClick={() => openEditDialog(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="h-10 w-10 rounded-xl" onClick={() => setDeleteConfirmId(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-card-foreground">{item.title}</h3>
                {item.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                )}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {item.images.length} image{item.images.length !== 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── Add Work Dialog ── */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add Work to Portfolio</DialogTitle></DialogHeader>
          <div className="space-y-6 mt-2">
            <div className="space-y-2">
              <Label htmlFor="add-title">Title</Label>
              <Input id="add-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Beach Wedding Shoot" disabled={isAddSubmitting} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-desc">Description <span className="text-muted-foreground">(optional)</span></Label>
              <Input id="add-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description..." disabled={isAddSubmitting} />
            </div>
            {/* <div className="space-y-2">
              <Label>Category</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button key={cat.id} disabled={isAddSubmitting}
                    onClick={() => { setSelectedCategory(cat.id); setSelectedSubCategory(""); }}
                    className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                      selectedCategory === cat.id ? "border-primary bg-primary/10 text-primary" : "border-border/60 bg-card text-card-foreground hover:border-primary/40 hover:bg-accent/50"
                    )}>
                    <span>{cat.icon}</span>{cat.name}
                  </button>
                ))}
              </div>
            </div>
            {activeCategory && (
              <div className="space-y-2">
                <Label>Sub-category</Label>
                <div className="flex flex-wrap gap-2">
                  {activeCategory.subCategories.map((sub) => (
                    <button key={sub} disabled={isAddSubmitting} onClick={() => setSelectedSubCategory(sub)}
                      className={cn("px-3 py-1.5 rounded-lg border text-sm transition-all",
                        selectedSubCategory === sub ? "border-primary bg-primary/10 text-primary font-medium" : "border-border/60 bg-card text-card-foreground hover:border-primary/40 hover:bg-accent/50"
                      )}>
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )} */}
            <div className="space-y-2">
              <Label>Upload Images</Label>
              <input ref={addFileInputRef} type="file" multiple accept="image/jpeg,image/png,image/webp,image/jpg" className="hidden" onChange={handleAddFileChange} disabled={isAddSubmitting} />
              <button onClick={() => addFileInputRef.current?.click()} disabled={isAddSubmitting}
                className="w-full flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-border/60 hover:border-primary/40 hover:bg-accent/30 transition-all text-muted-foreground disabled:pointer-events-none disabled:opacity-50">
                <Upload className="h-8 w-8" />
                <span className="text-sm font-medium">Click to upload images</span>
                <span className="text-xs">PNG, JPG, WEBP supported</span>
              </button>
            </div>
            {localFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Preview ({localFiles.length})</Label>
                <div className="grid grid-cols-4 gap-2">
                  {localFiles.map((lf, i) => (
                    <div key={i} className="relative group/thumb rounded-lg overflow-hidden border border-border/40 aspect-square">
                      <img src={lf.previewUrl} alt={lf.file.name} className="w-full h-full object-cover" />
                      {!isAddSubmitting && (
                        <button onClick={() => removeLocalFile(i)} className="absolute top-1 right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Button className="w-full rounded-xl" onClick={handleAddWork} disabled={isAddSubmitting}>
              {isUploading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading images...</>
                : isSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
                : "Add to Portfolio"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Edit Dialog ── */}
      <Dialog open={!!editItem} onOpenChange={(open) => { if (!open) setEditItem(null); }}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Portfolio Item</DialogTitle></DialogHeader>
          {editItem && (
            <div className="space-y-6 mt-2">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input id="edit-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} disabled={isEditSubmitting} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-desc">Description <span className="text-muted-foreground">(optional)</span></Label>
                <Input id="edit-desc" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Brief description..." disabled={isEditSubmitting} />
              </div>

              {/* Existing images */}
              {editItem.images.length > 0 && (
                <div className="space-y-2">
                  <Label>Existing Images ({editItem.images.length})</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {editItem.images.map((url, i) => (
                      <div key={i} className="relative group/thumb rounded-lg overflow-hidden border border-border/40 aspect-square">
                        <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                        {!isEditSubmitting && (
                          <button
                            onClick={() => setRemoveImageConfirm({ itemId: editItem.id, imageUrl: url })}
                            className="absolute top-1 right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                        {isRemovingImage && removeImageConfirm?.imageUrl === url && (
                          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add more images */}
              <div className="space-y-2">
                <Label>Add More Images <span className="text-muted-foreground">(optional)</span></Label>
                <input ref={editFileInputRef} type="file" multiple accept="image/jpeg,image/png,image/webp,image/jpg" className="hidden" onChange={handleEditFileChange} disabled={isEditSubmitting} />
                <button onClick={() => editFileInputRef.current?.click()} disabled={isEditSubmitting}
                  className="w-full flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-border/60 hover:border-primary/40 hover:bg-accent/30 transition-all text-muted-foreground disabled:pointer-events-none disabled:opacity-50">
                  <Upload className="h-6 w-6" />
                  <span className="text-sm font-medium">Click to add more images</span>
                </button>
              </div>

              {editNewFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>New Images to Add ({editNewFiles.length})</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {editNewFiles.map((lf, i) => (
                      <div key={i} className="relative group/thumb rounded-lg overflow-hidden border border-primary/30 aspect-square">
                        <img src={lf.previewUrl} alt={lf.file.name} className="w-full h-full object-cover" />
                        {!isEditSubmitting && (
                          <button onClick={() => removeEditLocalFile(i)} className="absolute top-1 right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button className="w-full rounded-xl" onClick={handleSaveEdit} disabled={isEditSubmitting}>
                {isUploading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading new images...</>
                  : isUpdating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving changes...</>
                  : "Save Changes"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Image Viewer Dialog ── */}
      <Dialog open={!!viewImages} onOpenChange={() => setViewImages(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Images</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {viewImages?.map((url, i) => (
              <img key={i} src={url} alt={`Image ${i + 1}`} className="w-full rounded-xl object-cover border border-border/40" />
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Remove Single Image Confirm ── */}
      <AlertDialog open={!!removeImageConfirm} onOpenChange={(open) => { if (!open) setRemoveImageConfirm(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete this image?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This image will be permanently deleted from storage and cannot be recovered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemovingImage}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRemoveImage}
              disabled={isRemovingImage}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemovingImage ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Deleting...</> : "Delete Image"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Delete Whole Item Confirm ── */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => { if (!open) setDeleteConfirmId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete portfolio item?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the item and all its images from storage. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Deleting...</> : "Delete Item"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}