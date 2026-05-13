// pages/client/ProviderListingPage.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProvidersByCategory } from "@/hooks/public/providers/useProvidersByCategory";
import { ProviderCard } from "@/components/provider/listing/ProviderCard";
import { ProviderListingFilters } from "@/components/provider/listing/ProviderListingFilters";
import { GetProvidersByCategoryParams } from "@/interfaces/provider/provider.listing.interface";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetAllCategories } from "@/hooks/public/useGetAllCategories";

export const ProviderListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category") ?? "Photography"

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetAllCategories();
  const categories = categoriesData?.data ?? [];

  const [filters, setFilters] = useState<GetProvidersByCategoryParams>({
    category: categoryFromUrl,
    page: 1,
    limit: 9,
    sortBy: "ratingAvg",
    sortOrder: "desc",
  });

  useEffect(() => {
  setFilters((prev) => ({ ...prev, category: categoryFromUrl, page: 1 }));
}, [categoryFromUrl]);

  // Sync category from URL into filters (handles back/forward nav too)
  useEffect(() => {
    if (!searchParams.get("category") && categories.length > 0) {
    setSearchParams({ category: categories[0].name }, { replace: true });
  }
  }, [categories]);

  const updateFilters = (updated: Partial<GetProvidersByCategoryParams>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleCategoryChange = (category: string) => {
    setSearchParams({ category });
  };

  const { data, isLoading, isError } = useProvidersByCategory(filters);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-[#719FC4] uppercase tracking-widest mb-1">
            Browse
          </p>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">
            Find a Provider
          </h1>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {categoriesLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-9 w-28 rounded-xl bg-gray-200 animate-pulse"
                />
              ))
            : categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.name)}
                  className={`px-5 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                    filters.category === cat.name
                      ? "bg-[#719FC4] text-white shadow-md"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-[#719FC4] hover:text-[#719FC4]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
        </div>

        {/* Filters + Result count */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <ProviderListingFilters filters={filters} onChange={updateFilters} />
          {data && (
            <p className="text-sm text-gray-400">
              {data.total} provider{data.total !== 1 ? "s" : ""} found
            </p>
          )}
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-72 bg-white rounded-2xl animate-pulse border border-gray-100"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="text-center py-20 text-gray-400">
            Something went wrong. Please try again.
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && data?.data.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm">
              No providers found for{" "}
              <span className="font-semibold capitalize text-gray-600">
                {filters.category}
              </span>{" "}
              with the selected filters.
            </p>
          </div>
        )}

        {/* Grid */}
        {!isLoading && !isError && data && data.data.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.data.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  onClick={() => updateFilters({ page: filters.page! - 1 })}
                  disabled={filters.page === 1}
                  className="p-2 rounded-xl border border-gray-200 bg-white disabled:opacity-40 hover:border-[#719FC4] transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: data.totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => updateFilters({ page: i + 1 })}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                        filters.page === i + 1
                          ? "bg-[#719FC4] text-white"
                          : "bg-white text-gray-500 border border-gray-200 hover:border-[#719FC4]"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => updateFilters({ page: filters.page! + 1 })}
                  disabled={filters.page === data.totalPages}
                  className="p-2 rounded-xl border border-gray-200 bg-white disabled:opacity-40 hover:border-[#719FC4] transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
