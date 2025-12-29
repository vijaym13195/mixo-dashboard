import { Skeleton } from '@/components/ui/skeleton';

interface ChartSkeletonProps {
  height?: string;
}

export function ChartSkeleton({ height = 'h-[300px]' }: ChartSkeletonProps) {
  return (
    <div className={`flex items-center justify-center ${height}`}>
      <Skeleton className="h-full w-full rounded-lg" />
    </div>
  );
}
