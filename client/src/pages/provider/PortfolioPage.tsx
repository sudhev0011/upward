import { useState } from "react";
import { Plus, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { PortfolioGrid } from "@/components/provider/portfolio/PortfolioGrid";
import { AddPortfolioDialog } from "@/components/provider/portfolio/AddPortfolioDialog";
import { EditPortfolioDialog } from "@/components/provider/portfolio/EditPortfolioDialog";
import { useDeletePortfolioItem } from "@/hooks/provider/portfolio/useDeletePortfolioItem";
import { PortfolioItem } from "@/interfaces/provider/portfolio.interface";

export default function PortfolioPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<PortfolioItem | null>(null);
  const [viewImages, setViewImages] = useState<string[] | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { mutate: deleteItem, isPending: isDeleting } = useDeletePortfolioItem();

  const handleConfirmDelete = () => {
    if (!deleteConfirmId) return;
    deleteItem(deleteConfirmId, {
      onSuccess: (res) => { toast.success(res.message || "Item deleted"); setDeleteConfirmId(null); },
      onError: (error) => toast.error(error.message || "Failed to delete item"),
    });
  };

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Showcase your best work to attract clients.
          </p>
        </div>
        <Button
          className="rounded-xl shadow-sm"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Work
        </Button>
      </div>

      {/* ── Grid with infinite scroll ── */}
      <PortfolioGrid
        onView={setViewImages}
        onEdit={setEditItem}
        onDelete={setDeleteConfirmId}
      />

      {/* ── Dialogs ── */}
      <AddPortfolioDialog open={addOpen} onOpenChange={setAddOpen} />

      <EditPortfolioDialog
        item={editItem}
        key={editItem?.id}
        onOpenChange={(open) => { if (!open) setEditItem(null); }}
      />

      {/* Image viewer */}
      <Dialog open={!!viewImages} onOpenChange={() => setViewImages(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Photos</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {viewImages?.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Photo ${i + 1}`}
                className="w-full rounded-xl object-cover border border-border/30"
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete item confirm */}
      <AlertDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => { if (!open) setDeleteConfirmId(null); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete portfolio item?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this item and all its photos from storage. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting
                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Deleting...</>
                : "Delete"
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}