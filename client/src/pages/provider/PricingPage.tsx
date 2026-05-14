import { useState, useEffect, useEffectEvent } from "react";
import { toast } from "sonner";
import {
  Camera,
  Video,
  Palette,
  Settings2,
  Loader2,
  Save,
  AlertCircle,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ProviderServicesGroupedByCategory } from "@/interfaces/admin/provider-service.interface";
// Hooks
import { useGetProviderSericeByCategoryQuery } from "@/hooks/provider/providerService/useGetProviderServiceByCategory";
import { useSetProviderServicePriceMutation } from "@/hooks/provider/providerService/useSetProviderServicePrice";
import { useDebounce } from "@/hooks/useDebounce";

const ICON_MAP: Record<string, React.ElementType> = {
  Photography: Camera,
  Videography: Video,
  Editing: Palette,
  "Photo & Video Editing": Palette,
};

type mode = "onsite" | "offsite" | "both" | "all"

const getCategoryIcon = (name: string) => ICON_MAP[name] || Settings2;

export default function PricingPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [mode, setMode] = useState<mode>(
    "all",
  );

  const {
    data: response,
    isLoading,
    isError,
  } = useGetProviderSericeByCategoryQuery({
    page,
    limit,
    search: debouncedSearch,
    mode: mode === "all" ? undefined : mode,
    sortBy: "name",
    sortOrder: "asc",
  });

  const [localPrices, setLocalPrices] = useState<Record<string, string>>({});
  const updatePriceMutation = useSetProviderServicePriceMutation();

  const categories = response?.data?.data || [];
  const meta = response?.data;

  const onCategoriesUpdate = useEffectEvent((latestCategories: ProviderServicesGroupedByCategory[]) => {
    setLocalPrices((prev) => {
      const next = { ...prev };
      latestCategories.forEach((group) => {
        group.services.forEach((s) => {
          if (!(s.providerServiceId in next)) {
            next[s.providerServiceId] = s.price ? s.price.toString() : "";
          }
        });
      });
      return next;
    });
  });
  // 3. Sync local prices only for new data arriving
  useEffect(() => {
    if (categories.length > 0) {
      onCategoriesUpdate(categories);
    }
  }, [categories]);

  const handleSave = async (providerServiceId: string) => {
    const price = parseFloat(localPrices[providerServiceId]);
    if (isNaN(price) || price < 0) return toast.error("Invalid price");

    updatePriceMutation.mutate(
      { providerServiceId, price },
      { onSuccess: () => toast.success("Price updated") },
    );
  };

  if (isError)
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load services.</AlertDescription>
      </Alert>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Pricing</h1>
          <p className="text-muted-foreground text-sm">
            Manage your service rates and visibility.
          </p>
        </div>

        {/* 4. Controls: Search and Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={mode}
            onValueChange={(v: mode) => {
              setMode(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modes</SelectItem>
              <SelectItem value="onsite">Onsite</SelectItem>
              <SelectItem value="offsite">Offsite</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading your catalog...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed p-12 text-center text-muted-foreground">
          No services found matching your criteria.
        </div>
      ) : (
        <div className="space-y-6">
          <Accordion
            type="multiple"
            defaultValue={categories.map((c) => c.category.id)}
            className="space-y-4"
          >
            {categories.map((group) => {
              const Icon = getCategoryIcon(group.category.name);
              return (
                <AccordionItem
                  key={group.category.id}
                  value={group.category.id}
                  className="border rounded-xl bg-card overflow-hidden"
                >
                  <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">{group.category.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {group.services.length} services
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-4 space-y-3">
                    {group.services.map((service) => {
                      const isMutating =
                        updatePriceMutation.isPending &&
                        updatePriceMutation.variables?.providerServiceId ===
                          service.providerServiceId;
                      const hasChanged =
                        localPrices[service.providerServiceId] !==
                        (service.price?.toString() || "");

                      return (
                        <div
                          key={service.providerServiceId}
                          className="flex items-center justify-between p-3 rounded-lg border bg-secondary/5"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {service.serviceName}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-[10px] uppercase"
                              >
                                {service.status}
                              </Badge>
                            </div>
                            <span className="text-[11px] text-muted-foreground capitalize">
                              {service.mode}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                ₹
                              </span>
                              <Input
                                type="number"
                                className="w-24 pl-6 h-8 text-right"
                                value={
                                  localPrices[service.providerServiceId] || ""
                                }
                                onChange={(e) =>
                                  setLocalPrices((prev) => ({
                                    ...prev,
                                    [service.providerServiceId]: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <Button
                              size="sm"
                              variant={hasChanged ? "default" : "secondary"}
                              className="h-8 w-8 p-0"
                              disabled={!hasChanged || isMutating}
                              onClick={() =>
                                handleSave(service.providerServiceId)
                              }
                            >
                              {isMutating ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Save className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {/* 5. Shadcn Pagination Integration */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between border-t pt-4">
              <p className="text-sm text-muted-foreground">
                Showing page {page} of {meta.totalPages}
              </p>
              <Pagination className="justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <PaginationPrevious className="hover:bg-transparent p-0" />
                    </Button>
                  </PaginationItem>

                  {/* Simple page numbers could go here */}

                  <PaginationItem>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(meta.totalPages, p + 1))
                      }
                      disabled={page === meta.totalPages}
                    >
                      <PaginationNext className="hover:bg-transparent p-0" />
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
