import { useCampaigns } from "@/lib/hooks/useCampaigns";

export interface BrandOption {
    id: string;
    name: string;
}

export interface PlatformOption {
    id: string;
    label: string;
}

export function useCampaignOptions() {
    const { data: campaigns, isLoading, error } = useCampaigns();

    // Extract unique brands from existing campaigns
    const brands: BrandOption[] = Array.from(new Set(campaigns?.map((c) => c.brand_id)))
        .filter(Boolean)
        .map((id) => ({
            id,
            name: id, // Using ID as name since we don't have separate brand names
        }));

    // Extract unique platforms from existing campaigns
    const uniquePlatforms = Array.from(new Set(campaigns?.flatMap((c) => c.platforms)))
        .filter(Boolean)
        .map((id) => ({
            id,
            label: id.charAt(0).toUpperCase() + id.slice(1), // Capitalize first letter for label
        }));

    // Fallback if no platforms found in data
    const platforms: PlatformOption[] =
        uniquePlatforms.length > 0
            ? uniquePlatforms
            : [
                { id: "meta", label: "Meta" },
                { id: "google", label: "Google" },
                { id: "linkedin", label: "LinkedIn" },
                { id: "tiktok", label: "TikTok" },
                { id: "twitter", label: "Twitter" },
            ];

    return {
        brands,
        platforms,
        isLoading,
        error,
    };
}
