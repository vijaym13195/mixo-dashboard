import { Badge } from "@/components/ui/badge";
import { Facebook, Globe, Linkedin, Search } from "lucide-react";

interface PlatformBadgeProps {
    platform: string;
}

export function PlatformBadge({ platform }: PlatformBadgeProps) {
    const p = platform.toLowerCase();

    let Icon = Globe;
    let variant: "default" | "secondary" | "outline" | "destructive" = "outline";
    let label = platform;

    if (p.includes("meta") || p.includes("facebook") || p.includes("instagram")) {
        Icon = Facebook;
        variant = "default"; // Blue-ish usually, but default works for now
        label = "Meta";
    } else if (p.includes("google") || p.includes("search")) {
        Icon = Search;
        variant = "secondary";
        label = "Google";
    } else if (p.includes("linkedin")) {
        Icon = Linkedin;
        variant = "outline";
        label = "LinkedIn";
    }

    return (
        <Badge variant={variant} className="gap-1 items-center">
            <Icon className="h-3 w-3" />
            {label}
        </Badge>
    );
}
