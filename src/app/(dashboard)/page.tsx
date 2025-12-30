"use client";

import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { CampaignsList } from "@/components/campaigns/CampaignsList";
import { CreateCampaignDialog } from "@/components/campaigns/CreateCampaignDialog";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage and monitor your marketing campaigns
          </p>
        </div>
        <CreateCampaignDialog />
      </div>

      <div className="space-y-6">
        <StatsOverview />
        <CampaignsList />
      </div>
    </div>
  );
}
