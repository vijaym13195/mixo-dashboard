import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Campaign } from '../types';
import { campaignKeys } from './queryKeys';

interface CampaignsListResponse {
    campaigns: Campaign[];
    total: number;
}

export function useCampaigns() {
    return useQuery({
        queryKey: campaignKeys.lists(),
        queryFn: async (): Promise<Campaign[]> => {
            const response = await apiClient.get('/campaigns') as CampaignsListResponse;
            return response.campaigns;
        },
    });
}

interface CampaignDetailResponse {
    campaign: Campaign;
}

export function useCampaign(id: string) {
    return useQuery({
        queryKey: campaignKeys.detail(id),
        queryFn: async (): Promise<Campaign> => {
            const response = await apiClient.get(`/campaigns/${id}`) as CampaignDetailResponse;
            return response.campaign;
        },
        enabled: !!id,
    });
}
