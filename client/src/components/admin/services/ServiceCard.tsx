import { MoreHorizontal, Power, Edit2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ServiceResponse } from "@/interfaces/admin/service.interface";

interface ServiceCardProps {
  service: ServiceResponse;
  categoryName: string;
  onEdit: (service: ServiceResponse) => void;
  onToggleStatus: (service: ServiceResponse) => void;
  isToggleDisabled?: boolean;
}

export function ServiceCard({
  service,
  categoryName,
  onEdit,
  onToggleStatus,
  isToggleDisabled,
}: ServiceCardProps) {
  return (
    <Card className="group shadow-sm hover:shadow-md transition-all border-muted/60">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <Badge
            variant="secondary"
            className="capitalize text-[10px] font-medium px-2 py-0"
          >
            {service.mode}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onEdit(service)}>
                <Edit2 className="mr-2 h-3.5 w-3.5" /> Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isToggleDisabled}
                onClick={() => onToggleStatus(service)}
              >
                <Power
                  className={`mr-2 h-3.5 w-3.5 ${service.isActive ? "text-destructive" : "text-green-500"}`}
                />
                {service.isActive ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className="font-semibold text-sm truncate">{service.name}</h3>
        <p className="text-xs text-muted-foreground mt-1 mb-3 line-clamp-2 min-h-[32px]">
          {service.description || "No description provided."}
        </p>

        <div className="flex flex-col gap-1.5 text-[11px] border-t pt-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Category</span>
            <span className="font-medium bg-muted px-2 py-0.5 rounded">
              {categoryName}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Work Unit</span>
            <span
              className={`font-medium ${service.maxHour ? "text-primary" : "text-orange-500"}`}
            >
              {service.maxHour ? `${service.maxHour} Hours Max` : "Fixed Project"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] mt-4">
          <div
            className={`h-2 w-2 rounded-full ${service.isActive ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}
          />
          <span
            className={
              service.isActive
                ? "text-green-600 font-medium"
                : "text-muted-foreground"
            }
          >
            {service.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}