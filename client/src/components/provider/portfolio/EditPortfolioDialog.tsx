import { useRef, useState, useEffect } from "react";
import { Upload, X, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { PortfolioItem } from "@/interfaces/provider/portfolio.interface";
import { useUpdatePortfolioItem } from "@/hooks/provider/portfolio/useUpdatePortfolioItem";
import { useUploadPortfolioFiles } from "@/hooks/provider/portfolio/useUploadPortfolioFiles";
import { useRemovePortfolioImage } from "@/hooks/provider/portfolio/useRemovePortfolioImage";


interface LocalFile {
  file: File;
  previewUrl: string;
}

interface EditPortfolioDialogProps {
  item: PortfolioItem | null;
  onOpenChange: (open: boolean) => void;
}

export function EditPortfolioDialog({ item, onOpenChange }: EditPortfolioDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<LocalFile[]>([]);
  const [removeConfirmUrl, setRemoveConfirmUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: uploadFiles, isPending: isUploading } = useUploadPortfolioFiles();
  const { mutate: updateItem, isPending: isUpdating } = useUpdatePortfolioItem();
  const { mutate: removeImage, isPending: isRemoving } = useRemovePortfolioImage();

  const isSubmitting = isUploading || isUpdating;

  // Sync form when item changes
  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description ?? "");
      setExistingImages(item.images);
      setNewFiles([]);
    }
  }, [item]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleClose = () => {
    newFiles.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    setNewFiles([]);
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setNewFiles((prev) => [
      ...prev,
      ...Array.from(files).map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);
    e.target.value = "";
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleConfirmRemoveImage = () => {
    if (!item || !removeConfirmUrl) return;

    removeImage(
      { id: item.id, imageUrl: removeConfirmUrl },
      {
        onSuccess: (response) => {
          toast.success(response.message || "Image deleted");
          setExistingImages((prev) => prev.filter((url) => url !== removeConfirmUrl));
          setRemoveConfirmUrl(null);
        },
        onError: (error) => toast.error(error.message || "Failed to delete image"),
      }
    );
  };

  const handleSave = () => {
    if (!item) return;
    if (!title.trim()) return toast.error("Title cannot be empty");

    const save = (newImages?: string[], newStorageKeys?: string[]) => {
      updateItem(
        {
          id: item.id,
          data: {
            title: title.trim(),
            description: description.trim() || null,
            ...(newImages?.length ? { newImages, newStorageKeys } : {}),
          },
        },
        {
          onSuccess: (response) => {
            toast.success(response.message || "Changes saved");
            handleClose();
          },
          onError: (error) => toast.error(error.message || "Failed to update portfolio item"),
        }
      );
    };

    if (newFiles.length > 0) {
      uploadFiles(newFiles.map((f) => f.file), {
        onSuccess: (uploaded) =>
          save(
            uploaded.map((u) => u.fileUrl),
            uploaded.map((u) => u.storageKey)
          ),
        onError: () => toast.error("Failed to upload images"),
      });
    } else {
      save();
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <Dialog open={!!item} onOpenChange={(open) => { if (!open) handleClose(); }}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Work</DialogTitle>
            <DialogDescription>
              Update details or manage photos for this portfolio item.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 mt-1">

            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-desc">
                Description{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Textarea
                id="edit-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                disabled={isSubmitting}
                className="resize-none"
              />
            </div>

            <Separator />

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Current Images</Label>
                  <span className="text-xs text-muted-foreground">{existingImages.length} photo{existingImages.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {existingImages.map((url, i) => (
                    <div
                      key={i}
                      className="relative group/thumb aspect-square rounded-lg overflow-hidden border border-border/40"
                    >
                      <img
                        src={url}
                        alt={`Photo ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {isRemoving && removeConfirmUrl === url ? (
                        <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        !isSubmitting && (
                          <button
                            onClick={() => setRemoveConfirmUrl(url)}
                            className="absolute top-1 right-1 h-5 w-5 rounded-full bg-background/90 text-destructive flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity shadow-sm"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add more images */}
            <div className="space-y-2">
              <Label>
                Add More Images{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/jpg"
                className="hidden"
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-border/60 hover:border-primary/50 hover:bg-primary/[0.02] transition-all text-muted-foreground text-sm disabled:pointer-events-none disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                Click to add photos
              </button>
            </div>

            {/* New file previews */}
            {newFiles.length > 0 && (
              <div className="space-y-2">
                <Label className="text-primary">
                  New Photos ({newFiles.length})
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {newFiles.map((lf, i) => (
                    <div
                      key={i}
                      className="relative group/thumb aspect-square rounded-lg overflow-hidden border border-primary/30"
                    >
                      <img
                        src={lf.previewUrl}
                        alt={lf.file.name}
                        className="w-full h-full object-cover"
                      />
                      {!isSubmitting && (
                        <button
                          onClick={() => removeNewFile(i)}
                          className="absolute top-1 right-1 h-5 w-5 rounded-full bg-background/90 text-foreground flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity shadow-sm"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              className="w-full rounded-xl"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isUploading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading...</>
              ) : isUpdating ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Remove image confirm ── */}
      <AlertDialog
        open={!!removeConfirmUrl}
        onOpenChange={(open) => { if (!open) setRemoveConfirmUrl(null); }}
      >
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
            <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRemoveImage}
              disabled={isRemoving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemoving
                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Deleting...</>
                : "Delete Image"
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}