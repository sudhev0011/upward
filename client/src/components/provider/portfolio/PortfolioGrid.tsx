import { useEffect, useRef } from "react";
import { Loader2, FolderOpen } from "lucide-react";
import { PortfolioCard } from "./PortfolioCard";
import { useGetPortfolio } from "@/hooks/provider/portfolio/useGetPortfolio";
import { PortfolioItem } from "@/interfaces/provider/portfolio.interface";

interface PortfolioGridProps {
  onView: (images: string[]) => void;
  onEdit: (item: PortfolioItem) => void;
  onDelete: (id: string) => void;
}

export function PortfolioGrid({ onView, onEdit, onDelete }: PortfolioGridProps) {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetPortfolio();

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const items = data?.pages.flatMap((page) => page.data?.items ?? []) ?? [];


  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-border/30 bg-card animate-pulse">
            <div className="aspect-[4/3] bg-muted/50" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-2/3 bg-muted/60 rounded-md" />
              <div className="h-3 w-full bg-muted/40 rounded-md" />
              <div className="h-3 w-1/2 bg-muted/40 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }


  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-4">
        <div className="h-16 w-16 rounded-2xl bg-muted/40 flex items-center justify-center">
          <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">No portfolio items yet</p>
          <p className="text-xs text-muted-foreground mt-1">Add your first project to showcase your work.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <PortfolioCard
            key={item.id}
            item={item}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Sentinel — observed by IntersectionObserver to trigger next page */}
      <div ref={sentinelRef} className="h-4" />

      {/* Fetching next page spinner */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* End of list */}
      {!hasNextPage && items.length > 0 && (
        <p className="text-center text-xs text-muted-foreground/50 py-2">
          All {items.length} items loaded
        </p>
      )}
    </div>
  );
}