"use client";

import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { CampaignsList } from "@/components/campaigns/CampaignsList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Create Campaign</span>
        </Button>
      </div>

      <div className="space-y-6">
        <StatsOverview />
        <CampaignsList />
      </div>
    </div>
  );
}
