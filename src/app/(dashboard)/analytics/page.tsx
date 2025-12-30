"use client";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { useInsights } from "@/lib/hooks/useInsights";
import { useCampaigns } from "@/lib/hooks/useCampaigns";
import { useAllCampaignInsights } from "@/lib/hooks/useAllCampaignInsights";
import { useSettingsStore } from "@/lib/store/useSettingsStore";
import { BarChart3, TrendingUp, Users, Target } from "lucide-react";
import { motion } from "framer-motion";

import { ChartCard } from "@/components/analytics/ChartCard";
import { StatusDonutChart } from "@/components/analytics/charts/StatusDonutChart";
import { PlatformPieChart } from "@/components/analytics/charts/PlatformPieChart";
import { FunnelChart } from "@/components/analytics/charts/FunnelChart";
import { BudgetBarChart } from "@/components/analytics/charts/BudgetBarChart";
import { PerformanceBarChart } from "@/components/analytics/charts/PerformanceBarChart";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function AnalyticsPage() {
  const { data: insights, isLoading: insightsLoading } = useInsights();
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns();
  const { campaignsWithInsights, isLoading: combinedLoading } = useAllCampaignInsights();
  const { chartVisibility } = useSettingsStore();

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
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={itemVariants}>
          <MetricCard
            title="Total Spend"
            value={isLoading ? "..." : formatCurrency(insights?.total_spend || 0)}
            icon={<TrendingUp className="h-4 w-4" />}
            isLoading={isLoading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard
            title="Avg CPC"
            value={isLoading ? "..." : formatCurrency(insights?.avg_cpc || 0)}
            icon={<BarChart3 className="h-4 w-4" />}
            isLoading={isLoading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard
            title="Avg CTR"
            value={isLoading ? "..." : `${insights?.avg_ctr?.toFixed(2) || 0}%`}
            icon={<Target className="h-4 w-4" />}
            isLoading={isLoading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard
            title="Conversion Rate"
            value={isLoading ? "..." : `${insights?.avg_conversion_rate?.toFixed(2) || 0}%`}
            icon={<Users className="h-4 w-4" />}
            isLoading={isLoading}
          />
        </motion.div>
      </motion.div>

      {/* Charts Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Distribution Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          {chartVisibility.campaignStatus && (
            <motion.div variants={itemVariants}>
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
            </motion.div>
          )}

          {chartVisibility.platformBreakdown && (
            <motion.div variants={itemVariants}>
              <ChartCard
                title="Platform Breakdown"
                description="Campaigns by advertising platform"
                isLoading={isLoading}
              >
                <PlatformPieChart campaigns={campaigns || []} />
              </ChartCard>
            </motion.div>
          )}
        </div>

        {/* Conversion Funnel */}
        {chartVisibility.conversionFunnel && (
          <motion.div variants={itemVariants}>
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
          </motion.div>
        )}

        {/* Budget Utilization */}
        {chartVisibility.budgetUtilization && (
          <motion.div variants={itemVariants}>
            <ChartCard
              title="Budget Utilization"
              description="Campaign budget vs actual spend comparison"
              isLoading={isLoading}
            >
              <BudgetBarChart campaigns={campaignsWithInsights} />
            </ChartCard>
          </motion.div>
        )}

        {/* Performance Comparison */}
        {chartVisibility.performanceComparison && (
          <motion.div variants={itemVariants}>
            <ChartCard
              title="Top Performing Campaigns"
              description="Campaigns ranked by performance metrics"
              isLoading={isLoading}
            >
              <PerformanceBarChart campaigns={campaignsWithInsights} />
            </ChartCard>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
