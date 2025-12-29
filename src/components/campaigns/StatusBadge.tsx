import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
    status: 'active' | 'paused' | 'completed' | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const s = status.toLowerCase();

    let className = "bg-slate-500 hover:bg-slate-600";

    if (s === 'active') {
        className = "bg-green-500 hover:bg-green-600 text-white border-transparent";
    } else if (s === 'paused') {
        className = "bg-yellow-500 hover:bg-yellow-600 text-white border-transparent";
    } else if (s === 'completed') {
        className = "bg-blue-500 hover:bg-blue-600 text-white border-transparent";
    }

    return (
        <Badge className={cn("capitalize", className)}>
            {status}
        </Badge>
    );
}
