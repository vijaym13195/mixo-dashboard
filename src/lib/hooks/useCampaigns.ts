import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Campaign } from '../types';
import { campaignKeys } from './queryKeys';

export function useCampaigns() {
    return useQuery<Campaign[]>({
        queryKey: campaignKeys.lists(),
        queryFn: () => apiClient.get('/campaigns'),
    });
}

export function useCampaign(id: string) {
    return useQuery<Campaign>({
        queryKey: campaignKeys.detail(id),
        queryFn: () => apiClient.get(`/campaigns/${id}`),
        enabled: !!id,
    });
}
