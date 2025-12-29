import { Skeleton } from "@/components/ui/skeleton";

export function CampaignListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-[140px]" />
      </div>
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}
