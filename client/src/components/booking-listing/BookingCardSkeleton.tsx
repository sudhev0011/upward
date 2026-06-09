import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const BookingCardSkeleton = () => {
  return (
    <Card className="border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex gap-4 items-center sm:items-start flex-1 w-full min-w-0">
            <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
            <div className="space-y-2 flex-1 w-full">
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-1/3 min-w-[140px]" />
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
              <Skeleton className="h-4 w-1/4 min-w-[90px]" />
              <div className="flex gap-4 pt-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
          <div className="flex sm:flex-col items-between sm:items-end justify-between w-full sm:w-auto shrink-0 border-t sm:border-0 pt-3 sm:pt-0 gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-16 hidden sm:block" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};