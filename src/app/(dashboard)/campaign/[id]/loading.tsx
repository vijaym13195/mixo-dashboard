import { Skeleton } from "@/components/ui/skeleton";

export default function CampaignDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[400px] rounded-xl" />
    </div>
  );
}
