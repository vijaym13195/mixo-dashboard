"use client";

import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your campaigns.
          </p>
        </div>
        <Button asChild>
          <Link href="/campaigns">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Create Campaign</span>
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        <StatsOverview />

        {/* Quick link to campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>View All Campaigns</CardTitle>
            <CardDescription>
              Manage your campaigns, monitor performance, and adjust settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link href="/campaigns">
                Go to Campaigns →
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
