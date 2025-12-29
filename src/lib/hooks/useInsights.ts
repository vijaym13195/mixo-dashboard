import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { AggregateInsights, CampaignInsight } from '../types';
import { insightKeys } from './queryKeys';

export function useInsights() {
    return useQuery<AggregateInsights>({
        queryKey: insightKeys.aggregate(),
        queryFn: () => apiClient.get('/campaigns/insights'),
    });
}

export function useCampaignInsights(id: string) {
    return useQuery<CampaignInsight>({
        queryKey: insightKeys.campaign(id),
        queryFn: () => apiClient.get(`/campaigns/${id}/insights`),
        enabled: !!id,
    });
}
