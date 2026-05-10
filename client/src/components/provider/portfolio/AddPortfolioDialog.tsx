import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePortfolioItem } from "@/hooks/provider/portfolio/useCreatePortfolioItem";
import { useUploadPortfolioFiles } from "@/hooks/provider/portfolio/useUploadPortfolioFiles";

interface LocalFile {
  file: File;
  previewUrl: string;
}

interface AddPortfolioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPortfolioDialog({ open, onOpenChange }: AddPortfolioDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [localFiles, setLocalFiles] = useState<LocalFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: uploadFiles, isPending: isUploading } = useUploadPortfolioFiles();
  const { mutate: createItem, isPending: isSaving } = useCreatePortfolioItem();

  const isSubmitting = isUploading || isSaving;

  // ── Handlers ────────────────────────────────────────────────────────────────

  const reset = () => {
    setTitle("");
    setDescription("");
    localFiles.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    setLocalFiles([]);
  };

  const handleClose = (open: boolean) => {
    if (!open) reset();
    onOpenChange(open);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setLocalFiles((prev) => [
      ...prev,
      ...Array.from(files).map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setLocalFiles((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = () => {
    if (!title.trim()) return toast.error("Please enter a title");
    if (localFiles.length === 0) return toast.error("Please upload at least one image");

    uploadFiles(localFiles.map((f) => f.file), {
      onSuccess: (uploaded) => {
        createItem(
          {
            title: title.trim(),
            description: description.trim() || null,
            images: uploaded.map((u) => u.fileUrl),
            storageKeys: uploaded.map((u) => u.storageKey),
            thumbnailUrl: uploaded[0]?.fileUrl ?? null,
          },
          {
            onSuccess: (response) => {
              toast.success(response.message || "Work added to portfolio");
              handleClose(false);
            },
            onError: (error) => toast.error(error.message || "Failed to save portfolio item"),
          }
        );
      },
      onError: (error) => toast.error(error.message || "Failed to upload images"),
    });
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Work</DialogTitle>
          <DialogDescription>
            Upload photos to showcase this project in your portfolio.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-1">

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="add-title">Title</Label>
            <Input
              id="add-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Kitchen Renovation"
              disabled={isSubmitting}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="add-desc">
              Description{" "}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Textarea
              id="add-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this project..."
              rows={2}
              disabled={isSubmitting}
              className="resize-none"
            />
          </div>

          {/* Upload zone */}
          <div className="space-y-1.5">
            <Label>Images</Label>
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
              className="w-full flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed border-border/60 hover:border-primary/50 hover:bg-primary/[0.02] transition-all text-muted-foreground disabled:pointer-events-none disabled:opacity-50"
            >
              <div className="h-9 w-9 rounded-xl bg-muted/60 flex items-center justify-center">
                <Upload className="h-4 w-4" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Click to upload</p>
                <p className="text-xs mt-0.5">PNG, JPG, WEBP supported</p>
              </div>
            </button>
          </div>

          {/* Preview grid */}
          {localFiles.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {localFiles.map((lf, i) => (
                <div
                  key={i}
                  className="relative group/thumb aspect-square rounded-lg overflow-hidden border border-border/40"
                >
                  <img
                    src={lf.previewUrl}
                    alt={lf.file.name}
                    className="w-full h-full object-cover"
                  />
                  {!isSubmitting && (
                    <button
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 h-5 w-5 rounded-full bg-background/90 text-foreground flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity shadow-sm"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <Button
            className="w-full rounded-xl"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isUploading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading...</>
            ) : isSaving ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
            ) : (
              "Add to Portfolio"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}