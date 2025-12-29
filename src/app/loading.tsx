import { LoadingState } from "@/components/dashboard/LoadingState";

export default function Loading() {
    return (
        <div className="space-y-6 animate-in fade-in-50">
            <div className="flex items-center justify-between mb-8">
                <div className="h-8 w-48 bg-muted rounded animate-pulse" />
                <div className="h-10 w-32 bg-muted rounded animate-pulse" />
            </div>
            <LoadingState />
        </div>
    );
}
