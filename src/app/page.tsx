"use client";

import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { CampaignsList } from "@/components/dashboard/CampaignsList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Create Campaign</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </div>

      <div className="space-y-6">
        <StatsOverview />
        <CampaignsList />
      </div>
    </div>
  );
}
