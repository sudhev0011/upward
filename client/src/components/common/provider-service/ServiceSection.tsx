import { useGetProviderActiveServices } from '@/hooks/public/providers/provider-service/useGetProviderActiveServices';
import { ProviderServicePublicItem } from '@/interfaces/provider/provider-service.interface';
import { Clock, MapPin, Wifi, LayoutGrid, Loader2 } from 'lucide-react';

interface Props {
  providerId: string;
}

const MODE_CONFIG = {
  onsite:  { label: 'On-site',  icon: MapPin,      color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  offsite: { label: 'Off-site', icon: Wifi,         color: 'text-purple-600 bg-purple-50 border-purple-100'   },
  both:    { label: 'Both',     icon: LayoutGrid,   color: 'text-[#4A86B0] bg-[#EEF5FB] border-[#C8DFF0]'    },
} as const;

function groupByCategory(items: ProviderServicePublicItem[]) {
  return items.reduce<Record<string, ProviderServicePublicItem[]>>((acc, item) => {
    if (!acc[item.categoryName]) acc[item.categoryName] = [];
    acc[item.categoryName].push(item);
    return acc;
  }, {});
}

export const ServicesSection = ({ providerId }: Props) => {
  const { data: services, isLoading, isError } = useGetProviderActiveServices(providerId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={22} className="animate-spin text-[#719FC4]" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-sm text-gray-400 py-10">
        Failed to load services.
      </p>
    );
  }

  if (!services || services.length === 0) {
    return (
      <p className="text-center text-sm text-gray-400 py-10">
        No active services offered yet.
      </p>
    );
  }

  const grouped = groupByCategory(services);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([categoryName, items]) => (
        <div key={categoryName}>
          {/* Category header */}
          <h3 className="text-xs font-bold text-[#4A86B0] uppercase tracking-widest mb-3">
            {categoryName}
          </h3>

          <div className="space-y-2">
            {items.map((service) => {
              const mode = MODE_CONFIG[service.mode as keyof typeof MODE_CONFIG];
              const ModeIcon = mode?.icon;

              return (
                <div
                  key={service.providerServiceId}
                  className="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-[#C8DFF0] transition-all"
                >
                  {/* Left */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-gray-800 truncate">
                        {service.serviceName}
                      </span>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {/* Mode badge */}
                        {mode && (
                          <span className={`flex items-center gap-1 text-xs font-medium border rounded-lg px-2 py-0.5 ${mode.color}`}>
                            <ModeIcon size={10} />
                            {mode.label}
                          </span>
                        )}
                        {/* Max hours */}
                        {service.maxHour && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock size={10} />
                            Up to {service.maxHour}h
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="shrink-0 text-right">
                    <span className="text-base font-black text-gray-900">
                      ₹{service.price.toLocaleString('en-IN')}
                    </span>
                    <p className="text-xs text-gray-400">per session</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};