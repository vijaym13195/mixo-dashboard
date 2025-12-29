import { Campaign } from "@/lib/types";
import { CampaignCard } from "./CampaignCard";

interface CampaignsGridProps {
  campaigns: Campaign[];
}

export function CampaignsGrid({ campaigns }: CampaignsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}
