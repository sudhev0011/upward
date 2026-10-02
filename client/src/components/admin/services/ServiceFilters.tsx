import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ServiceMode = "onsite" | "offsite" | "both";
export type ServiceSortBy = "name" | "createdAt";
export type ServiceSortOrder = "asc" | "desc";

interface ServiceFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  mode: ServiceMode | undefined;
  onModeChange: (value: ServiceMode | undefined) => void;
  isActive: boolean | undefined;
  onIsActiveChange: (value: boolean | undefined) => void;
  sortBy: ServiceSortBy;
  onSortByChange: (value: ServiceSortBy) => void;
  sortOrder: ServiceSortOrder;
  onSortOrderChange: (value: ServiceSortOrder) => void;
}

export function ServiceFilters({
  search,
  onSearchChange,
  mode,
  onModeChange,
  isActive,
  onIsActiveChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
}: ServiceFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        placeholder="Search..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-xs"
      />

      <Select
        value={mode || "all"}
        onValueChange={(val) =>
          onModeChange(val === "all" ? undefined : (val as ServiceMode))
        }
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Modes</SelectItem>
          <SelectItem value="onsite">Onsite</SelectItem>
          <SelectItem value="offsite">Offsite</SelectItem>
          <SelectItem value="both">Both</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={isActive === undefined ? "all" : String(isActive)}
        onValueChange={(val) =>
          onIsActiveChange(val === "all" ? undefined : val === "true")
        }
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="true">Active</SelectItem>
          <SelectItem value="false">Inactive</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={(val: ServiceSortBy) => onSortByChange(val)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt">Recent</SelectItem>
          <SelectItem value="name">Name</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={sortOrder}
        onValueChange={(val: ServiceSortOrder) => onSortOrderChange(val)}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Order" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">Desc</SelectItem>
          <SelectItem value="asc">Asc</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}