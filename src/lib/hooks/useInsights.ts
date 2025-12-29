import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { AggregateInsights, CampaignInsight } from '../types';
import { insightKeys } from './queryKeys';

interface AggregateInsightsResponse {
    insights: AggregateInsights;
}

interface CampaignInsightResponse {
    insights: CampaignInsight;
}

export function useInsights() {
    return useQuery({
        queryKey: insightKeys.aggregate(),
        queryFn: async (): Promise<AggregateInsights> => {
            const response = await apiClient.get('/campaigns/insights') as AggregateInsightsResponse;
            return response.insights;
        },
    });
}

export function useCampaignInsights(id: string) {
    return useQuery({
        queryKey: insightKeys.campaign(id),
        queryFn: async (): Promise<CampaignInsight> => {
            const response = await apiClient.get(`/campaigns/${id}/insights`) as CampaignInsightResponse;
            return response.insights;
        },
        enabled: !!id,
    });
}
