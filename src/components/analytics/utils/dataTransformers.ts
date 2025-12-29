import { Campaign } from '@/lib/types';
import { AggregateInsights } from '@/lib/types';
import { CampaignInsight } from '@/lib/types';
import { STATUS_COLORS, PLATFORM_COLORS, CHART_COLORS } from './chartColors';

// Types for transformed chart data
export interface StatusDataPoint {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

export interface PlatformDataPoint {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

export interface FunnelDataPoint {
  stage: string;
  count: number;
  rate: number;
  [key: string]: string | number;
}

export interface BudgetDataPoint {
  name: string;
  budget: number;
  spend: number;
  utilization: number;
  [key: string]: string | number;
}

export interface PerformanceDataPoint {
  name: string;
  value: number;
  id: string;
  [key: string]: string | number;
}

/**
 * Transform aggregate insights to status distribution for pie chart
 */
export function transformToStatusDistribution(insights: AggregateInsights): StatusDataPoint[] {
  return [
    {
      name: 'Active',
      value: insights.active_campaigns,
      color: STATUS_COLORS.active,
    },
    {
      name: 'Paused',
      value: insights.paused_campaigns,
      color: STATUS_COLORS.paused,
    },
    {
      name: 'Completed',
      value: insights.completed_campaigns,
      color: STATUS_COLORS.completed,
    },
  ];
}

/**
 * Transform campaigns to platform distribution for pie chart
 */
export function transformToPlatformDistribution(campaigns: Campaign[]): PlatformDataPoint[] {
  const platformCounts = campaigns.reduce((acc, campaign) => {
    campaign.platforms.forEach((platform) => {
      acc[platform] = (acc[platform] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(platformCounts)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: PLATFORM_COLORS[name] || CHART_COLORS[0],
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Transform aggregate insights to funnel data
 */
export function transformToFunnelData(insights: AggregateInsights): FunnelDataPoint[] {
  const { total_impressions, total_clicks, total_conversions } = insights;

  const impressionsRate = 100;
  const clicksRate = total_impressions > 0 ? (total_clicks / total_impressions) * 100 : 0;
  const conversionsRate = total_impressions > 0 ? (total_conversions / total_impressions) * 100 : 0;

  return [
    {
      stage: 'Impressions',
      count: total_impressions,
      rate: impressionsRate,
    },
    {
      stage: 'Clicks',
      count: total_clicks,
      rate: clicksRate,
    },
    {
      stage: 'Conversions',
      count: total_conversions,
      rate: conversionsRate,
    },
  ];
}

/**
 * Transform campaigns to budget vs spend comparison data
 */
export function transformToBudgetComparison(
  campaigns: Array<Campaign & { insights?: CampaignInsight }>,
  limit: number = 8
): BudgetDataPoint[] {
  const sorted = [...campaigns]
    .filter((c) => c.insights)
    .sort((a, b) => b.budget - a.budget)
    .slice(0, limit);

  return sorted.map((campaign) => ({
    name: campaign.name,
    budget: campaign.budget,
    spend: campaign.insights?.spend || 0,
    utilization: campaign.insights ? ((campaign.insights.spend / campaign.budget) * 100) : 0,
  }));
}

/**
 * Get top campaigns by metric
 */
export function getTopCampaigns(
  campaigns: Array<Campaign & { insights?: CampaignInsight }>,
  metric: keyof CampaignInsight,
  limit: number = 10
): PerformanceDataPoint[] {
  return campaigns
    .filter((c) => c.insights)
    .sort((a, b) => (b.insights?.[metric] as number) - (a.insights?.[metric] as number))
    .slice(0, limit)
    .map((campaign) => ({
      name: campaign.name,
      value: campaign.insights?.[metric] as number || 0,
      id: campaign.id,
    }));
}

/**
 * Transform campaigns to performance data for bar chart
 */
export function transformToPerformanceData(
  campaigns: Array<Campaign & { insights?: CampaignInsight }>,
  metric: keyof CampaignInsight,
  limit: number = 10
): PerformanceDataPoint[] {
  return getTopCampaigns(campaigns, metric, limit);
}
