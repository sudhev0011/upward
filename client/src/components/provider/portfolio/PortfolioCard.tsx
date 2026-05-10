import { Eye, Pencil, Trash2, ImageIcon, Images } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PortfolioItem } from "@/interfaces/provider/portfolio.interface";

interface PortfolioCardProps {
  item: PortfolioItem;
  onView: (images: string[]) => void;
  onEdit: (item: PortfolioItem) => void;
  onDelete: (id: string) => void;
}

export function PortfolioCard({ item, onView, onEdit, onDelete }: PortfolioCardProps) {
  return (
    <div className="group relative rounded-2xl overflow-hidden border border-border/40 bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">

      {/* ── Thumbnail ── */}
      <div className="relative aspect-[4/3] bg-muted/30 overflow-hidden">
        {item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
          </div>
        )}

        {/* Image count badge */}
        {item.images.length > 1 && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-background/80 backdrop-blur-sm border border-border/40 text-xs font-medium text-foreground">
            <Images className="h-3 w-3" />
            {item.images.length}
          </div>
        )}

        {/* Hover action overlay */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 rounded-xl shadow-md"
            onClick={() => onView(item.images)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 rounded-xl shadow-md"
            onClick={() => onEdit(item)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 rounded-xl shadow-md text-destructive hover:text-destructive"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-sm text-foreground leading-tight line-clamp-1">
          {item.title}
        </h3>

        {item.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {item.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[11px] px-2 py-0 rounded-md font-normal"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}