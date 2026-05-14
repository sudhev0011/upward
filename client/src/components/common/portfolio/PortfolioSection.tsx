import { useGetProviderPortfolio } from '@/hooks/public/providers/useGetProviderPortfolio';
import { PortfolioItem } from '@/interfaces/provider/portfolio.interface';
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ImageOff, Loader2 } from 'lucide-react';

interface Props {
  providerId: string;
}

export const PortfolioSection = ({ providerId }: Props) => {
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetProviderPortfolio(providerId);

  const [lightbox, setLightbox] = useState<{
    images: string[];
    index: number;
  } | null>(null);

  const allItems: PortfolioItem[] =
    data?.pages.flatMap((p) => p.data?.items ?? []) ?? [];

  const openLightbox = (images: string[], index: number) => {
    setLightbox({ images, index });
  };

  const closeLightbox = () => setLightbox(null);

  const prevImage = () =>
    setLightbox((prev) =>
      prev ? { ...prev, index: Math.max(0, prev.index - 1) } : null
    );

  const nextImage = () =>
    setLightbox((prev) =>
      prev
        ? { ...prev, index: Math.min(prev.images.length - 1, prev.index + 1) }
        : null
    );

  // Loading
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="text-center py-10 text-gray-400 text-sm">
        Failed to load portfolio.
      </div>
    );
  }

  // Empty
  if (allItems.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-gray-400">
        <ImageOff size={32} strokeWidth={1.5} />
        <p className="text-sm">No portfolio items yet.</p>
      </div>
    );
  }

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {allItems.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 cursor-pointer"
            onClick={() => openLightbox(item.images, 0)}
          >
            <img
              src={item.thumbnailUrl ?? item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end p-3">
              <div className="translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white text-sm font-bold truncate">{item.title}</p>
                {item.tags.length > 0 && (
                  <p className="text-white/70 text-xs truncate">
                    {item.tags.slice(0, 3).join(' · ')}
                  </p>
                )}
              </div>
            </div>
            {/* Multi-image indicator */}
            {item.images.length > 1 && (
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs rounded-lg px-1.5 py-0.5">
                +{item.images.length}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasNextPage && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-600 hover:border-[#719FC4] hover:text-[#719FC4] transition-colors disabled:opacity-50"
          >
            {isFetchingNextPage ? (
              <><Loader2 size={14} className="animate-spin" /> Loading...</>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            onClick={closeLightbox}
          >
            <X size={24} />
          </button>

          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.images[lightbox.index]}
              alt=""
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />

            {lightbox.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  disabled={lightbox.index === 0}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-xl disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  disabled={lightbox.index === lightbox.images.length - 1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-xl disabled:opacity-30 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
                <p className="text-center text-white/50 text-xs mt-3">
                  {lightbox.index + 1} / {lightbox.images.length}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};