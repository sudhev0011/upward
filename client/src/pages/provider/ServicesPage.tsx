import { useState } from "react";
import { toast } from "sonner";
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  X,
  Camera,
  Video,
  Palette,
  Settings2,
  ArrowLeft,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useGetAllCategories } from "@/hooks/public/useGetAllCategories";
import { useGetAllServicesByCategory } from "@/hooks/public/useGetAllServicesByCategory";
import { useCreateProviderServiceMutation } from "@/hooks/provider/providerService/useCreateProviderSevice";
import { useGetProviderSericeByCategoryQuery } from "@/hooks/provider/providerService/useGetProviderServiceByCategory";
import { useDeleteProviderServiceMutation } from "@/hooks/provider/providerService/useDeleteProviderService";
import { ProviderServicesGroupedByCategory, Services } from "@/interfaces/admin/provider-service.interface";

const ICON_MAP: Record<string, React.ElementType> = {
  Photography: Camera,
  Videography: Video,
  "Photo & Video Editing": Palette,
  Editing: Palette,
};

const getCategoryIcon = (name: string) => ICON_MAP[name] || Settings2;

export default function ServicesPage() {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Services | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const [sortBy, setSortBy] = useState<"name" | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: providerResponse, isLoading: isLoadingProvider } =
    useGetProviderSericeByCategoryQuery({
      page,
      limit: 10,
      search: search || undefined,
      isActive: statusFilter === "all" ? undefined : statusFilter === "true",
      sortBy,
      sortOrder,
    });

  const providerData = providerResponse?.data;

  const { data: categories, isLoading: isLoadingCats } = useGetAllCategories();
  const { data: categoryServices, isFetching: isFetchingSubServices } =
    useGetAllServicesByCategory(selectedCategory?.id || "");

  const createMutation = useCreateProviderServiceMutation();
  const deleteMutation = useDeleteProviderServiceMutation();

  const handleAddService = async (serviceId: string, serviceName: string) => {
    createMutation.mutate(
      { serviceId },
      {
        onSuccess: () => toast.success(`${serviceName} added successfully`),
        onError: (err) => toast.error(err.message || "Failed to add"),
      },
    );
  };

  const isAlreadyAdded = (serviceId: string) => {
    return providerData?.data?.some((group) =>
      group.services.some((s) => s.serviceId === serviceId),
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Services</h1>
          <p className="text-muted-foreground mt-1.5">Manage the services you offer.</p>
        </div>

        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSelectedCategory(null); }}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4 mr-2" /> Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md p-0 overflow-hidden">
            <DialogHeader className="p-5 pb-0">
              {selectedCategory ? (
                <div className="space-y-1">
                  <button onClick={() => setSelectedCategory(null)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-3.5 w-3.5" /> All Categories
                  </button>
                  <DialogTitle>{selectedCategory.name}</DialogTitle>
                </div>
              ) : (
                <DialogTitle>Select a Category</DialogTitle>
              )}
            </DialogHeader>
            <div className="p-5 pt-4 max-h-[60vh] overflow-y-auto">
              {isLoadingCats ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
              ) : !selectedCategory ? (
                <div className="grid grid-cols-2 gap-3">
                  {categories?.data?.map((cat) => {
                    const Icon = getCategoryIcon(cat.name);
                    const count = providerData?.data?.find((p) => p.category.id === cat.id)?.services.length || 0;
                    return (
                      <button key={cat.id} onClick={() => setSelectedCategory(cat)} className="flex flex-col items-center gap-2 p-5 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all relative">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <p className="font-medium text-sm text-center text-card-foreground">{cat.name}</p>
                        {count > 0 && <Badge className="absolute top-2 right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">{count}</Badge>}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {isFetchingSubServices ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
                  ) : (
                    categoryServices?.data?.map((service) => {
                      const added = isAlreadyAdded(service.id);
                      return (
                        <button key={service.id} disabled={added || createMutation.isPending} onClick={() => handleAddService(service.id, service.name)} className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${added ? "border-primary/20 bg-primary/5 cursor-default" : "border-border/50 hover:border-primary/30 hover:bg-primary/5"}`}>
                          <span className="font-medium text-sm text-card-foreground">{service.name}</span>
                          {added ? <Badge variant="secondary" className="text-[11px] rounded-lg bg-primary/10 text-primary border-0">Added</Badge> : <Plus className="h-4 w-4 text-muted-foreground" />}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter & Sort Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            className="pl-9 rounded-xl"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="rounded-xl">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* Updated Sorting Logic */}
        <Select
          value={`${sortBy}-${sortOrder}`}
          onValueChange={(v) => {
            const [field, order] = v.split("-") as ["name" | "createdAt", "asc" | "desc"];
            setSortBy(field);
            setSortOrder(order);
            setPage(1);
          }}
        >
          <SelectTrigger className="rounded-xl">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Newest First</SelectItem>
            <SelectItem value="createdAt-asc">Oldest First</SelectItem>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoadingProvider ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {providerData?.data?.map((group: ProviderServicesGroupedByCategory) => {
            const Icon = getCategoryIcon(group.category.name);
            return (
              <Card key={group.category.id} className="overflow-hidden border-border/50">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold">{group.category.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:ml-12">
                    {group.services.map((s: Services) => (
                      <Badge key={s.providerServiceId} variant="secondary" className="pl-3 pr-1.5 py-1.5 gap-2 rounded-lg">
                        {s.serviceName}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border border-border/50 ${s.status === 'active' ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'}`}>
                          {s.status}
                        </span>
                        <button onClick={() => setDeleteTarget(s)} className="hover:text-destructive transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {providerData && providerData.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{providerData.data.length}</span> categories
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" disabled={page === providerData.totalPages} onClick={() => setPage((p) => p + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove Service</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Remove{" "}
            <span className="font-medium text-foreground">
              {deleteTarget?.serviceName}
            </span>
            ?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (deleteTarget)
                  deleteMutation.mutate(deleteTarget.providerServiceId, {
                    onSuccess: (response) => {
                      setDeleteTarget(null);
                      toast.success(response.message);
                    },
                  });
              }}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
