import { useQueries } from '@tanstack/react-query';
import { useCampaigns } from './useCampaigns';
import { useCampaignInsights } from './useInsights';
import { Campaign } from '../types';
import { CampaignInsight } from '../types';

/**
 * Fetch insights for all campaigns in parallel
 * Returns an array of campaigns combined with their insights
 */
export function useAllCampaignInsights() {
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns();

  // Fetch insights for all campaigns in parallel
  const insightsQueries = useQueries({
    queries: (campaigns || []).map((campaign) => ({
      queryKey: ['campaign', campaign.id, 'insights'],
      queryFn: async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'https://mixo-fe-backend-task.vercel.app'}/campaigns/${campaign.id}/insights`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch insights for ${campaign.id}`);
        }
        const data = await response.json();
        return data.insights as CampaignInsight;
      },
      enabled: !!campaigns,
      staleTime: 5 * 60 * 1000, // 5 minutes
    })),
    combine: (results) => {
      return {
        data: results.map((result, index) => ({
          campaign: campaigns?.[index],
          insights: result.data,
          isLoading: result.isLoading,
          error: result.error,
        })),
        isLoading: results.some((r) => r.isLoading),
        errors: results.map((r) => r.error).filter((e) => e),
      };
    },
  });

  // Combine campaigns with their insights
  const campaignsWithInsights: Array<Campaign & { insights?: CampaignInsight }> = (campaigns || []).map(
    (campaign, index) => ({
      ...campaign,
      insights: insightsQueries.data[index]?.insights,
    })
  );

  return {
    campaignsWithInsights,
    isLoading: campaignsLoading || insightsQueries.isLoading,
    errors: insightsQueries.errors,
  };
}
