"use client";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { useInsights } from "@/lib/hooks/useInsights";
import { useCampaigns } from "@/lib/hooks/useCampaigns";
import { useAllCampaignInsights } from "@/lib/hooks/useAllCampaignInsights";
import { BarChart3, TrendingUp, Users, Target } from "lucide-react";

import { ChartCard } from "@/components/analytics/ChartCard";
import { StatusDonutChart } from "@/components/analytics/charts/StatusDonutChart";
import { PlatformPieChart } from "@/components/analytics/charts/PlatformPieChart";
import { FunnelChart } from "@/components/analytics/charts/FunnelChart";
import { BudgetBarChart } from "@/components/analytics/charts/BudgetBarChart";
import { PerformanceBarChart } from "@/components/analytics/charts/PerformanceBarChart";

export default function AnalyticsPage() {
  const { data: insights, isLoading: insightsLoading } = useInsights();
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns();
  const { campaignsWithInsights, isLoading: combinedLoading } = useAllCampaignInsights();

  const isLoading = insightsLoading || campaignsLoading || combinedLoading;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Deep dive into your marketing performance metrics
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Spend"
          value={isLoading ? "..." : formatCurrency(insights?.total_spend || 0)}
          icon={<TrendingUp className="h-4 w-4" />}
          isLoading={isLoading}
        />
        <MetricCard
          title="Avg CPC"
          value={isLoading ? "..." : formatCurrency(insights?.avg_cpc || 0)}
          icon={<BarChart3 className="h-4 w-4" />}
          isLoading={isLoading}
        />
        <MetricCard
          title="Avg CTR"
          value={isLoading ? "..." : `${insights?.avg_ctr?.toFixed(2) || 0}%`}
          icon={<Target className="h-4 w-4" />}
          isLoading={isLoading}
        />
        <MetricCard
          title="Conversion Rate"
          value={isLoading ? "..." : `${insights?.avg_conversion_rate?.toFixed(2) || 0}%`}
          icon={<Users className="h-4 w-4" />}
          isLoading={isLoading}
        />
      </div>

      {/* Charts Grid */}
      <div className="space-y-6">
        {/* Distribution Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <ChartCard
            title="Campaign Status"
            description="Distribution of campaign statuses"
            isLoading={isLoading}
          >
            <StatusDonutChart
              activeCampaigns={insights?.active_campaigns || 0}
              pausedCampaigns={insights?.paused_campaigns || 0}
              completedCampaigns={insights?.completed_campaigns || 0}
            />
          </ChartCard>

          <ChartCard
            title="Platform Breakdown"
            description="Campaigns by advertising platform"
            isLoading={isLoading}
          >
            <PlatformPieChart campaigns={campaigns || []} />
          </ChartCard>
        </div>

        {/* Conversion Funnel */}
        <ChartCard
          title="Conversion Funnel"
          description="Performance from impressions to conversions"
          isLoading={isLoading}
        >
          <FunnelChart
            impressions={insights?.total_impressions || 0}
            clicks={insights?.total_clicks || 0}
            conversions={insights?.total_conversions || 0}
          />
        </ChartCard>

        {/* Budget Utilization */}
        <ChartCard
          title="Budget Utilization"
          description="Campaign budget vs actual spend comparison"
          isLoading={isLoading}
        >
          <BudgetBarChart campaigns={campaignsWithInsights} />
        </ChartCard>

        {/* Performance Comparison */}
        <ChartCard
          title="Top Performing Campaigns"
          description="Campaigns ranked by performance metrics"
          isLoading={isLoading}
        >
          <PerformanceBarChart campaigns={campaignsWithInsights} />
        </ChartCard>
      </div>
    </div>
  );
}
