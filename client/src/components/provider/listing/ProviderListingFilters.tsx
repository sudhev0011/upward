import { GetProvidersByCategoryParams } from '@/interfaces/provider/provider.listing.interface';

interface Props {
  filters: GetProvidersByCategoryParams;
  onChange: (updated: Partial<GetProvidersByCategoryParams>) => void;
}

export const ProviderListingFilters = ({ filters, onChange }: Props) => {
  return (
    <div className="flex flex-wrap gap-2 items-center">

      <input
        type="text"
        placeholder="Location..."
        value={filters.location ?? ''}
        onChange={(e) =>
          onChange({ location: e.target.value || undefined, page: 1 })
        }
        className="text-sm border border-gray-200 bg-white rounded-xl px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-[#719FC4]/30 focus:border-[#719FC4] transition-colors"
      />

      <select
        value={filters.minRating ?? ''}
        onChange={(e) =>
          onChange({ minRating: e.target.value ? Number(e.target.value) : undefined, page: 1 })
        }
        className="text-sm border border-gray-200 bg-white rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#719FC4]/30 focus:border-[#719FC4] transition-colors"
      >
        <option value="">Any rating</option>
        {[4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>{r}★ & above</option>
        ))}
      </select>

      <select
        value={`${filters.sortBy}-${filters.sortOrder}`}
        onChange={(e) => {
          const [sortBy, sortOrder] = e.target.value.split('-') as [
            GetProvidersByCategoryParams['sortBy'],
            GetProvidersByCategoryParams['sortOrder'],
          ];
          onChange({ sortBy, sortOrder, page: 1 });
        }}
        className="text-sm border border-gray-200 bg-white rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#719FC4]/30 focus:border-[#719FC4] transition-colors"
      >
        <option value="ratingAvg-desc">Highest Rated</option>
        <option value="ratingAvg-asc">Lowest Rated</option>
        <option value="createdAt-desc">Newest</option>
        <option value="createdAt-asc">Oldest</option>
      </select>
    </div>
  );
};